"use client";

import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { AppShell } from '@/components/layout/AppShell';
import { redirect } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';

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

export default function AuthenticatedAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { currentUser, isLoading } = useAuth();
  const { t } = useLanguage();

  useEffect(() => {
    // If auth status is resolved and there's no user, redirect.
    if (!isLoading && !currentUser) {
      redirect('/landing');
    }
  }, [isLoading, currentUser]);

  // Show loading screen while Firebase is determining auth state.
  if (isLoading) {
    return <FullScreenLoader text={t.financialManagerLoading} />;
  }

  // If loading is complete, but there's no user,
  // it means they are unauthenticated. The useEffect above will trigger
  // a redirect. This return prevents AppShell from rendering during that brief period
  // and shows a specific message.
  if (!currentUser) {
    // Fallback text is provided in case t.authRedirectingToLogin is not yet available or defined
    return <FullScreenLoader text={t.authRedirectingToLogin ?? "Redirecting to login..."} />;
  }

  // If authenticated (isLoading is false and currentUser exists), render the AppShell and children.
  return (
    <AppShell>
      {children}
    </AppShell>
  );
}
