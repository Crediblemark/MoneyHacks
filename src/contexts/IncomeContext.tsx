
"use client";
import type { Income, ParsedIncome } from '@/lib/types';
import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from './AuthContext'; // Added useAuth
import { useLanguage } from './LanguageContext'; // For toast messages
import { useToast } from "@/hooks/use-toast";

interface IncomeContextType {
  incomes: Income[];
  addIncome: (parsedIncome: ParsedIncome) => void;
  getTotalIncomeByMonth: (year: number, month: number) => number;
  getIncomesByMonth: (year: number, month: number) => Income[];
  isIncomeInitialized: boolean;
  isLoading: boolean;
}

const IncomeContext = createContext<IncomeContextType | undefined>(undefined);

export const IncomeProvider = ({ children }: { children: ReactNode }) => {
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [isIncomeInitialized, setIsIncomeInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser, isLoading: authLoading } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();

  const getStorageKey = useCallback(() => {
    return currentUser ? `incomes_${currentUser.uid}` : 'incomes_anonymous';
  }, [currentUser]);

  const loadIncomes = useCallback(async () => {
    if (authLoading) return;

    setIsLoading(true);
    const storageKey = getStorageKey();
    const savedIncomes = localStorage.getItem(storageKey);
    if (savedIncomes) {
      try {
        setIncomes(JSON.parse(savedIncomes));
      } catch (error) {
        console.error("Failed to parse incomes from localStorage for key:", storageKey, error);
        localStorage.removeItem(storageKey); 
        setIncomes([]);
      }
    } else {
      setIncomes([]);
    }
    setIsIncomeInitialized(true);
    setIsLoading(false);
  }, [getStorageKey, authLoading]);

  useEffect(() => {
    loadIncomes();
  }, [loadIncomes]);

  useEffect(() => {
    if (isIncomeInitialized && !isLoading && !authLoading) {
      localStorage.setItem(getStorageKey(), JSON.stringify(incomes));
    }
  }, [incomes, isIncomeInitialized, getStorageKey, isLoading, authLoading]);

  const addIncome = (parsedIncome: ParsedIncome) => {
    if (!currentUser && !process.env.NEXT_PUBLIC_ALLOW_ANONYMOUS_DATA) {
         toast({
            title: t.authRequiredTitle,
            description: t.authRequiredDescription,
            variant: "destructive"
        });
        return;
    }
     if (isLoading) return;

    const newIncome: Income = {
      ...parsedIncome,
      id: uuidv4(),
      date: new Date().toISOString().split('T')[0], 
    };
    setIncomes(prevIncomes => [newIncome, ...prevIncomes]);
  };

  const getIncomesByMonth = (year: number, month: number): Income[] => {
    if (isLoading) return [];
    return incomes.filter(income => {
      const [incYear, incMonth] = income.date.split('-').map(Number);
      return incYear === year && (incMonth - 1) === month; 
    });
  };
  
  const getTotalIncomeByMonth = (year: number, month: number): number => {
    if (isLoading) return 0;
    return getIncomesByMonth(year, month).reduce((sum, income) => sum + income.amount, 0);
  };

  return (
    <IncomeContext.Provider value={{ 
        incomes, 
        addIncome, 
        getTotalIncomeByMonth,
        getIncomesByMonth,
        isIncomeInitialized,
        isLoading
      }}>
      {children}
    </IncomeContext.Provider>
  );
};

export const useIncome = (): IncomeContextType => {
  const context = useContext(IncomeContext);
  if (context === undefined) {
    throw new Error('useIncome must be used within an IncomeProvider');
  }
  return context;
};
