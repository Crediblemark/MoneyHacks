
"use client";
import { AIPredictionDisplay } from '@/components/predictions/AIPredictionDisplay';
import { AppPageHeader } from '@/components/layout/AppPageHeader';
import { useLanguage } from '@/contexts/LanguageContext';
import { Sparkles } from 'lucide-react';

export default function PredictionsPage() {
  const { t } = useLanguage();
  return (
    <div>
      <AppPageHeader 
        title={t.predictionsTitle}
        icon={Sparkles}
        description={t.predictionsDescription}
      />
      <AIPredictionDisplay />
    </div>
  );
}
