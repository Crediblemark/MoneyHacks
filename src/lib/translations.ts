
export type Language = 'id' | 'en';

type TranslationSet = {
  // AppShell & Common
  appName: string;
  navDashboard: string;
  navMonthlyReports: string;
  navAIPredictions: string;
  userAvatarAlt: string;
  userNamePlaceholder: string;
  userEmailPlaceholder: string;
  languageSwitcherID: string;
  languageSwitcherEN: string;
  logoutButtonLabel: string;

  // DashboardPage (src/app/page.tsx)
  dashboardTitle: string;
  dashboardDescription: string;

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
  recentExpensesCardDescription: (total: string) => string;
  recentExpensesTableDateHeader: string;
  recentExpensesTableDescriptionHeader: string;
  recentExpensesTableCategoryHeader: string;
  recentExpensesTableAmountHeader: string;
  recentExpensesTableNoExpensesThisMonth: string;
  recentExpensesTableDisplayingLast: (count: number) => string;
  recentExpensesTableTotalThisMonth: string;


  // PredictionsPage (src/app/predictions/page.tsx)
  predictionsTitle: string;
  predictionsDescription: string;

  // AIPredictionDisplay (src/components/predictions/AIPredictionDisplay.tsx)
  aiPredictionCardTitle: string;
  aiPredictionCardDescription: string;
  aiPredictionGenerateButton: string;
  aiPredictionProcessingButton: string;
  aiPredictionErrorTitle: string;
  aiPredictionErrorGeneral: string;
  aiPredictionErrorNoData: string;
  aiPredictionPredictedExpensesTitle: string;
  aiPredictionSavingRecommendationsTitle: string;
  aiPredictionHistoryNoteShort: string;

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

  // Categories (used in multiple places)
  categoryMakanan: string;
  categoryTransport: string;
  categoryBelanja: string;
  categoryLainnya: string;
};

export const translations: Record<Language, TranslationSet> = {
  id: {
    appName: "ChatExpense",
    navDashboard: "Dasbor",
    navMonthlyReports: "Laporan Bulanan",
    navAIPredictions: "Prediksi AI",
    userAvatarAlt: "Avatar Pengguna",
    userNamePlaceholder: "Nama Pengguna",
    userEmailPlaceholder: "pengguna@contoh.com",
    languageSwitcherID: "ID",
    languageSwitcherEN: "EN",
    logoutButtonLabel: "Keluar",

    dashboardTitle: "Dasbor",
    dashboardDescription: "Selamat datang! Catat pengeluaran Anda dan lihat ringkasan terbaru di sini.",

    expenseFormCardTitle: "Catat Pengeluaran Baru",
    expenseFormCardDescription: "Masukkan detail pengeluaran dalam format bebas, misal: \"Makan siang 50rb\" atau \"Transport 20k ke kantor\".",
    expenseFormInputPlaceholder: "Contoh: Kopi pagi 15rb",
    expenseFormSubmitButton: "Kirim",
    toastExpenseRecordedTitle: "✅ Pengeluaran Tercatat",
    toastExpenseRecordedDescription: (category, amount, description) => `${category}: ${amount} (${description})`,
    toastIncorrectFormatTitle: "❌ Format Salah",
    toastIncorrectFormatDescription: (example) => `Tidak dapat memproses input. Contoh: '${example}'`,
    exampleExpenseInput: "Makan siang 50rb",


    recentExpensesCardTitle: "Pengeluaran Terbaru (Bulan Ini)",
    recentExpensesCardDescription: (total) => `Total pengeluaran bulan ini: ${total}.`,
    recentExpensesTableDateHeader: "Tanggal",
    recentExpensesTableDescriptionHeader: "Deskripsi",
    recentExpensesTableCategoryHeader: "Kategori",
    recentExpensesTableAmountHeader: "Jumlah",
    recentExpensesTableNoExpensesThisMonth: "Belum ada pengeluaran tercatat bulan ini.",
    recentExpensesTableDisplayingLast: (count) => `Menampilkan ${count > 0 ? Math.min(count, 10) : '0'} transaksi terakhir.`,
    recentExpensesTableTotalThisMonth: "Total pengeluaran bulan ini:",

    predictionsTitle: "Prediksi Pengeluaran AI",
    predictionsDescription: "Manfaatkan kecerdasan buatan untuk memprediksi pengeluaran Anda di masa mendatang dan dapatkan tips hemat yang dipersonalisasi.",

    aiPredictionCardTitle: "Prediksi & Rekomendasi AI",
    aiPredictionCardDescription: "Dapatkan prediksi pengeluaran bulan depan dan rekomendasi hemat berdasarkan riwayat belanja Anda. Fitur ini menggunakan AI dan mungkin memerlukan beberapa saat untuk memproses.",
    aiPredictionGenerateButton: "Buat Prediksi Sekarang",
    aiPredictionProcessingButton: "Memproses...",
    aiPredictionErrorTitle: "Error",
    aiPredictionErrorGeneral: "Gagal menghasilkan prediksi. Silakan coba lagi nanti.",
    aiPredictionErrorNoData: "Tidak ada data pengeluaran untuk membuat prediksi. Silakan catat beberapa pengeluaran terlebih dahulu.",
    aiPredictionPredictedExpensesTitle: "Prediksi Pengeluaran Bulan Depan",
    aiPredictionSavingRecommendationsTitle: "Rekomendasi Hemat",
    aiPredictionHistoryNoteShort: "Catatan: Riwayat pengeluaran Anda masih sedikit, prediksi mungkin kurang akurat.\n\n",


    reportsTitle: "Laporan Bulanan",
    reportsDescription: "Lihat ringkasan pengeluaran Anda per bulan, lengkap dengan grafik.",

    monthlyReportSummaryTitle: "Ringkasan Pengeluaran",
    monthlyReportSummaryDescription: (total) => `Total Pengeluaran: ${total}`,
    monthlyReportDetailPerCategory: "Detail per Kategori",
    monthlyReportChartTitle: "Grafik Pengeluaran",
    monthlyReportCategoryHeader: "Kategori",
    monthlyReportTotalHeader: "Total",
    monthlyReportNoData: "Belum ada data pengeluaran untuk bulan ini.",

    categoryMakanan: "Makanan",
    categoryTransport: "Transport",
    categoryBelanja: "Belanja",
    categoryLainnya: "Lainnya",
  },
  en: {
    appName: "ChatExpense",
    navDashboard: "Dashboard",
    navMonthlyReports: "Monthly Reports",
    navAIPredictions: "AI Predictions",
    userAvatarAlt: "User Avatar",
    userNamePlaceholder: "User Name",
    userEmailPlaceholder: "user@example.com",
    languageSwitcherID: "ID",
    languageSwitcherEN: "EN",
    logoutButtonLabel: "Logout",

    dashboardTitle: "Dashboard",
    dashboardDescription: "Welcome! Record your expenses and see your latest summary here.",

    expenseFormCardTitle: "Record New Expense",
    expenseFormCardDescription: "Enter expense details in free format, e.g.: \"Lunch 50k\" or \"Transport 20k to office\".",
    expenseFormInputPlaceholder: "Example: Morning coffee 15k",
    expenseFormSubmitButton: "Submit",
    toastExpenseRecordedTitle: "✅ Expense Recorded",
    toastExpenseRecordedDescription: (category, amount, description) => `${category}: ${amount} (${description})`,
    toastIncorrectFormatTitle: "❌ Incorrect Format",
    toastIncorrectFormatDescription: (example) => `Cannot process input. Example: '${example}'`,
    exampleExpenseInput: "Lunch 50k",

    recentExpensesCardTitle: "Recent Expenses (This Month)",
    recentExpensesCardDescription: (total) => `Total expenses this month: ${total}.`,
    recentExpensesTableDateHeader: "Date",
    recentExpensesTableDescriptionHeader: "Description",
    recentExpensesTableCategoryHeader: "Category",
    recentExpensesTableAmountHeader: "Amount",
    recentExpensesTableNoExpensesThisMonth: "No expenses recorded this month yet.",
    recentExpensesTableDisplayingLast: (count) => `Displaying ${count > 0 ? Math.min(count, 10) : '0'} latest transactions.`,
    recentExpensesTableTotalThisMonth: "Total expenses this month:",


    predictionsTitle: "AI Expense Predictions",
    predictionsDescription: "Leverage artificial intelligence to predict your future expenses and get personalized saving tips.",

    aiPredictionCardTitle: "AI Prediction & Recommendations",
    aiPredictionCardDescription: "Get next month's expense predictions and saving recommendations based on your spending history. This feature uses AI and may take a moment to process.",
    aiPredictionGenerateButton: "Generate Prediction Now",
    aiPredictionProcessingButton: "Processing...",
    aiPredictionErrorTitle: "Error",
    aiPredictionErrorGeneral: "Failed to generate prediction. Please try again later.",
    aiPredictionErrorNoData: "No expense data available to make predictions. Please record some expenses first.",
    aiPredictionPredictedExpensesTitle: "Next Month's Expense Prediction",
    aiPredictionSavingRecommendationsTitle: "Saving Recommendations",
    aiPredictionHistoryNoteShort: "Note: Your spending history is still short, predictions might be less accurate.\n\n",

    reportsTitle: "Monthly Reports",
    reportsDescription: "View your monthly expense summary, complete with charts.",

    monthlyReportSummaryTitle: "Expense Summary",
    monthlyReportSummaryDescription: (total) => `Total Expenses: ${total}`,
    monthlyReportDetailPerCategory: "Details per Category",
    monthlyReportChartTitle: "Expense Chart",
    monthlyReportCategoryHeader: "Category",
    monthlyReportTotalHeader: "Total",
    monthlyReportNoData: "No expense data for this month yet.",

    categoryMakanan: "Food",
    categoryTransport: "Transport",
    categoryBelanja: "Shopping",
    categoryLainnya: "Others",
  }
};
