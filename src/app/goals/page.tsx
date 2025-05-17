
"use client";
import type { NextPage } from 'next';
import { GoalsClient } from '@/components/goals/GoalsClient';
import { AppPageHeader } from '@/components/layout/AppPageHeader';
import { useLanguage } from '@/contexts/LanguageContext';
import { Target } from 'lucide-react';
import { GoalsProvider } from '@/contexts/GoalsContext'; // Import GoalsProvider

const FinancialGoalsPage: NextPage = () => {
  const { t } = useLanguage();
  return (
    // Wrap GoalsClient with GoalsProvider if it's not already provided higher up
    // For this page, it's better to ensure GoalsProvider is here or in a layout specific to /goals
    // However, in our current setup, RootLayout already includes GoalsProvider.
    // So, direct usage of GoalsClient should be fine.
    // If GoalsProvider was NOT in RootLayout, you'd add it here:
    // <GoalsProvider>
    //   <AppPageHeader ... />
    //   <GoalsClient />
    // </GoalsProvider>
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
