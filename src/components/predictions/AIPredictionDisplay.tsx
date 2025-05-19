
"use client";
import { useState, useEffect } from 'react'; 
import { useExpenses } from '@/contexts/ExpenseContext';
import { useIncome } from '@/contexts/IncomeContext'; 
import { useLanguage } from '@/contexts/LanguageContext';
import { useGoals } from '@/contexts/GoalsContext'; // Added
import { predictExpenses, PredictExpensesOutput } from '@/ai/flows/predict-expenses';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Wand2, ShoppingBasket, UtensilsCrossed, PiggyBank, TrendingUp, HeartHandshake, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { cn, formatCurrency } from '@/lib/utils'; 
import { useAuth } from '@/contexts/AuthContext';
import type { Goal } from '@/lib/types';

interface BudgetCategoryCardProps {
  title: string;
  icon: React.ElementType;
  data: PredictExpensesOutput['financialPlan']['needs']; 
  language: 'id' | 'en';
}

// Helper function to format goals into a string (can be moved to utils if used elsewhere)
function formatGoalsToString(goals: Goal[], t: any, lang: 'id' | 'en'): string {
  if (!goals || goals.length === 0) {
    return lang === 'id' ? "Tidak ada target keuangan aktif." : "No active financial goals.";
  }
  return goals.map(goal => 
    `${goal.name} (${formatCurrency(goal.currentAmount, lang)} / ${formatCurrency(goal.targetAmount, lang)})`
  ).join(', ');
}

function BudgetCategoryCard({ title, icon: Icon, data, language }: BudgetCategoryCardProps) {
  const { t } = useLanguage(); // t is already available here

  const actualPercentageDisplay = data.actualPercentage;
  const targetPercentageDisplay = data.targetPercentage;

  let indicatorClass = "bg-primary"; 

  // Use translated titles for comparison
  if (title === t.aiPredictionNeedsTitle || title === t.aiPredictionWantsTitle) { 
    if (actualPercentageDisplay > targetPercentageDisplay) {
      indicatorClass = "bg-destructive"; 
    } else if (actualPercentageDisplay > targetPercentageDisplay * 0.9) {
      indicatorClass = "bg-yellow-500"; 
    }
  } else { 
    if (actualPercentageDisplay < targetPercentageDisplay * 0.9) {
      indicatorClass = "bg-destructive"; 
    } else if (actualPercentageDisplay < targetPercentageDisplay) {
      indicatorClass = "bg-yellow-500"; 
    } else if (actualPercentageDisplay >= targetPercentageDisplay * 1.1) { 
      indicatorClass = "bg-green-500"; 
    }
  }

  return (
    <Card className="bg-background/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Icon className="text-primary" size={24} />
          {title} 
        </CardTitle>
        <CardDescription>
          {t.aiPredictionTargetVsActual(targetPercentageDisplay, actualPercentageDisplay)} | {data.recommendedAmount}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="relative h-6">
          <Progress
            value={actualPercentageDisplay}
            className={cn(
              "h-full [&>div]:transition-all [&>div]:duration-500",
              `[&>div]:${indicatorClass}` 
            )}
            aria-label={`${title} progress: ${actualPercentageDisplay.toFixed(0)}% of ${targetPercentageDisplay}% target`}
          />
          <div
            className="absolute top-0 left-0 h-full border-r-2 border-dashed border-foreground/50"
            style={{ width: `${targetPercentageDisplay}%` }}
            title={t.aiPredictionTargetPercentageLabel(targetPercentageDisplay)}
          ></div>
           <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs font-semibold text-primary-foreground mix-blend-difference">
            {actualPercentageDisplay.toFixed(0)}%
          </span>
        </div>
        <p className="text-sm text-muted-foreground">{data.feedback}</p>
      </CardContent>
    </Card>
  );
}


export function AIPredictionDisplay() {
  const { getSpendingHistoryString, expenses, isExpensesInitialized } = useExpenses();
  const { getTotalIncomeByMonth, isIncomeInitialized: isIncomeCtxInitialized } = useIncome(); 
  const { goals, isLoading: goalsLoading } = useGoals(); // Added goals
  const { t, language } = useLanguage();
  const { currentUser, isLoading: authLoading } = useAuth();

  const [prediction, setPrediction] = useState<PredictExpensesOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false); 
  const [error, setError] = useState<string | null>(null);
  const [currentMonthIncome, setCurrentMonthIncome] = useState<number | null>(null);

  const [clientDateInfo, setClientDateInfo] = useState<{year: number, month: number} | null>(null);

  useEffect(() => {
    const now = new Date();
    setClientDateInfo({ year: now.getFullYear(), month: now.getMonth() });
  }, []);

  useEffect(() => {
    if (clientDateInfo && isIncomeCtxInitialized) {
      const income = getTotalIncomeByMonth(clientDateInfo.year, clientDateInfo.month);
      setCurrentMonthIncome(income);
    }
  }, [clientDateInfo, getTotalIncomeByMonth, isIncomeCtxInitialized]);


  const handleGeneratePrediction = async () => {
    if (!clientDateInfo || !currentUser ) return; 
    setIsLoading(true);
    setError(null);
    setPrediction(null);

    const spendingHistory = getSpendingHistoryString();
    const incomeForAI = currentMonthIncome !== null && currentMonthIncome > 0 ? currentMonthIncome : undefined;
    const goalsString = formatGoalsToString(goals, t, language);

     if (!spendingHistory && expenses.length === 0 && (incomeForAI === undefined || incomeForAI === 0)) {
      setError(t.aiPredictionErrorNoData);
      setIsLoading(false);
      return;
    }
    
    let historyNote = "";
    if (expenses.length > 0 && expenses.length < 5) { 
        historyNote = t.aiPredictionHistoryNoteShort;
    }

    try {
      const result = await predictExpenses({ 
        spendingHistory: historyNote + spendingHistory,
        monthlyIncome: incomeForAI, 
        language: language,
        financialGoals: goalsString, // Pass goals
      });
      setPrediction(result);
    } catch (e) {
      console.error("AI Prediction Error:", e);
      setError(t.aiPredictionErrorGeneral);
    } finally {
      setIsLoading(false);
    }
  };
  
  const categoryCardTitles = {
    needs: t.aiPredictionNeedsTitle,
    wants: t.aiPredictionWantsTitle,
    savings: t.aiPredictionSavingsTitle,
    investments: t.aiPredictionInvestmentsTitle,
    social: t.aiPredictionSocialTitle,
  };

  const categoryCardIcons = {
    needs: UtensilsCrossed,
    wants: ShoppingBasket,
    savings: PiggyBank,
    investments: TrendingUp,
    social: HeartHandshake,
  };

  const isPageDisabled = authLoading || !currentUser;
  const isButtonDisabled = isLoading || !isExpensesInitialized || !isIncomeCtxInitialized || !clientDateInfo || isPageDisabled || goalsLoading;

  if (authLoading && !currentUser) {
    return (
        <Card className="shadow-lg rounded-xl">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Wand2 className="text-primary" />{t.aiPredictionCardTitle}</CardTitle>
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
                <CardTitle className="flex items-center gap-2"><Wand2 className="text-primary" />{t.aiPredictionCardTitle}</CardTitle>
            </CardHeader>
            <CardContent className="text-center py-10">
                <p className="text-muted-foreground">{t.authRequiredDescription}</p>
            </CardContent>
        </Card>
    )
  }

  return (
    <Card className="shadow-lg rounded-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wand2 className="text-primary" />
          {t.aiPredictionCardTitle}
        </CardTitle>
        <CardDescription>
          {t.aiPredictionCardDescriptionNewRule}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <Button onClick={handleGeneratePrediction} disabled={isButtonDisabled} size="lg">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t.aiPredictionProcessingButton}
              </>
            ) : (
              t.aiPredictionGenerateButton
            )}
          </Button>
           { (goalsLoading || !isExpensesInitialized || !isIncomeCtxInitialized) && !isLoading &&
            <p className="text-xs text-muted-foreground mt-1">
              {goalsLoading ? "Memuat data target..." : (!isExpensesInitialized || !isIncomeCtxInitialized ? "Memuat data transaksi..." : "")}
            </p>
          }
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertTitle>{t.aiPredictionErrorTitle}</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {prediction && (
          <div className="space-y-6">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>{t.aiPredictionEstimatedIncomeTitle}</AlertTitle>
              <AlertDescription>
                {currentMonthIncome !== null && currentMonthIncome > 0
                  ? t.aiPredictionProvidedIncomeText(prediction.financialPlan.estimatedMonthlyIncome) 
                  : t.aiPredictionEstimatedIncomeText(prediction.financialPlan.estimatedMonthlyIncome)}
              </AlertDescription>
            </Alert>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(prediction.financialPlan).map(([key, value]) => {
                if (key === 'estimatedMonthlyIncome') return null; 
                const categoryKey = key as keyof typeof categoryCardTitles;
                if (!categoryCardTitles[categoryKey] || !categoryCardIcons[categoryKey]) return null;

                return (
                  <BudgetCategoryCard
                    key={categoryKey}
                    title={categoryCardTitles[categoryKey]} 
                    icon={categoryCardIcons[categoryKey]}
                    data={value as PredictExpensesOutput['financialPlan']['needs']}
                    language={language} 
                  />
                );
              })}
            </div>

            <Card className="bg-background/50 border-primary border-2">
              <CardHeader>
                <CardTitle>{t.aiPredictionOverallFeedbackTitle}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap text-sm">{prediction.overallFeedback}</p>
              </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

