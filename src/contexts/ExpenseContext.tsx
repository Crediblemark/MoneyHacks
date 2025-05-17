
"use client";
import type { Expense, ParsedExpense, Category } from '@/lib/types';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid'; // Add uuid for generating unique IDs

interface ExpenseContextType {
  expenses: Expense[];
  addExpense: (parsedExpense: ParsedExpense) => void;
  getSpendingHistoryString: () => string;
  getExpensesByMonth: (year: number, month: number) => Expense[];
  getTotalExpensesByMonth: (year: number, month: number) => number;
  getExpensesSummaryByMonth: (year: number, month: number) => { category: Category; total: number }[];
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export const ExpenseProvider = ({ children }: { children: ReactNode }) => {
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    if (typeof window !== 'undefined') {
      const savedExpenses = localStorage.getItem('expenses');
      return savedExpenses ? JSON.parse(savedExpenses) : [];
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  const addExpense = (parsedExpense: ParsedExpense) => {
    const newExpense: Expense = {
      ...parsedExpense,
      id: uuidv4(),
      date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
    };
    setExpenses(prevExpenses => [newExpense, ...prevExpenses]);
  };

  const getSpendingHistoryString = (): string => {
    return expenses
      .map(e => `${e.description}, ${e.category}, ${e.amount}, ${e.date}`)
      .join('\n');
  };

  const getExpensesByMonth = (year: number, month: number): Expense[] => {
    return expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate.getFullYear() === year && expenseDate.getMonth() === month;
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
    <ExpenseContext.Provider value={{ expenses, addExpense, getSpendingHistoryString, getExpensesByMonth, getTotalExpensesByMonth, getExpensesSummaryByMonth }}>
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
