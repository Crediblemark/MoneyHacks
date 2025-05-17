
"use client";
import type { Income, ParsedIncome } from '@/lib/types';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface IncomeContextType {
  incomes: Income[];
  addIncome: (parsedIncome: ParsedIncome) => void;
  getTotalIncomeByMonth: (year: number, month: number) => number;
  getIncomesByMonth: (year: number, month: number) => Income[];
  isIncomeInitialized: boolean;
}

const IncomeContext = createContext<IncomeContextType | undefined>(undefined);

export const IncomeProvider = ({ children }: { children: ReactNode }) => {
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [isIncomeInitialized, setIsIncomeInitialized] = useState(false);

  useEffect(() => {
    const savedIncomes = localStorage.getItem('incomes');
    if (savedIncomes) {
      try {
        setIncomes(JSON.parse(savedIncomes));
      } catch (error) {
        console.error("Failed to parse incomes from localStorage", error);
        localStorage.removeItem('incomes'); 
      }
    }
    setIsIncomeInitialized(true); 
  }, []); 

  useEffect(() => {
    if (isIncomeInitialized && typeof window !== 'undefined') {
      localStorage.setItem('incomes', JSON.stringify(incomes));
    }
  }, [incomes, isIncomeInitialized]);

  const addIncome = (parsedIncome: ParsedIncome) => {
    const newIncome: Income = {
      ...parsedIncome,
      id: uuidv4(),
      date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
    };
    setIncomes(prevIncomes => [newIncome, ...prevIncomes]);
  };

  const getIncomesByMonth = (year: number, month: number): Income[] => {
    return incomes.filter(income => {
      const [incYear, incMonth] = income.date.split('-').map(Number);
      return incYear === year && (incMonth - 1) === month; 
    });
  };
  
  const getTotalIncomeByMonth = (year: number, month: number): number => {
    return getIncomesByMonth(year, month).reduce((sum, income) => sum + income.amount, 0);
  };

  return (
    <IncomeContext.Provider value={{ 
        incomes, 
        addIncome, 
        getTotalIncomeByMonth,
        getIncomesByMonth,
        isIncomeInitialized 
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
