
"use client";
import type { Expense, ParsedExpense, Category } from '@/lib/types';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useLanguage } from './LanguageContext'; 
import { useToast } from "@/hooks/use-toast";

interface ExpenseContextType {
  expenses: Expense[];
  addExpense: (parsedExpense: ParsedExpense) => void;
  getSpendingHistoryString: () => string;
  getExpensesByMonth: (year: number, month: number) => Expense[];
  getTotalExpensesByMonth: (year: number, month: number) => number;
  getExpensesSummaryByMonth: (year: number, month: number) => { category: Category; total: number }[];
  isExpensesInitialized: boolean;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export const ExpenseProvider = ({ children }: { children: ReactNode }) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isExpensesInitialized, setIsExpensesInitialized] = useState(false);
  const { t } = useLanguage(); 
  const { toast } = useToast();

  useEffect(() => {
    const savedExpenses = localStorage.getItem('expenses');
    if (savedExpenses) {
      try {
        const parsed = JSON.parse(savedExpenses);
        setExpenses(parsed);
      } catch (error) {
        console.error("Failed to parse expenses from localStorage", error);
        localStorage.removeItem('expenses'); 
      }
    }
    setIsExpensesInitialized(true); 
  }, []); 

  useEffect(() => {
    if (isExpensesInitialized && typeof window !== 'undefined') {
      localStorage.setItem('expenses', JSON.stringify(expenses));
    }
  }, [expenses, isExpensesInitialized]);

  const addExpense = (parsedExpense: ParsedExpense) => {
    const newExpense: Expense = {
      id: uuidv4(),
      description: parsedExpense.description,
      amount: parsedExpense.amount,
      category: parsedExpense.category,
      date: new Date().toISOString().split('T')[0], 
    };
    setExpenses(prevExpenses => [newExpense, ...prevExpenses]);

    // Habit detection logic removed
  };

  const getSpendingHistoryString = (): string => {
    return expenses
      .map(e => {
        return `${e.date}, ${e.category}, "${e.description}", ${e.amount}`;
      })
      .join('\n');
  };

  const getExpensesByMonth = (year: number, month: number): Expense[] => {
    return expenses.filter(expense => {
      const [expYear, expMonth] = expense.date.split('-').map(Number);
      return expYear === year && (expMonth - 1) === month; 
    });
  };
  
  const getTotalExpensesByMonth = (year: number, month: number): number => {
    return getExpensesByMonth(year, month).reduce((sum, expense) => sum + expense.amount, 0);
  };

  const getExpensesSummaryByMonth = (year: number, month: number): { category: Category; total: number }[] => {
    const monthlyExpenses = getExpensesByMonth(year, month);
    const summary: { [key in Category]?: number } = {};

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
        isExpensesInitialized 
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
