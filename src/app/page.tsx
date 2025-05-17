
"use client";
import { ExpenseForm } from '@/components/dashboard/ExpenseForm';
import { RecentExpensesTable } from '@/components/dashboard/RecentExpensesTable';
import { IncomeForm } from '@/components/dashboard/IncomeForm';
import { RecentIncomesTable } from '@/components/dashboard/RecentIncomesTable';
import { AppPageHeader } from '@/components/layout/AppPageHeader';
import { useLanguage } from '@/contexts/LanguageContext';
import { LayoutDashboard } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { FinancialManagerAdvice } from '@/components/dashboard/FinancialManagerAdvice'; // Added

export default function DashboardPage() {
  const { t } = useLanguage();
  return (
    <div className="space-y-8">
      <AppPageHeader 
        title={t.dashboardTitle}
        icon={LayoutDashboard}
        description={t.dashboardDescription}
      />

      <FinancialManagerAdvice /> {/* Added Financial Manager Advice Card */}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <IncomeForm />
          <RecentIncomesTable />
        </div>
        <div className="space-y-6">
          <ExpenseForm />
          <RecentExpensesTable />
        </div>
      </div>
    </div>
  );
}
