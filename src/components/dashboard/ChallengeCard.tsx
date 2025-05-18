
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
import { useAuth } from '@/contexts/AuthContext'; // Added

const CHALLENGE_STORAGE_KEY_BASE = 'activeSpendingChallenge';
const CHALLENGE_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export function ChallengeCard() {
  const { currentUser, isLoading: authLoading } = useAuth(); // Added
  const { t, language, aiName } = useLanguage();
  const { getSpendingHistoryString, expenses, isExpensesInitialized } = useExpenses();
  const { toast } = useToast();

  const [activeChallenge, setActiveChallenge] = useState<Challenge | null>(null);
  const [isLoadingChallenge, setIsLoadingChallenge] = useState(false); // Renamed to avoid conflict
  const [timeLeft, setTimeLeft] = useState<string>('');

  const getChallengeStorageKey = useCallback(() => {
    return currentUser ? `${CHALLENGE_STORAGE_KEY_BASE}_${currentUser.uid}` : null;
  }, [currentUser]);

  const loadChallengeFromStorage = useCallback(() => {
    if (authLoading || !currentUser) {
      setActiveChallenge(null); // Clear challenge if not logged in or auth is loading
      return;
    }
    const storageKey = getChallengeStorageKey();
    if (!storageKey) return;

    const storedChallenge = localStorage.getItem(storageKey);
    if (storedChallenge) {
      try {
        const parsedChallenge: Challenge = JSON.parse(storedChallenge);
        if (parsedChallenge.expiresAt > Date.now()) {
          setActiveChallenge(parsedChallenge);
        } else {
          localStorage.removeItem(storageKey); 
          setActiveChallenge(null);
        }
      } catch (error) {
        console.error("Failed to parse challenge from storage:", error);
        localStorage.removeItem(storageKey);
        setActiveChallenge(null);
      }
    } else {
      setActiveChallenge(null);
    }
  }, [getChallengeStorageKey, authLoading, currentUser]);

  useEffect(() => {
    loadChallengeFromStorage();
  }, [loadChallengeFromStorage, currentUser]); // Depend on currentUser to reload if user logs in/out

  useEffect(() => {
    if (activeChallenge && currentUser) { // Only run timer if there's a challenge and user
      const updateTimer = () => {
        const distanceLocale = language === 'id' ? indonesiaLocale : englishLocale;
        const distance = formatDistanceToNowStrict(activeChallenge.expiresAt, { addSuffix: false, locale: distanceLocale });
        setTimeLeft(t.challengeExpiresInLabel(distance));
      };
      updateTimer();
      const intervalId = setInterval(updateTimer, 60000); 
      return () => clearInterval(intervalId);
    }
  }, [activeChallenge, language, t, currentUser]);


  const handleGetNewChallenge = async () => {
    if (!currentUser || !isExpensesInitialized) {
      toast({ title: t.errorDialogTitle, description: !currentUser ? t.authRequiredDescription : t.financialManagerNoData, variant: 'destructive' });
      return;
    }
    setIsLoadingChallenge(true);
    toast({ title: t.challengeGeneratingToast });
    const storageKey = getChallengeStorageKey();
    if (!storageKey) {
        setIsLoadingChallenge(false);
        return;
    }

    try {
      const spendingHistory = getSpendingHistoryString(); 
      const result = await generateSpendingChallenge({ spendingHistory, language });
      
      const now = Date.now();
      const newChallenge: Challenge = {
        id: uuidv4(),
        title: result.challengeTitle,
        description: result.challengeDescription,
        createdAt: now,
        expiresAt: now + CHALLENGE_DURATION_MS,
      };
      localStorage.setItem(storageKey, JSON.stringify(newChallenge));
      setActiveChallenge(newChallenge);
      toast({ 
        title: t.challengeGeneratedToastTitle, 
        description: t.challengeGeneratedToastDescription
      });
    } catch (error) {
      console.error("Error generating challenge:", error);
      toast({ title: t.errorDialogTitle, description: t.challengeErrorGenerating, variant: 'destructive' });
    } finally {
      setIsLoadingChallenge(false);
    }
  };

  const clearChallenge = (isSuccess: boolean) => {
    if (!activeChallenge || !currentUser) return;
    const storageKey = getChallengeStorageKey();
    if (!storageKey) return;

    localStorage.removeItem(storageKey);
    setActiveChallenge(null);
    setTimeLeft('');
    if (isSuccess) {
        toast({ title: t.challengeCompletedToastTitle, description: t.challengeClearedToastDescription});
    } else {
        toast({ title: t.challengeFailedToastTitle, description: t.challengeClearedToastDescription, variant: "default" });
    }
  };

  if (authLoading) {
    return (
      <Card className="shadow-lg rounded-xl border-accent/50">
        <CardHeader>
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2 mt-1" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-center py-6">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </CardContent>
        <CardFooter>
          <Skeleton className="h-10 w-full" />
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg rounded-xl border-accent/50">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
            <Sparkles className="text-accent" />
            {activeChallenge && currentUser ? t.challengeStartedCardTitle : t.challengeCardTitle(aiName)}
        </CardTitle>
        <CardDescription>{t.challengeCardDescription}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoadingChallenge && (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-2">{t.challengeGeneratingToast}</p>
          </div>
        )}
        {!isLoadingChallenge && activeChallenge && currentUser && (
          <div className="p-4 rounded-md bg-accent/10 border border-accent">
            <h3 className="font-semibold text-lg text-accent-foreground">{activeChallenge.title}</h3>
            <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap">{activeChallenge.description}</p>
            <p className="text-xs text-muted-foreground mt-3 font-medium">{timeLeft}</p>
          </div>
        )}
        {!isLoadingChallenge && (!activeChallenge || !currentUser) && (
          <div className="text-center py-4">
            <p className="text-muted-foreground">{!currentUser ? t.challengeLoginPrompt : t.challengeNoActiveChallenge}</p>
            {!currentUser && <p className="text-sm text-muted-foreground mb-4">{t.authLoginButton}</p>}
            {currentUser && <p className="text-sm text-muted-foreground mb-4">{t.challengeAskForNew}</p>}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row justify-center gap-3 pt-4">
        {activeChallenge && !isLoadingChallenge && currentUser && (
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
        {(!activeChallenge || !currentUser) && !isLoadingChallenge && (
             <Button onClick={handleGetNewChallenge} disabled={isLoadingChallenge || !isExpensesInitialized || !currentUser} className="w-full sm:w-auto">
                {isLoadingChallenge ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Lightbulb size={18} className="mr-2" />}
                {t.challengeGetNewButton}
            </Button>
        )}
      </CardFooter>
    </Card>
  );
}
