
"use client";
import { SpendingAnalysisClient } from '@/components/analysis/SpendingAnalysisClient';
import { AppPageHeader } from '@/components/layout/AppPageHeader';
import { useLanguage } from '@/contexts/LanguageContext';
import { Brain } from 'lucide-react';

export default function AnalysisPage() {
  const { t } = useLanguage();
  return (
    <div>
      <AppPageHeader 
        title={t.analysisPageTitle}
        icon={Brain}
        description={t.analysisPageDescription}
      />
      <SpendingAnalysisClient />
    </div>
  );
}
