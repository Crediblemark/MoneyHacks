
"use client";

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, AlertCircle, FileText, ListChecks, Sparkles, ShieldCheck, ThumbsUp, ThumbsDown } from 'lucide-react'; // Removed TrendingUp
import { useLanguage } from '@/contexts/LanguageContext';
import { useExpenses } from '@/contexts/ExpenseContext';
import { useIncome } from '@/contexts/IncomeContext';
import { useGoals } from '@/contexts/GoalsContext'; // Added
import { getMonthName, formatCurrency } from '@/lib/utils';
import { checkFinancialHealth, type CheckFinancialHealthOutput } from '@/ai/flows/check-financial-health-flow';
import { useAuth } from '@/contexts/AuthContext';
import type { Goal } from '@/lib/types';

// Helper function to format goals into a string
function formatGoalsToString(goals: Goal[], t: any, lang: 'id' | 'en'): string {
  if (!goals || goals.length === 0) {
    return lang === 'id' ? "Tidak ada target keuangan aktif." : "No active financial goals.";
  }
  return goals.map(goal => 
    `${goal.name} (${formatCurrency(goal.currentAmount, lang)} / ${formatCurrency(goal.targetAmount, lang)})`
  ).join(', ');
}

export function HealthCheckClient() {
  const { t, language } = useLanguage();
  const { getExpensesByMonth, isExpensesInitialized } = useExpenses();
  const { getTotalIncomeByMonth, isIncomeInitialized } = useIncome();
  const { goals, isLoading: goalsLoading } = useGoals(); // Added
  const { currentUser, isLoading: authLoading } = useAuth();

  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [isLoading, setIsLoading] = useState(false); 
  const [error, setError] = useState<string | null>(null);
  const [healthReport, setHealthReport] = useState<CheckFinancialHealthOutput | null>(null);

  const availableYears = useMemo(() => {
    const currentYr = new Date().getFullYear();
    return Array.from({ length: 5 }, (_, i) => currentYr - i);
  }, []);

  const availableMonths = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => i);
  }, []);

  const handlePerformCheck = async () => {
    if (!currentUser) return;
    if (!isExpensesInitialized || !isIncomeInitialized || goalsLoading) { // Added goalsLoading check
      setError(t.financialManagerNoData); // Re-use existing translation or add a specific one
      return;
    }
    setIsLoading(true);
    setError(null);
    setHealthReport(null);

    const expensesForMonth = getExpensesByMonth(selectedYear, selectedMonth);
    const incomeForMonth = getTotalIncomeByMonth(selectedYear, selectedMonth);
    const goalsString = formatGoalsToString(goals, t, language);

    const spendingHistoryString = expensesForMonth
      .map(e => `${e.date}, ${e.category}, "${e.description}", ${e.amount}`)
      .join('\n');

    if (expensesForMonth.length === 0 && incomeForMonth === 0) {
      setError(t.healthCheckNoDataForMonth);
      setIsLoading(false);
      return;
    }

    try {
      const result = await checkFinancialHealth({
        spendingHistoryForMonth: spendingHistoryString,
        incomeForMonth: incomeForMonth,
        language: language,
        selectedMonth: selectedMonth + 1, 
        selectedYear: selectedYear,
        financialGoals: goalsString, // Pass goals
      });
      setHealthReport(result);
    } catch (e) {
      console.error("Health Check Error:", e);
      setError(t.healthCheckError);
    } finally {
      setIsLoading(false);
    }
  };

  const formattedMonthYear = useMemo(() => {
    return `${getMonthName(selectedMonth, language)} ${selectedYear}`;
  }, [selectedMonth, selectedYear, language]);

  const isPageDisabled = authLoading || !currentUser;
  const isDataLoading = !isExpensesInitialized || !isIncomeInitialized || goalsLoading;


  if (authLoading && !currentUser) {
     return (
        <Card className="shadow-lg rounded-xl">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><ShieldCheck className="text-primary" />{t.healthCheckTitle}</CardTitle>
                <CardDescription>{t.authLoadingConfiguration}</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center items-center py-10">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </CardContent>
        </Card>
    )
  }
  
  if (!currentUser && !authLoading) {
    return (
         <Card className="shadow-lg rounded-xl">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><ShieldCheck className="text-primary" />{t.healthCheckTitle}</CardTitle>
            </CardHeader>
            <CardContent className="text-center py-10">
                <p className="text-muted-foreground">{t.authRequiredDescription}</p>
            </CardContent>
        </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="shadow-lg rounded-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="text-primary" />
            {t.healthCheckTitle}
          </CardTitle>
          <CardDescription>{t.healthCheckSelectMonthYearLabel}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
            <div>
              <Label htmlFor="month-select">{t.healthCheckMonthLabel}</Label>
              <Select
                value={selectedMonth.toString()}
                onValueChange={(value) => setSelectedMonth(parseInt(value))}
                disabled={isPageDisabled}
              >
                <SelectTrigger id="month-select">
                  <SelectValue placeholder={t.healthCheckMonthLabel} />
                </SelectTrigger>
                <SelectContent>
                  {availableMonths.map(month => (
                    <SelectItem key={month} value={month.toString()}>
                      {getMonthName(month, language)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="year-select">{t.healthCheckYearLabel}</Label>
              <Select
                value={selectedYear.toString()}
                onValueChange={(value) => setSelectedYear(parseInt(value))}
                disabled={isPageDisabled}
              >
                <SelectTrigger id="year-select">
                  <SelectValue placeholder={t.healthCheckYearLabel} />
                </SelectTrigger>
                <SelectContent>
                  {availableYears.map(year => (
                    <SelectItem key={year} value={year.toString()}>
                      {year.toString()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handlePerformCheck} disabled={isLoading || isDataLoading || isPageDisabled} className="w-full sm:w-auto">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t.healthCheckPerformingCheck}
                </>
              ) : (
                t.healthCheckPerformCheckButton
              )}
            </Button>
          </div>
           {isDataLoading && !isLoading && <p className="text-xs text-muted-foreground mt-1 text-center sm:text-right">
              {goalsLoading ? "Memuat data target..." : "Memuat data transaksi..."}
            </p>}
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{t.errorDialogTitle}</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {healthReport && !isLoading && (
        <Card className="shadow-lg rounded-xl border-primary/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <FileText className="text-primary" />
              {t.healthCheckReportCardTitle(formattedMonthYear)}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground uppercase tracking-wider">{t.healthCheckOverallGradeLabel}</p>
              <p className="text-5xl font-bold text-primary my-2">{healthReport.overallGrade}</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg text-green-700 dark:text-green-400">
                    <ThumbsUp /> {t.healthCheckPositiveHighlightsLabel}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {healthReport.positiveHighlights.length > 0 ? (
                    <ul className="list-disc pl-5 space-y-1 text-sm text-green-600 dark:text-green-300">
                      {healthReport.positiveHighlights.map((item, index) => <li key={`pos-${index}`}>{item}</li>)}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">{language === 'id' ? 'Tidak ada sorotan positif khusus bulan ini.' : 'No specific positive highlights this month.'}</p>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg text-red-700 dark:text-red-400">
                    <ThumbsDown /> {t.healthCheckAreasForImprovementLabel}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {healthReport.areasForImprovement.length > 0 ? (
                  <ul className="list-disc pl-5 space-y-1 text-sm text-red-600 dark:text-red-300">
                    {healthReport.areasForImprovement.map((item, index) => <li key={`imp-${index}`}>{item}</li>)}
                  </ul>
                  ) : (
                     <p className="text-sm text-muted-foreground italic">{language === 'id' ? 'Tidak ada area perbaikan yang signifikan bulan ini. Pertahankan!' : 'No significant areas for improvement this month. Keep it up!'}</p>
                  )}
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <ListChecks /> {t.healthCheckActionableAdviceLabel}
                </CardTitle>
              </CardHeader>
              <CardContent>
                 {healthReport.actionableAdviceNextMonth.length > 0 ? (
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  {healthReport.actionableAdviceNextMonth.map((item, index) => <li key={`adv-${index}`}>{item}</li>)}
                </ul>
                 ) : (
                    <p className="text-sm text-muted-foreground italic">{language === 'id' ? 'Tidak ada saran aksi spesifik untuk bulan depan. Lanjutkan yang sudah baik!' : 'No specific actionable advice for next month. Continue the good work!'}</p>
                 )}
              </CardContent>
            </Card>
            
            <Alert variant="default" className="border-accent">
              <Sparkles className="h-4 w-4 text-accent" />
              <AlertTitle>{t.healthCheckSummaryMessageLabel}</AlertTitle>
              <AlertDescription className="whitespace-pre-wrap">{healthReport.summaryMessage}</AlertDescription>
            </Alert>

          </CardContent>
        </Card>
      )}
    </div>
  );
}

