
"use client";
import React, { useState, useMemo, useEffect } from 'react';
import { useExpenses } from '@/contexts/ExpenseContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { formatCurrency, getMonthName } from '@/lib/utils';
import type { Category } from '@/lib/types';
import { CATEGORY_ICONS, getTranslatedCategory } from '@/lib/constants';
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
import { Skeleton } from '@/components/ui/skeleton';

export function MonthlyReportClient() {
  const { getExpensesSummaryByMonth, getTotalExpensesByMonth, isExpensesInitialized } = useExpenses();
  const { t, language } = useLanguage();
  const [currentDate, setCurrentDate] = useState<Date | null>(null);

  useEffect(() => {
    setCurrentDate(new Date());
  }, []);

  const year = currentDate?.getFullYear();
  const month = currentDate?.getMonth(); // 0-indexed

  const monthlySummary = useMemo(() => {
    if (!isExpensesInitialized || typeof year !== 'number' || typeof month !== 'number') return [];
    return getExpensesSummaryByMonth(year, month);
  }, [year, month, getExpensesSummaryByMonth, isExpensesInitialized]);
  
  const totalMonthlyExpenses = useMemo(() => {
    if (!isExpensesInitialized || typeof year !== 'number' || typeof month !== 'number') return 0;
    return getTotalExpensesByMonth(year, month);
  }, [year, month, getTotalExpensesByMonth, isExpensesInitialized]);
  
  const chartData = useMemo(() => {
    if (!isExpensesInitialized) return [];
    return monthlySummary.map(item => ({
      // Use original category name for dataKey in chart, then translate in label
      name: item.category, 
      total: item.total,
      fill: `var(--color-${item.category.toLowerCase().replace(/\s+/g, '-')})`, // Ensure valid CSS var name
    }));
  }, [monthlySummary, isExpensesInitialized]);

  const chartConfig = useMemo(() => {
    if (!isExpensesInitialized) return {} as ChartConfig;
    const config = {} as ChartConfig;
    monthlySummary.forEach((item, index) => {
      const IconComponent = CATEGORY_ICONS[item.category];
      const translatedCategoryName = getTranslatedCategory(item.category, t);
      // Use original category name (lowercase, hyphenated) for config key
      const configKey = item.category.toLowerCase().replace(/\s+/g, '-');
      config[configKey as keyof typeof config] = {
        label: (
          <div className="flex items-center gap-1">
            <IconComponent size={14} />
            {translatedCategoryName}
          </div>
        ),
        color: `hsl(var(--chart-${(index % 5) + 1}))`,
      };
    });
    return config;
  }, [monthlySummary, isExpensesInitialized, t]);


  const handlePrevMonth = () => {
    setCurrentDate(prev => {
      if (!prev) return null;
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() - 1);
      return newDate;
    });
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => {
      if (!prev) return null;
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + 1);
      if (newDate > new Date()) return prev; 
      return newDate;
    });
  };
  
  const isNextMonthDisabled = () => {
    if (!currentDate) return true;
    const nextMonthDate = new Date(currentDate);
    nextMonthDate.setMonth(currentDate.getMonth() + 1);
    const today = new Date();
    // Disable if next month is after the current month of the current year
    return nextMonthDate.getFullYear() > today.getFullYear() || 
           (nextMonthDate.getFullYear() === today.getFullYear() && nextMonthDate.getMonth() > today.getMonth());
  }

  if (!isExpensesInitialized || !currentDate || typeof year !== 'number' || typeof month !== 'number') {
    return (
      <div className="space-y-6">
        <div className="flex justify-center items-center gap-4 mb-6">
          <Button variant="outline" size="icon" disabled><ChevronLeft className="h-4 w-4" /></Button>
          <Skeleton className="h-8 w-48" />
          <Button variant="outline" size="icon" disabled><ChevronRight className="h-4 w-4" /></Button>
        </div>
        <Card className="shadow-lg rounded-xl">
          <CardHeader>
            <CardTitle>{t.monthlyReportSummaryTitle}</CardTitle>
            <CardDescription><Skeleton className="h-4 w-[200px]" /></CardDescription>
          </CardHeader>
          <CardContent>
             <div className="space-y-2 py-8">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-[80%]" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-center items-center gap-4 mb-6">
        <Button variant="outline" size="icon" onClick={handlePrevMonth}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-2xl font-semibold text-center w-48">
          {getMonthName(month, language)} {year}
        </h2>
        <Button variant="outline" size="icon" onClick={handleNextMonth} disabled={isNextMonthDisabled()}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <Card className="shadow-lg rounded-xl">
        <CardHeader>
          <CardTitle>{t.monthlyReportSummaryTitle}</CardTitle>
          <CardDescription>{t.monthlyReportSummaryDescription(formatCurrency(totalMonthlyExpenses, language))}</CardDescription>
        </CardHeader>
        <CardContent>
          {monthlySummary.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">{t.monthlyReportDetailPerCategory}</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t.monthlyReportCategoryHeader}</TableHead>
                      <TableHead className="text-right">{t.monthlyReportTotalHeader}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {monthlySummary.map(item => {
                      const Icon = CATEGORY_ICONS[item.category];
                      const translatedCategoryName = getTranslatedCategory(item.category, t);
                      return (
                        <TableRow key={item.category}>
                          <TableCell className="flex items-center gap-2">
                            <Icon size={16} className="text-muted-foreground" />
                            {translatedCategoryName}
                          </TableCell>
                          <TableCell className="text-right font-mono">{formatCurrency(item.total, language)}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">{t.monthlyReportChartTitle}</h3>
                 <ChartContainer config={chartConfig} className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} layout="vertical" margin={{ right: 20, left: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                      <XAxis type="number" hide />
                      <YAxis 
                        dataKey="name" 
                        type="category" 
                        tickLine={false} 
                        axisLine={false} 
                        stroke="hsl(var(--foreground))" 
                        tick={{fontSize: 12}} 
                        width={language === 'id' ? 80 : 90} // Adjust width for potentially longer English category names
                        tickFormatter={(value) => getTranslatedCategory(value as Category, t)}
                      />
                      <ChartTooltip 
                        content={<ChartTooltipContent 
                          hideLabel 
                          formatter={(value, name, props) => {
                            const categoryName = props.payload?.name as Category;
                            return [
                              formatCurrency(value as number, language),
                              getTranslatedCategory(categoryName, t)
                            ];
                          }}
                          />} 
                      />
                      <ChartLegend 
                        content={
                          <ChartLegendContent 
                            formatter={(value, entry) => {
                                // The `value` here is the original dataKey (category name)
                                // We need to find its translated version from chartConfig for the label
                                const configKey = (value as string).toLowerCase().replace(/\s+/g, '-');
                                return chartConfig[configKey]?.label || value;
                            }}
                          />
                        } 
                      />
                      <Bar dataKey="total" radius={5} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">{t.monthlyReportNoData}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
