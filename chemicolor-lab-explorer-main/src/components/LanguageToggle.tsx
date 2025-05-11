
import { Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "../context/ThemeContext";
import { useTranslation } from "../utils/i18n";

export function LanguageToggle() {
  const { language, toggleLanguage } = useTheme();
  const { t } = useTranslation();

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={toggleLanguage}
      aria-label={t('language.switch')}
    >
      <Languages className="h-5 w-5" />
      <span className="sr-only">
        {language === 'en' ? 'تبديل إلى العربية' : 'Switch to English'}
      </span>
    </Button>
  );
}
