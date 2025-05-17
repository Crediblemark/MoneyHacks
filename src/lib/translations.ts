
export type Language = 'id' | 'en';

type TranslationSet = {
  // AppShell & Common
  appName: string;
  navDashboard: string;
  navMonthlyReports: string;
  navAIPredictions: string;
  navSelfReflectionAnalysis: string;
  navFinancialGoals: string;
  navHealthCheck: string;
  userAvatarAlt: string;
  userNamePlaceholder: string;
  userEmailPlaceholder: string;
  languageSwitcherID: string;
  languageSwitcherEN: string;
  logoutButtonLabel: string;
  errorDialogTitle: string;
  aiNameSettingLabel: string;
  deleteButtonLabel: string;
  cancelButtonLabel: string;
  saveButtonLabel: string;
  confirmButtonLabel: string;
  actionConfirmationTitle: string;
  actionConfirmationDescriptionDelete: (itemName: string) => string;
  authLoginButton: string;
  authLoginSuccessTitle: string;
  authLoginSuccessDescription: string;
  authLoginError: string;
  authLogoutSuccessTitle: string;
  authLogoutSuccessDescription: string;
  authLogoutError: string;
  authRequiredTitle: string;
  authRequiredDescription: string;
  authNotificationRequest: string;
  authNotificationAllowed: string;
  authNotificationBlocked: string;
  authRedirectingToLogin: string;
  authRedirectingToDashboard: string; // New
  authLoadingConfiguration: string; // New


  // Landing Page
  landingPageTitle: string;
  landingPageSubtitle: string;
  landingPageDescription: string;
  landingPageFeature1Title: string;
  landingPageFeature1Description: string;
  landingPageFeature2Title: string;
  landingPageFeature2Description: string;
  landingPageFeature3Title: string;
  landingPageFeature3Description: string;
  landingPageCTA: string; // Can be removed if login button is the main CTA


  // DashboardPage (src/app/page.tsx)
  dashboardTitle: string;
  dashboardDescription: string;

  // FinancialManagerAdvice (src/components/dashboard/FinancialManagerAdvice.tsx)
  financialManagerCardTitle: (name: string) => string;
  financialManagerCardDescription: string;
  financialManagerLoading: string;
  financialManagerPredictionLabel: string;
  financialManagerAnalysisLabel: string;
  financialManagerAnalysisDefault: string;
  financialManagerNoData: string;
  financialManagerError: string;
  financialManagerViewPredictionsButton: string;
  financialManagerViewAnalysisButton: string;
  financialManagerLoginPrompt: string; 

  // ExpenseForm (src/components/dashboard/ExpenseForm.tsx)
  expenseFormCardTitle: string;
  expenseFormCardDescription: string;
  expenseFormInputPlaceholder: string;
  expenseFormSubmitButton: string;
  toastExpenseRecordedTitle: string;
  toastExpenseRecordedDescription: (category: string, amount: string, description: string) => string;
  toastIncorrectFormatTitle: string;
  toastIncorrectFormatDescription: (example: string) => string;
  exampleExpenseInput: string;

  // RecentExpensesTable (src/components/dashboard/RecentExpensesTable.tsx)
  recentExpensesCardTitle: string;
  recentExpensesTableDateHeader: string;
  recentExpensesTableDescriptionHeader: string;
  recentExpensesTableCategoryHeader: string;
  recentExpensesTableAmountHeader: string;
  recentExpensesTableNoExpensesThisMonth: string;
  recentExpensesTableDisplayingLast: (count: number) => string;
  recentExpensesTableTotalThisMonth: string;

  // IncomeForm (src/components/dashboard/IncomeForm.tsx)
  incomeFormCardTitle: string;
  incomeFormCardDescription: string;
  incomeFormInputPlaceholder: string;
  incomeFormSubmitButton: string;
  toastIncomeRecordedTitle: string;
  toastIncomeRecordedDescription: (amount: string, description: string) => string;
  exampleIncomeInput: string;

  // RecentIncomesTable (src/components/dashboard/RecentIncomesTable.tsx)
  recentIncomesCardTitle: string;
  recentIncomesTableDateHeader: string;
  recentIncomesTableDescriptionHeader: string;
  recentIncomesTableAmountHeader: string;
  recentIncomesTableNoIncomesThisMonth: string;
  recentIncomesTableDisplayingLast: (count: number) => string;
  recentIncomesTableTotalThisMonth: string;


  // PredictionsPage (src/app/predictions/page.tsx)
  predictionsTitle: string;
  predictionsDescription: string;

  // AIPredictionDisplay (src/components/predictions/AIPredictionDisplay.tsx)
  aiPredictionCardTitle: string;
  aiPredictionCardDescriptionNewRule: string;
  aiPredictionGenerateButton: string;
  aiPredictionProcessingButton: string;
  aiPredictionErrorTitle: string;
  aiPredictionErrorGeneral: string;
  aiPredictionErrorNoData: string;
  aiPredictionHistoryNoteShort: string;
  aiPredictionNeedsTitle: string;
  aiPredictionWantsTitle: string;
  aiPredictionSavingsTitle: string;
  aiPredictionInvestmentsTitle: string;
  aiPredictionSocialTitle: string;
  aiPredictionTargetVsActual: (target: number, actual: number) => string;
  aiPredictionTargetPercentageLabel: (percentage: number) => string;
  aiPredictionEstimatedIncomeTitle: string;
  aiPredictionEstimatedIncomeText: (income: string) => string;
  aiPredictionProvidedIncomeText: (income: string) => string;
  aiPredictionOverallFeedbackTitle: string;


  // ReportsPage (src/app/reports/page.tsx)
  reportsTitle: string;
  reportsDescription: string;

  // MonthlyReportClient (src/components/reports/MonthlyReportClient.tsx)
  monthlyReportSummaryTitle: string;
  monthlyReportSummaryDescription: (total: string) => string;
  monthlyReportDetailPerCategory: string;
  monthlyReportChartTitle: string;
  monthlyReportCategoryHeader: string;
  monthlyReportTotalHeader: string;
  monthlyReportNoData: string;
  reportsNeedsVsWantsTitle: string;
  reportsNeedsLabel: string;
  reportsWantsLabel: string;
  reportsTotalNeeds: string;
  reportsTotalWants: string;

  // Analysis Page (src/app/analysis/page.tsx)
  analysisPageTitle: string;
  analysisPageDescription: string;
  analysisStartButton: string;
  analysisProcessingButton: string;
  analysisErrorTitle: string;
  analysisErrorGeneral: string;
  analysisKeyObservationsTitle: string;
  analysisReflectiveQuestionsTitle: string;
  analysisGuidanceTextTitle: string;
  analysisYourAnswerPlaceholder: string;
  analysisSubmitAnswersButton: string;
  analysisNoSpendingHistory: string;

  // Financial Goals Page (src/app/goals/page.tsx & GoalsClient.tsx)
  financialGoalsTitle: string;
  financialGoalsDescription: string;
  addGoalButtonLabel: string;
  goalCardProgressLabel: (current: string, target: string) => string;
  goalCardFundsLabel: string;
  goalCardAddFundsButton: string;
  goalCardGenerateImageButton: string;
  goalCardDeleteGoalButton: string;
  goalCardGeneratingImage: string;
  goalCardImageAlt: (goalName: string) => string;
  goalCardImagePlaceholder: string;
  addGoalDialogTitle: string;
  addGoalDialogNameLabel: string;
  addGoalDialogNamePlaceholder: string;
  addGoalDialogDescriptionLabel: string;
  addGoalDialogDescriptionPlaceholder: string;
  addGoalDialogTargetAmountLabel: string;
  addGoalDialogAmountPlaceholder: string;
  addGoalDialogAddButton: string;
  addFundsDialogTitle: (goalName: string) => string;
  addFundsDialogAmountLabel: string;
  addFundsDialogCurrentAmount: (amount: string) => string;
  addFundsDialogAddButton: string;
  goalAddedToastTitle: string;
  goalAddedToastDescription: (name: string) => string;
  fundsAddedToastTitle: string;
  fundsAddedToastDescription: (amount: string, name: string) => string;
  goalDeletedToastTitle: string;
  goalDeletedToastDescription: (name: string) => string;
  imageGeneratedToastTitle: string;
  imageGeneratedToastDescription: (name: string) => string;
  errorGeneratingImageToast: string;
  goalDescriptionNeededForImage: string;
  errorAddingGoalToast: string;
  errorAddingFundsToast: string;
  errorDeletingGoalToast: string;
  errorLoadingGoals: string;
  noGoalsYetTitle: string;
  noGoalsYetDescription: string;

  // Spending Challenge Feature
  challengeCardTitle: (aiName: string) => string;
  challengeCardDescription: string;
  challengeActiveTitle: string;
  challengeExpiresInLabel: (time: string) => string;
  challengeCompleteButton: string;
  challengeFailedButton: string;
  challengeGetNewButton: string;
  challengeGeneratingToast: string;
  challengeGeneratedToastTitle: string;
  challengeGeneratedToastDescription: string;
  challengeCompletedToastTitle: string;
  challengeFailedToastTitle: string;
  challengeClearedToastDescription: string;
  challengeErrorGenerating: string;
  challengeNoActiveChallenge: string;
  challengeAskForNew: string;
  challengeStartedCardTitle: string;
  challengeLoginPrompt: string; 


  // Categories (used in multiple places)
  categoryMakanan: string;
  categoryTransport: string;
  categoryBelanja: string;
  categoryLainnya: string;

  // Health Check Page (New)
  healthCheckTitle: string;
  healthCheckDescription: string;
  healthCheckSelectMonthYearLabel: string;
  healthCheckPerformCheckButton: string;
  healthCheckPerformingCheck: string;
  healthCheckReportCardTitle: (monthYear: string) => string;
  healthCheckOverallGradeLabel: string;
  healthCheckPositiveHighlightsLabel: string;
  healthCheckAreasForImprovementLabel: string;
  healthCheckActionableAdviceLabel: string;
  healthCheckSummaryMessageLabel: string;
  healthCheckNoDataForMonth: string;
  healthCheckError: string;
  healthCheckMonthLabel: string;
  healthCheckYearLabel: string;
};

export const translations: Record<Language, TranslationSet> = {
  id: {
    appName: "ChatExpense",
    navDashboard: "Dasbor",
    navMonthlyReports: "Laporan Bulanan",
    navAIPredictions: "Prediksi AI",
    navSelfReflectionAnalysis: "Analisis & Refleksi",
    navFinancialGoals: "Target Keuangan",
    navHealthCheck: "Cek Kesehatan Keuangan",
    userAvatarAlt: "Avatar Pengguna",
    userNamePlaceholder: "Nama Pengguna",
    userEmailPlaceholder: "pengguna@contoh.com",
    languageSwitcherID: "ID",
    languageSwitcherEN: "EN",
    logoutButtonLabel: "Keluar",
    errorDialogTitle: "Terjadi Kesalahan",
    aiNameSettingLabel: "Panggil AI Sebagai:",
    deleteButtonLabel: "Hapus",
    cancelButtonLabel: "Batal",
    saveButtonLabel: "Simpan",
    confirmButtonLabel: "Konfirmasi",
    actionConfirmationTitle: "Konfirmasi Tindakan",
    actionConfirmationDescriptionDelete: (itemName) => `Apakah Anda yakin ingin menghapus "${itemName}"? Tindakan ini tidak dapat diurungkan.`,
    authLoginButton: "Login dengan Google",
    authLoginSuccessTitle: "Login Berhasil!",
    authLoginSuccessDescription: "Selamat datang kembali!",
    authLoginError: "Gagal melakukan login dengan Google. Silakan coba lagi.",
    authLogoutSuccessTitle: "Logout Berhasil!",
    authLogoutSuccessDescription: "Anda telah berhasil keluar.",
    authLogoutError: "Gagal melakukan logout. Silakan coba lagi.",
    authRequiredTitle: "Login Diperlukan",
    authRequiredDescription: "Anda harus login untuk menggunakan fitur ini.",
    authNotificationRequest: "Aktifkan Notifikasi Browser",
    authNotificationAllowed: "Notifikasi Browser Diizinkan",
    authNotificationBlocked: "Notifikasi Browser Diblokir",
    authRedirectingToLogin: "Mengarahkan ke halaman login...",
    authRedirectingToDashboard: "Mengarahkan ke dasbor...",
    authLoadingConfiguration: "Memuat konfigurasi...",

    landingPageTitle: "ChatExpense: Keuangan Terkendali",
    landingPageSubtitle: "Catat pengeluaran & pemasukan dengan mudah, dapatkan analisis cerdas dari AI, dan capai target keuangan Anda.",
    landingPageDescription: "ChatExpense adalah asisten keuangan pribadi Anda. Login untuk memulai perjalanan finansial yang lebih baik!",
    landingPageFeature1Title: "Pencatatan Cerdas",
    landingPageFeature1Description: "Input transaksi secepat chat! AI kami akan membantu mengkategorikan pengeluaran Anda.",
    landingPageFeature2Title: "Analisis & Saran AI",
    landingPageFeature2Description: "Dapatkan wawasan mendalam dan terima saran 'tough love' dari AI untuk perbaikan.",
    landingPageFeature3Title: "Capai Target Finansial",
    landingPageFeature3Description: "Tetapkan target, lacak progres, dan biarkan AI membantu memotivasi Anda.",
    landingPageCTA: "Mulai Sekarang - Gratis!",

    dashboardTitle: "Dasbor Keuangan",
    dashboardDescription: "Selamat datang! Catat pemasukan dan pengeluaran Anda, serta lihat ringkasan terbaru dan saran dari AI Anda di sini.",

    financialManagerCardTitle: (name) => `Saran dari ${name} Anda`,
    financialManagerCardDescription: "Dapatkan panduan singkat untuk mengelola keuangan Anda lebih baik.",
    financialManagerLoading: "Memuat saran AI...",
    financialManagerPredictionLabel: "Dari Rencana Keuangan Anda:",
    financialManagerAnalysisLabel: "Untuk Direnungkan:",
    financialManagerAnalysisDefault: "Belum ada pertanyaan refleksi spesifik saat ini. Coba analisis pengeluaran Anda!",
    financialManagerNoData: "Belum cukup data untuk memberikan saran. Silakan catat beberapa transaksi.",
    financialManagerError: "Gagal memuat saran. Silakan coba lagi nanti.",
    financialManagerViewPredictionsButton: "Lihat Prediksi Detail",
    financialManagerViewAnalysisButton: "Mulai Refleksi Diri",
    financialManagerLoginPrompt: "Login untuk mendapatkan saran dari AI Anda.",

    expenseFormCardTitle: "Catat Pengeluaran Baru",
    expenseFormCardDescription: "Masukkan detail pengeluaran dalam format bebas, misal: \"Makan siang 50rb\" atau \"Transport 20k ke kantor\". AI akan membantu mengkategorikannya.",
    expenseFormInputPlaceholder: "Contoh: Kopi pagi 15rb",
    expenseFormSubmitButton: "Kirim",
    toastExpenseRecordedTitle: "✅ Pengeluaran Tercatat",
    toastExpenseRecordedDescription: (category, amount, description) => `${category}: ${amount} (${description})`,
    toastIncorrectFormatTitle: "❌ Format Salah",
    toastIncorrectFormatDescription: (example) => `Tidak dapat memproses input. Contoh: '${example}'`,
    exampleExpenseInput: "Makan siang 50rb",

    recentExpensesCardTitle: "Pengeluaran Terbaru (Bulan Ini)",
    recentExpensesTableDateHeader: "Tanggal",
    recentExpensesTableDescriptionHeader: "Deskripsi",
    recentExpensesTableCategoryHeader: "Kategori",
    recentExpensesTableAmountHeader: "Jumlah",
    recentExpensesTableNoExpensesThisMonth: "Belum ada pengeluaran tercatat bulan ini.",
    recentExpensesTableDisplayingLast: (count) => `Menampilkan ${count > 0 ? Math.min(count, 10) : '0'} transaksi terakhir.`,
    recentExpensesTableTotalThisMonth: "Total pengeluaran bulan ini:",

    incomeFormCardTitle: "Catat Pemasukan Baru",
    incomeFormCardDescription: "Masukkan detail pemasukan, misal: \"Gaji bulanan 10jt\" atau \"Bonus proyek 1.5jt\".",
    incomeFormInputPlaceholder: "Contoh: Gaji bulanan 10jt",
    incomeFormSubmitButton: "Kirim",
    toastIncomeRecordedTitle: "✅ Pemasukan Tercatat",
    toastIncomeRecordedDescription: (amount, description) => `Pemasukan: ${amount} (${description})`,
    exampleIncomeInput: "Gaji bulanan 10jt",

    recentIncomesCardTitle: "Pemasukan Terbaru (Bulan Ini)",
    recentIncomesTableDateHeader: "Tanggal",
    recentIncomesTableDescriptionHeader: "Deskripsi",
    recentIncomesTableAmountHeader: "Jumlah",
    recentIncomesTableNoIncomesThisMonth: "Belum ada pemasukan tercatat bulan ini.",
    recentIncomesTableDisplayingLast: (count) => `Menampilkan ${count > 0 ? Math.min(count, 10) : '0'} transaksi terakhir.`,
    recentIncomesTableTotalThisMonth: "Total pemasukan bulan ini:",

    predictionsTitle: "Prediksi & Rencana Keuangan AI",
    predictionsDescription: "Dapatkan analisis keuangan pribadi dan rencana alokasi dana berdasarkan aturan 50/15/10/20/5 (Kebutuhan/Keinginan/Tabungan/Investasi/Sosial).",

    aiPredictionCardTitle: "Analisis & Rencana Keuangan AI",
    aiPredictionCardDescriptionNewRule: "AI akan menganalisis pengeluaran Anda dan membuat rencana keuangan berdasarkan aturan: Kebutuhan (maks 50%), Keinginan (maks 15%), Tabungan (min 10%), Investasi (min 20%), dan Sosial/ZIS (min 5%). Berikan data pemasukan Anda untuk akurasi lebih baik.",
    aiPredictionGenerateButton: "Buat Analisis Sekarang",
    aiPredictionProcessingButton: "Memproses...",
    aiPredictionErrorTitle: "Error",
    aiPredictionErrorGeneral: "Gagal menghasilkan analisis. Silakan coba lagi nanti.",
    aiPredictionErrorNoData: "Tidak ada data pengeluaran atau pemasukan yang cukup untuk dianalisis. Silakan catat beberapa transaksi terlebih dahulu.",
    aiPredictionHistoryNoteShort: "Catatan: Riwayat pengeluaran Anda masih sedikit, analisis mungkin kurang akurat jika estimasi pendapatan dari pengeluaran.\n\n",
    aiPredictionNeedsTitle: "Kebutuhan (Maks 50%)",
    aiPredictionWantsTitle: "Keinginan (Maks 15%)",
    aiPredictionSavingsTitle: "Tabungan (Min 10%)",
    aiPredictionInvestmentsTitle: "Investasi (Min 20%)",
    aiPredictionSocialTitle: "Sosial/ZIS (Min 5%)",
    aiPredictionTargetVsActual: (target, actual) => `Target: ${target}%, Aktual: ${actual.toFixed(1)}%`,
    aiPredictionTargetPercentageLabel: (percentage) => `Target ${percentage}%`,
    aiPredictionEstimatedIncomeTitle: "Pendapatan Bulanan",
    aiPredictionEstimatedIncomeText: (income) => `AI mengestimasi pendapatan bulanan Anda sekitar ${income} berdasarkan riwayat pengeluaran.`,
    aiPredictionProvidedIncomeText: (income) => `Pendapatan bulanan Anda (berdasarkan data yang dimasukkan): ${income}.`,
    aiPredictionOverallFeedbackTitle: "Umpan Balik & Langkah Selanjutnya",

    reportsTitle: "Laporan Bulanan",
    reportsDescription: "Lihat ringkasan pengeluaran Anda per bulan, lengkap dengan grafik.",

    monthlyReportSummaryTitle: "Ringkasan Pengeluaran",
    monthlyReportSummaryDescription: (total) => `Total Pengeluaran: ${total}`,
    monthlyReportDetailPerCategory: "Detail per Kategori",
    monthlyReportChartTitle: "Grafik Pengeluaran",
    monthlyReportCategoryHeader: "Kategori",
    monthlyReportTotalHeader: "Total",
    monthlyReportNoData: "Belum ada data pengeluaran untuk bulan ini.",
    reportsNeedsVsWantsTitle: "Kebutuhan vs. Keinginan",
    reportsNeedsLabel: "Kebutuhan",
    reportsWantsLabel: "Keinginan",
    reportsTotalNeeds: "Total Kebutuhan:",
    reportsTotalWants: "Total Keinginan:",


    analysisPageTitle: "Analisis Belanja & Refleksi Diri",
    analysisPageDescription: "Pahami pola pengeluaran Anda lebih dalam dan bedakan antara kebutuhan dan keinginan melalui pertanyaan reflektif dari AI.",
    analysisStartButton: "Mulai Analisis",
    analysisProcessingButton: "Menganalisis...",
    analysisErrorTitle: "Error Analisis",
    analysisErrorGeneral: "Gagal melakukan analisis. Silakan coba lagi.",
    analysisKeyObservationsTitle: "Observasi Kunci dari AI:",
    analysisReflectiveQuestionsTitle: "Pertanyaan Reflektif untuk Anda:",
    analysisGuidanceTextTitle: "Panduan Refleksi:",
    analysisYourAnswerPlaceholder: "Ketik jawaban atau refleksi Anda di sini...",
    analysisSubmitAnswersButton: "Kirim Jawaban & Dapatkan Wawasan Baru",
    analysisNoSpendingHistory: "Belum ada riwayat pengeluaran yang cukup untuk dianalisis. Silakan catat beberapa pengeluaran terlebih dahulu.",

    financialGoalsTitle: "Target Keuangan",
    financialGoalsDescription: "Tetapkan dan lacak target keuangan Anda. Biarkan AI membantu memvisualisasikan impian Anda!",
    addGoalButtonLabel: "Tambah Target Baru",
    goalCardProgressLabel: (current, target) => `${current} / ${target}`,
    goalCardFundsLabel: "Dana Terkumpul",
    goalCardAddFundsButton: "Tambah Dana",
    goalCardGenerateImageButton: "Buat Gambar AI",
    goalCardDeleteGoalButton: "Hapus Target",
    goalCardGeneratingImage: "Membuat gambar...",
    goalCardImageAlt: (goalName) => `Gambar AI untuk target ${goalName}`,
    goalCardImagePlaceholder: "Belum ada gambar AI. Klik 'Buat Gambar AI'.",
    addGoalDialogTitle: "Tambah Target Keuangan Baru",
    addGoalDialogNameLabel: "Nama Target",
    addGoalDialogNamePlaceholder: "Contoh: Liburan ke Jepang, Laptop Baru",
    addGoalDialogDescriptionLabel: "Deskripsi (untuk AI Image)",
    addGoalDialogDescriptionPlaceholder: "Contoh: Pemandangan Gunung Fuji saat musim semi",
    addGoalDialogTargetAmountLabel: "Jumlah Target",
    addGoalDialogAmountPlaceholder: "Contoh: 20000000",
    addGoalDialogAddButton: "Tambah Target",
    addFundsDialogTitle: (goalName) => `Tambah Dana untuk "${goalName}"`,
    addFundsDialogAmountLabel: "Jumlah Dana",
    addFundsDialogCurrentAmount: (amount) => `Dana saat ini: ${amount}`,
    addFundsDialogAddButton: "Tambah Dana",
    goalAddedToastTitle: "🎯 Target Ditambahkan!",
    goalAddedToastDescription: (name) => `Target "${name}" berhasil ditambahkan.`,
    fundsAddedToastTitle: "💰 Dana Ditambahkan!",
    fundsAddedToastDescription: (amount, name) => `${amount} ditambahkan ke target "${name}".`,
    goalDeletedToastTitle: "🗑️ Target Dihapus",
    goalDeletedToastDescription: (name) => `Target "${name}" telah dihapus.`,
    imageGeneratedToastTitle: "🖼️ Gambar Dibuat!",
    imageGeneratedToastDescription: (name) => `Gambar AI untuk target "${name}" telah dibuat.`,
    errorGeneratingImageToast: "Gagal membuat gambar AI.",
    goalDescriptionNeededForImage: "Deskripsi target diperlukan untuk membuat gambar.",
    errorAddingGoalToast: "Gagal menambah target.",
    errorAddingFundsToast: "Gagal menambah dana.",
    errorDeletingGoalToast: "Gagal menghapus target.",
    errorLoadingGoals: "Gagal memuat target.",
    noGoalsYetTitle: "Belum Ada Target",
    noGoalsYetDescription: "Anda belum menetapkan target keuangan. Ayo buat target pertamamu!",

    challengeCardTitle: (aiName) => `Tantangan dari ${aiName}`,
    challengeCardDescription: "Dapatkan tantangan keuangan mingguan dari AI untuk membantu memperbaiki kebiasaan belanja Anda.",
    challengeActiveTitle: "Tantangan Aktif Minggu Ini:",
    challengeExpiresInLabel: (time) => `Berakhir dalam ${time}`,
    challengeCompleteButton: "Saya Berhasil!",
    challengeFailedButton: "Saya Gagal/Lewati",
    challengeGetNewButton: "Minta Tantangan Baru dari AI",
    challengeGeneratingToast: "Sedang meminta tantangan dari AI...",
    challengeGeneratedToastTitle: "💪 Tantangan Baru Diterima!",
    challengeGeneratedToastDescription: "Semangat jalani tantangannya!",
    challengeCompletedToastTitle: "🎉 Selamat! Tantangan Selesai!",
    challengeFailedToastTitle: "😔 Tantangan Belum Selesai",
    challengeClearedToastDescription: "Anda bisa meminta tantangan baru kapan saja.",
    challengeErrorGenerating: "Gagal meminta tantangan dari AI. Coba lagi nanti.",
    challengeNoActiveChallenge: "Tidak ada tantangan aktif saat ini.",
    challengeAskForNew: "Ayo minta tantangan baru dari AI!",
    challengeStartedCardTitle: "Tantangan Sedang Berjalan:",
    challengeLoginPrompt: "Login untuk mendapatkan tantangan dari AI.", 


    categoryMakanan: "Makanan",
    categoryTransport: "Transportasi",
    categoryBelanja: "Belanja",
    categoryLainnya: "Lainnya",

    healthCheckTitle: "Cek Kesehatan Keuangan Bulanan",
    healthCheckDescription: "Dapatkan 'rapor' keuangan bulanan dari AI Anda, lengkap dengan analisis dan saran 'tough love'.",
    healthCheckSelectMonthYearLabel: "Pilih Bulan & Tahun:",
    healthCheckPerformCheckButton: "Lakukan Cek Kesehatan",
    healthCheckPerformingCheck: "Sedang memeriksa...",
    healthCheckReportCardTitle: (monthYear) => `Rapor Kesehatan Keuangan - ${monthYear}`,
    healthCheckOverallGradeLabel: "Nilai Keseluruhan:",
    healthCheckPositiveHighlightsLabel: "Hal Positif Bulan Ini 👍:",
    healthCheckAreasForImprovementLabel: "Area Perbaikan Bulan Ini 👎:",
    healthCheckActionableAdviceLabel: "Saran Aksi Bulan Depan 🚀:",
    healthCheckSummaryMessageLabel: "Pesan dari Pelatih Keuanganmu:",
    healthCheckNoDataForMonth: "Tidak cukup data pengeluaran atau pemasukan untuk bulan yang dipilih. Tidak bisa melakukan cek kesehatan.",
    healthCheckError: "Gagal melakukan cek kesehatan. Coba lagi nanti.",
    healthCheckMonthLabel: "Bulan",
    healthCheckYearLabel: "Tahun",

  },
  en: {
    appName: "ChatExpense",
    navDashboard: "Dashboard",
    navMonthlyReports: "Monthly Reports",
    navAIPredictions: "AI Predictions",
    navSelfReflectionAnalysis: "Analysis & Reflection",
    navFinancialGoals: "Financial Goals",
    navHealthCheck: "Financial Health Check",
    userAvatarAlt: "User Avatar",
    userNamePlaceholder: "User Name",
    userEmailPlaceholder: "user@example.com",
    languageSwitcherID: "ID",
    languageSwitcherEN: "EN",
    logoutButtonLabel: "Logout",
    errorDialogTitle: "An Error Occurred",
    aiNameSettingLabel: "Call AI As:",
    deleteButtonLabel: "Delete",
    cancelButtonLabel: "Cancel",
    saveButtonLabel: "Save",
    confirmButtonLabel: "Confirm",
    actionConfirmationTitle: "Confirm Action",
    actionConfirmationDescriptionDelete: (itemName) => `Are you sure you want to delete "${itemName}"? This action cannot be undone.`,
    authLoginButton: "Login with Google",
    authLoginSuccessTitle: "Login Successful!",
    authLoginSuccessDescription: "Welcome back!",
    authLoginError: "Failed to login with Google. Please try again.",
    authLogoutSuccessTitle: "Logout Successful!",
    authLogoutSuccessDescription: "You have been successfully logged out.",
    authLogoutError: "Failed to logout. Please try again.",
    authRequiredTitle: "Login Required",
    authRequiredDescription: "You must be logged in to use this feature.",
    authNotificationRequest: "Enable Browser Notifications",
    authNotificationAllowed: "Browser Notifications Allowed",
    authNotificationBlocked: "Browser Notifications Blocked",
    authRedirectingToLogin: "Redirecting to login page...",
    authRedirectingToDashboard: "Redirecting to dashboard...",
    authLoadingConfiguration: "Loading configuration...",


    landingPageTitle: "ChatExpense: Controlled Finances",
    landingPageSubtitle: "Easily track income & expenses, get smart AI analysis, and achieve your financial goals.",
    landingPageDescription: "ChatExpense is your personal finance assistant. Login to start your better financial journey!",
    landingPageFeature1Title: "Smart Tracking",
    landingPageFeature1Description: "Input transactions as fast as chatting! Our AI will help categorize your expenses.",
    landingPageFeature2Title: "AI Analysis & Advice",
    landingPageFeature2Description: "Gain deep insights and receive 'tough love' advice from AI for improvement.",
    landingPageFeature3Title: "Achieve Financial Goals",
    landingPageFeature3Description: "Set targets, track progress, and let AI help motivate you.",
    landingPageCTA: "Get Started - It's Free!",


    dashboardTitle: "Financial Dashboard",
    dashboardDescription: "Welcome! Record your income and expenses, and see your latest summary and advice from your AI here.",

    financialManagerCardTitle: (name) => `Advice from Your ${name}`,
    financialManagerCardDescription: "Get quick guidance to manage your finances better.",
    financialManagerLoading: "Loading AI advice...",
    financialManagerPredictionLabel: "From Your Financial Plan:",
    financialManagerAnalysisLabel: "Food for Thought:",
    financialManagerAnalysisDefault: "No specific reflective questions at the moment. Try analyzing your spending!",
    financialManagerNoData: "Not enough data to provide advice. Please record some transactions.",
    financialManagerError: "Failed to load advice. Please try again later.",
    financialManagerViewPredictionsButton: "View Detailed Predictions",
    financialManagerViewAnalysisButton: "Start Self-Reflection",
    financialManagerLoginPrompt: "Login to get advice from your AI.",

    expenseFormCardTitle: "Record New Expense",
    expenseFormCardDescription: "Enter expense details in free format, e.g.: \"Lunch 50k\" or \"Transport 20k to office\". AI will help categorize it.",
    expenseFormInputPlaceholder: "Example: Morning coffee 15k",
    expenseFormSubmitButton: "Submit",
    toastExpenseRecordedTitle: "✅ Expense Recorded",
    toastExpenseRecordedDescription: (category, amount, description) => `${category}: ${amount} (${description})`,
    toastIncorrectFormatTitle: "❌ Incorrect Format",
    toastIncorrectFormatDescription: (example) => `Cannot process input. Example: '${example}'`,
    exampleExpenseInput: "Lunch 50k",

    recentExpensesCardTitle: "Recent Expenses (This Month)",
    recentExpensesTableDateHeader: "Date",
    recentExpensesTableDescriptionHeader: "Description",
    recentExpensesTableCategoryHeader: "Category",
    recentExpensesTableAmountHeader: "Amount",
    recentExpensesTableNoExpensesThisMonth: "No expenses recorded this month yet.",
    recentExpensesTableDisplayingLast: (count) => `Displaying ${count > 0 ? Math.min(count, 10) : '0'} latest transactions.`,
    recentExpensesTableTotalThisMonth: "Total expenses this month:",

    incomeFormCardTitle: "Record New Income",
    incomeFormCardDescription: "Enter income details, e.g.: \"Monthly salary 10M\" or \"Project bonus 1.5M\".",
    incomeFormInputPlaceholder: "Example: Monthly salary 10M",
    incomeFormSubmitButton: "Submit",
    toastIncomeRecordedTitle: "✅ Income Recorded",
    toastIncomeRecordedDescription: (amount, description) => `Income: ${amount} (${description})`,
    exampleIncomeInput: "Monthly salary 10M",

    recentIncomesCardTitle: "Recent Incomes (This Month)",
    recentIncomesTableDateHeader: "Date",
    recentIncomesTableDescriptionHeader: "Description",
    recentIncomesTableAmountHeader: "Amount",
    recentIncomesTableNoIncomesThisMonth: "No income recorded this month yet.",
    recentIncomesTableDisplayingLast: (count) => `Displaying ${count > 0 ? Math.min(count, 10) : '0'} latest transactions.`,
    recentIncomesTableTotalThisMonth: "Total income this month:",

    predictionsTitle: "AI Financial Plan & Predictions",
    predictionsDescription: "Get a personalized financial analysis and fund allocation plan based on the 50/15/10/20/5 rule (Needs/Wants/Savings/Investments/Social).",

    aiPredictionCardTitle: "AI Financial Analysis & Plan",
    aiPredictionCardDescriptionNewRule: "The AI will analyze your spending and create a financial plan based on the rule: Needs (max 50%), Wants (max 15%), Savings (min 10%), Investments (min 20%), and Social/ZIS (min 5%). Provide your income data for better accuracy.",
    aiPredictionGenerateButton: "Generate Analysis Now",
    aiPredictionProcessingButton: "Processing...",
    aiPredictionErrorTitle: "Error",
    aiPredictionErrorGeneral: "Failed to generate analysis. Please try again later.",
    aiPredictionErrorNoData: "Not enough expense or income data available to analyze. Please record some transactions first.",
    aiPredictionHistoryNoteShort: "Note: Your spending history is still short, income estimation from expenses might be less accurate.\n\n",
    aiPredictionNeedsTitle: "Needs (Max 50%)",
    aiPredictionWantsTitle: "Wants (Max 15%)",
    aiPredictionSavingsTitle: "Savings (Min 10%)",
    aiPredictionInvestmentsTitle: "Investments (Min 20%)",
    aiPredictionSocialTitle: "Social/ZIS (Min 5%)",
    aiPredictionTargetVsActual: (target, actual) => `Target: ${target}%, Actual: ${actual.toFixed(1)}%`,
    aiPredictionTargetPercentageLabel: (percentage) => `Target ${percentage}%`,
    aiPredictionEstimatedIncomeTitle: "Monthly Income",
    aiPredictionEstimatedIncomeText: (income) => `The AI estimates your monthly income to be around ${income} based on your spending history.`,
    aiPredictionProvidedIncomeText: (income) => `Your monthly income (based on entered data): ${income}.`,
    aiPredictionOverallFeedbackTitle: "Overall Feedback & Next Steps",

    reportsTitle: "Monthly Reports",
    reportsDescription: "View your monthly expense summary, complete with charts.",

    monthlyReportSummaryTitle: "Expense Summary",
    monthlyReportSummaryDescription: (total) => `Total Expenses: ${total}`,
    monthlyReportDetailPerCategory: "Details per Category",
    monthlyReportChartTitle: "Expense Chart",
    monthlyReportCategoryHeader: "Category",
    monthlyReportTotalHeader: "Total",
    monthlyReportNoData: "No expense data for this month yet.",
    reportsNeedsVsWantsTitle: "Needs vs. Wants",
    reportsNeedsLabel: "Needs",
    reportsWantsLabel: "Wants",
    reportsTotalNeeds: "Total Needs:",
    reportsTotalWants: "Total Wants:",


    analysisPageTitle: "Spending Analysis & Self-Reflection",
    analysisPageDescription: "Understand your spending patterns deeper and distinguish between needs and wants through AI-driven reflective questions.",
    analysisStartButton: "Start Analysis",
    analysisProcessingButton: "Analyzing...",
    analysisErrorTitle: "Analysis Error",
    analysisErrorGeneral: "Failed to perform analysis. Please try again.",
    analysisKeyObservationsTitle: "Key Observations from AI:",
    analysisReflectiveQuestionsTitle: "Reflective Questions for You:",
    analysisGuidanceTextTitle: "Reflection Guidance:",
    analysisYourAnswerPlaceholder: "Type your answer or reflection here...",
    analysisSubmitAnswersButton: "Submit Answers & Get New Insights",
    analysisNoSpendingHistory: "Not enough spending history to analyze. Please record some expenses first.",

    financialGoalsTitle: "Financial Goals",
    financialGoalsDescription: "Set and track your financial goals. Let AI help visualize your dreams!",
    addGoalButtonLabel: "Add New Goal",
    goalCardProgressLabel: (current, target) => `${current} / ${target}`,
    goalCardFundsLabel: "Funds Accumulated",
    goalCardAddFundsButton: "Add Funds",
    goalCardGenerateImageButton: "Generate AI Image",
    goalCardDeleteGoalButton: "Delete Goal",
    goalCardGeneratingImage: "Generating image...",
    goalCardImageAlt: (goalName) => `AI image for goal ${goalName}`,
    goalCardImagePlaceholder: "No AI image yet. Click 'Generate AI Image'.",
    addGoalDialogTitle: "Add New Financial Goal",
    addGoalDialogNameLabel: "Goal Name",
    addGoalDialogNamePlaceholder: "E.g.: Japan Trip, New Laptop",
    addGoalDialogDescriptionLabel: "Description (for AI Image)",
    addGoalDialogDescriptionPlaceholder: "E.g.: Mount Fuji view in spring",
    addGoalDialogTargetAmountLabel: "Target Amount",
    addGoalDialogAmountPlaceholder: "E.g.: 20000000",
    addGoalDialogAddButton: "Add Goal",
    addFundsDialogTitle: (goalName) => `Add Funds for "${goalName}"`,
    addFundsDialogAmountLabel: "Amount of Funds",
    addFundsDialogCurrentAmount: (amount) => `Current funds: ${amount}`,
    addFundsDialogAddButton: "Add Funds",
    goalAddedToastTitle: "🎯 Goal Added!",
    goalAddedToastDescription: (name) => `Goal "${name}" added successfully.`,
    fundsAddedToastTitle: "💰 Funds Added!",
    fundsAddedToastDescription: (amount, name) => `${amount} added to goal "${name}".`,
    goalDeletedToastTitle: "🗑️ Goal Deleted",
    goalDeletedToastDescription: (name) => `Goal "${name}" has been deleted.`,
    imageGeneratedToastTitle: "🖼️ Image Generated!",
    imageGeneratedToastDescription: (name) => `AI image for goal "${name}" has been generated.`,
    errorGeneratingImageToast: "Failed to generate AI image.",
    goalDescriptionNeededForImage: "Goal description is needed to generate an image.",
    errorAddingGoalToast: "Failed to add goal.",
    errorAddingFundsToast: "Failed to add funds.",
    errorDeletingGoalToast: "Failed to delete goal.",
    errorLoadingGoals: "Failed to load goals.",
    noGoalsYetTitle: "No Goals Yet",
    noGoalsYetDescription: "You haven't set any financial goals. Let's create your first one!",

    challengeCardTitle: (aiName) => `Challenge from ${aiName}`,
    challengeCardDescription: "Get weekly financial challenges from AI to help improve your spending habits.",
    challengeActiveTitle: "This Week's Active Challenge:",
    challengeExpiresInLabel: (time) => `Expires in ${time}`,
    challengeCompleteButton: "I Succeeded!",
    challengeFailedButton: "I Failed/Skipped",
    challengeGetNewButton: "Get New Challenge from AI",
    challengeGeneratingToast: "Requesting challenge from AI...",
    challengeGeneratedToastTitle: "💪 New Challenge Received!",
    challengeGeneratedToastDescription: "Good luck with the challenge!",
    challengeCompletedToastTitle: "🎉 Congratulations! Challenge Completed!",
    challengeFailedToastTitle: "😔 Challenge Not Completed",
    challengeClearedToastDescription: "You can request a new challenge anytime.",
    challengeErrorGenerating: "Failed to request challenge from AI. Try again later.",
    challengeNoActiveChallenge: "No active challenge at the moment.",
    challengeAskForNew: "Let's ask AI for a new challenge!",
    challengeStartedCardTitle: "Ongoing Challenge:",
    challengeLoginPrompt: "Login to get challenges from AI.", 


    categoryMakanan: "Food",
    categoryTransport: "Transportation",
    categoryBelanja: "Shopping",
    categoryLainnya: "Others",

    healthCheckTitle: "Monthly Financial Health Check",
    healthCheckDescription: "Get your monthly financial 'report card' from your AI, complete with 'tough love' analysis and advice.",
    healthCheckSelectMonthYearLabel: "Select Month & Year:",
    healthCheckPerformCheckButton: "Perform Health Check",
    healthCheckPerformingCheck: "Performing check...",
    healthCheckReportCardTitle: (monthYear) => `Financial Health Report - ${monthYear}`,
    healthCheckOverallGradeLabel: "Overall Grade:",
    healthCheckPositiveHighlightsLabel: "Positive Highlights This Month 👍:",
    healthCheckAreasForImprovementLabel: "Areas for Improvement This Month 👎:",
    healthCheckActionableAdviceLabel: "Actionable Advice Next Month 🚀:",
    healthCheckSummaryMessageLabel: "Message from Your Financial Coach:",
    healthCheckNoDataForMonth: "Not enough expense or income data for the selected month. Cannot perform health check.",
    healthCheckError: "Failed to perform health check. Please try again later.",
    healthCheckMonthLabel: "Month",
    healthCheckYearLabel: "Year",
  }
};

