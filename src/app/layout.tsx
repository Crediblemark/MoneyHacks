
"use client"; // Add this directive

import type {Metadata} from 'next'; // Keep Metadata type for reference if needed elsewhere, but not for export
import {Geist, Geist_Mono} from 'next/font/google';
import './globals.css';
import { ExpenseProvider } from '@/contexts/ExpenseContext';
import { IncomeProvider } from '@/contexts/IncomeContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { GoalsProvider } from '@/contexts/GoalsContext';
import { AuthProvider } from '@/contexts/AuthContext'; // Added AuthProvider
import { Toaster } from "@/components/ui/toaster";
import { AppShell } from '@/components/layout/AppShell';
import React, { useEffect } from 'react';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

// Removed metadata export:
// export const metadata: Metadata = {
//   title: 'ChatExpense - Catat Uang Mudah',
//   description: 'Catat pengeluaran sehari-hari langsung via chat, dapatkan laporan otomatis tiap bulan!',
//   manifest: '/manifest.json',
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => console.log('ChatExpense Service Worker registered with scope:', registration.scope))
        .catch((error) => console.error('ChatExpense Service Worker registration failed:', error));
    }
  }, []);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>ChatExpense - Catat Uang Mudah</title>
        <meta name="description" content="Catat pengeluaran sehari-hari langsung via chat, dapatkan laporan otomatis tiap bulan!" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#A29BFE" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="ChatExpense" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <LanguageProvider>
          <AuthProvider> {/* AuthProvider wraps other providers that might need auth state */}
            <ExpenseProvider>
              <IncomeProvider>
                <GoalsProvider>
                  <AppShell>
                    {children}
                  </AppShell>
                  <Toaster />
                </GoalsProvider>
              </IncomeProvider>
            </ExpenseProvider>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
