
"use client";

import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { AppShell } from '@/components/layout/AppShell';
import { useRouter } from 'next/navigation'; // Changed from redirect
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button'; // For overlay button

// A simple reusable loading screen component
const FullScreenLoader = ({ text }: { text: string }) => (
  <div className="flex items-center justify-center h-screen bg-background">
    <div className="flex flex-col items-center space-y-4">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-16 h-16 text-primary animate-pulse">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-2-9h4v2h-4v-2zm-2-3h8v2H8v-2zm4 6h4v2h-4v-2z"/>
      </svg>
      <p className="text-muted-foreground">{text}</p>
    </div>
  </div>
);

const SubscriptionExpiredOverlay = () => {
  const { t } = useLanguage();
  const router = useRouter();
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm p-8 text-center">
        <div className="bg-card p-8 rounded-xl shadow-2xl max-w-md w-full">
            <h2 className="text-2xl font-bold text-destructive mb-4">{t.subscriptionOverlayTitle}</h2>
            <p className="text-muted-foreground mb-6">{t.subscriptionOverlayMessage}</p>
            <Button onClick={() => router.push('/settings')} size="lg">
                {t.subscriptionOverlayButton}
            </Button>
        </div>
    </div>
  );
};

export default function AuthenticatedAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const auth = useAuth(); // Use alias for clarity
  const router = useRouter();
  const { t } = useLanguage();

  useEffect(() => {
    if (!auth.isLoading && !auth.currentUser) {
      router.replace('/landing');
    }
  }, [auth.isLoading, auth.currentUser, router]);

  if (auth.isLoading) {
    return <FullScreenLoader text={t.financialManagerLoading} />;
  }

  if (!auth.currentUser) {
    return <FullScreenLoader text={t.authRedirectingToLogin ?? "Redirecting to login..."} />;
  }

  // After user is confirmed, check subscription status
  if (auth.isLoadingSubscription) {
    return <FullScreenLoader text={t.subscriptionStatusLoading} />;
  }

  if (!auth.isSubscriptionActive) {
    return (
      <>
        <SubscriptionExpiredOverlay />
        {/* Optionally render a very basic AppShell or nothing underneath */}
         <AppShell> 
          {/* This children won't be interactive due to overlay */}
          <div className="opacity-20 pointer-events-none">{children}</div>
        </AppShell>
      </>
    );
  }

  return (
    <AppShell>
      {children}
    </AppShell>
  );
}
