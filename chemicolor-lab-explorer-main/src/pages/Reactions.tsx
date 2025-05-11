
import { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { ThemeProvider } from '../context/ThemeContext';
import { SimulationProvider } from '../context/SimulationContext';
import { useTheme } from '../context/ThemeContext';
import { useSimulation } from '../context/SimulationContext';
import { useTranslation } from '../utils/i18n';
import { useNavigate } from 'react-router-dom';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  FlaskConical, 
  Beaker, 
  Thermometer, 
  Gauge, 
  Droplets,
  Cloud,
  ArrowRight,
  Filter,
  Search,
  ChevronDown,
  Loader2
} from 'lucide-react';
import { reactions } from '../data/reactions';
import { motion } from 'framer-motion';
import { ChemicalBackground } from '../components/ChemicalBackground';

const ReactionCard = ({ reaction, onClick, isLoading }: { reaction: any, onClick: () => void, isLoading: boolean }) => {
  const { language } = useTheme();
  const { t } = useTranslation();
  
  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-all duration-300 overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">
          {/* Display the full bilingual name */}
          <div className="flex flex-col">
            {language === 'en' ? (
              <>
                <span className="text-base">{reaction.name}</span>
                <span className="text-xs text-muted-foreground mt-1 rtl:text-right">{reaction.nameAr}</span>
              </>
            ) : (
              <>
                <span className="text-base">{reaction.nameAr}</span>
                <span className="text-xs text-muted-foreground mt-1 ltr:text-left">{reaction.name}</span>
              </>
            )}
          </div>
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
              {t('gas.bubbles')}
            </div>
          )}
          {reaction.effects.smoke && (
            <div className="flex items-center text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
              <Cloud className="w-3 h-3 mr-1" />
              {t('smoke.vapor')}
            </div>
          )}
          {reaction.effects.precipitate && (
            <div className="flex items-center text-xs px-2 py-1 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-200">
              <div className="w-2 h-2 rounded-full bg-purple-500 mr-1"></div>
              {t('precipitate')}
            </div>
          )}
          {reaction.effects.temperature === 'increase' && (
            <div className="flex items-center text-xs px-2 py-1 rounded-full bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-200">
              <Thermometer className="w-3 h-3 mr-1" />
              {t('temperature.increase')}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          variant="default" 
          className="w-full" 
          onClick={onClick}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {t('reaction.loading', 'Loading...')}
            </>
          ) : (
            <>
              {t('reaction.try')}
              <ArrowRight className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

const ReactionsContent = () => {
  const { language } = useTheme();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loadingReaction, setLoadingReaction] = useState<string | null>(null);
  
  const categories = [
    { id: 'all', name: 'All Reactions', nameAr: 'جميع التفاعلات' },
    { id: 'acid-base', name: 'Acid-Base', nameAr: 'حمض-قاعدة' },
    { id: 'metal-acid', name: 'Metal-Acid', nameAr: 'معدن-حمض' },
    { id: 'precipitation', name: 'Precipitation', nameAr: 'ترسيب' },
    { id: 'redox', name: 'Redox', nameAr: 'أكسدة واختزال' },
    { id: 'catalytic', name: 'Catalytic', nameAr: 'حفزي' },
    { id: 'combustion', name: 'Combustion', nameAr: 'احتراق' },
    { id: 'gas-formation', name: 'Gas Formation', nameAr: 'تكوين غاز' },
  ];
  
  const effects = [
    { id: 'all', name: 'All Effects', nameAr: 'جميع التأثيرات' },
    { id: 'bubbles', name: 'Bubbles', nameAr: 'فقاعات' },
    { id: 'smoke', name: 'Smoke/Vapor', nameAr: 'دخان/بخار' },
    { id: 'precipitate', name: 'Precipitate', nameAr: 'راسب' },
    { id: 'temp-increase', name: 'Temperature Increase', nameAr: 'زيادة درجة الحرارة' },
    { id: 'temp-decrease', name: 'Temperature Decrease', nameAr: 'انخفاض درجة الحرارة' },
    { id: 'fire', name: 'Fire', nameAr: 'نار' },
    { id: 'glow', name: 'Glow', nameAr: 'توهج' },
  ];
  
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeEffect, setActiveEffect] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredReactions = reactions
    .filter(r => {
      // Category filter
      if (activeCategory !== 'all' && !r.id.startsWith(activeCategory)) {
        return false;
      }
      
      // Effects filter
      if (activeEffect !== 'all') {
        switch (activeEffect) {
          case 'bubbles':
            if (!r.effects.bubbles) return false;
            break;
          case 'smoke':
            if (!r.effects.smoke) return false;
            break;
          case 'precipitate':
            if (!r.effects.precipitate) return false;
            break;
          case 'temp-increase':
            if (r.effects.temperature !== 'increase') return false;
            break;
          case 'temp-decrease':
            if (r.effects.temperature !== 'decrease') return false;
            break;
          case 'fire':
            if (!r.effects.fire) return false;
            break;
          case 'glow':
            if (!r.effects.glow) return false;
            break;
        }
      }
      
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          r.name.toLowerCase().includes(query) ||
          r.nameAr.includes(query) ||
          r.description.toLowerCase().includes(query) ||
          r.descriptionAr.includes(query)
        );
      }
      
      return true;
    });
  
  const handleReactionSelect = (reactionId: string) => {
    // Set loading state to display loading indicator
    setLoadingReaction(reactionId);
    
    // Use setTimeout to allow the UI to update before navigation
    setTimeout(() => {
      navigate(`/simulation?reaction=${reactionId}`);
      // Reset loading state (this will run after navigation)
      setLoadingReaction(null);
    }, 100);
  };
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-2 text-center">
          {t('reactions.title')}
        </h1>
        <p className="text-muted-foreground text-center max-w-3xl mx-auto">
          {t('reactions.description')}
        </p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
          <Input
            placeholder={t('search.reactions', 'Search reactions...')}
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {/* Effect filter dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="min-w-[180px]">
              <Filter className="w-4 h-4 mr-2" />
              {language === 'en' 
                ? effects.find(e => e.id === activeEffect)?.name 
                : effects.find(e => e.id === activeEffect)?.nameAr}
              <ChevronDown className="w-4 h-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {effects.map(effect => (
              <DropdownMenuItem 
                key={effect.id}
                onClick={() => setActiveEffect(effect.id)}
              >
                {language === 'en' ? effect.name : effect.nameAr}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <Tabs defaultValue="all" className="mb-8">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 mb-8">
          {categories.map(category => (
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
                <motion.div
                  key={reaction.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ReactionCard 
                    reaction={reaction} 
                    onClick={() => handleReactionSelect(reaction.id)}
                    isLoading={loadingReaction === reaction.id} 
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">{t('no.reactions.found', 'No reactions found matching your criteria')}</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

const Reactions = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/login');
    }
  }, [navigate]);
  
  return (
    <ThemeProvider>
      <SimulationProvider>
        <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 pt-16 relative overflow-hidden">
          <ChemicalBackground />
          <Navbar />
          <ReactionsContent />
        </div>
      </SimulationProvider>
    </ThemeProvider>
  );
};

export default Reactions;
