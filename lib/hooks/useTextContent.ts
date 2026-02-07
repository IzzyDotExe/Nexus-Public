'use client';

import { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/language-context';

type LanguageCode = 'en' | 'fr';

interface TextContent {
  [key: string]: any;
}

let cachedTranslations: { [key: string]: TextContent } = {};

/**
 * Custom hook for accessing translated text content
 * Automatically uses the language from LanguageContext if not provided
 * @param language - Language code ('en' or 'fr'). If not provided, uses context language
 * @returns Object with getText method to retrieve translations by key
 *
 * @example
 * const { getText } = useTextContent();
 * const title = getText('home.title');
 * const withParams = getText('projects.showingProjects', { filtered: 5, total: 10 });
 */
export function useTextContent(language?: LanguageCode) {
  const { language: contextLanguage } = useLanguage();
  const activeLanguage = language || contextLanguage;
  const [translations, setTranslations] = useState<TextContent>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTranslations = async () => {
      // Return cached translations if available
      if (cachedTranslations[activeLanguage]) {
        setTranslations(cachedTranslations[activeLanguage]);
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`/locales/${activeLanguage}.json`);
        if (!response.ok) {
          throw new Error(`Failed to load ${activeLanguage} translations`);
        }
        const data = await response.json();
        cachedTranslations[activeLanguage] = data;
        setTranslations(data);
      } catch (error) {
        console.error(`Error loading translations for language ${activeLanguage}:`, error);
        // Fallback to English if translation fails
        if (activeLanguage !== 'en' && cachedTranslations['en']) {
          setTranslations(cachedTranslations['en']);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadTranslations();
  }, [activeLanguage]);

  /**
   * Get translated text by dot-notation key
   * @param key - Dot-notation key path (e.g., 'home.title', 'contact.dialog.title')
   * @param params - Optional object for parameter replacement in template strings
   * @returns Translated text, empty string if loading, or the key itself if not found
   */
  const getText = (key: string, params?: Record<string, string | number>): string => {
    // Return empty string while loading to prevent showing keys
    if (isLoading) {
      return '';
    }

    const keys = key.split('.');
    let value: any = translations;

    // Traverse the object using dot notation
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        console.warn(`Translation key not found: ${key}`);
        return key;
      }
    }

    // Handle parameter replacement
    if (typeof value === 'string' && params) {
      let result = value;
      for (const [paramKey, paramValue] of Object.entries(params)) {
        result = result.replace(`{${paramKey}}`, String(paramValue));
      }
      return result;
    }

    return typeof value === 'string' ? value : key;
  };

  return { getText, isLoading, language: activeLanguage };
}

/**
 * Synchronous version of getText that uses cached translations
 * Use this if you need translations without the hook (e.g., in non-React contexts)
 * Make sure translations are loaded before using this
 */
export function getTextSync(language: LanguageCode = 'en', key: string, params?: Record<string, string | number>): string {
  if (!cachedTranslations[language]) {
    console.warn(`Translations for language ${language} are not loaded yet`);
    return key;
  }

  const keys = key.split('.');
  let value: any = cachedTranslations[language];

  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      console.warn(`Translation key not found: ${key}`);
      return key;
    }
  }

  if (typeof value === 'string' && params) {
    let result = value;
    for (const [paramKey, paramValue] of Object.entries(params)) {
      result = result.replace(`{${paramKey}}`, String(paramValue));
    }
    return result;
  }

  return typeof value === 'string' ? value : key;
}
