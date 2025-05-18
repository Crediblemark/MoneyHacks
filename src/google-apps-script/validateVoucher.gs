
// Google Apps Script untuk Validasi Voucher
// Pastikan sheet 'Vouchers' memiliki kolom:
// A: voucher_code, B: type, C: value, D: expiry_date, E: max_uses, F: current_uses, G: is_active
// Pastikan sheet 'UsedVouchers' memiliki kolom:
// A: user_id, B: voucher_code, C: used_at

function doPost(e) {
  var response = {
    success: false,
    message: "Terjadi kesalahan yang tidak diketahui pada server."
  };

  var voucherCode = "";
  var userId = "";

  try {
    Logger.log("Request received. Event object: " + JSON.stringify(e));

    // Cek jika e.postData.contents ada dan merupakan JSON
    if (e && e.postData && e.postData.type === "application/json" && e.postData.contents) {
      var requestData = JSON.parse(e.postData.contents);
      voucherCode = requestData.voucherCode;
      userId = requestData.userId;
      Logger.log("Parsed JSON data: voucherCode=" + voucherCode + ", userId=" + userId);
    } else if (e && e.parameter) {
      // Fallback jika data dikirim sebagai parameter (misalnya dari GET atau form-data)
      voucherCode = e.parameter.voucherCode;
      userId = e.parameter.userId;
      Logger.log("Parsed parameter data: voucherCode=" + voucherCode + ", userId=" + userId);
    } else {
        response.message = "Request tidak valid atau data tidak lengkap.";
        Logger.log(response.message);
        return ContentService.createTextOutput(JSON.stringify(response)).setMimeType(ContentService.MimeType.JSON);
    }
    
    if (!voucherCode || voucherCode.toString().trim() === "") {
      response.message = "Parameter 'voucherCode' diperlukan dan tidak boleh kosong.";
      Logger.log(response.message);
      return ContentService.createTextOutput(JSON.stringify(response)).setMimeType(ContentService.MimeType.JSON);
    }
    if (!userId || userId.toString().trim() === "") {
      response.message = "Parameter 'userId' diperlukan dan tidak boleh kosong.";
      Logger.log(response.message);
      return ContentService.createTextOutput(JSON.stringify(response)).setMimeType(ContentService.MimeType.JSON);
    }

    // Trim input
    voucherCode = voucherCode.toString().trim();
    userId = userId.toString().trim();

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var vouchersSheet = ss.getSheetByName("Vouchers");
    var usedVouchersSheet = ss.getSheetByName("UsedVouchers");

    if (!vouchersSheet) {
      response.message = "Sheet 'Vouchers' tidak ditemukan. Pastikan nama sheet sudah benar.";
      Logger.log(response.message);
      return ContentService.createTextOutput(JSON.stringify(response)).setMimeType(ContentService.MimeType.JSON);
    }
    if (!usedVouchersSheet) {
      response.message = "Sheet 'UsedVouchers' tidak ditemukan. Pastikan nama sheet sudah benar.";
      Logger.log(response.message);
      return ContentService.createTextOutput(JSON.stringify(response)).setMimeType(ContentService.MimeType.JSON);
    }

    var vouchersData = vouchersSheet.getDataRange().getValues();
    var voucherRowIndex = -1; 
    var voucherDetails = null;

    Logger.log("Mencari voucher: '" + voucherCode.toUpperCase() + "'");
    for (var i = 1; i < vouchersData.length; i++) { // Mulai dari 1 untuk melewati header
      var sheetVoucherCode = vouchersData[i][0] ? vouchersData[i][0].toString().trim().toUpperCase() : "";
      // Logger.log("Memeriksa baris " + (i+1) + ": '" + sheetVoucherCode + "' vs '" + voucherCode.toUpperCase() + "'");
      if (sheetVoucherCode === voucherCode.toUpperCase()) {
        voucherRowIndex = i;
        voucherDetails = {
          code: vouchersData[i][0].toString().trim(),
          type: vouchersData[i][1] ? vouchersData[i][1].toString().trim().toLowerCase() : "duration", // Kolom B (index 1)
          value: vouchersData[i][2] ? parseInt(vouchersData[i][2]) : 0, // Kolom C (index 2)
          expiry_date_raw: vouchersData[i][3], // Kolom D (index 3)
          max_uses: vouchersData[i][4] ? parseInt(vouchersData[i][4]) : 0, // Kolom E (index 4)
          current_uses: vouchersData[i][5] ? parseInt(vouchersData[i][5]) : 0, // Kolom F (index 5)
          is_active: vouchersData[i][6] // Kolom G (index 6)
        };
        Logger.log("Voucher ditemukan di baris " + (i+1) + ". Detail: " + JSON.stringify(voucherDetails));
        break;
      }
    }

    if (!voucherDetails) {
      response.message = "Kode voucher tidak ditemukan."; // Ini pesan yang Anda dapatkan
      Logger.log(response.message + " Kode yang dicari: " + voucherCode.toUpperCase());
      return ContentService.createTextOutput(JSON.stringify(response)).setMimeType(ContentService.MimeType.JSON);
    }

    if (voucherDetails.is_active !== true && String(voucherDetails.is_active).toUpperCase() !== "TRUE") {
      response.message = "Voucher tidak aktif.";
      Logger.log(response.message + " (Nilai is_active: " + voucherDetails.is_active + ")");
      return ContentService.createTextOutput(JSON.stringify(response)).setMimeType(ContentService.MimeType.JSON);
    }
    
    if (voucherDetails.expiry_date_raw && voucherDetails.expiry_date_raw.toString().trim() !== "") {
        var expiryDate;
        if (voucherDetails.expiry_date_raw instanceof Date) {
            expiryDate = voucherDetails.expiry_date_raw;
        } else {
            expiryDate = new Date(voucherDetails.expiry_date_raw.toString());
        }
        expiryDate.setHours(23, 59, 59, 999); // Bandingkan dengan akhir hari
        
        if (isNaN(expiryDate.getTime())) {
            Logger.log("Tanggal kedaluwarsa tidak valid: " + voucherDetails.expiry_date_raw);
            // Bisa pilih untuk mengabaikan tanggal tidak valid atau menganggap voucher kedaluwarsa
        } else if (expiryDate < new Date()) {
            response.message = "Voucher sudah kedaluwarsa.";
            Logger.log(response.message + " (Tanggal kedaluwarsa: " + expiryDate.toISOString() + ")");
            return ContentService.createTextOutput(JSON.stringify(response)).setMimeType(ContentService.MimeType.JSON);
        }
    }

    if (voucherDetails.current_uses >= voucherDetails.max_uses) {
      response.message = "Voucher sudah mencapai batas penggunaan maksimum.";
      Logger.log(response.message + " (Digunakan: " + voucherDetails.current_uses + ", Maks: " + voucherDetails.max_uses + ")");
      return ContentService.createTextOutput(JSON.stringify(response)).setMimeType(ContentService.MimeType.JSON);
    }

    var usedVouchersData = usedVouchersSheet.getDataRange().getValues();
    var alreadyUsed = false;
    for (var j = 1; j < usedVouchersData.length; j++) {
      var usedUserId = usedVouchersData[j][0] ? usedVouchersData[j][0].toString().trim() : "";
      var usedVoucherCode = usedVouchersData[j][1] ? usedVouchersData[j][1].toString().trim().toUpperCase() : "";
      if (usedUserId == userId && usedVoucherCode == voucherCode.toUpperCase()) {
        alreadyUsed = true;
        break;
      }
    }

    if (alreadyUsed) {
      response.message = "Anda sudah pernah menggunakan voucher ini.";
      Logger.log(response.message);
      return ContentService.createTextOutput(JSON.stringify(response)).setMimeType(ContentService.MimeType.JSON);
    }
    
    usedVouchersSheet.appendRow([userId, voucherDetails.code, new Date()]);
    // Kolom F adalah current_uses (index 5), baris sheet adalah voucherRowIndex + 1
    vouchersSheet.getRange(voucherRowIndex + 1, 6).setValue(voucherDetails.current_uses + 1);

    response.success = true;
    response.message = "Voucher '" + voucherDetails.code + "' berhasil diaktifkan!";
    if (voucherDetails.type === "duration" && voucherDetails.value > 0) {
      response.duration_days = voucherDetails.value;
    } else {
      response.duration_days = 30; // Default jika tipe bukan duration atau value tidak valid
      Logger.log("Tipe voucher bukan 'duration' atau value tidak valid, menggunakan default 30 hari. Tipe: " + voucherDetails.type + ", Value: " + voucherDetails.value);
    }
    
    Logger.log("Aktivasi sukses: " + JSON.stringify(response));

  } catch (err) {
    Logger.log("Error dalam doPost: " + err.toString() + "\nStack: " + err.stack + "\nRequest Data (stringified e.postData.contents if available): " + (e && e.postData ? e.postData.contents : "N/A"));
    response.success = false; // Pastikan success adalah false jika ada error
    response.message = "Terjadi kesalahan internal pada server saat memproses voucher.";
  }

  return ContentService.createTextOutput(JSON.stringify(response)).setMimeType(ContentService.MimeType.JSON);
}
    