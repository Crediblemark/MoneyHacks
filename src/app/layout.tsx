
import type {Metadata} from 'next';
import {Geist, Geist_Mono} from 'next/font/google';
import './globals.css';
import { ExpenseProvider } from '@/contexts/ExpenseContext';
import { IncomeProvider } from '@/contexts/IncomeContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { GoalsProvider } from '@/contexts/GoalsContext'; // Added GoalsProvider
import { Toaster } from "@/components/ui/toaster";
import { AppShell } from '@/components/layout/AppShell';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

// Metadata will remain in the default language (Indonesian) for simplicity,
// as proper i18n for metadata is more complex.
export const metadata: Metadata = {
  title: 'ChatExpense - Catat Uang Mudah',
  description: 'Catat pengeluaran sehari-hari langsung via chat, dapatkan laporan otomatis tiap bulan!',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <LanguageProvider>
          <ExpenseProvider>
            <IncomeProvider>
              <GoalsProvider> {/* Wrapped children with GoalsProvider */}
                <AppShell>
                  {children}
                </AppShell>
                <Toaster />
              </GoalsProvider>
            </IncomeProvider>
          </ExpenseProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
