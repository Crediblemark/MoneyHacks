
"use client";
import { ExpenseForm } from '@/components/dashboard/ExpenseForm';
import { RecentExpensesTable } from '@/components/dashboard/RecentExpensesTable';
import { AppPageHeader } from '@/components/layout/AppPageHeader';
import { useLanguage } from '@/contexts/LanguageContext';
import { LayoutDashboard } from 'lucide-react';

export default function DashboardPage() {
  const { t } = useLanguage();
  return (
    <div className="space-y-6">
      <AppPageHeader 
        title={t.dashboardTitle}
        icon={LayoutDashboard}
        description={t.dashboardDescription}
      />
      <ExpenseForm />
      <RecentExpensesTable />
    </div>
  );
}
