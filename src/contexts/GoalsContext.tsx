
"use client";

import type { Goal, UserGoalInput } from '@/lib/types';
import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from './LanguageContext';
import { useAuth } from './AuthContext'; // Added useAuth

interface GoalsContextType {
  goals: Goal[];
  addGoal: (goalInput: UserGoalInput) => Promise<void>;
  addFundsToGoal: (goalId: string, amount: number) => Promise<void>;
  deleteGoal: (goalId: string) => Promise<void>;
  updateGoalImage: (goalId: string, imageUrl: string, imagePrompt?: string) => Promise<void>;
  isLoading: boolean; // Combined loading state
}

const GoalsContext = createContext<GoalsContextType | undefined>(undefined);

export const GoalsProvider = ({ children }: { children: ReactNode }) => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(true); 
  const { toast } = useToast();
  const { t } = useLanguage();
  const { currentUser, isLoading: authLoading } = useAuth();

  const getStorageKey = useCallback(() => {
    return currentUser ? `financialGoals_${currentUser.uid}` : 'financialGoals_anonymous';
  }, [currentUser]);

  const loadGoals = useCallback(async () => {
    if (authLoading) return;

    setIsLoading(true);
    const storageKey = getStorageKey();
    const savedGoals = localStorage.getItem(storageKey);
    if (savedGoals) {
      try {
        setGoals(JSON.parse(savedGoals));
      } catch (error) {
        console.error("Failed to parse goals from localStorage for key:", storageKey, error);
        localStorage.removeItem(storageKey);
        setGoals([]);
      }
    } else {
      setGoals([]);
    }
    setIsLoading(false);
  }, [getStorageKey, authLoading]);

  useEffect(() => {
    loadGoals();
  }, [loadGoals]);

  const saveGoals = useCallback((updatedGoals: Goal[]) => {
    if (isAuthLoading || isLoading) return; // Prevent saving if still initializing
    localStorage.setItem(getStorageKey(), JSON.stringify(updatedGoals));
    setGoals(updatedGoals);
  }, [getStorageKey, authLoading, isLoading]);


  const addGoal = async (goalInput: UserGoalInput) => {
    if (!currentUser && !process.env.NEXT_PUBLIC_ALLOW_ANONYMOUS_DATA) {
       toast({ title: t.authRequiredTitle, description: t.authRequiredDescription, variant: "destructive" });
       return;
    }
    if (isLoading) return;

    const newGoal: Goal = {
      ...goalInput,
      id: uuidv4(),
      currentAmount: 0,
      createdAt: new Date().toISOString(),
    };
    const updatedGoals = [...goals, newGoal];
    saveGoals(updatedGoals);
  };

  const addFundsToGoal = async (goalId: string, amount: number) => {
     if (!currentUser && !process.env.NEXT_PUBLIC_ALLOW_ANONYMOUS_DATA) {
       toast({ title: t.authRequiredTitle, description: t.authRequiredDescription, variant: "destructive" });
       return;
    }
    if (isLoading) return;
    const updatedGoals = goals.map(goal =>
      goal.id === goalId ? { ...goal, currentAmount: Math.min(goal.currentAmount + amount, goal.targetAmount) } : goal
    );
    saveGoals(updatedGoals);
  };

  const deleteGoal = async (goalId: string) => {
    if (!currentUser && !process.env.NEXT_PUBLIC_ALLOW_ANONYMOUS_DATA) {
       toast({ title: t.authRequiredTitle, description: t.authRequiredDescription, variant: "destructive" });
       return;
    }
    if (isLoading) return;
    const updatedGoals = goals.filter(goal => goal.id !== goalId);
    saveGoals(updatedGoals);
  };

  const updateGoalImage = async (goalId: string, imageUrl: string, imagePrompt?: string) => {
    if (!currentUser && !process.env.NEXT_PUBLIC_ALLOW_ANONYMOUS_DATA) {
       toast({ title: t.authRequiredTitle, description: t.authRequiredDescription, variant: "destructive" });
       return;
    }
    if (isLoading) return;
    const updatedGoals = goals.map(goal =>
      goal.id === goalId ? { ...goal, imageUrl, imagePrompt } : goal
    );
    saveGoals(updatedGoals);
  };
  
  const isAuthLoading = authLoading; // Alias for clarity

  return (
    <GoalsContext.Provider value={{ goals, addGoal, addFundsToGoal, deleteGoal, updateGoalImage, isLoading: isLoading || isAuthLoading }}>
      {children}
    </GoalsContext.Provider>
  );
};

export const useGoals = (): GoalsContextType => {
  const context = useContext(GoalsContext);
  if (context === undefined) {
    throw new Error('useGoals must be used within a GoalsProvider');
  }
  return context;
};
