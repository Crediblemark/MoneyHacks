
"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { requestNotificationPermission, showBrowserNotification } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export function SettingsClient() {
  const { language, setLanguage, t, aiName, setAiName } = useLanguage();
  const { currentUser } = useAuth(); // Removed unused subscription state
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
      title: t.settingsAiNameSavedTitle,
      description: t.settingsAiNameSavedDescription(localAiName || (language === 'id' ? 'Manajer Keuangan AI' : 'AI Financial Manager')),
    });
  };
  
  const handleNotificationRequest = async () => {
    const permission = await requestNotificationPermission();
    setNotificationPermission(permission);
    if (permission === 'granted') {
      showBrowserNotification(t.authNotificationAllowed, t.settingsNotificationGrantedBody);
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
          <CardDescription>{t.settingsAiNameDescription}</CardDescription>
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
           <CardDescription>{t.settingsLanguageDescription}</CardDescription>
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
            <CardDescription>{t.settingsNotificationDescription}</CardDescription>
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
             {notificationPermission === 'granted' && <p className="text-xs text-muted-foreground mt-2">{t.settingsNotificationGrantedBody}</p>}
             {notificationPermission === 'denied' && <p className="text-xs text-muted-foreground mt-2">{t.settingsNotificationDeniedBody}</p>}
        </CardContent>
      </Card>
    </div>
  );
}
