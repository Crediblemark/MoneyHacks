
"use client";
import type { NextPage } from 'next';
import { GoalsClient } from '@/components/goals/GoalsClient';
import { AppPageHeader } from '@/components/layout/AppPageHeader';
import { useLanguage } from '@/contexts/LanguageContext';
import { Target } from 'lucide-react';
// GoalsProvider is in RootLayout, so no need to wrap here.

const FinancialGoalsPage: NextPage = () => {
  const { t } = useLanguage();
  return (
    <div>
      <AppPageHeader
        title={t.financialGoalsTitle}
        icon={Target}
        description={t.financialGoalsDescription}
      />
      <GoalsClient />
    </div>
  );
};

export default FinancialGoalsPage;

    