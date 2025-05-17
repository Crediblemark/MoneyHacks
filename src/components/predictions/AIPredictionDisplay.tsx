
"use client";
import { useState } from 'react';
import { useExpenses } from '@/contexts/ExpenseContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { predictExpenses, PredictExpensesOutput } from '@/ai/flows/predict-expenses';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Wand2, ShoppingBasket, UtensilsCrossed, PiggyBank, TrendingUp, HeartHandshake, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface BudgetCategoryCardProps {
  title: string;
  icon: React.ElementType;
  data: PredictExpensesOutput['financialPlan']['needs']; // Use one of the types as a template
  language: 'id' | 'en';
}

function BudgetCategoryCard({ title, icon: Icon, data, language }: BudgetCategoryCardProps) {
  const actualPercentageDisplay = data.actualPercentage; // Already a number
  const targetPercentageDisplay = data.targetPercentage; // Already a number

  let progressColor = "bg-primary"; // Default/Good
  if (title === t.aiPredictionNeedsTitle(language) || title === t.aiPredictionWantsTitle(language)) { // Assuming t is available or passed
      if (actualPercentageDisplay > targetPercentageDisplay) progressColor = "bg-destructive";
      else if (actualPercentageDisplay > targetPercentageDisplay * 0.9) progressColor = "bg-yellow-500"; // Warning if close to limit
  } else { // Savings, Investments, Social
      if (actualPercentageDisplay < targetPercentageDisplay) progressColor = "bg-destructive";
      else if (actualPercentageDisplay < targetPercentageDisplay * 1.1 && actualPercentageDisplay >= targetPercentageDisplay ) progressColor = "bg-primary"; // Good if at or slightly above target
      else if (actualPercentageDisplay >= targetPercentageDisplay *1.1) progressColor = "bg-green-500"; // Excellent if well above target for savings/investments
  }


  const t = useLanguage().t; // Access translations here

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
          <Progress value={actualPercentageDisplay} className="h-full [&>div]:transition-all [&>div]:duration-500" />
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
  const { getSpendingHistoryString, expenses } = useExpenses();
  const { t, language } = useLanguage();
  const [prediction, setPrediction] = useState<PredictExpensesOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGeneratePrediction = async () => {
    setIsLoading(true);
    setError(null);
    setPrediction(null);

    const spendingHistory = getSpendingHistoryString();
     if (!spendingHistory && expenses.length === 0) {
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
        language: language 
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
          <Button onClick={handleGeneratePrediction} disabled={isLoading} size="lg">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t.aiPredictionProcessingButton}
              </>
            ) : (
              t.aiPredictionGenerateButton
            )}
          </Button>
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
                {t.aiPredictionEstimatedIncomeText(prediction.financialPlan.estimatedMonthlyIncome)}
              </AlertDescription>
            </Alert>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(prediction.financialPlan).map(([key, value]) => {
                if (key === 'estimatedMonthlyIncome') return null; // Already displayed
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

