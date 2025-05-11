
import { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { ThemeProvider } from '../context/ThemeContext';
import { SimulationProvider, useSimulation } from '../context/SimulationContext';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from '../utils/i18n';
import { useNavigate } from 'react-router-dom';
import { 
  Tabs, TabsContent, TabsList, TabsTrigger 
} from '@/components/ui/tabs';
import {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Beaker, Thermometer, Droplets, Cloud, ArrowRight, Sparkles
} from 'lucide-react';
import { reactions } from '../data/reactions';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';

// Categories for the reactions
const CATEGORIES = [
  { id: 'all', name: 'All Reactions', nameAr: 'جميع التفاعلات' },
  { id: 'combustion', name: 'Combustion', nameAr: 'احتراق' },
  { id: 'metal-nonmetal', name: 'Metal-Nonmetal', nameAr: 'معدن-لامعدن' },
  { id: 'metal-water', name: 'Metal-Water', nameAr: 'معدن-ماء' },
  { id: 'metal-acid', name: 'Metal-Acid', nameAr: 'معدن-حمض' },
  { id: 'acid-base', name: 'Acid-Base', nameAr: 'حمض-قاعدة' },
  { id: 'precipitation', name: 'Precipitation', nameAr: 'ترسيب' },
  { id: 'redox', name: 'Redox', nameAr: 'أكسدة واختزال' },
  { id: 'displacement', name: 'Displacement', nameAr: 'إزاحة' },
  { id: 'double-displacement', name: 'Double Displacement', nameAr: 'إزاحة مزدوجة' },
  { id: 'decomposition', name: 'Decomposition', nameAr: 'تحلل' },
  { id: 'catalytic', name: 'Catalytic', nameAr: 'حفزي' },
  { id: 'gas-formation', name: 'Gas Formation', nameAr: 'تكوين غاز' },
];

// Component for the reaction card
const ReactionCard = ({ reaction, onClick }: { reaction: any, onClick: () => void }) => {
  const { language } = useTheme();
  const { t } = useTranslation();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="h-full flex flex-col hover:shadow-lg transition-all duration-300 overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">
            {language === 'en' ? reaction.name : reaction.nameAr}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-grow pb-2">
          <CardDescription className="line-clamp-3 mb-4">
            {language === 'en' ? reaction.description : reaction.descriptionAr}
          </CardDescription>
          <div className="flex flex-wrap gap-2 mb-3">
            {reaction.effects.bubbles && (
              <div className="flex items-center text-xs px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-200">
                <Droplets className="w-3 h-3 mr-1" />
                {language === 'en' ? 'Gas' : 'غاز'}
              </div>
            )}
            {reaction.effects.smoke && (
              <div className="flex items-center text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                <Cloud className="w-3 h-3 mr-1" />
                {language === 'en' ? 'Smoke' : 'دخان'}
              </div>
            )}
            {reaction.effects.precipitate && (
              <div className="flex items-center text-xs px-2 py-1 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-200">
                <div className="w-2 h-2 rounded-full bg-purple-500 mr-1"></div>
                {language === 'en' ? 'Precipitate' : 'راسب'}
              </div>
            )}
            {reaction.effects.temperature === 'increase' && (
              <div className="flex items-center text-xs px-2 py-1 rounded-full bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-200">
                <Thermometer className="w-3 h-3 mr-1" />
                {language === 'en' ? 'Heat' : 'حرارة'}
              </div>
            )}
            {reaction.conditions.temperature > 100 && (
              <div className="flex items-center text-xs px-2 py-1 rounded-full bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-200">
                <Sparkles className="w-3 h-3 mr-1" />
                {language === 'en' ? 'High Temp' : 'درجة حرارة عالية'}
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            variant="default" 
            className="w-full" 
            onClick={onClick}
          >
            {t('reaction.try')}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

// Main content component
const ElementaryReactionsContent = () => {
  const { language } = useTheme();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { selectReaction } = useSimulation();
  
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter reactions based on category and search term
  const filteredReactions = reactions
    .filter(r => activeCategory === 'all' || r.id.startsWith(activeCategory))
    .filter(r => {
      if (!searchTerm) return true;
      const searchLower = searchTerm.toLowerCase();
      return (
        r.name.toLowerCase().includes(searchLower) ||
        r.nameAr.includes(searchTerm) ||
        r.description.toLowerCase().includes(searchLower) ||
        r.descriptionAr.includes(searchTerm)
      );
    });
  
  const handleReactionSelect = (reactionId: string) => {
    selectReaction(reactionId);
    navigate('/simulation');
  };
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-2 text-center">
          {language === 'en' ? 'Elementary Chemical Reactions' : 'التفاعلات الكيميائية الأساسية'}
        </h1>
        <p className="text-muted-foreground text-center max-w-3xl mx-auto">
          {language === 'en' 
            ? 'Explore these fundamental chemical reactions and run simulations to see how they work.' 
            : 'استكشف هذه التفاعلات الكيميائية الأساسية وقم بتشغيل المحاكاة لمعرفة كيفية عملها.'}
        </p>
      </div>
      
      {/* Search bar */}
      <div className="mb-6 max-w-lg mx-auto">
        <Input
          placeholder={language === 'en' ? "Search reactions..." : "بحث عن تفاعلات..."}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />
      </div>
      
      <Tabs defaultValue="all" className="mb-8">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 mb-8">
          {CATEGORIES.map(category => (
            <TabsTrigger 
              key={category.id} 
              value={category.id}
              onClick={() => setActiveCategory(category.id)}
              className="text-xs md:text-sm"
            >
              {language === 'en' ? category.name : category.nameAr}
            </TabsTrigger>
          ))}
        </TabsList>
        
        <TabsContent value={activeCategory} className="mt-6">
          {filteredReactions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredReactions.map(reaction => (
                <ReactionCard 
                  key={reaction.id}
                  reaction={reaction} 
                  onClick={() => handleReactionSelect(reaction.id)} 
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Beaker className="w-12 h-12 mx-auto text-muted-foreground" />
              <p className="mt-4 text-lg font-medium">
                {language === 'en' ? 'No reactions found' : 'لم يتم العثور على تفاعلات'}
              </p>
              <p className="text-muted-foreground">
                {language === 'en' 
                  ? 'Try adjusting your search or category filter' 
                  : 'حاول تعديل البحث أو تصفية الفئة'}
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Main page component
const ElementaryReactions = () => {
  return (
    <ThemeProvider>
      <SimulationProvider>
        <div className="min-h-screen pt-16">
          <Navbar />
          <ElementaryReactionsContent />
        </div>
      </SimulationProvider>
    </ThemeProvider>
  );
};

export default ElementaryReactions;
