
"use client";
import { useState, useMemo } from 'react';
import { useExpenses } from '@/contexts/ExpenseContext';
import { formatCurrency, getMonthName } from '@/lib/utils';
import type { Category } from '@/lib/types';
import { CATEGORY_ICONS } from '@/lib/constants';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts";
import type { ChartConfig } from "@/components/ui/chart";

export function MonthlyReportClient() {
  const { getExpensesSummaryByMonth, getTotalExpensesByMonth } = useExpenses();
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-indexed

  const monthlySummary = useMemo(() => getExpensesSummaryByMonth(year, month), [year, month, getExpensesSummaryByMonth]);
  const totalMonthlyExpenses = useMemo(() => getTotalExpensesByMonth(year, month), [year, month, getTotalExpensesByMonth]);
  
  const chartData = monthlySummary.map(item => ({
    name: item.category,
    total: item.total,
    fill: `var(--color-${item.category.toLowerCase()})`,
  }));

  const chartConfig = {} as ChartConfig;
  monthlySummary.forEach((item, index) => {
    const IconComponent = CATEGORY_ICONS[item.category];
    chartConfig[item.category.toLowerCase() as keyof typeof chartConfig] = {
      label: (
        <div className="flex items-center gap-1">
          <IconComponent size={14} />
          {item.category}
        </div>
      ),
      color: `hsl(var(--chart-${(index % 5) + 1}))`,
    };
  });


  const handlePrevMonth = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() - 1);
      return newDate;
    });
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + 1);
      // Prevent going to future months beyond current month
      if (newDate > new Date()) return prev;
      return newDate;
    });
  };
  
  const isNextMonthDisabled = () => {
    const nextMonthDate = new Date(currentDate);
    nextMonthDate.setMonth(currentDate.getMonth() + 1);
    return nextMonthDate > new Date();
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-center items-center gap-4 mb-6">
        <Button variant="outline" size="icon" onClick={handlePrevMonth}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-2xl font-semibold text-center w-48">
          {getMonthName(month)} {year}
        </h2>
        <Button variant="outline" size="icon" onClick={handleNextMonth} disabled={isNextMonthDisabled()}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <Card className="shadow-lg rounded-xl">
        <CardHeader>
          <CardTitle>Ringkasan Pengeluaran</CardTitle>
          <CardDescription>Total Pengeluaran: <span className="font-bold text-primary">{formatCurrency(totalMonthlyExpenses)}</span></CardDescription>
        </CardHeader>
        <CardContent>
          {monthlySummary.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Detail per Kategori</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Kategori</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {monthlySummary.map(item => {
                      const Icon = CATEGORY_ICONS[item.category];
                      return (
                        <TableRow key={item.category}>
                          <TableCell className="flex items-center gap-2">
                            <Icon size={16} className="text-muted-foreground" />
                            {item.category}
                          </TableCell>
                          <TableCell className="text-right font-mono">{formatCurrency(item.total)}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Grafik Pengeluaran</h3>
                 <ChartContainer config={chartConfig} className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} layout="vertical" margin={{ right: 20, left: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} stroke="hsl(var(--foreground))" tick={{fontSize: 12}} width={80} />
                      <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                      <ChartLegend content={<ChartLegendContent />} />
                      <Bar dataKey="total" radius={5} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">Belum ada data pengeluaran untuk bulan ini.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
