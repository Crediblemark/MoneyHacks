
"use client";
import type { Expense, ParsedExpenseForContext, Category } from '@/lib/types';
import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useLanguage } from './LanguageContext'; 
import { useToast } from "@/hooks/use-toast";
import { useAuth } from './AuthContext'; // Added useAuth

interface ExpenseContextType {
  expenses: Expense[];
  addExpense: (parsedExpense: ParsedExpenseForContext) => void;
  getSpendingHistoryString: () => string;
  getExpensesByMonth: (year: number, month: number) => Expense[];
  getTotalExpensesByMonth: (year: number, month: number) => number;
  getExpensesSummaryByMonth: (year: number, month: number) => { category: Category; total: number }[];
  isExpensesInitialized: boolean;
  isLoading: boolean; // To indicate if data is being loaded/cleared due to auth changes
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export const ExpenseProvider = ({ children }: { children: ReactNode }) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isExpensesInitialized, setIsExpensesInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Start true
  const { t, language } = useLanguage(); 
  const { toast } = useToast();
  const { currentUser, isLoading: authLoading } = useAuth();

  const getStorageKey = useCallback(() => {
    return currentUser ? `expenses_${currentUser.uid}` : 'expenses_anonymous'; // Fallback or disable if no user
  }, [currentUser]);

  const loadExpenses = useCallback(async () => {
    if (authLoading) return; // Wait for auth to initialize
    
    setIsLoading(true);
    const storageKey = getStorageKey();
    const savedExpenses = localStorage.getItem(storageKey);
    if (savedExpenses) {
      try {
        const parsed = JSON.parse(savedExpenses);
        setExpenses(parsed);
      } catch (error) {
        console.error("Failed to parse expenses from localStorage for key:", storageKey, error);
        localStorage.removeItem(storageKey); 
        setExpenses([]);
      }
    } else {
      setExpenses([]); // No data for this user/key
    }
    setIsExpensesInitialized(true);
    setIsLoading(false);
  }, [getStorageKey, authLoading]);

  useEffect(() => {
    loadExpenses();
  }, [loadExpenses]); // Reloads when currentUser (from getStorageKey) changes

  useEffect(() => {
    if (isExpensesInitialized && !isLoading && !authLoading) { // Save only when ready and not loading
      localStorage.setItem(getStorageKey(), JSON.stringify(expenses));
    }
  }, [expenses, isExpensesInitialized, getStorageKey, isLoading, authLoading]);

  const addExpense = (parsedExpense: ParsedExpenseForContext) => {
    if (!currentUser && !process.env.NEXT_PUBLIC_ALLOW_ANONYMOUS_DATA) { // Stricter: require login
        toast({
            title: t.authRequiredTitle,
            description: t.authRequiredDescription,
            variant: "destructive"
        });
        return;
    }
    if (isLoading) return; // Prevent adding while loading due to auth change

    const newExpense: Expense = {
      id: uuidv4(),
      description: parsedExpense.description,
      amount: parsedExpense.amount,
      category: parsedExpense.category,
      date: new Date().toISOString().split('T')[0], 
    };
    setExpenses(prevExpenses => [newExpense, ...prevExpenses]);

    // Habit detection logic - simplified without quick add for now
    const MIN_HABIT_OCCURRENCES = 3;
    const HABIT_CHECK_WINDOW = 20;

    const recentExpenses = [newExpense, ...expenses].slice(0, HABIT_CHECK_WINDOW);
    const habitOccurrences = recentExpenses.filter(
      (exp) => exp.description === newExpense.description && exp.category === newExpense.category
    ).length;

    if (habitOccurrences >= MIN_HABIT_OCCURRENCES) {
        // For now, just a console log. Browser notification needs permission handling.
        console.log(`Habit detected: "${newExpense.description}" in category "${newExpense.category}"`);
        // Future: showBrowserNotification(t.habitDetectedToastTitle, t.habitDetectedToastDescription(newExpense.description));
    }
  };

  const getSpendingHistoryString = (): string => {
    if (isLoading) return ""; // Return empty if loading
    return expenses
      .map(e => `${e.date}, ${e.category}, "${e.description}", ${e.amount}`)
      .join('\n');
  };

  const getExpensesByMonth = (year: number, month: number): Expense[] => {
    if (isLoading) return [];
    return expenses.filter(expense => {
      const [expYear, expMonth] = expense.date.split('-').map(Number);
      return expYear === year && (expMonth - 1) === month; 
    });
  };
  
  const getTotalExpensesByMonth = (year: number, month: number): number => {
    if (isLoading) return 0;
    return getExpensesByMonth(year, month).reduce((sum, expense) => sum + expense.amount, 0);
  };

  const getExpensesSummaryByMonth = (year: number, month: number): { category: Category; total: number }[] => {
    if (isLoading) return [];
    const monthlyExpenses = getExpensesByMonth(year, month);
    const summary: { [key: string]: number } = {};

    monthlyExpenses.forEach(expense => {
      summary[expense.category] = (summary[expense.category] || 0) + expense.amount;
    });
    
    return Object.entries(summary).map(([category, total]) => ({
        category: category as Category,
        total: total as number,
      })).sort((a,b) => b.total - a.total);
  };

  return (
    <ExpenseContext.Provider value={{ 
        expenses, 
        addExpense, 
        getSpendingHistoryString, 
        getExpensesByMonth, 
        getTotalExpensesByMonth, 
        getExpensesSummaryByMonth,
        isExpensesInitialized,
        isLoading
      }}>
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpenses = (): ExpenseContextType => {
  const context = useContext(ExpenseContext);
  if (context === undefined) {
    throw new Error('useExpenses must be used within an ExpenseProvider');
  }
  return context;
};
