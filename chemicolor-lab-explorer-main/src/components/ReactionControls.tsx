
import { useTheme } from '../context/ThemeContext';
import { useSimulation } from '../context/SimulationContext';
import { useTranslation } from '../utils/i18n';
import { 
  Beaker, 
  RefreshCw,
  Play,
  Square,
  Filter,
  Thermometer,
  Gauge,
  AlertTriangle,
  Droplets
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useEffect, useState, RefObject } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Slider } from "@/components/ui/slider";
import { chemicals } from '../data/chemicals';
import { toast } from '@/hooks/use-toast';

interface AudioRefs {
  bubbling: RefObject<HTMLAudioElement>;
  hissing: RefObject<HTMLAudioElement>;
  explosion: RefObject<HTMLAudioElement>;
  fizzing: RefObject<HTMLAudioElement>;
}

interface ReactionControlsProps {
  soundEnabled?: boolean;
  audioRefs?: AudioRefs;
}

export const ReactionControls = ({ soundEnabled = true, audioRefs }: ReactionControlsProps) => {
  const { language } = useTheme();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { 
    selectedReaction,
    selectedChemicals,
    clearTestTube,
    startReaction,
    stopReaction,
    isReacting,
    reactionResult,
    temperature,
    setTemperature,
    pressure,
    setPressure
  } = useSimulation();
  
  const [showResults, setShowResults] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  
  // Make sure i18n language is synced with our ThemeContext language
  useEffect(() => {
    if (i18n.language !== language) {
      i18n.changeLanguage(language);
    }
  }, [language, i18n]);
  
  // Show the results panel when a reaction completes
  useEffect(() => {
    if (reactionResult) {
      setShowResults(true);
    }
  }, [reactionResult]);
  
  // Handle sound effects
  useEffect(() => {
    if (!soundEnabled || !audioRefs || !reactionResult) return;
    
    // Stop all sounds first
    Object.values(audioRefs).forEach(ref => {
      if (ref.current) {
        ref.current.pause();
        if (ref.current.currentTime) {
          ref.current.currentTime = 0;
        }
      }
    });
    
    // Play appropriate sound based on reaction result
    if (isReacting && reactionResult) {
      if (reactionResult.soundEffect === 'explosion' && audioRefs.explosion.current) {
        audioRefs.explosion.current.volume = 0.7;
        audioRefs.explosion.current.play().catch(e => console.log('Could not play sound:', e));
      } else if (reactionResult.soundEffect === 'hissing' && audioRefs.hissing.current) {
        audioRefs.hissing.current.volume = 0.5;
        audioRefs.hissing.current.play().catch(e => console.log('Could not play sound:', e));
      } else if (reactionResult.soundEffect === 'bubbling' && audioRefs.bubbling.current) {
        audioRefs.bubbling.current.volume = 0.4;
        audioRefs.bubbling.current.play().catch(e => console.log('Could not play sound:', e));
      } else if (reactionResult.soundEffect === 'fizzing' && audioRefs.fizzing.current) {
        audioRefs.fizzing.current.volume = 0.3;
        audioRefs.fizzing.current.play().catch(e => console.log('Could not play sound:', e));
      }
    }
    
    return () => {
      // Cleanup sounds when component unmounts or effect re-runs
      if (soundEnabled && audioRefs) {
        Object.values(audioRefs).forEach(ref => {
          if (ref.current) {
            ref.current.pause();
            if (ref.current.currentTime) {
              ref.current.currentTime = 0;
            }
          }
        });
      }
    };
  }, [isReacting, reactionResult, soundEnabled, audioRefs]);
  
  const handleResetAndGoToFreeReactions = () => {
    clearTestTube();
    navigate('/free-mode');
  };
  
  const handleBackToReactions = () => {
    clearTestTube();
    navigate('/reactions');
  };
  
  const handleToggleReaction = async () => {
    if (isReacting) {
      stopReaction();
      toast({
        title: t('reaction.stopped', 'Reaction Stopped'),
        description: t('reaction.completed', 'Chemical reaction has been stopped'),
        duration: 3000,
      });
    } else {
      try {
        setIsStarting(true);
        // Add a small delay before starting the reaction to give UI time to update
        await new Promise(resolve => setTimeout(resolve, 100));
        startReaction();
        
        // Display toast notification
        toast({
          title: t('reaction.started', 'Reaction Started'),
          description: t('reaction.in.progress', 'Chemical reaction is in progress'),
          duration: 3000,
        });
      } catch (error) {
        console.error('Error starting reaction:', error);
        toast({
          variant: "destructive",
          title: t('error.occurred', 'Error'),
          description: t('reaction.failed', 'Failed to start reaction'),
        });
      } finally {
        setIsStarting(false);
      }
    }
  };
  
  // Function to handle reset
  const handleReset = () => {
    clearTestTube();
    setShowResults(false);
    toast({
      title: t('reaction.reset', 'Reset Complete'),
      description: t('reaction.reset.description', 'Test tube has been cleared'),
      duration: 3000,
    });
  };
  
  // Get reactant details for display
  const getReactantDetails = () => {
    if (!selectedChemicals.length) return [];
    
    return selectedChemicals.map(chem => ({
      id: chem.id,
      name: language === 'en' ? chem.name : chem.nameAr,
      state: chem.state,
      color: chem.color,
      quantity: chem.quantity || 1
    }));
  };
  
  const reactantDetails = getReactantDetails();
  
  // Check for dangerous reaction
  const isDangerousReaction = reactionResult && (
    reactionResult.hasFire || 
    reactionResult.hasExplosion || 
    reactionResult.temperature > 100
  );
  
  // Check if we can start a reaction
  const canStartReaction = selectedChemicals.length >= 2 && !isReacting;
  
  return (
    <div 
      className={`glass rounded-xl p-6 shadow-lg transition-all duration-300 ${
        language === 'ar' ? 'rtl' : 'ltr'
      }`}
    >
      <div className="space-y-6">
        {/* Reaction Information */}
        <div>
          <h3 className={`text-lg font-medium mb-3 flex items-center ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
            <Beaker className={`w-5 h-5 ${language === 'ar' ? 'ml-2' : 'mr-2'}`} />
            {selectedReaction !== null 
              ? (language === 'en' ? selectedReaction.name : selectedReaction.nameAr)
              : t('sim.choose.reaction')}
          </h3>
          
          {/* Show current chemicals in test tube */}
          {reactantDetails.length > 0 && (
            <div className="mb-4 p-3 rounded-md bg-secondary/10">
              <h4 className="text-sm font-medium mb-2">
                {t('sim.chemicals.added', 'Chemicals Added')}:
              </h4>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {reactantDetails.map((chem) => (
                  <div key={chem.id} className="flex items-center text-sm">
                    <div 
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: chem.color }}
                    ></div>
                    <span className="flex-1 truncate">{chem.name}</span>
                    <span className="text-xs text-muted-foreground flex items-center">
                      <Droplets className="w-3 h-3 mr-1" />
                      {chem.quantity} ml
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Temperature and Pressure Controls */}
          <div className="space-y-3 mb-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm flex items-center">
                  <Thermometer className="w-4 h-4 mr-1" />
                  {t('sim.temperature', 'Temperature')}: {temperature}°C
                </label>
                <span className="text-xs text-muted-foreground">
                  {temperature < 10 ? t('sim.cold') : 
                   temperature > 90 ? t('sim.hot') : 
                   t('sim.ambient')}
                </span>
              </div>
              <Slider
                value={[temperature]}
                min={0}
                max={150}
                step={1}
                onValueChange={(value) => setTemperature(value[0])}
                disabled={isReacting}
              />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm flex items-center">
                  <Gauge className="w-4 h-4 mr-1" />
                  {t('sim.pressure', 'Pressure')}: {pressure} atm
                </label>
              </div>
              <Slider
                value={[pressure]}
                min={0.1}
                max={5}
                step={0.1}
                onValueChange={(value) => setPressure(value[0])}
                disabled={isReacting}
              />
            </div>
          </div>
          
          <div className="space-y-3">
            {/* Reaction Control Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <Button
                        variant={isReacting ? "destructive" : "glow"}
                        className={`w-full ${language === 'ar' ? 'flex-row-reverse' : ''}`}
                        onClick={handleToggleReaction}
                        disabled={!canStartReaction && !isReacting}
                      >
                        {isReacting ? (
                          <>
                            <Square className={`w-4 h-4 ${language === 'ar' ? 'ml-2' : 'mr-2'}`} />
                            {t('reaction.stop', 'Stop Reaction')}
                          </>
                        ) : isStarting ? (
                          <span className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            {t('reaction.starting', 'Starting Reaction...')}
                          </span>
                        ) : (
                          <>
                            <Play className={`w-4 h-4 ${language === 'ar' ? 'ml-2' : 'mr-2'}`} />
                            {t('reaction.start', 'Start Reaction')}
                          </>
                        )}
                      </Button>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    {selectedChemicals.length < 2 && !isReacting
                      ? t('reaction.need.two.chemicals', 'Need at least two chemicals') 
                      : isReacting 
                        ? t('reaction.stop.tooltip', 'Stop the current reaction') 
                        : t('reaction.start.tooltip', 'Begin the chemical reaction')}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      className={`w-full ${language === 'ar' ? 'flex-row-reverse' : ''}`}
                      onClick={handleReset}
                      disabled={isReacting || selectedChemicals.length === 0}
                    >
                      <RefreshCw className={`w-4 h-4 ${language === 'ar' ? 'ml-2' : 'mr-2'}`} />
                      {t('reaction.reset', 'Reset')}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {t('reaction.reset.tooltip', 'Clear all chemicals')}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              {isDangerousReaction && isReacting && (
                <Button
                  variant="destructive"
                  className="w-full mt-1 col-span-2 animate-pulse"
                  onClick={stopReaction}
                >
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  {t('reaction.emergency.stop', 'Emergency Stop!')}
                </Button>
              )}
            </div>
            
            {/* Navigation Buttons */}
            <Button
              variant="outline"
              className={`w-full ${language === 'ar' ? 'flex-row-reverse' : ''}`}
              onClick={handleBackToReactions}
            >
              <Filter className={`w-4 h-4 ${language === 'ar' ? 'ml-2' : 'mr-2'}`} />
              {t('sim.backToLibrary')}
            </Button>
            
            <Button
              variant="gradient"
              className={`w-full ${language === 'ar' ? 'flex-row-reverse' : ''}`}
              onClick={handleResetAndGoToFreeReactions}
            >
              <Beaker className={`w-4 h-4 ${language === 'ar' ? 'ml-2' : 'mr-2'}`} />
              {t('sim.goToFreeReactions', 'Free Reactions')}
            </Button>
          </div>
        </div>
        
        {/* Reaction Result Information */}
        {showResults && reactionResult && (
          <div className="mt-4 p-3 rounded-md bg-primary/10 animate-fade-in">
            <h4 className="text-sm font-medium mb-2 flex items-center">
              <Beaker className="w-4 h-4 mr-2" />
              {t('sim.reaction.result', 'Reaction Result')}
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: reactionResult.color }}
                ></div>
                <span>{t('sim.resulting.color', 'Resulting Color')}</span>
              </div>
              
              {reactionResult.temperatureChange !== 'none' && (
                <div className="flex items-center">
                  <Thermometer className={`w-3 h-3 mr-2 ${
                    reactionResult.temperatureChange === 'increase' ? 'text-red-500' : 'text-blue-500'
                  }`} />
                  <span>
                    {reactionResult.temperatureChange === 'increase'
                      ? t('sim.temp.increased', 'Temperature increased')
                      : t('sim.temp.decreased', 'Temperature decreased')}
                    {' '}({reactionResult.temperature.toFixed(1)}°C)
                  </span>
                </div>
              )}
              
              {reactionResult.hasBubbles && (
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-2 bg-gray-300"></div>
                  <span>{t('sim.gas.released', 'Gas released')}</span>
                </div>
              )}
              
              {reactionResult.hasPrecipitate && (
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-2 bg-gray-400"></div>
                  <span>{t('sim.precipitate.formed', 'Precipitate formed')}</span>
                </div>
              )}
              
              {reactionResult.hasSmoke && (
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-2 bg-gray-500"></div>
                  <span>{t('sim.smoke.produced', 'Vapor/smoke produced')}</span>
                </div>
              )}
              
              {reactionResult.hasFire && (
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-2 bg-orange-500"></div>
                  <span>{t('sim.fire.produced', 'Fire produced')}</span>
                </div>
              )}
              
              {reactionResult.hasExplosion && (
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-2 bg-red-600"></div>
                  <span>{t('sim.explosion.produced', 'Explosion occurred')}</span>
                </div>
              )}
              
              {reactionResult.hasIce && (
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-2 bg-blue-300"></div>
                  <span>{t('sim.freezing.produced', 'Freezing occurred')}</span>
                </div>
              )}
              
              {reactionResult.formula && (
                <div className="mt-2 p-2 bg-background/50 rounded-md text-sm font-mono">
                  {reactionResult.formula}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
