
"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { useIncome } from '@/contexts/IncomeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { formatCurrency } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Banknote } from 'lucide-react';

export function RecentIncomesTable() {
  const { incomes, isIncomeInitialized, getTotalIncomeByMonth } = useIncome();
  const { t, language } = useLanguage();
  
  const [clientDateInfo, setClientDateInfo] = useState<{year: number, month: number} | null>(null);

  useEffect(() => {
    const now = new Date();
    setClientDateInfo({ year: now.getFullYear(), month: now.getMonth() });
  }, []);

  const recentIncomes = useMemo(() => {
    if (!isIncomeInitialized || !clientDateInfo) return [];
    return incomes.filter(inc => {
      const incDate = new Date(inc.date);
      return incDate.getFullYear() === clientDateInfo.year && incDate.getMonth() === clientDateInfo.month;
    }).slice(0, 10);
  }, [incomes, isIncomeInitialized, clientDateInfo]);

  const totalIncomeThisMonth = useMemo(() => {
    if (!isIncomeInitialized || !clientDateInfo) return 0;
    return getTotalIncomeByMonth(clientDateInfo.year, clientDateInfo.month);
  }, [getTotalIncomeByMonth, isIncomeInitialized, clientDateInfo]);


  if (!isIncomeInitialized || !clientDateInfo) {
    return (
      <Card className="mt-6 shadow-lg rounded-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Banknote className="text-primary" />
            {t.recentIncomesCardTitle}
          </CardTitle>
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
        <CardTitle className="flex items-center gap-2">
          <Banknote className="text-primary" />
          {t.recentIncomesCardTitle}
        </CardTitle>
        <CardDescription>
          {t.recentIncomesTableTotalThisMonth} <span className="font-semibold text-primary">{formatCurrency(totalIncomeThisMonth, language)}</span>.
          {' '}
          {t.recentIncomesTableDisplayingLast(recentIncomes.length)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {incomes.length === 0 || recentIncomes.length === 0 ? (
           <p className="text-muted-foreground text-center py-8">{t.recentIncomesTableNoIncomesThisMonth}</p>
        ) : (
          <ScrollArea className="h-[300px] w-full">
            <Table>
              <TableHeader className="sticky top-0 bg-card z-10">
                <TableRow>
                  <TableHead className="w-[100px]">{t.recentIncomesTableDateHeader}</TableHead>
                  <TableHead>{t.recentIncomesTableDescriptionHeader}</TableHead>
                  <TableHead className="text-right">{t.recentIncomesTableAmountHeader}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentIncomes.map((income) => {
                  return (
                    <TableRow key={income.id}>
                      <TableCell className="font-medium text-xs">
                        {new Date(income.date).toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US', { day: '2-digit', month: 'short' })}
                      </TableCell>
                      <TableCell>{income.description}</TableCell>
                      <TableCell className="text-right font-mono">{formatCurrency(income.amount, language)}</TableCell>
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
