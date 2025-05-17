
"use client";
import React, { useState, useMemo, useEffect } from 'react';
import { useExpenses } from '@/contexts/ExpenseContext';
import { useLanguage } from '@/contexts/LanguageContext';
import type { Category } from '@/lib/types';
import { CATEGORY_ICONS, getTranslatedCategory } from '@/lib/constants';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, TrendingUp, TrendingDown } from 'lucide-react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip as RechartsTooltip } from "recharts";
import type { ChartConfig } from "@/components/ui/chart";
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency, getMonthName } from '@/lib/utils';

const NEEDS_CATEGORIES: Category[] = ["Makanan", "Transportasi"]; // Explicitly define "Transportasi" if it exists as a category. Assuming it does for now. Or adjust as needed.
const WANTS_CATEGORIES_PRIMARY: Category[] = ["Belanja"];


export function MonthlyReportClient() {
  const { getExpensesSummaryByMonth, getTotalExpensesByMonth, isExpensesInitialized, getExpensesByMonth } = useExpenses();
  const { t, language } = useLanguage();
  const [currentDate, setCurrentDate] = useState<Date | null>(null);

  useEffect(() => {
    setCurrentDate(new Date());
  }, []);

  const year = currentDate?.getFullYear();
  const month = currentDate?.getMonth(); // 0-indexed

  const monthlyExpenses = useMemo(() => {
    if (!isExpensesInitialized || typeof year !== 'number' || typeof month !== 'number') return [];
    return getExpensesByMonth(year, month);
  }, [year, month, getExpensesByMonth, isExpensesInitialized]);

  const tableSummary = useMemo(() => {
    if (!isExpensesInitialized) return [];
    const summary: { name: string; total: number; }[] = [];
    const categoryMap: Record<string, number> = {};

    monthlyExpenses.forEach(expense => {
      categoryMap[expense.category] = (categoryMap[expense.category] || 0) + expense.amount;
    });

    for (const category in categoryMap) {
      summary.push({ name: category, total: categoryMap[category] });
    }
    return summary.sort((a, b) => b.total - a.total);
  }, [monthlyExpenses, isExpensesInitialized]);
  
  const totalMonthlyExpenses = useMemo(() => {
    if (!isExpensesInitialized || typeof year !== 'number' || typeof month !== 'number') return 0;
    return getTotalExpensesByMonth(year, month);
  }, [year, month, getTotalExpensesByMonth, isExpensesInitialized]);
  
  const chartSummaryData = useMemo(() => {
    if (!isExpensesInitialized || typeof year !== 'number' || typeof month !== 'number') return [];
    return getExpensesSummaryByMonth(year, month);
  }, [year, month, getExpensesSummaryByMonth, isExpensesInitialized]);


  const barChartData = useMemo(() => {
    if (!isExpensesInitialized) return [];
    return chartSummaryData.map(item => ({
      name: item.category, 
      total: item.total,
      fill: `var(--color-${item.category.toLowerCase().replace(/\s+/g, '-')})`, 
    }));
  }, [chartSummaryData, isExpensesInitialized]);

  const barChartConfig = useMemo(() => {
    if (!isExpensesInitialized) return {} as ChartConfig;
    const config = {} as ChartConfig;
    chartSummaryData.forEach((item, index) => {
      const IconComponent = CATEGORY_ICONS[item.category];
      const translatedCategoryName = getTranslatedCategory(item.category, t);
      const configKey = item.category.toLowerCase().replace(/\s+/g, '-');
      config[configKey as keyof typeof config] = {
        label: (
          <div className="flex items-center gap-1">
            {IconComponent && <IconComponent size={14} />}
            {translatedCategoryName}
          </div>
        ),
        color: `hsl(var(--chart-${(index % 5) + 1}))`,
      };
    });
    return config;
  }, [chartSummaryData, isExpensesInitialized, t]);

  const { needsVsWantsData, totalNeeds, totalWants } = useMemo(() => {
    let calculatedNeeds = 0;
    let calculatedWants = 0;
    monthlyExpenses.forEach(expense => {
      if (NEEDS_CATEGORIES.includes(expense.category as Category)) { // Ensure 'Transportasi' is handled if it's a distinct category for needs
        calculatedNeeds += expense.amount;
      } else {
        calculatedWants += expense.amount;
      }
    });
    return {
      needsVsWantsData: [
        { name: t.reportsNeedsLabel, value: calculatedNeeds, fill: 'hsl(var(--chart-1))' },
        { name: t.reportsWantsLabel, value: calculatedWants, fill: 'hsl(var(--chart-2))' },
      ],
      totalNeeds: calculatedNeeds,
      totalWants: calculatedWants,
    };
  }, [monthlyExpenses, t]);


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
          {monthlyExpenses.length > 0 ? (
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
                    {tableSummary.map(item => {
                      const Icon = CATEGORY_ICONS[item.name as Category];
                      const translatedName = getTranslatedCategory(item.name as Category, t);
                      return (
                        <TableRow key={item.name}>
                          <TableCell className="flex items-center gap-2">
                            {Icon && <Icon size={16} className="text-muted-foreground" />}
                            {translatedName}
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
                 <ChartContainer config={barChartConfig} className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barChartData} layout="vertical" margin={{ right: 20, left: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                      <XAxis type="number" hide />
                      <YAxis 
                        dataKey="name" 
                        type="category" 
                        tickLine={false} 
                        axisLine={false} 
                        stroke="hsl(var(--foreground))" 
                        tick={{fontSize: 12}} 
                        width={language === 'id' ? 80 : 90} 
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
                                const configKey = (value as string).toLowerCase().replace(/\s+/g, '-');
                                return barChartConfig[configKey]?.label || value;
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

      {/* Needs vs Wants Chart Section */}
      {monthlyExpenses.length > 0 && (
        <Card className="shadow-lg rounded-xl">
          <CardHeader>
            <CardTitle>{t.reportsNeedsVsWantsTitle}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={needsVsWantsData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      dataKey="value"
                      label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }) => {
                        const RADIAN = Math.PI / 180;
                        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                        const x = cx + radius * Math.cos(-midAngle * RADIAN);
                        const y = cy + radius * Math.sin(-midAngle * RADIAN);
                        return (
                          <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize="12px">
                            {`${name} (${(percent * 100).toFixed(0)}%)`}
                          </text>
                        );
                      }}
                    >
                      {needsVsWantsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <RechartsTooltip formatter={(value: number, name: string) => [formatCurrency(value, language), name]}/>
                    {/* <Legend /> We use custom legend below */}
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-4 h-4 rounded-sm" style={{backgroundColor: 'hsl(var(--chart-1))'}} />
                    <h4 className="font-semibold text-lg">{t.reportsNeedsLabel}</h4>
                  </div>
                  <p className="text-2xl font-bold text-primary">{formatCurrency(totalNeeds, language)}</p>
                  <p className="text-sm text-muted-foreground">
                    ({((totalNeeds / totalMonthlyExpenses) * 100 || 0).toFixed(1)}% dari total pengeluaran)
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                     <div className="w-4 h-4 rounded-sm" style={{backgroundColor: 'hsl(var(--chart-2))'}} />
                    <h4 className="font-semibold text-lg">{t.reportsWantsLabel}</h4>
                  </div>
                  <p className="text-2xl font-bold" style={{color: 'hsl(var(--chart-2))'}}>{formatCurrency(totalWants, language)}</p>
                   <p className="text-sm text-muted-foreground">
                    ({((totalWants / totalMonthlyExpenses) * 100 || 0).toFixed(1)}% dari total pengeluaran)
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

    </div>
  );
}
