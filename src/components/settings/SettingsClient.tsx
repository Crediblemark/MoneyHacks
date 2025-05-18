
"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { requestNotificationPermission, showBrowserNotification } from '@/lib/utils'; // Assuming these utils exist

export function SettingsClient() {
  const { language, setLanguage, t, aiName, setAiName } = useLanguage();
  const { currentUser } = useAuth();
  const { toast } = useToast();

  const [localAiName, setLocalAiName] = useState(aiName);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    setLocalAiName(aiName);
  }, [aiName]);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  const handleAiNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalAiName(e.target.value);
  };

  const handleSaveAiName = () => {
    setAiName(localAiName);
    toast({
      title: language === 'id' ? "Nama AI Disimpan" : "AI Name Saved",
      description: language === 'id' ? `AI sekarang akan dipanggil "${localAiName || (language === 'id' ? 'Manajer Keuangan AI' : 'AI Financial Manager')}"` : `AI will now be called "${localAiName || (language === 'id' ? 'Manajer Keuangan AI' : 'AI Financial Manager')}"`,
    });
  };
  
  const handleNotificationRequest = async () => {
    const permission = await requestNotificationPermission();
    setNotificationPermission(permission);
    if (permission === 'granted') {
      showBrowserNotification(t.authNotificationAllowed, language === 'id' ? "Anda akan menerima notifikasi dari aplikasi ini." : "You will receive notifications from this app.");
    }
  };


  if (!currentUser) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t.settingsPageTitle}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{t.authRequiredDescription}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t.settingsAiNameLabel}</CardTitle>
          <CardDescription>{language === 'id' ? 'Personalisasi bagaimana Anda memanggil asisten AI Anda.' : 'Personalize how you call your AI assistant.'}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Label htmlFor="ai-name-input">{t.aiNameSettingLabel}</Label>
          <div className="flex items-center gap-2">
            <Input
              id="ai-name-input"
              type="text"
              value={localAiName}
              onChange={handleAiNameChange}
              placeholder={t.settingsAiNamePlaceholder}
              className="h-10"
            />
            <Button onClick={handleSaveAiName} disabled={localAiName === aiName}>{t.saveButtonLabel}</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t.settingsLanguageLabel}</CardTitle>
           <CardDescription>{language === 'id' ? 'Pilih bahasa yang Anda preferensikan untuk antarmuka aplikasi.' : 'Choose your preferred language for the application interface.'}</CardDescription>
        </CardHeader>
        <CardContent className="flex gap-2">
          <Button
            variant={language === 'id' ? 'default' : 'outline'}
            onClick={() => setLanguage('id')}
            className="flex-1"
          >
            {t.languageSwitcherID}
          </Button>
          <Button
            variant={language === 'en' ? 'default' : 'outline'}
            onClick={() => setLanguage('en')}
            className="flex-1"
          >
            {t.languageSwitcherEN}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
            <CardTitle>{t.settingsNotificationLabel}</CardTitle>
            <CardDescription>{language === 'id' ? 'Kelola izin notifikasi browser untuk pengingat dan pembaruan.' : 'Manage browser notification permissions for reminders and updates.'}</CardDescription>
        </CardHeader>
        <CardContent>
            <Button 
                onClick={handleNotificationRequest}
                disabled={notificationPermission !== 'default'}
                className="w-full"
            >
                {notificationPermission === 'granted' ? t.authNotificationAllowed :
                 notificationPermission === 'denied' ? t.authNotificationBlocked :
                 t.authNotificationRequest}
            </Button>
        </CardContent>
      </Card>
    </div>
  );
}
