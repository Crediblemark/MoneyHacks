
"use client";
import { MonthlyReportClient } from '@/components/reports/MonthlyReportClient';
import { AppPageHeader } from '@/components/layout/AppPageHeader';
import { useLanguage } from '@/contexts/LanguageContext';
import { BarChartBig } from 'lucide-react';

export default function ReportsPage() {
  const { t } = useLanguage();
  return (
    <div>
      <AppPageHeader 
        title={t.reportsTitle} 
        icon={BarChartBig}
        description={t.reportsDescription}
      />
      <MonthlyReportClient />
    </div>
  );
}
