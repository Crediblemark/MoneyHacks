
"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { useExpenses } from '@/contexts/ExpenseContext';
import { useLanguage } from '@/contexts/LanguageContext';
import type { Expense } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import { CATEGORY_ICONS, getTranslatedCategory } from '@/lib/constants';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

export function RecentExpensesTable() {
  const { expenses, isExpensesInitialized } = useExpenses();
  const { t, language } = useLanguage();
  
  const [clientDateInfo, setClientDateInfo] = useState<{year: number, month: number} | null>(null);

  useEffect(() => {
    const now = new Date();
    setClientDateInfo({ year: now.getFullYear(), month: now.getMonth() });
  }, []);

  const recentExpenses = useMemo(() => {
    if (!isExpensesInitialized || !clientDateInfo) return [];
    return expenses.filter(exp => {
      const expDate = new Date(exp.date);
      return expDate.getFullYear() === clientDateInfo.year && expDate.getMonth() === clientDateInfo.month;
    }).slice(0, 10); 
  }, [expenses, isExpensesInitialized, clientDateInfo]);

  const totalExpensesThisMonth = useMemo(() => {
    if (!isExpensesInitialized || !clientDateInfo) return 0;
    return expenses
      .filter(exp => {
        const expDate = new Date(exp.date);
        return expDate.getFullYear() === clientDateInfo.year && expDate.getMonth() === clientDateInfo.month;
      })
      .reduce((sum, exp) => sum + exp.amount, 0);
  }, [expenses, isExpensesInitialized, clientDateInfo]);


  if (!isExpensesInitialized || !clientDateInfo) {
    return (
      <Card className="mt-6 shadow-lg rounded-xl">
        <CardHeader>
          <CardTitle>{t.recentExpensesCardTitle}</CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-[250px]" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 py-8">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[80%]" />
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="mt-6 shadow-lg rounded-xl">
      <CardHeader>
        <CardTitle>{t.recentExpensesCardTitle}</CardTitle>
        <CardDescription>
          {t.recentExpensesTableTotalThisMonth} <span className="font-semibold text-primary">{formatCurrency(totalExpensesThisMonth, language)}</span>.
          {' '}
          {t.recentExpensesTableDisplayingLast(recentExpenses.length)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {expenses.length === 0 || recentExpenses.length === 0 ? ( 
           <p className="text-muted-foreground text-center py-8">{t.recentExpensesTableNoExpensesThisMonth}</p>
        ) : (
          <ScrollArea className="h-[300px] w-full">
            <Table>
              <TableHeader className="sticky top-0 bg-card z-10">
                <TableRow>
                  <TableHead className="w-[100px]">{t.recentExpensesTableDateHeader}</TableHead>
                  <TableHead>{t.recentExpensesTableDescriptionHeader}</TableHead>
                  <TableHead>{t.recentExpensesTableCategoryHeader}</TableHead>
                  <TableHead className="text-right">{t.recentExpensesTableAmountHeader}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentExpenses.map((expense) => {
                  const Icon = CATEGORY_ICONS[expense.category];
                  const displayCategory = getTranslatedCategory(expense.category, t);
                  const displayDescription = expense.description;
                  
                  return (
                    <TableRow key={expense.id}>
                      <TableCell className="font-medium text-xs">
                        {new Date(expense.date).toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US', { day: '2-digit', month: 'short' })}
                      </TableCell>
                      <TableCell>{displayDescription}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="flex items-center gap-1.5 w-fit">
                          {Icon && <Icon size={14} className="text-muted-foreground" />}
                          {displayCategory}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-mono">{formatCurrency(expense.amount, language)}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
