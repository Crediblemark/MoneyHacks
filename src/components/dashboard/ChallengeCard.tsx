
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useExpenses } from '@/contexts/ExpenseContext';
import { generateSpendingChallenge, type GenerateSpendingChallengeOutput } from '@/ai/flows/generate-spending-challenge-flow';
import type { Challenge } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Lightbulb, CheckCircle, XCircle, Sparkles } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { formatDistanceToNowStrict } from 'date-fns';
import { id as indonesiaLocale, enUS as englishLocale } from 'date-fns/locale';


const CHALLENGE_STORAGE_KEY = 'activeSpendingChallenge';
const CHALLENGE_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export function ChallengeCard() {
  const { t, language, aiName } = useLanguage();
  const { getSpendingHistoryString, expenses, isExpensesInitialized } = useExpenses();
  const { toast } = useToast();

  const [activeChallenge, setActiveChallenge] = useState<Challenge | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState<string>('');

  const loadChallengeFromStorage = useCallback(() => {
    const storedChallenge = localStorage.getItem(CHALLENGE_STORAGE_KEY);
    if (storedChallenge) {
      try {
        const parsedChallenge: Challenge = JSON.parse(storedChallenge);
        if (parsedChallenge.expiresAt > Date.now()) {
          setActiveChallenge(parsedChallenge);
        } else {
          localStorage.removeItem(CHALLENGE_STORAGE_KEY); // Challenge expired
          setActiveChallenge(null);
        }
      } catch (error) {
        console.error("Failed to parse challenge from storage:", error);
        localStorage.removeItem(CHALLENGE_STORAGE_KEY);
        setActiveChallenge(null);
      }
    }
  }, []);

  useEffect(() => {
    loadChallengeFromStorage();
  }, [loadChallengeFromStorage]);

  useEffect(() => {
    if (activeChallenge) {
      const updateTimer = () => {
        const distanceLocale = language === 'id' ? indonesiaLocale : englishLocale;
        const distance = formatDistanceToNowStrict(activeChallenge.expiresAt, { addSuffix: false, locale: distanceLocale });
        setTimeLeft(t.challengeExpiresInLabel(distance));
      };
      updateTimer();
      const intervalId = setInterval(updateTimer, 60000); // Update every minute
      return () => clearInterval(intervalId);
    }
  }, [activeChallenge, language, t]);


  const handleGetNewChallenge = async () => {
    if (!isExpensesInitialized) {
      toast({ title: t.errorDialogTitle, description: t.financialManagerNoData, variant: 'destructive' });
      return;
    }
    setIsLoading(true);
    toast({ title: t.challengeGeneratingToast });
    try {
      const spendingHistory = getSpendingHistoryString(); // Get recent 30 days or similar
      const result = await generateSpendingChallenge({ spendingHistory, language });
      
      const now = Date.now();
      const newChallenge: Challenge = {
        id: uuidv4(),
        title: result.challengeTitle,
        description: result.challengeDescription,
        createdAt: now,
        expiresAt: now + CHALLENGE_DURATION_MS,
      };
      localStorage.setItem(CHALLENGE_STORAGE_KEY, JSON.stringify(newChallenge));
      setActiveChallenge(newChallenge);
      toast({ 
        title: t.challengeGeneratedToastTitle, 
        description: t.challengeGeneratedToastDescription
      });
    } catch (error) {
      console.error("Error generating challenge:", error);
      toast({ title: t.errorDialogTitle, description: t.challengeErrorGenerating, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const clearChallenge = (isSuccess: boolean) => {
    if (!activeChallenge) return;

    localStorage.removeItem(CHALLENGE_STORAGE_KEY);
    setActiveChallenge(null);
    setTimeLeft('');
    if (isSuccess) {
        toast({ title: t.challengeCompletedToastTitle, description: t.challengeClearedToastDescription});
    } else {
        toast({ title: t.challengeFailedToastTitle, description: t.challengeClearedToastDescription, variant: "default" });
    }
  };


  return (
    <Card className="shadow-lg rounded-xl border-accent/50">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
            <Sparkles className="text-accent" />
            {activeChallenge ? t.challengeStartedCardTitle : t.challengeCardTitle(aiName)}
        </CardTitle>
        <CardDescription>{t.challengeCardDescription}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading && (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-2">{t.challengeGeneratingToast}</p>
          </div>
        )}
        {!isLoading && activeChallenge && (
          <div className="p-4 rounded-md bg-accent/10 border border-accent">
            <h3 className="font-semibold text-lg text-accent-foreground">{activeChallenge.title}</h3>
            <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap">{activeChallenge.description}</p>
            <p className="text-xs text-muted-foreground mt-3 font-medium">{timeLeft}</p>
          </div>
        )}
        {!isLoading && !activeChallenge && (
          <div className="text-center py-4">
            <p className="text-muted-foreground">{t.challengeNoActiveChallenge}</p>
            <p className="text-sm text-muted-foreground mb-4">{t.challengeAskForNew}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row justify-center gap-3 pt-4">
        {activeChallenge && !isLoading && (
          <>
            <Button onClick={() => clearChallenge(true)} variant="default" className="w-full sm:w-auto">
              <CheckCircle size={18} className="mr-2" />
              {t.challengeCompleteButton}
            </Button>
            <Button onClick={() => clearChallenge(false)} variant="outline" className="w-full sm:w-auto">
              <XCircle size={18} className="mr-2" />
              {t.challengeFailedButton}
            </Button>
          </>
        )}
        {!activeChallenge && !isLoading && (
             <Button onClick={handleGetNewChallenge} disabled={isLoading || !isExpensesInitialized} className="w-full sm:w-auto">
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Lightbulb size={18} className="mr-2" />}
                {t.challengeGetNewButton}
            </Button>
        )}
      </CardFooter>
    </Card>
  );
}
