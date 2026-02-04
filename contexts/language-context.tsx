'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type LanguageCode = 'en' | 'fr';

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (language: LanguageCode) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>('en');
  const [isMounted, setIsMounted] = useState(false);

  // Initialize language from localStorage on client side
  useEffect(() => {
    setIsMounted(true);
    const savedLanguage = localStorage.getItem('language') as LanguageCode | null;
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'fr')) {
      setLanguageState(savedLanguage);
      document.documentElement.lang = savedLanguage;
    }
  }, []);

  const setLanguage = (newLanguage: LanguageCode) => {
    setLanguageState(newLanguage);
    localStorage.setItem('language', newLanguage);
    document.documentElement.lang = newLanguage;
  };

  // Provide context even before hydration with a default value
  const value: LanguageContextType = { language, setLanguage };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    // Provide a default value if context is not available (fallback)
    return { language: 'en' as LanguageCode, setLanguage: () => {} };
  }
  return context;
}
