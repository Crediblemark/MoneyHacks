
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
import { Loader2, AlertCircle, Lightbulb, MessageSquare, ArrowRight } from 'lucide-react'; // Added ArrowRight
import { Skeleton } from '@/components/ui/skeleton';

export function FinancialManagerAdvice() {
  const { expenses, getSpendingHistoryString, isExpensesInitialized } = useExpenses();
  const { incomes, getTotalIncomeByMonth, isIncomeInitialized } = useIncome();
  const { t, language } = useLanguage();

  const [predictionData, setPredictionData] = useState<PredictExpensesOutput | null>(null);
  const [analysisData, setAnalysisData] = useState<AnalyzeSpendingOutput | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Start loading true
  const [error, setError] = useState<string | null>(null);
  
  const [clientDateInfo, setClientDateInfo] = useState<{year: number, month: number} | null>(null);

  useEffect(() => {
    const now = new Date();
    setClientDateInfo({ year: now.getFullYear(), month: now.getMonth() });
  }, []);


  useEffect(() => {
    if (!isExpensesInitialized || !isIncomeInitialized || !clientDateInfo) {
      // Data context not ready or client date not set, keep loading or show placeholder
      // If they remain false after a timeout, it might indicate an issue or no data.
      // For now, we rely on them becoming true to trigger fetches.
      return;
    }

    const fetchAdvice = async () => {
      setIsLoading(true);
      setError(null);

      const spendingHistory = getSpendingHistoryString();
      const currentMonthIncome = getTotalIncomeByMonth(clientDateInfo.year, clientDateInfo.month);
      const incomeForAI = currentMonthIncome > 0 ? currentMonthIncome : undefined;

      // Only fetch if there's some data to analyze or predict upon
      if (expenses.length === 0 && (incomeForAI === undefined || incomeForAI === 0)) {
        setError(t.financialManagerNoData);
        setIsLoading(false);
        return;
      }
      
      let historyNote = "";
      if (expenses.length > 0 && expenses.length < 5) { 
          historyNote = t.aiPredictionHistoryNoteShort; // Using existing translation
      }

      try {
        const [predictionResult, analysisResult] = await Promise.all([
          predictExpenses({ 
            spendingHistory: historyNote + spendingHistory, 
            monthlyIncome: incomeForAI, 
            language 
          }),
          analyzeSpendingPatterns({ 
            spendingHistory: spendingHistory, // Analysis might be useful even with short history for reflection
            language 
          })
        ]);
        setPredictionData(predictionResult);
        setAnalysisData(analysisResult);
      } catch (e) {
        console.error("Financial Manager Advice Error:", e);
        setError(t.financialManagerError);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdvice();
  }, [
    isExpensesInitialized, 
    isIncomeInitialized, 
    clientDateInfo, 
    language, 
    getSpendingHistoryString, 
    getTotalIncomeByMonth, 
    t,
    expenses.length // Re-run if expenses count changes, might indicate new data
  ]);

  if (!isExpensesInitialized || !isIncomeInitialized || !clientDateInfo) {
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
        <CardTitle className="text-xl">{t.financialManagerCardTitle}</CardTitle>
        <CardDescription>{t.financialManagerCardDescription}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading && (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-2">{t.financialManagerLoading}</p>
          </div>
        )}
        {error && !isLoading && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{t.errorDialogTitle}</AlertTitle> {/* Reusing generic error title */}
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {!isLoading && !error && predictionData && analysisData && (
          <div className="space-y-4">
            <div className="p-4 rounded-md bg-accent/20 border border-accent">
              <h4 className="font-semibold flex items-center gap-2 text-accent-foreground">
                <Lightbulb size={18} />
                {t.financialManagerPredictionLabel}
              </h4>
              <p className="text-sm text-muted-foreground mt-1">
                {predictionData.overallFeedback.substring(0, 150)}{predictionData.overallFeedback.length > 150 ? "..." : ""}
              </p>
            </div>

            <div className="p-4 rounded-md bg-secondary/20 border border-secondary">
              <h4 className="font-semibold flex items-center gap-2 text-secondary-foreground">
                <MessageSquare size={18} />
                {t.financialManagerAnalysisLabel}
              </h4>
              <p className="text-sm text-muted-foreground mt-1">
                {analysisData.reflectiveQuestions && analysisData.reflectiveQuestions.length > 0 
                    ? analysisData.reflectiveQuestions[0] 
                    : (analysisData.keyObservations && analysisData.keyObservations.length > 0 
                        ? analysisData.keyObservations[0]
                        : t.financialManagerAnalysisDefault)}
              </p>
            </div>
          </div>
        )}
         {!isLoading && !error && (!predictionData || !analysisData) && ! (expenses.length === 0 && (getTotalIncomeByMonth(clientDateInfo?.year ?? 0, clientDateInfo?.month ?? 0) === 0 || getTotalIncomeByMonth(clientDateInfo?.year ?? 0, clientDateInfo?.month ?? 0) === undefined )) && (
            <p className="text-muted-foreground text-center py-4">{t.financialManagerNoData}</p>
        )}
      </CardContent>
      {!isLoading && !error && (
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
