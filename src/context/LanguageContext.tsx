import React, { createContext, useContext, useState, ReactNode } from 'react';
import { translations, TranslationKeys } from '../i18n/translations';

type Language = 'pt' | 'en';

interface LanguageContextValue {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: TranslationKeys) => string;
}

export const LanguageContext = createContext<LanguageContextValue | null>(null);

// gerencia o idioma atual e as traduções do site
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(() => {
    const saved = localStorage.getItem('rm-lang');
    return (saved === 'en' || saved === 'pt') ? saved : 'pt';
  });

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('rm-lang', newLang);
  };

  const t = (key: TranslationKeys): string => {
    // se por algum motivo a chave nao existir, retorna a chave pura para evitar quebras catastróficas
    return translations[lang][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
