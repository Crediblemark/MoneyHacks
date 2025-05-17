
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
  recentExpensesCardDescription: (total: string) => string; // Not used anymore, total is shown differently
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
  aiPredictionCardDescription: string; // Old description
  aiPredictionCardDescriptionNewRule: string; // New description for the new rule
  aiPredictionGenerateButton: string;
  aiPredictionProcessingButton: string;
  aiPredictionErrorTitle: string;
  aiPredictionErrorGeneral: string;
  aiPredictionErrorNoData: string;
  aiPredictionPredictedExpensesTitle: string; // Old, replaced by specific categories
  aiPredictionSavingRecommendationsTitle: string; // Old, replaced by overall feedback
  aiPredictionHistoryNoteShort: string;
  aiPredictionBudgetAnalysisTitle: string; // Old, for 50/30/20
  aiPredictionNeedsCategory: string; // Old
  aiPredictionWantsCategory: string; // Old
  aiPredictionSavingsCategory: string; // Old
  aiPredictionPercentageActual: (percentage: number) => string; // Old
  aiPredictionPercentageTarget: (percentage: number) => string; // Old
  aiPredictionAllocationGuidance: string; // Old
  aiPredictionNeedsTitle: string;
  aiPredictionWantsTitle: string;
  aiPredictionSavingsTitle: string;
  aiPredictionInvestmentsTitle: string;
  aiPredictionSocialTitle: string;
  aiPredictionTargetVsActual: (target: number, actual: number) => string;
  aiPredictionTargetPercentageLabel: (percentage: number) => string;
  aiPredictionEstimatedIncomeTitle: string;
  aiPredictionEstimatedIncomeText: (income: string) => string;
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

    predictionsTitle: "Prediksi & Rencana Keuangan AI",
    predictionsDescription: "Dapatkan analisis keuangan pribadi dan rencana alokasi dana berdasarkan aturan 50/15/10/20/5 (Kebutuhan/Keinginan/Tabungan/Investasi/Sosial).",

    aiPredictionCardTitle: "Analisis & Rencana Keuangan AI",
    aiPredictionCardDescription: "Analisis pengeluaran Anda terhadap aturan 50/30/20 (Kebutuhan/Keinginan/Tabungan) dan dapatkan rekomendasi.", // Old
    aiPredictionCardDescriptionNewRule: "AI akan menganalisis pengeluaran Anda dan membuat rencana keuangan berdasarkan aturan: Kebutuhan (maks 50%), Keinginan (maks 15%), Tabungan (min 10%), Investasi (min 20%), dan Sosial/ZIS (min 5%).",
    aiPredictionGenerateButton: "Buat Analisis Sekarang",
    aiPredictionProcessingButton: "Memproses...",
    aiPredictionErrorTitle: "Error",
    aiPredictionErrorGeneral: "Gagal menghasilkan analisis. Silakan coba lagi nanti.",
    aiPredictionErrorNoData: "Tidak ada data pengeluaran untuk dianalisis. Silakan catat beberapa pengeluaran terlebih dahulu.",
    aiPredictionPredictedExpensesTitle: "Prediksi Pengeluaran", // Old
    aiPredictionSavingRecommendationsTitle: "Rekomendasi Hemat", // Old
    aiPredictionHistoryNoteShort: "Catatan: Riwayat pengeluaran Anda masih sedikit, analisis mungkin kurang akurat.\n\n",
    aiPredictionBudgetAnalysisTitle: "Analisis Alokasi Anggaran (50/30/20)", // Old
    aiPredictionNeedsCategory: "Kebutuhan (50%)", // Old
    aiPredictionWantsCategory: "Keinginan (30%)", // Old
    aiPredictionSavingsCategory: "Tabungan (20%)", // Old
    aiPredictionPercentageActual: (percentage) => `Aktual: ${percentage.toFixed(1)}%`, // Old
    aiPredictionPercentageTarget: (percentage) => `Target: ${percentage}%`, // Old
    aiPredictionAllocationGuidance: "Berikut adalah panduan alokasi berdasarkan aturan 50/30/20 dari total pengeluaran Anda:", // Old
    aiPredictionNeedsTitle: "Kebutuhan (Maks 50%)",
    aiPredictionWantsTitle: "Keinginan (Maks 15%)",
    aiPredictionSavingsTitle: "Tabungan (Min 10%)",
    aiPredictionInvestmentsTitle: "Investasi (Min 20%)",
    aiPredictionSocialTitle: "Sosial/ZIS (Min 5%)",
    aiPredictionTargetVsActual: (target, actual) => `Target: ${target}%, Aktual: ${actual.toFixed(1)}%`,
    aiPredictionTargetPercentageLabel: (percentage) => `Target ${percentage}%`,
    aiPredictionEstimatedIncomeTitle: "Estimasi Pendapatan Bulanan",
    aiPredictionEstimatedIncomeText: (income) => `AI mengestimasi pendapatan bulanan Anda sekitar ${income} berdasarkan riwayat pengeluaran.`,
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

    categoryMakanan: "Makanan",
    categoryTransport: "Transportasi",
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


    predictionsTitle: "AI Financial Plan & Predictions",
    predictionsDescription: "Get a personalized financial analysis and fund allocation plan based on the 50/15/10/20/5 rule (Needs/Wants/Savings/Investments/Social).",

    aiPredictionCardTitle: "AI Financial Analysis & Plan",
    aiPredictionCardDescription: "Your expenses analyzed against the 50/30/20 rule (Needs/Wants/Savings) with recommendations.", // Old
    aiPredictionCardDescriptionNewRule: "The AI will analyze your spending and create a financial plan based on the rule: Needs (max 50%), Wants (max 15%), Savings (min 10%), Investments (min 20%), and Social/ZIS (min 5%).",
    aiPredictionGenerateButton: "Generate Analysis Now",
    aiPredictionProcessingButton: "Processing...",
    aiPredictionErrorTitle: "Error",
    aiPredictionErrorGeneral: "Failed to generate analysis. Please try again later.",
    aiPredictionErrorNoData: "No expense data available to analyze. Please record some expenses first.",
    aiPredictionPredictedExpensesTitle: "Expense Prediction", // Old
    aiPredictionSavingRecommendationsTitle: "Saving Recommendations", // Old
    aiPredictionHistoryNoteShort: "Note: Your spending history is still short, analysis might be less accurate.\n\n",
    aiPredictionBudgetAnalysisTitle: "Budget Allocation Analysis (50/30/20)", // Old
    aiPredictionNeedsCategory: "Needs (50%)", // Old
    aiPredictionWantsCategory: "Wants (30%)", // Old
    aiPredictionSavingsCategory: "Savings (20%)", // Old
    aiPredictionPercentageActual: (percentage) => `Actual: ${percentage.toFixed(1)}%`, // Old
    aiPredictionPercentageTarget: (percentage) => `Target: ${percentage}%`, // Old
    aiPredictionAllocationGuidance: "Here's an allocation guide based on the 50/30/20 rule from your total spending:", // Old
    aiPredictionNeedsTitle: "Needs (Max 50%)",
    aiPredictionWantsTitle: "Wants (Max 15%)",
    aiPredictionSavingsTitle: "Savings (Min 10%)",
    aiPredictionInvestmentsTitle: "Investments (Min 20%)",
    aiPredictionSocialTitle: "Social/ZIS (Min 5%)",
    aiPredictionTargetVsActual: (target, actual) => `Target: ${target}%, Actual: ${actual.toFixed(1)}%`,
    aiPredictionTargetPercentageLabel: (percentage) => `Target ${percentage}%`,
    aiPredictionEstimatedIncomeTitle: "Estimated Monthly Income",
    aiPredictionEstimatedIncomeText: (income) => `The AI estimates your monthly income to be around ${income} based on your spending history.`,
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

    categoryMakanan: "Food",
    categoryTransport: "Transportation",
    categoryBelanja: "Shopping",
    categoryLainnya: "Others",
  }
};

