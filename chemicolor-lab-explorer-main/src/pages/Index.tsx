import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from '../utils/i18n';
import { ChemicalBackground } from '../components/ChemicalBackground';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Beaker, TestTube, Atom, ArrowRight, LogIn, UserPlus, FlaskConical, GraduationCap, BookOpen } from 'lucide-react';

const Index = () => {
  const { language } = useTheme();
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  useEffect(() => {
    document.title = "SciSphere - Home";
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 relative overflow-hidden">
      <ChemicalBackground />
      <Navbar />
      
      <div className="container mx-auto px-4 py-16 relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-64px)]">
        <div className="max-w-6xl w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left Column - Welcome Message */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col space-y-6"
              dir={language === 'ar' ? 'rtl' : 'ltr'}
            >
              <motion.h1 
                className="text-4xl md:text-4xl lg:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-500 mt-12"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {t('welcome.title')}
              </motion.h1>
              
              <motion.p 
                className="text-xl text-muted-foreground mt-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                {t('welcome.subtitle')}
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex flex-col space-y-4 w-full max-w-md"
              >
                <Button 
                  size="lg" 
                  variant="outline"
                  className="px-8 py-6 text-lg group flex items-center gap-2 w-full"
                  onClick={() => navigate('/free-mode')}
                >
                  <Beaker className="w-4 h-4" />
                  <span>{language === 'en' ? 'Free Reactions' : 'التفاعلات الحرة'}</span>
                </Button>
                
                <Button 
                  size="lg" 
                  variant="outline"
                  className="px-8 py-6 text-lg group flex items-center gap-2 w-full"
                  onClick={() => navigate('/reactions')}
                >
                  <BookOpen className="w-4 h-4" />
                  <span>{language === 'en' ? 'Reactions Library' : 'مكتبة التفاعلات'}</span>
                </Button>

                <Button 
                  size="lg" 
                  className="px-8 py-6 text-lg group flex items-center gap-2 w-full button-shine"
                  onClick={() => navigate('/login')}
                >
                  <LogIn className="w-4 h-4" />
                  <span>{language === 'en' ? 'Login' : 'تسجيل الدخول'}</span>
                </Button>
              </motion.div>
              
              <motion.p
                className="text-sm text-muted-foreground mt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                {language === 'en'
                  ? 'Not a member yet? Login to unlock more features or try our free reactions!'
                  : 'لست عضوًا بعد؟ سجل الدخول لفتح المزيد من المزايا أو جرب تفاعلاتنا المجانية!'}
              </motion.p>
            </motion.div>
            
            {/* Right Column - Features */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-6"
              dir={language === 'ar' ? 'rtl' : 'ltr'}
            >
              <h2 className="text-2xl font-semibold">{t('welcome.features.title')}</h2>
              
              <motion.div 
                className="glass p-6 rounded-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Beaker className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">{t('welcome.feature1.title')}</h3>
                    <p className="text-muted-foreground mt-2">{t('welcome.feature1.description')}</p>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                className="glass p-6 rounded-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
              >
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Atom className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">{t('welcome.feature2.title')}</h3>
                    <p className="text-muted-foreground mt-2">{t('welcome.feature2.description')}</p>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                className="glass p-6 rounded-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.5 }}
              >
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <TestTube className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">{t('welcome.feature3.title')}</h3>
                    <p className="text-muted-foreground mt-2">{t('welcome.feature3.description')}</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
        
        {/* About Section */}
        <motion.div 
          className="mt-16 max-w-6xl w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          dir={language === 'ar' ? 'rtl' : 'ltr'}
        >
          <h2 className="text-3xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-500">
            {language === 'en' ? 'About SciSphere' : 'حول ساي سفير'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass p-6 rounded-lg hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="flex flex-col items-center text-center gap-4">
                <div className="bg-primary/10 p-4 rounded-full">
                  <FlaskConical className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-medium">
                  {language === 'en' ? 'Virtual Laboratory' : 'معمل افتراضي'}
                </h3>
                <p className="text-muted-foreground">
                  {language === 'en' 
                    ? 'Experience chemistry in a safe, virtual environment. Conduct experiments and observe reactions without any real-world risks.'
                    : 'جرب الكيمياء في بيئة افتراضية آمنة. قم بإجراء التجارب ومراقبة التفاعلات دون أي مخاطر في العالم الحقيقي.'}
                </p>
              </div>
            </div>
            
            <div className="glass p-6 rounded-lg hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="flex flex-col items-center text-center gap-4">
                <div className="bg-primary/10 p-4 rounded-full">
                  <GraduationCap className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-medium">
                  {language === 'en' ? 'Educational Tool' : 'أداة تعليمية'}
                </h3>
                <p className="text-muted-foreground">
                  {language === 'en'
                    ? 'Perfect for students and educators. Visualize chemical reactions and understand complex concepts through interactive simulations.'
                    : 'مثالي للطلاب والمعلمين. تصور التفاعلات الكيميائية وفهم المفاهيم المعقدة من خلال المحاكاة التفاعلية.'}
                </p>
              </div>
            </div>
            
            <div className="glass p-6 rounded-lg hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="flex flex-col items-center text-center gap-4">
                <div className="bg-primary/10 p-4 rounded-full">
                  <BookOpen className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-medium">
                  {language === 'en' ? 'Comprehensive Database' : 'قاعدة بيانات شاملة'}
                </h3>
                <p className="text-muted-foreground">
                  {language === 'en'
                    ? 'Access a wide range of chemical reactions and compounds. From basic to advanced reactions, all with detailed formulas and explanations.'
                    : 'الوصول إلى مجموعة واسعة من التفاعلات الكيميائية والمركبات. من التفاعلات الأساسية إلى المتقدمة، كلها مع صيغ وتفسيرات مفصلة.'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-12 text-center space-y-6">
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              {language === 'en'
                ? 'SciSphere is designed to make learning chemistry interactive and engaging. Our platform provides realistic simulations that help visualize chemical reactions in real-time.'
                : 'تم تصميم ساي سفير لجعل تعلم الكيمياء تفاعليًا وجذابًا. توفر منصتنا محاكاة واقعية تساعد على تصور التفاعلات الكيميائية في الوقت الفعلي.'}
            </p>
            
            <Button 
              size="lg" 
              className="px-8 py-6 bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-500 hover:from-violet-500 hover:via-indigo-500 hover:to-blue-400 shadow-lg button-shine"
              onClick={() => navigate('/free-mode')}
            >
              {language === 'en' ? 'Try Free Reactions' : 'جرب التفاعلات الحرة'}
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Index;
