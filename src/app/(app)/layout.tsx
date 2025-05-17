
"use client";

import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { AppShell } from '@/components/layout/AppShell';
import { redirect } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext'; // Untuk loading text

export default function AuthenticatedAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { currentUser, isLoading } = useAuth();
  const { t } = useLanguage(); // Mengambil fungsi terjemahan

  useEffect(() => {
    // Jika proses loading status auth selesai dan tidak ada pengguna,
    // arahkan ke halaman landing.
    if (!isLoading && !currentUser) {
      redirect('/landing');
    }
  }, [isLoading, currentUser]);

  if (isLoading) {
    // Tampilkan layar loading penuh selama status auth diperiksa
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="flex flex-col items-center space-y-4">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-16 h-16 text-primary animate-pulse">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-2-9h4v2h-4v-2zm-2-3h8v2H8v-2zm4 6h4v2h-4v-2z"/>
          </svg>
          <p className="text-muted-foreground">{t.financialManagerLoading}</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    // Fallback jika redirect dari useEffect belum sepenuhnya terjadi.
    // Ini memastikan tidak ada konten aplikasi yang dirender.
    // Pengguna akan melihat layar loading ini (atau layar kosong jika return null)
    // sebelum redirect ke /landing selesai.
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="flex flex-col items-center space-y-4">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-16 h-16 text-primary animate-pulse">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-2-9h4v2h-4v-2zm-2-3h8v2H8v-2zm4 6h4v2h-4v-2z"/>
          </svg>
           <p className="text-muted-foreground">{t.financialManagerLoading}</p>
        </div>
      </div>
    );
  }

  // Jika pengguna sudah diautentikasi, tampilkan AppShell dan kontennya
  return (
    <AppShell>
      {children}
    </AppShell>
  );
}
