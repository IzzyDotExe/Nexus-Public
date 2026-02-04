'use client';

import { useLanguage } from '@/contexts/language-context';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'fr' : 'en');
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleLanguage}
      title={language === 'en' ? 'Switch to French' : 'Basculer vers anglais'}
      aria-label={language === 'en' ? 'Switch to French' : 'Switch to English'}
    >
      <Globe className="h-4 w-4" />
      <span className="ml-1 text-sm font-medium hidden sm:inline">{language.toUpperCase()}</span>
    </Button>
  );
}
