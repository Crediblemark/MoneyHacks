
"use client";
import { AppPageHeader } from '@/components/layout/AppPageHeader';
import { HealthCheckClient } from '@/components/health-check/HealthCheckClient';
import { useLanguage } from '@/contexts/LanguageContext';
import { ShieldCheck } from 'lucide-react';

export default function HealthCheckPage() {
  const { t } = useLanguage();
  return (
    <div>
      <AppPageHeader 
        title={t.healthCheckTitle}
        icon={ShieldCheck}
        description={t.healthCheckDescription}
      />
      <HealthCheckClient />
    </div>
  );
}
