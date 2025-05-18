
"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useExpenses } from '@/contexts/ExpenseContext';
import { useIncome } from '@/contexts/IncomeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { predictExpenses, type PredictExpensesOutput } from '@/ai/flows/predict-expenses';
import { analyzeSpendingPatterns, type AnalyzeSpendingOutput } from '@/ai/flows/analyze-spending-flow';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, AlertCircle, Lightbulb, MessageSquare, ArrowRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext'; // Added

export function FinancialManagerAdvice() {
  const { currentUser, isLoading: authLoading } = useAuth(); // Added
  const { expenses, getSpendingHistoryString, isExpensesInitialized } = useExpenses();
  const { incomes, getTotalIncomeByMonth, isIncomeInitialized } = useIncome();
  const { t, language, aiName } = useLanguage();

  const [predictionData, setPredictionData] = useState<PredictExpensesOutput | null>(null);
  const [analysisData, setAnalysisData] = useState<AnalyzeSpendingOutput | null>(null);
  const [isLoadingAdvice, setIsLoadingAdvice] = useState(false); // Changed to avoid conflict with authLoading
  const [error, setError] = useState<string | null>(null);
  
  const [clientDateInfo, setClientDateInfo] = useState<{year: number, month: number} | null>(null);

  useEffect(() => {
    const now = new Date();
    setClientDateInfo({ year: now.getFullYear(), month: now.getMonth() });
  }, []);


  useEffect(() => {
    if (!currentUser || !isExpensesInitialized || !isIncomeInitialized || !clientDateInfo || authLoading) {
      if (currentUser && !authLoading) { // Only set loading if user exists and auth is done
        setIsLoadingAdvice(true); // We expect to fetch if user is logged in
      }
      return;
    }

    const fetchAdvice = async () => {
      setIsLoadingAdvice(true);
      setError(null);

      const spendingHistory = getSpendingHistoryString();
      const currentMonthIncome = getTotalIncomeByMonth(clientDateInfo.year, clientDateInfo.month);
      const incomeForAI = currentMonthIncome > 0 ? currentMonthIncome : undefined;

      // Avoid calling AI if no user data at all, even if they were logged in.
      // This check becomes less critical if the outer currentUser check is solid.
      if (expenses.length === 0 && (incomeForAI === undefined || incomeForAI === 0)) {
        setError(t.financialManagerNoData);
        setIsLoadingAdvice(false);
        return;
      }
      
      let historyNote = "";
      if (expenses.length > 0 && expenses.length < 5) { 
          historyNote = t.aiPredictionHistoryNoteShort; 
      }

      try {
        const [predictionResult, analysisResult] = await Promise.all([
          predictExpenses({ 
            spendingHistory: historyNote + spendingHistory, 
            monthlyIncome: incomeForAI, 
            language 
          }),
          analyzeSpendingPatterns({ 
            spendingHistory: spendingHistory,
            previousInteractions: [], 
            language 
          })
        ]);
        setPredictionData(predictionResult);
        setAnalysisData(analysisResult);
      } catch (e) {
        console.error("Financial Manager Advice Error:", e);
        setError(t.financialManagerError);
      } finally {
        setIsLoadingAdvice(false);
      }
    };

    fetchAdvice();
  }, [
    currentUser, // Added
    authLoading, // Added
    isExpensesInitialized, 
    isIncomeInitialized, 
    clientDateInfo, 
    language, 
    getSpendingHistoryString, 
    getTotalIncomeByMonth, 
    t,
    expenses.length 
  ]);

  if (authLoading || (!currentUser && !authLoading)) { // Show skeleton or login prompt
    return (
      <Card className="shadow-lg rounded-xl border-primary/50">
        <CardHeader>
          <CardTitle className="text-xl">{t.financialManagerCardTitle(aiName)}</CardTitle> 
          <CardDescription>{t.financialManagerCardDescription}</CardDescription>
        </CardHeader>
        <CardContent>
          {authLoading ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="ml-2">{t.financialManagerLoading}</p>
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-4">{t.financialManagerLoginPrompt}</p>
          )}
        </CardContent>
      </Card>
    );
  }
  
  // This section is only reached if currentUser exists and authLoading is false
  if (!isExpensesInitialized || !isIncomeInitialized || !clientDateInfo) {
    // This state is when user is logged in but expense/income contexts are still initializing
    return (
      <Card className="shadow-lg rounded-xl">
        <CardHeader>
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2 mt-1" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
        </CardFooter>
      </Card>
    )
  }


  return (
    <Card className="shadow-lg rounded-xl border-primary/50">
      <CardHeader>
        <CardTitle className="text-xl">{t.financialManagerCardTitle(aiName)}</CardTitle> 
        <CardDescription>{t.financialManagerCardDescription}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoadingAdvice && ( // Changed to isLoadingAdvice
          <div className="flex items-center justify-center py-6">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-2">{t.financialManagerLoading}</p>
          </div>
        )}
        {error && !isLoadingAdvice && ( // Changed to isLoadingAdvice
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{t.errorDialogTitle}</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {!isLoadingAdvice && !error && predictionData && analysisData && ( // Changed to isLoadingAdvice
          <div className="space-y-4">
            <div className="p-4 rounded-md bg-accent/20 border border-accent">
              <h4 className="font-semibold flex items-center gap-2 text-accent-foreground">
                <Lightbulb size={18} />
                {t.financialManagerPredictionLabel}
              </h4>
              <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap">
                {predictionData.overallFeedback}
              </p>
            </div>

            <div className="p-4 rounded-md bg-secondary/20 border border-secondary">
              <h4 className="font-semibold flex items-center gap-2 text-secondary-foreground">
                <MessageSquare size={18} />
                {t.financialManagerAnalysisLabel}
              </h4>
              <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap">
                {analysisData.reflectiveQuestions && analysisData.reflectiveQuestions.length > 0 
                    ? analysisData.reflectiveQuestions.join('\n\n') 
                    : (analysisData.keyObservations && analysisData.keyObservations.length > 0 
                        ? analysisData.keyObservations.join('\n\n') 
                        : t.financialManagerAnalysisDefault)}
              </p>
            </div>
          </div>
        )}
         {!isLoadingAdvice && !error && (!predictionData || !analysisData) && ! (expenses.length === 0 && (getTotalIncomeByMonth(clientDateInfo?.year ?? 0, clientDateInfo?.month ?? 0) === 0 || getTotalIncomeByMonth(clientDateInfo?.year ?? 0, clientDateInfo?.month ?? 0) === undefined )) && ( // Changed to isLoadingAdvice
            <p className="text-muted-foreground text-center py-4">{t.financialManagerNoData}</p>
        )}
      </CardContent>
      {!isLoadingAdvice && !error && currentUser && ( // Changed to isLoadingAdvice and added currentUser check for footer
        <CardFooter className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
          <Button variant="outline" asChild>
            <Link href="/predictions">
              {t.financialManagerViewPredictionsButton}
              <ArrowRight size={16} className="ml-2" />
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/analysis">
              {t.financialManagerViewAnalysisButton}
              <ArrowRight size={16} className="ml-2" />
            </Link>
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
