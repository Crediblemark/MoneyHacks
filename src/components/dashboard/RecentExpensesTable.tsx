
"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { useExpenses } from '@/contexts/ExpenseContext';
import type { Expense } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import { CATEGORY_ICONS } from '@/lib/constants';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

export function RecentExpensesTable() {
  const { expenses, isExpensesInitialized } = useExpenses();
  
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
    return recentExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  }, [recentExpenses]);

  if (!isExpensesInitialized || !clientDateInfo) {
    return (
      <Card className="mt-6 shadow-lg rounded-xl">
        <CardHeader>
          <CardTitle>Pengeluaran Terbaru (Bulan Ini)</CardTitle>
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
        <CardTitle>Pengeluaran Terbaru (Bulan Ini)</CardTitle>
        <CardDescription>
          Total pengeluaran bulan ini: <span className="font-semibold text-primary">{formatCurrency(totalExpensesThisMonth)}</span>.
          Menampilkan {recentExpenses.length > 0 ? Math.min(recentExpenses.length, 10) : '0'} transaksi terakhir.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {expenses.length === 0 ? (
           <p className="text-muted-foreground text-center py-8">Belum ada pengeluaran tercatat bulan ini.</p>
        ) : (
          <ScrollArea className="h-[300px] w-full">
            <Table>
              <TableHeader className="sticky top-0 bg-card z-10">
                <TableRow>
                  <TableHead className="w-[100px]">Tanggal</TableHead>
                  <TableHead>Deskripsi</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead className="text-right">Jumlah</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentExpenses.length > 0 ? recentExpenses.map((expense) => {
                  const Icon = CATEGORY_ICONS[expense.category];
                  return (
                    <TableRow key={expense.id}>
                      <TableCell className="font-medium text-xs">
                        {new Date(expense.date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })}
                      </TableCell>
                      <TableCell>{expense.description}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="flex items-center gap-1.5 w-fit">
                          <Icon size={14} className="text-muted-foreground" /> 
                          {expense.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-mono">{formatCurrency(expense.amount)}</TableCell>
                    </TableRow>
                  );
                }) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                      Belum ada pengeluaran tercatat bulan ini.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
