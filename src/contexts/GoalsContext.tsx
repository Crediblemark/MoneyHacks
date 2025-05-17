
"use client";

import type { Goal, UserGoalInput } from '@/lib/types';
import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from './LanguageContext'; // For potential future toast translations

interface GoalsContextType {
  goals: Goal[];
  addGoal: (goalInput: UserGoalInput) => Promise<void>;
  addFundsToGoal: (goalId: string, amount: number) => Promise<void>;
  deleteGoal: (goalId: string) => Promise<void>;
  updateGoalImage: (goalId: string, imageUrl: string, imagePrompt?: string) => Promise<void>;
  isLoading: boolean;
}

const GoalsContext = createContext<GoalsContextType | undefined>(undefined);

const GOALS_STORAGE_KEY = 'financialGoals';

export const GoalsProvider = ({ children }: { children: ReactNode }) => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Start true until loaded
  const { toast } = useToast();
  // const { t } = useLanguage(); // For future translated toasts

  const loadGoals = useCallback(() => {
    setIsLoading(true);
    const savedGoals = localStorage.getItem(GOALS_STORAGE_KEY);
    if (savedGoals) {
      try {
        setGoals(JSON.parse(savedGoals));
      } catch (error) {
        console.error("Failed to parse goals from localStorage", error);
        localStorage.removeItem(GOALS_STORAGE_KEY);
        // toast({ title: "Error", description: "Failed to load goals.", variant: "destructive" });
      }
    }
    setIsLoading(false);
  }, [/* toast */]);

  useEffect(() => {
    loadGoals();
  }, [loadGoals]);

  const saveGoals = useCallback((updatedGoals: Goal[]) => {
    localStorage.setItem(GOALS_STORAGE_KEY, JSON.stringify(updatedGoals));
    setGoals(updatedGoals);
  }, []);

  const addGoal = async (goalInput: UserGoalInput) => {
    const newGoal: Goal = {
      ...goalInput,
      id: uuidv4(),
      currentAmount: 0,
      createdAt: new Date().toISOString(),
    };
    saveGoals([...goals, newGoal]);
  };

  const addFundsToGoal = async (goalId: string, amount: number) => {
    const updatedGoals = goals.map(goal =>
      goal.id === goalId ? { ...goal, currentAmount: Math.min(goal.currentAmount + amount, goal.targetAmount) } : goal
    );
    saveGoals(updatedGoals);
  };

  const deleteGoal = async (goalId: string) => {
    const updatedGoals = goals.filter(goal => goal.id !== goalId);
    saveGoals(updatedGoals);
  };

  const updateGoalImage = async (goalId: string, imageUrl: string, imagePrompt?: string) => {
    const updatedGoals = goals.map(goal =>
      goal.id === goalId ? { ...goal, imageUrl, imagePrompt } : goal
    );
    saveGoals(updatedGoals);
  };

  return (
    <GoalsContext.Provider value={{ goals, addGoal, addFundsToGoal, deleteGoal, updateGoalImage, isLoading }}>
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
