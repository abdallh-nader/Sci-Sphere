import { Link, useLocation } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';
import { LanguageToggle } from './LanguageToggle';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from '../utils/i18n';
import { User, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export const Navbar = () => {
  const { language } = useTheme();
  const location = useLocation();
  const { t } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
      console.log('Scroll state:', isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out px-6 md:px-10 py-4 ${
        scrolled
          ? 'bg-gray-200/90 backdrop-filter backdrop-blur-md shadow-md supports-[backdrop-filter]:bg-gray-200/90'
          : 'bg-transparent'
      }`}
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <img
            src="/L1.png"
            alt="L1 Logo"
            className="h-12 w-12 object-contain transition-transform duration-200 group-hover:scale-105"
            onError={(e) => {
              e.currentTarget.src = '/fallback-logo.png';
              console.error('Failed to load L1 logo');
            }}
          />
          <span className="font-extrabold text-xl bg-clip-text text-transparent bg-gradient-to-r from-violet-300 via-green-300 to-blue-300 transition-colors duration-200 group-hover:from-violet-400 group-hover:via-green-400 group-hover:to-blue-400">
            {language === 'en' ? 'SciSphere' : 'SciSphere'}
          </span>
        </Link>

        <div className="hidden md:flex items-center space-x-6">
          <Link
            to="/free-mode"
            className={`px-3 py-1 transition-colors bg-clip-text text-transparent bg-gradient-to-r from-violet-300 via-green-300 to-blue-300 hover:bg-gradient-to-r hover:from-violet-400 hover:via-green-400 hover:to-blue-400 ${
              isActive('/free-mode') ? 'font-bold' : ''
            } ${language === 'ar' ? 'ml-6' : ''}`}
          >
            {language === 'en' ? 'Free Reactions' : 'التفاعلات الحرة'}
          </Link>
          <Link
            to="/reactions"
            className={`px-3 py-1 transition-colors bg-clip-text text-transparent bg-gradient-to-r from-violet-300 via-green-300 to-blue-300 hover:bg-gradient-to-r hover:from-violet-400 hover:via-green-400 hover:to-blue-400 ${
              isActive('/reactions') ? 'font-bold' : ''
            } ${language === 'ar' ? 'ml-6' : ''}`}
          >
            {language === 'en' ? 'Reactions' : 'التفاعلات'}
          </Link>

          <div className="flex items-center space-x-1">
            <ThemeToggle />
            <LanguageToggle />
          </div>

          <Link to="/login">
            <Button variant="outline" size="sm" className="gap-2 bg-clip-text text-transparent bg-gradient-to-r from-violet-300 via-green-300 to-blue-300 hover:bg-gradient-to-r hover:from-violet-400 hover:via-green-400 hover:to-blue-400">
              <User size={16} />
              {language === 'en' ? 'Login' : 'تسجيل الدخول'}
            </Button>
          </Link>
        </div>

        <div className="md:hidden flex items-center">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side={language === 'ar' ? 'right' : 'left'}>
              <div className="flex flex-col h-full py-6" dir={language === 'ar' ? 'rtl' : 'ltr'}>
                <div className="mb-8">
                  <Link to="/" className="flex items-center gap-2">
                    <img
                      src="/L1.png"
                      alt="L1 Logo"
                      className="h-12 w-12 object-contain"
                      onError={(e) => {
                        e.currentTarget.src = '/fallback-logo.png';
                        console.error('Failed to load L1 logo');
                      }}
                    />
                    <span className="font-extrabold text-xl bg-clip-text text-transparent bg-gradient-to-r from-violet-300 via-green-300 to-blue-300">
                      {language === 'en' ? 'Chemical Lab' : 'معمل الكيمياء'}
                    </span>
                  </Link>
                </div>
                <div className="flex flex-col space-y-4">
                  <Link
                    to="/free-mode"
                    className={`px-2 py-2 rounded-md transition-colors bg-clip-text text-transparent bg-gradient-to-r from-violet-300 via-green-300 to-blue-300 hover:bg-gradient-to-r hover:from-violet-400 hover:via-green-400 hover:to-blue-400 ${
                      isActive('/free-mode') ? 'font-bold' : ''
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {language === 'en' ? 'Free Reactions' : 'التفاعلات الحرة'}
                  </Link>
                  <Link
                    to="/reactions"
                    className={`px-2 py-2 rounded-md transition-colors bg-clip-text text-transparent bg-gradient-to-r from-violet-300 via-green-300 to-blue-300 hover:bg-gradient-to-r hover:from-violet-400 hover:via-green-400 hover:to-blue-400 ${
                      isActive('/reactions') ? 'font-bold' : ''
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {language === 'en' ? 'Reactions' : 'التفاعلات'}
                  </Link>
                  <Link
                    to="/login"
                    className={`px-2 py-2 rounded-md transition-colors bg-clip-text text-transparent bg-gradient-to-r from-violet-300 via-green-300 to-blue-300 hover:bg-gradient-to-r hover:from-violet-400 hover:via-green-400 hover:to-blue-400 ${
                      isActive('/login') ? 'font-bold' : ''
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {language === 'en' ? 'Login' : 'تسجيل الدخول'}
                  </Link>
                </div>
                <div className="mt-auto flex gap-4">
                  <ThemeToggle />
                  <LanguageToggle />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};