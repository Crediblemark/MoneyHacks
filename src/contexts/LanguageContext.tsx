
"use client";
import type { translations as translationType, Language } from '@/lib/translations';
import { translations } from '@/lib/translations';
import React, { createContext, useContext, useState, ReactNode, useEffect, useMemo } from 'react';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translationType.id; // Represents the set of translated strings for the current language
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>('id'); // Default to Indonesian
  const [isLanguageInitialized, setIsLanguageInitialized] = useState(false);

  useEffect(() => {
    // Load language from localStorage only on the client after mount
    const savedLanguage = localStorage.getItem('appLanguage') as Language | null;
    if (savedLanguage && (savedLanguage === 'id' || savedLanguage === 'en')) {
      setLanguageState(savedLanguage);
    }
    setIsLanguageInitialized(true);
  }, []);

  useEffect(() => {
    // Save language to localStorage whenever it changes, but only if initialized
    if (isLanguageInitialized && typeof window !== 'undefined') {
      localStorage.setItem('appLanguage', language);
    }
  }, [language, isLanguageInitialized]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  // Memoize translations to prevent unnecessary re-renders
  const t = useMemo(() => translations[language], [language]);

  if (!isLanguageInitialized) {
    return null; // Or a global loading spinner, but null is fine for context init
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
