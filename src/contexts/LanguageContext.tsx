
"use client";
import type { translations as translationType, Language } from '@/lib/translations';
import { translations } from '@/lib/translations';
import React, { createContext, useContext, useState, ReactNode, useEffect, useMemo } from 'react';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translationType.id; // Represents the set of translated strings for the current language
  aiName: string;
  setAiName: (name: string) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const DEFAULT_AI_NAME_ID = "Manajer Keuangan AI";
const DEFAULT_AI_NAME_EN = "AI Financial Manager";

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>('id'); // Default to Indonesian
  const [aiName, setAiNameState] = useState<string>(""); // Initial empty, will be set by useEffect
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const savedLanguage = localStorage.getItem('appLanguage') as Language | null;
    if (savedLanguage && (savedLanguage === 'id' || savedLanguage === 'en')) {
      setLanguageState(savedLanguage);
    }

    const savedAiName = localStorage.getItem('appAiName');
    const defaultName = savedLanguage === 'en' ? DEFAULT_AI_NAME_EN : DEFAULT_AI_NAME_ID;
    setAiNameState(savedAiName || defaultName);
    
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('appLanguage', language);
      // Update default AI name if language changes and current AI name is the default for the *other* language
      const currentDefaultId = language === 'id' ? DEFAULT_AI_NAME_ID : DEFAULT_AI_NAME_EN;
      const otherDefaultId = language === 'id' ? DEFAULT_AI_NAME_EN : DEFAULT_AI_NAME_ID;
      if (aiName === otherDefaultId) {
        setAiNameState(currentDefaultId);
        localStorage.setItem('appAiName', currentDefaultId);
      }
    }
  }, [language, isInitialized, aiName]);

  useEffect(() => {
    if (isInitialized && aiName) { // Ensure aiName is not empty before saving
        localStorage.setItem('appAiName', aiName);
    }
  }, [aiName, isInitialized]);


  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const setAiName = (name: string) => {
    const defaultName = language === 'en' ? DEFAULT_AI_NAME_EN : DEFAULT_AI_NAME_ID;
    setAiNameState(name || defaultName); // Revert to default if name is empty
  };

  const t = useMemo(() => translations[language], [language]);

  if (!isInitialized) {
    return null; 
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, aiName, setAiName }}>
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
