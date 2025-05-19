
"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useExpenses } from '@/contexts/ExpenseContext';
import { useIncome } from '@/contexts/IncomeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useGoals } from '@/contexts/GoalsContext'; // Added
import { predictExpenses, type PredictExpensesOutput } from '@/ai/flows/predict-expenses';
import { analyzeSpendingPatterns, type AnalyzeSpendingOutput } from '@/ai/flows/analyze-spending-flow';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, AlertCircle, Lightbulb, MessageSquare, ArrowRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext'; 
import { formatCurrency } from '@/lib/utils';
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


export function FinancialManagerAdvice() {
  const { currentUser, isLoading: authLoading } = useAuth(); 
  const { expenses, getSpendingHistoryString, isExpensesInitialized } = useExpenses();
  const { incomes, getTotalIncomeByMonth, isIncomeInitialized } = useIncome();
  const { goals, isLoading: goalsLoading } = useGoals(); // Added goals
  const { t, language, aiName } = useLanguage();

  const [predictionData, setPredictionData] = useState<PredictExpensesOutput | null>(null);
  const [analysisData, setAnalysisData] = useState<AnalyzeSpendingOutput | null>(null);
  const [isLoadingAdvice, setIsLoadingAdvice] = useState(false); 
  const [error, setError] = useState<string | null>(null);
  
  const [clientDateInfo, setClientDateInfo] = useState<{year: number, month: number} | null>(null);

  useEffect(() => {
    const now = new Date();
    setClientDateInfo({ year: now.getFullYear(), month: now.getMonth() });
  }, []);


  useEffect(() => {
    if (!currentUser || !isExpensesInitialized || !isIncomeInitialized || !clientDateInfo || authLoading || goalsLoading) {
      if (currentUser && !authLoading && !goalsLoading) { 
        setIsLoadingAdvice(true); 
      }
      return;
    }

    const fetchAdvice = async () => {
      setIsLoadingAdvice(true);
      setError(null);

      const spendingHistory = getSpendingHistoryString();
      const currentMonthIncome = getTotalIncomeByMonth(clientDateInfo.year, clientDateInfo.month);
      const incomeForAI = currentMonthIncome > 0 ? currentMonthIncome : undefined;
      const goalsString = formatGoalsToString(goals, t, language);

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
            language,
            financialGoals: goalsString, // Pass goals
          }),
          analyzeSpendingPatterns({ 
            spendingHistory: spendingHistory,
            previousInteractions: [], 
            language,
            financialGoals: goalsString, // Pass goals
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
    currentUser, 
    authLoading, 
    isExpensesInitialized, 
    isIncomeInitialized, 
    clientDateInfo, 
    language, 
    getSpendingHistoryString, 
    getTotalIncomeByMonth, 
    t,
    expenses.length,
    goals, // Added goals dependency
    goalsLoading // Added goalsLoading dependency
  ]);

  if (authLoading || (!currentUser && !authLoading)) { 
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
  
  if (!isExpensesInitialized || !isIncomeInitialized || !clientDateInfo || goalsLoading) {
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
        {isLoadingAdvice && ( 
          <div className="flex items-center justify-center py-6">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-2">{t.financialManagerLoading}</p>
          </div>
        )}
        {error && !isLoadingAdvice && ( 
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{t.errorDialogTitle}</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {!isLoadingAdvice && !error && predictionData && analysisData && ( 
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
         {!isLoadingAdvice && !error && (!predictionData || !analysisData) && ! (expenses.length === 0 && (getTotalIncomeByMonth(clientDateInfo?.year ?? 0, clientDateInfo?.month ?? 0) === 0 || getTotalIncomeByMonth(clientDateInfo?.year ?? 0, clientDateInfo?.month ?? 0) === undefined )) && ( 
            <p className="text-muted-foreground text-center py-4">{t.financialManagerNoData}</p>
        )}
      </CardContent>
      {!isLoadingAdvice && !error && currentUser && ( 
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

