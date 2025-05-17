
import { ExpenseForm } from '@/components/dashboard/ExpenseForm';
import { RecentExpensesTable } from '@/components/dashboard/RecentExpensesTable';
import { AppPageHeader } from '@/components/layout/AppPageHeader';
import { LayoutDashboard } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <AppPageHeader 
        title="Dashboard" 
        icon={LayoutDashboard}
        description="Selamat datang! Catat pengeluaran Anda dan lihat ringkasan terbaru di sini."
      />
      <ExpenseForm />
      <RecentExpensesTable />
    </div>
  );
}
