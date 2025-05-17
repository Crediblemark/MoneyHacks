import type {Metadata} from 'next';
import {Geist, Geist_Mono} from 'next/font/google';
import './globals.css';
import { ExpenseProvider } from '@/contexts/ExpenseContext';
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
        <ExpenseProvider>
          <AppShell>
            {children}
          </AppShell>
          <Toaster />
        </ExpenseProvider>
      </body>
    </html>
  );
}
