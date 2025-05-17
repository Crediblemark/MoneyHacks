
"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogIn, Wallet } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import Image from 'next/image';

const FullScreenLoader = ({ text }: { text: string }) => (
  <div className="flex items-center justify-center h-screen bg-gradient-to-br from-primary/10 via-background to-background">
    <div className="flex flex-col items-center space-y-4">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-16 h-16 text-primary animate-pulse">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-2-9h4v2h-4v-2zm-2-3h8v2H8v-2zm4 6h4v2h-4v-2z"/>
      </svg>
      <p className="text-muted-foreground">{text}</p>
    </div>
  </div>
);

export default function LandingPage() {
  const { currentUser, isLoading, signInWithGoogle } = useAuth();
  const router = useRouter();
  const { t } = useLanguage();

  useEffect(() => {
    if (!isLoading && currentUser) {
      router.replace('/'); // Redirect to dashboard if logged in
    }
  }, [currentUser, isLoading, router]);

  if (isLoading || (!isLoading && currentUser)) {
    // Show loader while checking auth or if user exists (before redirect)
    return <FullScreenLoader text={currentUser ? t.authRedirectingToDashboard : t.authLoadingConfiguration} />;
  }

  // If not loading and no current user, show the login page
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-primary/20 via-background to-background p-6 text-center">
      <div className="max-w-md w-full space-y-8">
        <div className="flex flex-col items-center">
          <div className="p-4 bg-primary/20 rounded-full mb-6 shadow-lg">
            <Wallet size={64} className="text-primary" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            {t.landingPageTitle}
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">
            {t.landingPageSubtitle}
          </p>
        </div>

        <div className="bg-card p-8 rounded-xl shadow-2xl space-y-6">
          <p className="text-muted-foreground">{t.landingPageDescription}</p>
          <Button 
            onClick={signInWithGoogle} 
            size="lg" 
            className="w-full text-lg py-3"
            disabled={isLoading}
          >
            <LogIn className="mr-2 h-5 w-5" />
            {t.authLoginButton}
          </Button>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div className="bg-card/50 p-6 rounded-lg shadow-lg">
                <h3 className="text-lg font-semibold text-primary mb-2">{t.landingPageFeature1Title}</h3>
                <p className="text-sm text-muted-foreground">{t.landingPageFeature1Description}</p>
            </div>
            <div className="bg-card/50 p-6 rounded-lg shadow-lg">
                <h3 className="text-lg font-semibold text-primary mb-2">{t.landingPageFeature2Title}</h3>
                <p className="text-sm text-muted-foreground">{t.landingPageFeature2Description}</p>
            </div>
            <div className="bg-card/50 p-6 rounded-lg shadow-lg">
                <h3 className="text-lg font-semibold text-primary mb-2">{t.landingPageFeature3Title}</h3>
                <p className="text-sm text-muted-foreground">{t.landingPageFeature3Description}</p>
            </div>
        </div>
         <p className="text-xs text-muted-foreground mt-12">
          {t.appName} - Your Personal Finance Companion
        </p>
      </div>
    </div>
  );
}
