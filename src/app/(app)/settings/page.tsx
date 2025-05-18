
"use client";

import { AppPageHeader } from '@/components/layout/AppPageHeader';
import { SettingsClient } from '@/components/settings/SettingsClient';
import { useLanguage } from '@/contexts/LanguageContext';
import { Settings } from 'lucide-react';

export default function SettingsPage() {
  const { t } = useLanguage();

  return (
    <div>
      <AppPageHeader
        title={t.settingsPageTitle}
        icon={Settings}
        description={t.settingsPageDescription}
      />
      <SettingsClient />
    </div>
  );
}
