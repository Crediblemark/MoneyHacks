
"use client";

import { useState } from 'react';
import { useExpenses } from '@/contexts/ExpenseContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, AlertCircle, MessageSquare, Lightbulb, Brain } from 'lucide-react'; // Added Brain
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  analyzeSpendingPatterns,
  type AnalyzeSpendingOutput,
  type PreviousInteraction,
  // type AnalyzeSpendingInput // Optional import if you want to type params explicitly
} from '@/ai/flows/analyze-spending-flow';

export function SpendingAnalysisClient() {
  const { getSpendingHistoryString, expenses, isExpensesInitialized } = useExpenses();
  const { t, language } = useLanguage();
  
  const [analysisResult, setAnalysisResult] = useState<AnalyzeSpendingOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [conversationHistory, setConversationHistory] = useState<PreviousInteraction[]>([]);
  const [currentAnswers, setCurrentAnswers] = useState<Record<number, string>>({});

  const handleFetchAnalysis = async (isFollowUp = false) => {
    if (!isExpensesInitialized) {
        setError(t.analysisNoSpendingHistory); 
        return;
    }
    
    const spendingHistory = getSpendingHistoryString();
    // This client-side check prevents calling AI if no expenses and it's not a follow-up.
    // The AI flow itself can handle empty spendingHistory string.
    if (expenses.length === 0 && !isFollowUp) {
      setAnalysisResult({ // Provide a gentle message if no history
        keyObservations: [],
        reflectiveQuestions: [],
        guidanceText: t.analysisNoSpendingHistory
      });
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    const interactionsForAI: PreviousInteraction[] = isFollowUp
      ? analysisResult?.reflectiveQuestions.map((q, index) => ({
          question: q,
          userAnswer: currentAnswers[index] || ""
        })) || []
      : [];
    
    try {
      // Ensure the parameters match AnalyzeSpendingInput
      const params = {
        spendingHistory: spendingHistory, // Can be empty string if expenses.length > 0 but getSpendingHistoryString returns ""
        previousInteractions: interactionsForAI,
        language: language,
      };
      const result = await analyzeSpendingPatterns(params);
      setAnalysisResult(result);
      if (isFollowUp) {
        setConversationHistory(prev => [...prev, ...interactionsForAI]);
      } else {
        setConversationHistory([]); // Reset for new analysis
      }
      setCurrentAnswers({}); // Reset answers for new questions
    } catch (e) {
      console.error("Spending Analysis Error:", e);
      setError(t.analysisErrorGeneral);
      // Optionally clear previous results on error
      // setAnalysisResult(null); 
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerChange = (questionIndex: number, answer: string) => {
    setCurrentAnswers(prev => ({ ...prev, [questionIndex]: answer }));
  };
  
  const canSubmitFollowUp = analysisResult && 
                            analysisResult.reflectiveQuestions && 
                            analysisResult.reflectiveQuestions.length > 0 && 
                            analysisResult.reflectiveQuestions.some((_, index) => currentAnswers[index] && currentAnswers[index].trim() !== "");


  return (
    <Card className="shadow-lg rounded-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="text-primary" />
          {t.analysisPageTitle}
        </CardTitle>
        <CardDescription>{t.analysisPageDescription}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!analysisResult && !isLoading && (
          <div className="text-center">
            <Button onClick={() => handleFetchAnalysis(false)} size="lg" disabled={!isExpensesInitialized}>
              {t.analysisStartButton}
            </Button>
             {!isExpensesInitialized && <p className="text-sm text-muted-foreground mt-2">Loading expense data...</p>}
          </div>
        )}

        {isLoading && (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="mr-2 h-8 w-8 animate-spin text-primary" />
            <p className="text-lg">{t.analysisProcessingButton}</p>
          </div>
        )}

        {error && !isLoading && ( // Show error only if not loading
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{t.analysisErrorTitle}</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {analysisResult && !isLoading && (
          <div className="space-y-6">
            {analysisResult.keyObservations && analysisResult.keyObservations.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg gap-2">
                    <Lightbulb size={20} className="text-yellow-500" />
                    {t.analysisKeyObservationsTitle}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    {analysisResult.keyObservations.map((obs, index) => (
                      <li key={`obs-${index}`}>{obs}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {analysisResult.guidanceText && (
                 <Alert variant="default" className="border-primary">
                    <MessageSquare className="h-4 w-4 text-primary" />
                    <AlertTitle>{t.analysisGuidanceTextTitle}</AlertTitle>
                    <AlertDescription>{analysisResult.guidanceText}</AlertDescription>
                </Alert>
            )}

            {analysisResult.reflectiveQuestions && analysisResult.reflectiveQuestions.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg gap-2">
                    <MessageSquare size={20} className="text-green-500" />
                    {t.analysisReflectiveQuestionsTitle}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {analysisResult.reflectiveQuestions.map((question, index) => (
                    <div key={`q-${index}`} className="space-y-2">
                      <p className="font-medium">{index + 1}. {question}</p>
                      <Textarea
                        placeholder={t.analysisYourAnswerPlaceholder}
                        value={currentAnswers[index] || ""}
                        onChange={(e) => handleAnswerChange(index, e.target.value)}
                        rows={3}
                      />
                    </div>
                  ))}
                   <Button onClick={() => handleFetchAnalysis(true)} disabled={!canSubmitFollowUp}>
                    {t.analysisSubmitAnswersButton}
                  </Button>
                </CardContent>
              </Card>
            )}
            
            {(!analysisResult.reflectiveQuestions || analysisResult.reflectiveQuestions.length === 0) &&
             (!analysisResult.keyObservations || analysisResult.keyObservations.length === 0) &&
             (analysisResult.guidanceText === t.analysisNoSpendingHistory) && ( // Check if it's the specific no-history message
                <div className="text-center py-4">
                    {/* Message is already in guidanceText if no history */}
                     <Button onClick={() => handleFetchAnalysis(false)} className="mt-4" disabled={!isExpensesInitialized}>
                        {t.analysisStartButton}
                    </Button>
                    {!isExpensesInitialized && <p className="text-sm text-muted-foreground mt-2">Loading expense data...</p>}
                </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

    