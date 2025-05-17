
"use client";

import { useState } from 'react';
import { useExpenses } from '@/contexts/ExpenseContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, AlertCircle, MessageSquare, Lightbulb } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// Import the AI flow (we'll define this properly soon)
// import { analyzeSpendingPatterns, AnalyzeSpendingPatternsOutput, PreviousInteraction } from '@/ai/flows/analyze-spending-flow'; 

// Placeholder types - will be replaced by actual AI flow types
interface AnalyzeSpendingPatternsOutput {
  keyObservations: string[];
  reflectiveQuestions: string[];
  guidanceText: string;
}
interface PreviousInteraction {
  question: string;
  userAnswer: string;
}
// Placeholder AI function
async function analyzeSpendingPatterns(params: {
  spendingHistory: string;
  previousInteractions?: PreviousInteraction[];
  language: 'id' | 'en';
}): Promise<AnalyzeSpendingPatternsOutput> {
  console.log("Calling mock analyzeSpendingPatterns with params:", params);
  // Simulate AI delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Simulate some spending history for mock response
  const hasHistory = params.spendingHistory && params.spendingHistory.length > 0;

  if (!hasHistory && (!params.previousInteractions || params.previousInteractions.length === 0)) {
    return {
      keyObservations: [],
      reflectiveQuestions: [],
      guidanceText: params.language === 'id' ? "Tidak ada riwayat pengeluaran untuk dianalisis. Pertanyaan reflektif akan lebih baik jika ada data." : "No spending history to analyze. Reflective questions work best with data."
    };
  }
  
  const baseObservations = params.language === 'id' 
    ? ["Pengeluaran untuk 'Makanan' cukup signifikan.", "Ada beberapa transaksi 'Belanja' dengan nilai besar."]
    : ["Spending on 'Food' is quite significant.", "There are several high-value 'Shopping' transactions."];

  const baseQuestions = params.language === 'id'
    ? [
        "Dari pengeluaran 'Makanan' terakhir Anda, mana yang benar-benar untuk kebutuhan dasar dan mana yang untuk kesenangan atau sosial?",
        "Apa yang Anda rasakan sebelum dan sesudah melakukan transaksi 'Belanja' tersebut?"
      ]
    : [
        "From your recent 'Food' expenses, which ones were truly for basic needs versus pleasure or social reasons?",
        "What did you feel before and after making those 'Shopping' transactions?"
      ];
  
  const baseGuidance = params.language === 'id'
    ? "Gunakan pertanyaan ini untuk merefleksikan motivasi di balik pengeluaran Anda. Tidak ada jawaban benar atau salah."
    : "Use these questions to reflect on the motivations behind your spending. There are no right or wrong answers.";

  if (params.previousInteractions && params.previousInteractions.length > 0) {
    const lastAnswer = params.previousInteractions[params.previousInteractions.length - 1].userAnswer;
    return {
      keyObservations: params.language === 'id' 
        ? [`Menganalisis jawaban Anda: "${lastAnswer.substring(0,30)}..."`, "Pola pikir Anda mulai terlihat lebih jelas."]
        : [`Analyzing your answer: "${lastAnswer.substring(0,30)}..."`, "Your thought patterns are becoming clearer."],
      reflectiveQuestions: params.language === 'id'
        ? ["Apa satu hal kecil yang bisa Anda ubah minggu ini terkait pengeluaran tersebut?", "Bagaimana perasaan Anda jika berhasil mengubahnya?"]
        : ["What's one small thing you could change this week regarding that spending?", "How would you feel if you successfully changed it?"],
      guidanceText: params.language === 'id'
        ? "Refleksi berkelanjutan membantu membangun kebiasaan finansial yang lebih baik."
        : "Continuous reflection helps build better financial habits."
    };
  }

  return {
    keyObservations: baseObservations,
    reflectiveQuestions: baseQuestions,
    guidanceText: baseGuidance
  };
}


export function SpendingAnalysisClient() {
  const { getSpendingHistoryString, expenses, isExpensesInitialized } = useExpenses();
  const { t, language } = useLanguage();
  
  const [analysisResult, setAnalysisResult] = useState<AnalyzeSpendingPatternsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [conversationHistory, setConversationHistory] = useState<PreviousInteraction[]>([]);
  const [currentAnswers, setCurrentAnswers] = useState<Record<number, string>>({});

  const handleFetchAnalysis = async (isFollowUp = false) => {
    if (!isExpensesInitialized) {
        setError(t.analysisNoSpendingHistory); // Or a more generic "data not ready"
        return;
    }
    
    const spendingHistory = getSpendingHistoryString();
    if (expenses.length === 0 && !isFollowUp) {
      setError(t.analysisNoSpendingHistory);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    const interactionsForAI = isFollowUp 
      ? analysisResult?.reflectiveQuestions.map((q, index) => ({
          question: q,
          userAnswer: currentAnswers[index] || ""
        })) || []
      : [];
    
    try {
      const result = await analyzeSpendingPatterns({
        spendingHistory,
        previousInteractions: interactionsForAI,
        language,
      });
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerChange = (questionIndex: number, answer: string) => {
    setCurrentAnswers(prev => ({ ...prev, [questionIndex]: answer }));
  };
  
  const canSubmitFollowUp = analysisResult && analysisResult.reflectiveQuestions.some((_, index) => currentAnswers[index] && currentAnswers[index].trim() !== "");


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

        {error && (
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
             (!analysisResult.keyObservations || analysisResult.keyObservations.length === 0) && (
                <div className="text-center py-4">
                    <p className="text-muted-foreground">{t.analysisNoSpendingHistory}</p>
                     <Button onClick={() => handleFetchAnalysis(false)} className="mt-4">
                        {t.analysisStartButton}
                    </Button>
                </div>
            )}


          </div>
        )}
      </CardContent>
    </Card>
  );
}
