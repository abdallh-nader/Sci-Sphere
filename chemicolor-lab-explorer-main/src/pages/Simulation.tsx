
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import SimulationArea from '../components/SimulationArea';
import { ThemeProvider } from '../context/ThemeContext';
import { SimulationProvider } from '../context/SimulationContext';
import { ChemicalBackground } from '../components/ChemicalBackground';
import { motion } from 'framer-motion';
import { useTranslation } from '../utils/i18n';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Beaker, Volume2, VolumeX, RefreshCcw } from 'lucide-react';
import { useState, useRef } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileControls from '../components/MobileControls';
import MobileReactionControls from '../components/MobileReactionControls';

const Simulation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const reactionId = queryParams.get('reaction');
  const { t } = useTranslation();
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const isMobile = useIsMobile();
  
  // Reference to audio elements
  const bubbleAudioRef = useRef<HTMLAudioElement | null>(null);
  const hissAudioRef = useRef<HTMLAudioElement | null>(null);
  const explosionAudioRef = useRef<HTMLAudioElement | null>(null);
  const fizzAudioRef = useRef<HTMLAudioElement | null>(null);
  
  // Create audio elements on mount
  useEffect(() => {
    // Create audio elements with proper error handling and preloading
    try {
      // Create and initialize audio elements
      bubbleAudioRef.current = new Audio('/sounds/bubbling.mp3');
      hissAudioRef.current = new Audio('/sounds/hissing.mp3');
      explosionAudioRef.current = new Audio('/sounds/explosion.mp3');
      fizzAudioRef.current = new Audio('/sounds/fizzing.mp3');
      
      // Set loop for continuous sounds
      if (bubbleAudioRef.current) bubbleAudioRef.current.loop = true;
      if (hissAudioRef.current) hissAudioRef.current.loop = true;
      
      // Pre-load all audio files
      const audioElements = [
        bubbleAudioRef.current,
        hissAudioRef.current,
        explosionAudioRef.current,
        fizzAudioRef.current
      ];
      
      audioElements.forEach(audio => {
        if (audio) {
          // Using the load method to preload the audio
          audio.load();
          // Setting volume to 0 and playing briefly to help with mobile devices
          audio.volume = 0;
          const playPromise = audio.play();
          
          if (playPromise !== undefined) {
            playPromise.then(() => {
              audio.pause();
              audio.currentTime = 0;
              console.log("Audio preloaded successfully");
            }).catch(e => {
              console.warn("Audio preload failed, likely requires user interaction:", e);
            });
          }
        }
      });
      
      console.log("All audio files initialized");
    } catch (error) {
      console.error("Error initializing audio files:", error);
    }

    // Cleanup on unmount
    return () => {
      [
        bubbleAudioRef.current, 
        hissAudioRef.current, 
        explosionAudioRef.current, 
        fizzAudioRef.current
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
  }, []);
  
  useEffect(() => {
    document.title = "Chemical Lab - Simulation";
    
    // Check if user is logged in
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/reactions');
    }
  }, [navigate]);
  
  // Handle navigation to free reactions
  const handleGoToFreeReactions = () => {
    setIsLoading(true);
    // Add a small delay to allow for visual loading state to show
    setTimeout(() => {
      navigate('/free-mode');
      setIsLoading(false);
    }, 100);
  };
  
  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
    
    // Stop all sounds when disabled
    if (soundEnabled) {
      [
        bubbleAudioRef.current, 
        hissAudioRef.current, 
        explosionAudioRef.current, 
        fizzAudioRef.current
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
    }
  };
  
  return (
    <ThemeProvider>
      <SimulationProvider>
        <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 pt-16 relative overflow-hidden">
          <ChemicalBackground />
          <Navbar />
          <div className="container mx-auto px-4 py-4 relative z-10">
            {!isMobile && (
              <div className="flex justify-between items-center mb-6">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => navigate('/reactions')}
                  className="flex items-center"
                  disabled={isLoading}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {t('sim.backToLibrary')}
                </Button>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleSound}
                    className="flex items-center"
                    disabled={isLoading}
                  >
                    {soundEnabled ? (
                      <Volume2 className="w-4 h-4 mr-2" />
                    ) : (
                      <VolumeX className="w-4 h-4 mr-2" />
                    )}
                    {soundEnabled ? t('sound.on', 'Sound On') : t('sound.off', 'Sound Off')}
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleGoToFreeReactions}
                    className="flex items-center"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {t('sim.loading', 'Loading...')}
                      </span>
                    ) : (
                      <>
                        <Beaker className="w-4 h-4 mr-2" />
                        {t('sim.goToFreeReactions', 'Free Reactions')}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
            
            <motion.h1 
              className="text-2xl md:text-4xl font-bold text-center mb-2 md:mb-4 bg-clip-text text-transparent bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-500"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {t('sim.title')}
            </motion.h1>
            
            {!isMobile && (
              <motion.p
                className="text-center text-muted-foreground max-w-2xl mx-auto mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {t('sim.description', 'Watch chemical reactions unfold with realistic simulations. Select a reaction to begin.')}
              </motion.p>
            )}
          </div>
          <SimulationArea 
            autoSelectReaction={reactionId} 
            soundEnabled={soundEnabled}
            audioRefs={{
              bubbling: bubbleAudioRef,
              hissing: hissAudioRef,
              explosion: explosionAudioRef,
              fizzing: fizzAudioRef
            }}
            showResultsAboveReactants={false}
            useChemicalBottle={true}
            autoRestoreOnExplosion={true}
            sequentialPouring={true} // Enable sequential pouring for prepared reactions
          />
          
          {isMobile && (
            <MobileControls
              soundEnabled={soundEnabled}
              toggleSound={toggleSound}
              backPath="/reactions"
              showTips={false}
              onResetSimulation={() => {
                // The reset functionality will be handled within SimulationArea
                // This is a placeholder for the interface
                const event = new CustomEvent('reset-simulation');
                document.dispatchEvent(event);
              }}
            />
          )}
        </div>
      </SimulationProvider>
    </ThemeProvider>
  );
};

export default Simulation;
