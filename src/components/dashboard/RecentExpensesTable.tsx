
"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { useExpenses } from '@/contexts/ExpenseContext';
import { useLanguage } from '@/contexts/LanguageContext';
import type { Expense, Category, DefaultCategory } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import { DEFAULT_CATEGORY_ICONS, getTranslatedCategory, GENERIC_CATEGORY_ICON } from '@/lib/constants';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext'; // Added
import { Loader2 } from 'lucide-react'; // Added

export function RecentExpensesTable() {
  const { currentUser, isLoading: authLoading } = useAuth(); // Added
  const { expenses, isExpensesInitialized, isLoading: expensesLoading } = useExpenses(); // Use expensesLoading
  const { t, language } = useLanguage();
  
  const [clientDateInfo, setClientDateInfo] = useState<{year: number, month: number} | null>(null);

  useEffect(() => {
    const now = new Date();
    setClientDateInfo({ year: now.getFullYear(), month: now.getMonth() });
  }, []);

  const recentExpenses = useMemo(() => {
    if (!currentUser || !isExpensesInitialized || !clientDateInfo || expensesLoading) return [];
    return expenses.filter(exp => {
      const expDate = new Date(exp.date);
      return expDate.getFullYear() === clientDateInfo.year && expDate.getMonth() === clientDateInfo.month;
    }).slice(0, 10); 
  }, [expenses, isExpensesInitialized, clientDateInfo, currentUser, expensesLoading]);

  const totalExpensesThisMonth = useMemo(() => {
    if (!currentUser || !isExpensesInitialized || !clientDateInfo || expensesLoading) return 0;
    return expenses
      .filter(exp => {
        const expDate = new Date(exp.date);
        return expDate.getFullYear() === clientDateInfo.year && expDate.getMonth() === clientDateInfo.month;
      })
      .reduce((sum, exp) => sum + exp.amount, 0);
  }, [expenses, isExpensesInitialized, clientDateInfo, currentUser, expensesLoading]);

  const isLoading = authLoading || expensesLoading || !isExpensesInitialized || !clientDateInfo;

  if (isLoading && !currentUser && !authLoading) { // If not auth loading but no user, show login prompt early
     return (
        <Card className="mt-6 shadow-lg rounded-xl">
            <CardHeader>
                <CardTitle>{t.recentExpensesCardTitle}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground text-center py-8">{t.authRequiredDescription}</p>
            </CardContent>
        </Card>
     )
  }
  
  if (isLoading) {
    return (
      <Card className="mt-6 shadow-lg rounded-xl">
        <CardHeader>
          <CardTitle>{t.recentExpensesCardTitle}</CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-[250px]" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
             <Loader2 className="h-8 w-8 animate-spin text-primary" />
             <p className="ml-2">{language === 'id' ? "Memuat data..." : "Loading data..."}</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // At this point, currentUser exists, not loading, and expenses are initialized
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
                  const Icon = DEFAULT_CATEGORY_ICONS[expense.category as DefaultCategory] || GENERIC_CATEGORY_ICON;
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
