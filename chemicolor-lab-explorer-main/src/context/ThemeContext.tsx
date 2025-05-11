
import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';
type Language = 'en' | 'ar';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  language: Language;
  toggleLanguage: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    // Check local storage or system preference
    const storedTheme = localStorage.getItem('theme') as Theme;
    if (storedTheme) return storedTheme;
    
    return window.matchMedia('(prefers-color-scheme: dark)').matches 
      ? 'dark' 
      : 'light';
  });
  
  const [language, setLanguage] = useState<Language>(() => {
    // Check local storage or system preference
    const storedLang = localStorage.getItem('language') as Language;
    if (storedLang) return storedLang;
    
    // Check browser language
    const browserLang = navigator.language.startsWith('ar') ? 'ar' : 'en';
    return browserLang;
  });

  // Toggle theme
  const toggleTheme = () => {
    setTheme(prevTheme => {
      const newTheme = prevTheme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', newTheme);
      return newTheme;
    });
  };
  
  // Toggle language
  const toggleLanguage = () => {
    setLanguage(prevLang => {
      const newLang = prevLang === 'en' ? 'ar' : 'en';
      localStorage.setItem('language', newLang);
      
      // Force reload i18next to apply language change immediately
      if (window.i18next) {
        window.i18next.changeLanguage(newLang);
      }
      
      return newLang;
    });
  };
  
  // Apply theme to document
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);
  
  // Apply language to document
  useEffect(() => {
    const html = document.documentElement;
    html.lang = language;
    html.dir = language === 'ar' ? 'rtl' : 'ltr';
    
    if (language === 'ar') {
      document.body.classList.add('ar');
    } else {
      document.body.classList.remove('ar');
    }
    
    // Update i18next language when component mounts
    if (window.i18next && window.i18next.language !== language) {
      window.i18next.changeLanguage(language);
    }
  }, [language]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, language, toggleLanguage }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
