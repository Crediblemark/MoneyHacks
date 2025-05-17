
import { MonthlyReportClient } from '@/components/reports/MonthlyReportClient';
import { AppPageHeader } from '@/components/layout/AppPageHeader';
import { BarChartBig } from 'lucide-react';

export default function ReportsPage() {
  return (
    <div>
      <AppPageHeader 
        title="Laporan Bulanan" 
        icon={BarChartBig}
        description="Lihat ringkasan pengeluaran Anda per bulan, lengkap dengan grafik."
      />
      <MonthlyReportClient />
    </div>
  );
}
