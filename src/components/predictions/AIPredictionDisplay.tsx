
"use client";
import { useState } from 'react';
import { useExpenses } from '@/contexts/ExpenseContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { predictExpenses, PredictExpensesOutput } from '@/ai/flows/predict-expenses';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Wand2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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

  return (
    <Card className="shadow-lg rounded-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wand2 className="text-primary" />
          {t.aiPredictionCardTitle}
        </CardTitle>
        <CardDescription>
          {t.aiPredictionCardDescription}
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
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-background/50">
              <CardHeader>
                <CardTitle>{t.aiPredictionPredictedExpensesTitle}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap text-sm">{prediction.predictedExpenses}</p>
              </CardContent>
            </Card>
            <Card className="bg-background/50">
              <CardHeader>
                <CardTitle>{t.aiPredictionSavingRecommendationsTitle}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap text-sm">{prediction.savingRecommendations}</p>
              </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
