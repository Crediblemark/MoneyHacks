
export type Language = 'id' | 'en';

type TranslationSet = {
  // AppShell & Common
  appName: string;
  navDashboard: string;
  navMonthlyReports: string;
  navAIPredictions: string;
  navSelfReflectionAnalysis: string; 
  userAvatarAlt: string;
  userNamePlaceholder: string;
  userEmailPlaceholder: string;
  languageSwitcherID: string;
  languageSwitcherEN: string;
  logoutButtonLabel: string;
  errorDialogTitle: string; // Generic error title
  aiNameSettingLabel: string; // New for AI name input

  // DashboardPage (src/app/page.tsx)
  dashboardTitle: string;
  dashboardDescription: string;

  // FinancialManagerAdvice (src/components/dashboard/FinancialManagerAdvice.tsx) - New
  financialManagerCardTitle: (name: string) => string; // Changed to function
  financialManagerCardDescription: string;
  financialManagerLoading: string;
  financialManagerPredictionLabel: string;
  financialManagerAnalysisLabel: string;
  financialManagerAnalysisDefault: string;
  financialManagerNoData: string;
  financialManagerError: string;
  financialManagerViewPredictionsButton: string;
  financialManagerViewAnalysisButton: string;

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
    navSelfReflectionAnalysis: "Analisis & Refleksi",
    userAvatarAlt: "Avatar Pengguna",
    userNamePlaceholder: "Nama Pengguna",
    userEmailPlaceholder: "pengguna@contoh.com",
    languageSwitcherID: "ID",
    languageSwitcherEN: "EN",
    logoutButtonLabel: "Keluar",
    errorDialogTitle: "Terjadi Kesalahan",
    aiNameSettingLabel: "Panggil AI Sebagai:",

    dashboardTitle: "Dasbor Keuangan",
    dashboardDescription: "Selamat datang! Catat pemasukan dan pengeluaran Anda, serta lihat ringkasan terbaru dan saran dari AI Anda di sini.",

    financialManagerCardTitle: (name: string) => `Saran dari ${name} Anda`,
    financialManagerCardDescription: "Dapatkan panduan singkat untuk mengelola keuangan Anda lebih baik.",
    financialManagerLoading: "Memuat saran...",
    financialManagerPredictionLabel: "Dari Rencana Keuangan Anda:",
    financialManagerAnalysisLabel: "Untuk Direnungkan:",
    financialManagerAnalysisDefault: "Belum ada pertanyaan refleksi spesifik saat ini. Coba analisis pengeluaran Anda!",
    financialManagerNoData: "Belum cukup data untuk memberikan saran. Silakan catat beberapa transaksi.",
    financialManagerError: "Gagal memuat saran. Silakan coba lagi nanti.",
    financialManagerViewPredictionsButton: "Lihat Prediksi Detail",
    financialManagerViewAnalysisButton: "Mulai Refleksi Diri",

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
    navSelfReflectionAnalysis: "Analysis & Reflection", 
    userAvatarAlt: "User Avatar",
    userNamePlaceholder: "User Name",
    userEmailPlaceholder: "user@example.com",
    languageSwitcherID: "ID",
    languageSwitcherEN: "EN",
    logoutButtonLabel: "Logout",
    errorDialogTitle: "An Error Occurred",
    aiNameSettingLabel: "Call AI As:",

    dashboardTitle: "Financial Dashboard",
    dashboardDescription: "Welcome! Record your income and expenses, and see your latest summary and advice from your AI here.",

    financialManagerCardTitle: (name: string) => `Advice from Your ${name}`,
    financialManagerCardDescription: "Get quick guidance to manage your finances better.",
    financialManagerLoading: "Loading advice...",
    financialManagerPredictionLabel: "From Your Financial Plan:",
    financialManagerAnalysisLabel: "Food for Thought:",
    financialManagerAnalysisDefault: "No specific reflective questions at the moment. Try analyzing your spending!",
    financialManagerNoData: "Not enough data to provide advice. Please record some transactions.",
    financialManagerError: "Failed to load advice. Please try again later.",
    financialManagerViewPredictionsButton: "View Detailed Predictions",
    financialManagerViewAnalysisButton: "Start Self-Reflection",

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

    categoryMakanan: "Food",
    categoryTransport: "Transportation",
    categoryBelanja: "Shopping",
    categoryLainnya: "Others",
  }
};
