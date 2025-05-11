import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { ThemeProvider } from '../context/ThemeContext';
import { SimulationProvider } from '../context/SimulationContext';
import { ChemicalBackground } from '../components/ChemicalBackground';
import { FreeModeSimulation } from '../components/FreeModeSimulation';
import { motion } from 'framer-motion';
import { useTranslation } from '../utils/i18n';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Lightbulb, Volume2, VolumeX, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useIsMobile } from '@/hooks/use-mobile';
import MobileControls from '../components/MobileControls';
import { useToast } from "@/hooks/use-toast";

const FreeMode = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const isMobile = useIsMobile();
  const { toast } = useToast();
  
  // Reference to audio elements
  const bubbleAudioRef = useRef<HTMLAudioElement | null>(null);
  const hissAudioRef = useRef<HTMLAudioElement | null>(null);
  const explosionAudioRef = useRef<HTMLAudioElement | null>(null);
  const fizzAudioRef = useRef<HTMLAudioElement | null>(null);
  const pouringAudioRef = useRef<HTMLAudioElement | null>(null);
  const smokeAudioRef = useRef<HTMLAudioElement | null>(null);
  const glassBreakAudioRef = useRef<HTMLAudioElement | null>(null);
  const dangerAudioRef = useRef<HTMLAudioElement | null>(null);

  // Create audio elements on mount
  useEffect(() => {
    // Preload audio elements
    const preloadAudio = async () => {
      try {
        const audioFiles = [
          { ref: bubbleAudioRef, path: '/sounds/bubbling.mp3', loop: true },
          { ref: hissAudioRef, path: '/sounds/hissing.mp3', loop: true },
          { ref: explosionAudioRef, path: '/sounds/explosion.mp3', loop: false },
          { ref: fizzAudioRef, path: '/sounds/fizzing.mp3', loop: false },
          { ref: pouringAudioRef, path: '/sounds/pouring.mp3', loop: false },
          { ref: smokeAudioRef, path: '/sounds/smoke.mp3', loop: true },
          { ref: glassBreakAudioRef, path: '/sounds/glass_break.mp3', loop: false },
          { ref: dangerAudioRef, path: '/sounds/danger.mp3', loop: true },
        ];

        for (const { ref, path, loop } of audioFiles) {
          try {
            const audio = new Audio(path);
            await new Promise((resolve, reject) => {
              audio.addEventListener('canplaythrough', resolve, { once: true });
              audio.addEventListener('error', reject, { once: true });
              audio.load();
            });
            audio.loop = loop;
            ref.current = audio;
          } catch (error) {
            console.error(`Failed to load audio file: ${path}`, error);
            throw error;
          }
        }

        console.log("All audio files loaded successfully in FreeMode");
      } catch (error) {
        console.error("Error loading audio files in FreeMode:", error);
        toast({
          variant: "destructive",
          title: t('audio.error.title', 'Audio Error'),
          description: t('audio.error.description', 'Could not load sound effects. The app will continue without sound.'),
        });
        setSoundEnabled(false);
      }
    };
    
    preloadAudio();

    // Cleanup on unmount
    return () => {
      [
        bubbleAudioRef.current, 
        hissAudioRef.current, 
        explosionAudioRef.current, 
        fizzAudioRef.current,
        pouringAudioRef.current,
        smokeAudioRef.current,
        glassBreakAudioRef.current,
        dangerAudioRef.current
      ].forEach(audio => {
        if (audio) {
          try {
            audio.pause();
            audio.currentTime = 0;
          } catch (error) {
            console.error("Error cleaning up audio:", error);
          }
        }
      });
    };
  }, [t, toast]);

  useEffect(() => {
    document.title = "Chemical Lab - Free Reactions";
    
    // Check if user is logged in
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/reactions');
    }
  }, [navigate]);

  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
    
    // Stop all sounds when disabled
    if (soundEnabled) {
      [
        bubbleAudioRef.current, 
        hissAudioRef.current, 
        explosionAudioRef.current, 
        fizzAudioRef.current,
        pouringAudioRef.current,
        smokeAudioRef.current,
        glassBreakAudioRef.current,
        dangerAudioRef.current
      ].forEach(audio => {
        if (audio) {
          try {
            audio.pause();
            audio.currentTime = 0;
          } catch (error) {
            console.error("Error stopping audio:", error);
          }
        }
      });
    } else {
      // Notify user that sound is enabled
      toast({
        title: t('sound.enabled'),
        description: t('sound.enabled.description', 'Sound effects are now enabled.'),
      });
    }
  };
  
  const handleBackToLibrary = () => {
    setIsLoading(true);
    // Add a small delay to show loading
    setTimeout(() => {
      navigate('/reactions');
      setIsLoading(false);
    }, 100);
  };
  
  const handleReload = () => {
    // Show loading indicator
    setIsLoading(true);
    
    // Add a small delay to allow the UI to update
    setTimeout(() => {
      // Reload the current page to reset the state
      window.location.reload();
    }, 300);
    
    // Show toast notification
    toast({
      title: t('reaction.restarting', 'Restarting Reactions'),
      description: t('reaction.restarting.description', 'Reloading the experiment area'),
      duration: 2000,
    });
  };
  
  // Render the FreeMode component
  return (
    <ThemeProvider>
      <SimulationProvider>
        <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 pt-16 relative overflow-hidden">
          <ChemicalBackground />
          <Navbar />
          <div className="container mx-auto px-4 py-4 relative z-10">
            {!isMobile && (
              <div className="flex justify-between items-center mb-6">
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleBackToLibrary}
                    className="flex items-center"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {t('sim.loading', 'Loading...')}
                      </span>
                    ) : (
                      <>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        {t('sim.backToLibrary')}
                      </>
                    )}
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleReload}
                    className="flex items-center"
                    disabled={isLoading}
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    {t('restart', 'Restart')}
                  </Button>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleSound}
                  className="flex items-center"
                  aria-label={soundEnabled ? t('sound.disable', 'Disable sound') : t('sound.enable', 'Enable sound')}
                >
                  {soundEnabled ? (
                    <Volume2 className="w-4 h-4 mr-2" />
                  ) : (
                    <VolumeX className="w-4 h-4 mr-2" />
                  )}
                  {soundEnabled ? t('sound.on', 'Sound On') : t('sound.off', 'Sound Off')}
                </Button>
              </div>
            )}
            
            <motion.h1 
              className="text-2xl md:text-4xl font-bold text-center mb-2 md:mb-4 bg-clip-text text-transparent bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-500"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {t('freemode.title', 'Free Reactions Laboratory')}
            </motion.h1>
            
            {!isMobile && (
              <motion.p
                className="text-center text-muted-foreground max-w-2xl mx-auto mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {t('freemode.description', 'Create your own chemical reactions by combining different substances. Experiment freely!')}
              </motion.p>
            )}
            
            {!isMobile && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="max-w-2xl mx-auto mb-8"
              >
              <Alert
  variant="default"
  className="bg-primary/5 border-primary/20"
  dir={t('direction', 'ltr')} // يحصل على الاتجاه المناسب من ملف الترجمة
>
  <Lightbulb className="h-4 w-4" />
  <AlertTitle>{t('freemode.tips.title', 'Experimentation Tips')}</AlertTitle>
  <AlertDescription className="mt-2">
    <ul className="list-disc list-inside space-y-1 text-sm">
      <li>{t('freemode.tips.combine', 'Combine at least two chemicals to start a reaction')}</li>
      <li>{t('freemode.tips.temperature', 'Adjust temperature to see different reaction results')}</li>
      <li>{t('freemode.tips.states', 'Mix chemicals in different states (solid, liquid, gas) for varied effects')}</li>
      <li>{t('freemode.tips.acid', 'Try acid-base or metal-acid combinations for dramatic reactions')}</li>
      <li>{t('freemode.tips.intense', 'Some intense combinations may even break the test tube!')}</li>
      <li>{t('freemode.tips.quantity', 'Change chemical quantity (ml) to control reaction intensity')}</li>
    </ul>
  </AlertDescription>
</Alert>

              </motion.div>
            )}
          </div>
          <FreeModeSimulation 
            soundEnabled={soundEnabled}
            audioRefs={{
              bubbling: bubbleAudioRef,
              hissing: hissAudioRef,
              explosion: explosionAudioRef,
              fizzing: fizzAudioRef,
              pouring: pouringAudioRef,
              smoke: smokeAudioRef,
              glass_break: glassBreakAudioRef,
              danger: dangerAudioRef
            }}
            showResultsAboveReactants={false}
          />
          
          {isMobile && (
            <MobileControls
              soundEnabled={soundEnabled}
              toggleSound={toggleSound}
              showTips={true}
              backPath="/reactions"
              showReactionControls={false}
            />
          )}
        </div>
      </SimulationProvider>
    </ThemeProvider>
  );
};

export default FreeMode;