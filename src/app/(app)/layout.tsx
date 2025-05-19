
"use client";

import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { AppShell } from '@/components/layout/AppShell';
import { useRouter } from 'next/navigation'; 
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
  const auth = useAuth(); 
  const router = useRouter();
  const { t } = useLanguage();

  useEffect(() => {
    if (!auth.isLoading && !auth.currentUser) {
      router.replace('/landing');
    }
  }, [auth.isLoading, auth.currentUser, router]);

  if (auth.isLoading) {
    return <FullScreenLoader text={t.financialManagerLoading} />; // Using a generic loading text
  }

  if (!auth.currentUser) {
    // This state should ideally be brief as the useEffect above will trigger a redirect.
    // It's a fallback to prevent rendering AppShell if currentUser is null after loading.
    return <FullScreenLoader text={t.authRedirectingToLogin ?? "Redirecting to login..."} />;
  }

  // If user is authenticated, render the AppShell and children
  return (
    <AppShell>
      {children}
    </AppShell>
  );
}
