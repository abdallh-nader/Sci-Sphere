import React, { useEffect, useRef, useState } from 'react';
import { useSimulation } from '../context/SimulationContext';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from '../utils/i18n';
import TestTube from './TestTube';
import { ReactionControls } from './ReactionControls';
import { Info, AlertCircle, ListChecks, Flame, Snowflake, ChevronsUpDown } from 'lucide-react';
import { chemicals } from '../data/chemicals';
import { motion } from 'framer-motion';
import { Chemical } from '../context/SimulationContext';
import BrokenTestTube from './BrokenTestTube';
import { useToast } from "@/hooks/use-toast";
import ChemicalBottle from './ChemicalBottle';

interface AudioRefs {
  bubbling: React.RefObject<HTMLAudioElement>;
  hissing: React.RefObject<HTMLAudioElement>;
  explosion: React.RefObject<HTMLAudioElement>;
  fizzing: React.RefObject<HTMLAudioElement>;
}

interface SimulationAreaProps {
  autoSelectReaction?: string | null;
  soundEnabled?: boolean;
  audioRefs?: AudioRefs;
  showResultsAboveReactants?: boolean;
  useChemicalBottle?: boolean;
  autoRestoreOnExplosion?: boolean;
  sequentialPouring?: boolean;
}

// This wrapper checks if a SimulationProvider is available
// and renders the component only if it's in the proper context
const SimulationAreaWithProvider = ({ 
  autoSelectReaction, 
  soundEnabled = true, 
  audioRefs, 
  showResultsAboveReactants = true,
  useChemicalBottle = false,
  autoRestoreOnExplosion = false,
  sequentialPouring = false
}: SimulationAreaProps) => {
  try {
    // This will throw if SimulationProvider is not in the component tree
    useSimulation();
    return (
      <SimulationAreaContent 
        autoSelectReaction={autoSelectReaction} 
        soundEnabled={soundEnabled} 
        audioRefs={audioRefs}
        showResultsAboveReactants={showResultsAboveReactants}
        useChemicalBottle={useChemicalBottle}
        autoRestoreOnExplosion={autoRestoreOnExplosion}
        sequentialPouring={sequentialPouring}
      />
    );
  } catch (error) {
    // If SimulationProvider is not available, render nothing
    console.error("SimulationArea must be used within a SimulationProvider", error);
    return null;
  }
};

const SimulationAreaContent = ({ 
  autoSelectReaction, 
  soundEnabled = true, 
  audioRefs, 
  showResultsAboveReactants = true,
  useChemicalBottle = false,
  autoRestoreOnExplosion = false,
  sequentialPouring = false
}: SimulationAreaProps) => {
  const { 
    selectedReaction, 
    reactionResult, 
    selectedChemicals,
    addChemical,
    selectReaction,
    clearTestTube,
    stopReaction,
    isReacting,
    startReaction
  } = useSimulation();
  const { language } = useTheme();
  const { t } = useTranslation();
  const { toast } = useToast();
  
  // Manage the tube breaking state
  const [tubeIsBroken, setTubeIsBroken] = useState(false);
  const [isLoadingReactants, setIsLoadingReactants] = useState(false);
  
  // For chemical bottle pouring animation
  const [isPouringChemical, setIsPouringChemical] = useState(false);
  const [currentChemicalIndex, setCurrentChemicalIndex] = useState(-1);
  const [currentPouringChemical, setCurrentPouringChemical] = useState<Chemical | null>(null);
  
  // Determine state change description
  const getStateChangeDescription = () => {
    if (!reactionResult || !isReacting) return '';
    
    let newState = '';
    
    if (reactionResult.hasGas || reactionResult.hasBubbles) {
      newState = t('state.gas');
    } else if (reactionResult.hasPrecipitate || reactionResult.hasIce) {
      newState = t('state.solid');
    } else {
      newState = t('state.liquid');
    }
    
    return t('state.change.description', 'Reactants transformed into {{state}} state', { state: newState });
  };
  
  const stateChangeDescription = getStateChangeDescription();
  const showStateChanges = Boolean(reactionResult && isReacting);
  
  // Handle sequential pouring of chemicals
  useEffect(() => {
    if (!selectedReaction || selectedChemicals.length > 0 || !sequentialPouring) {
      return;
    }

    if (selectedReaction.reactants.length > 0 && currentChemicalIndex === -1 && !isPouringChemical) {
      console.log("Starting sequential pouring...");
      setCurrentChemicalIndex(0);
    }
  }, [selectedReaction, selectedChemicals.length, currentChemicalIndex, isPouringChemical, sequentialPouring]);

  // Handle pouring the current chemical
  useEffect(() => {
    if (!selectedReaction || !sequentialPouring || currentChemicalIndex === -1 || isPouringChemical) {
      return;
    }

    if (currentChemicalIndex < selectedReaction.reactants.length) {
      const reactantId = selectedReaction.reactants[currentChemicalIndex];
      const chemical = chemicals.find(c => c.id === reactantId);
      
      if (chemical) {
        console.log(`Pouring chemical ${currentChemicalIndex + 1}/${selectedReaction.reactants.length}: ${chemical.name}`);
        setCurrentPouringChemical(chemical);
        setIsPouringChemical(true);
      } else {
        // Skip missing chemicals
        setCurrentChemicalIndex(prev => prev + 1);
      }
    } else {
      // All chemicals have been poured
      setCurrentChemicalIndex(-1);
    }
  }, [currentChemicalIndex, selectedReaction, isPouringChemical, sequentialPouring]);

  // Handle when chemical pouring is complete
  const handlePourComplete = () => {
    if (currentPouringChemical && selectedReaction) {
      console.log(`Finished pouring: ${currentPouringChemical.name}`);
      addChemical(currentPouringChemical.id);
      setIsPouringChemical(false);
      setCurrentPouringChemical(null);
      setCurrentChemicalIndex(prev => prev + 1);
    }
  };
  
  useEffect(() => {
    const cleanupReaction = () => {
      clearTestTube();
      setIsLoadingReactants(false);
      // Reset pouring state
      setCurrentChemicalIndex(-1);
      setIsPouringChemical(false);
      setCurrentPouringChemical(null);
    };

    cleanupReaction();
    
    console.log('SimulationArea mounted, autoSelectReaction:', autoSelectReaction);
    
    return cleanupReaction;
  }, [clearTestTube]);
  
  useEffect(() => {
    if (autoSelectReaction && typeof autoSelectReaction === 'string') {
      console.log('Auto-selecting reaction:', autoSelectReaction);
      selectReaction(autoSelectReaction);
    }
  }, [autoSelectReaction, selectReaction]);
  
  useEffect(() => {
    if (selectedReaction && !isReacting && selectedChemicals.length === 0 && !sequentialPouring) {
      console.log('Adding reactants for reaction:', selectedReaction.id);
      // Add reactants without loading indicator
      selectedReaction.reactants.forEach(reactantId => {
        console.log('Adding reactant:', reactantId);
        addChemical(reactantId);
      });
    }
  }, [selectedReaction, selectedChemicals.length, isReacting, addChemical, sequentialPouring]);

  // Handle tube breaking for explosion reactions
  useEffect(() => {
    if (reactionResult && isReacting && reactionResult.hasExplosion) {
      // Set a delay before showing the broken tube
      const explosionTimer = setTimeout(() => {
        setTubeIsBroken(true);
        if (soundEnabled && audioRefs?.explosion.current) {
          audioRefs.explosion.current.volume = 0.7;
          audioRefs.explosion.current.play().catch(e => console.log('Could not play sound:', e));
        }
      }, 1500);
      
      // Stop the reaction after a delay
      const stopTimer = setTimeout(() => {
        stopReaction();
      }, 8000);
      
      return () => {
        clearTimeout(explosionTimer);
        clearTimeout(stopTimer);
      };
    } else if (!isReacting) {
      // Reset broken state when reaction stops
      setTubeIsBroken(false);
    }
  }, [reactionResult, isReacting, stopReaction, soundEnabled, audioRefs]);
  
  useEffect(() => {
    if (!soundEnabled || !audioRefs || !reactionResult) return;
    
    // Reset all sounds
    Object.values(audioRefs).forEach(audioRef => {
      if (audioRef.current) {
        audioRef.current.pause();
        if (audioRef.current.currentTime) {
          audioRef.current.currentTime = 0;
        }
      }
    });
    
    if (isReacting && reactionResult) {
      if (reactionResult.hasExplosion && audioRefs.explosion.current) {
        audioRefs.explosion.current.volume = 0.7;
        audioRefs.explosion.current.play().catch(e => console.log('Could not play sound:', e));
      } else if (reactionResult.hasSmoke && audioRefs.hissing.current) {
        audioRefs.hissing.current.volume = 0.5;
        audioRefs.hissing.current.play().catch(e => console.log('Could not play sound:', e));
      } else if (reactionResult.hasBubbles && audioRefs.bubbling.current) {
        audioRefs.bubbling.current.volume = 0.4;
        audioRefs.bubbling.current.play().catch(e => console.log('Could not play sound:', e));
      } else if (audioRefs.fizzing.current) {
        audioRefs.fizzing.current.volume = 0.3;
        audioRefs.fizzing.current.play().catch(e => console.log('Could not play sound:', e));
      }
    }
    
    return () => {
      if (soundEnabled && audioRefs) {
        Object.values(audioRefs).forEach(audioRef => {
          if (audioRef.current) {
            audioRef.current.pause();
            if (audioRef.current.currentTime) {
              audioRef.current.currentTime = 0;
            }
          }
        });
      }
    };
  }, [isReacting, reactionResult, soundEnabled, audioRefs]);
  
  const generateChemicalEquation = () => {
    if (!selectedReaction) return '';
    
    const reactants = selectedReaction.reactants.map(id => {
      const chemical = chemicals.find(c => c.id === id);
      return chemical?.formula || id.toUpperCase();
    }).join(' + ');
    
    const products = selectedReaction.products.map(id => {
      const chemical = chemicals.find(c => c.id === id);
      return chemical?.formula || id.toUpperCase();
    }).join(' + ');
    
    return `${reactants} → ${products}`;
  };
  
  const getReactantDetails = () => {
    if (!selectedReaction) return [];
    
    return selectedReaction.reactants.map(id => {
      const chemical = chemicals.find(c => c.id === id);
      return chemical ? {
        id: chemical.id,
        name: language === 'en' ? chemical.name : chemical.nameAr,
        state: chemical.state,
        color: chemical.color,
        formula: chemical.formula || chemical.id
      } : null;
    }).filter(Boolean);
  };
  
  const reactantDetails = getReactantDetails();
  
  // Add a function to start the reaction
  const handleStartReaction = () => {
    if (selectedReaction && selectedChemicals.length > 0) {
      console.log("Starting reaction now...");
      startReaction();
      toast({
        title: t('reaction.started', 'Reaction Started'),
        description: t('reaction.in.progress', 'Chemical reaction is in progress'),
        duration: 3000,
      });
    } else {
      toast({
        title: t('error'),
        description: t('reaction.noChemicals', 'No chemicals available for reaction'),
        variant: "destructive"
      });
    }
  };
  
  // Add a function to reset the reaction
  const handleResetReaction = () => {
    console.log("Resetting reaction...");
    clearTestTube();
    // Reset pouring state
    setCurrentChemicalIndex(-1);
    setIsPouringChemical(false);
    setCurrentPouringChemical(null);
    toast({
      title: t('reaction.reset', 'Reset Complete'),
      description: t('reaction.reset.description', 'Test tube has been cleared'),
      duration: 3000,
    });
  };
  
  // Add a function to stop the reaction
  const handleStopReaction = () => {
    console.log("Stopping reaction...");
    stopReaction();
    toast({
      title: t('reaction.stopped', 'Reaction Stopped'),
      description: t('reaction.completed', 'Chemical reaction has been stopped'),
      duration: 3000,
    });
  };
  
  return (
    <div className="container mx-auto px-4 py-6 relative z-10" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <motion.div 
            className="glass rounded-xl p-6 shadow-lg h-full flex flex-col"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex-1 flex items-center justify-center relative min-h-[400px]">
              <motion.div 
                className="relative"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                {/* Chemical Bottle for pouring (conditionally rendered) */}
                {currentPouringChemical && isPouringChemical && (
                  <ChemicalBottle 
                    chemical={currentPouringChemical} 
                    isPouring={isPouringChemical} 
                    onPourComplete={handlePourComplete}
                  />
                )}
                
                {tubeIsBroken ? (
                  <BrokenTestTube 
                    width={120} 
                    height={350}
                    color={reactionResult?.color || "#cccccc"}
                  />
                ) : (
                  <TestTube 
                    width={120} 
                    height={350} 
                    substances={isReacting && reactionResult ? [
                      { 
                        substance: {
                          id: "reaction-result",
                          name: "Reaction Result",
                          nameAr: "نتيجة التفاعل",
                          color: reactionResult.color || "#cccccc",
                          state: reactionResult.hasGas ? "gas" : reactionResult.hasPrecipitate ? "solid" : "liquid",
                          density: 1
                        },
                        volume: selectedChemicals.reduce((sum, chem) => sum + (chem.quantity || 1) * 10, 0)
                      }
                    ] : selectedChemicals.map(chem => ({
                      substance: chem,
                      volume: (chem.quantity || 1) * 10
                    }))}
                    showBubbles={reactionResult?.hasBubbles}
                    showSmoke={reactionResult?.hasSmoke}
                    showFire={reactionResult?.hasFire}
                    showExplosion={reactionResult?.hasExplosion && !tubeIsBroken}
                    shake={isReacting}
                    glow={reactionResult?.hasGlow}
                    glowColor={reactionResult?.glowColor}
                    intensity={reactionResult?.intensity || 1}
                  />
                )}
                
                {selectedChemicals.length === 0 && !isReacting && !selectedReaction && !isLoadingReactants && !isPouringChemical && (
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-muted-foreground p-4 rounded-lg bg-background/50 backdrop-blur-sm animate-fade-in max-w-[200px]">
                    <AlertCircle className="w-6 h-6 mx-auto mb-2" />
                    <p className="text-sm">
                      {t('select.reaction')}
                    </p>
                  </div>
                )}
              </motion.div>
            </div>
            
            {/* Conditionally render reaction result based on showResultsAboveReactants */}
            {reactionResult && !showResultsAboveReactants && (
              <motion.div 
                className="mt-6 p-4 rounded-lg bg-primary/10"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <h3 className="text-lg font-medium mb-2">
                  {t('sim.result')}
                </h3>
                
                {selectedReaction && (
                  <div className="p-2 mb-3 bg-background/40 rounded-md text-center">
                    <p className="font-mono text-lg">
                      {generateChemicalEquation()}
                    </p>
                  </div>
                )}
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: reactionResult.color }}
                    ></div>
                    <span className="text-sm">
                      {t('color.change')}
                    </span>
                  </div>
                  
                  {reactionResult.temperatureChange !== 'none' && (
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-full ${
                        reactionResult.temperatureChange === 'increase'
                          ? 'bg-red-500'
                          : 'bg-blue-500'
                      }`}></div>
                      <span className="text-sm">
                        {reactionResult.temperatureChange === 'increase'
                          ? t('temperature.increase')
                          : t('temperature.decrease')
                        }
                      </span>
                    </div>
                  )}
                  
                  {reactionResult.hasBubbles && (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-white/70"></div>
                      <span className="text-sm">
                        {t('gas.bubbles')}
                      </span>
                    </div>
                  )}
                  
                  {reactionResult.hasPrecipitate && (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-gray-300"></div>
                      <span className="text-sm">
                        {t('precipitate')}
                      </span>
                    </div>
                  )}
                  
                  {reactionResult.hasSmoke && (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-gray-400"></div>
                      <span className="text-sm">
                        {t('smoke.vapor')}
                      </span>
                    </div>
                  )}
                  
                  {reactionResult.hasFire && (
                    <div className="flex items-center gap-2">
                      <Flame className="w-4 h-4 text-orange-500" />
                      <span className="text-sm">
                        {t('fire.effect')}
                      </span>
                    </div>
                  )}
                  
                  {reactionResult.hasIce && (
                    <div className="flex items-center gap-2">
                      <Snowflake className="w-4 h-4 text-blue-400" />
                      <span className="text-sm">
                        {t('ice.effect')}
                      </span>
                    </div>
                  )}
                  
                  {reactionResult.hasGlow && (
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-4 h-4 rounded-full animate-pulse"
                        style={{ 
                          backgroundColor: reactionResult.glowColor || '#ffff00',
                          boxShadow: `0 0 5px 2px ${reactionResult.glowColor || '#ffff00'}`
                        }}
                      ></div>
                      <span className="text-sm">
                        {t('glow.effect')}
                      </span>
                    </div>
                  )}
                  
                  {reactionResult.hasExplosion && (
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-4 h-4 rounded-full bg-orange-600"
                      ></div>
                      <span className="text-sm">
                        {t('explosion.effect')}
                      </span>
                    </div>
                  )}
                  
                  {/* State change display - Make it prominent at the top of the results */}
                  <div className="col-span-4 mb-4 bg-background/60 p-3 rounded-md border border-primary/20 flex items-center justify-center gap-2">
                    <ChevronsUpDown className="w-5 h-5 text-primary" />
                    <span className="text-sm font-medium">
                      {stateChangeDescription ? stateChangeDescription : t('state.analyzing', 'Analyzing state changes...')}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
            
            {/* Show reactant details */}
            {selectedReaction && (
              <motion.div 
                className="mt-6 p-4 rounded-lg bg-primary/10"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <Info className="w-5 h-5" />
                  {language === 'en' ? selectedReaction.name : selectedReaction.nameAr}
                </h3>
                <p className="text-sm mt-2 text-muted-foreground">
                  {language === 'en' ? selectedReaction.description : selectedReaction.descriptionAr}
                </p>
                
                <div className="mt-3 p-2 bg-background/40 rounded-md text-center">
                  <p className="font-mono text-lg">
                    {generateChemicalEquation()}
                  </p>
                </div>
                
                {reactantDetails.length > 0 && (
                  <div className="mt-4 border-t border-primary/20 pt-3">
                    <h4 className="text-sm font-medium flex items-center mb-2 gap-2">
                      <ListChecks className="w-4 h-4" />
                      {t('reactants')}:
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {reactantDetails.map((chemical) => (
                        <div key={chemical.id} className="flex items-center p-2 rounded-md bg-background/40 gap-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: chemical.color }}
                          ></div>
                          <div>
                            <div className="text-sm font-medium">{chemical.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {chemical.formula && <span className="font-mono mr-2">{chemical.formula}</span>}
                              {t('state')}: {language === 'en' 
                                ? chemical.state.charAt(0).toUpperCase() + chemical.state.slice(1)
                                : t(`state.${chemical.state}`)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
            
            {/* Conditionally render reaction result based on showResultsAboveReactants */}
            {reactionResult && showResultsAboveReactants && (
              <motion.div 
                className="mt-6 p-4 rounded-lg bg-primary/10"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <h3 className="text-lg font-medium mb-2">
                  {t('sim.result')}
                </h3>
                
                {selectedReaction && (
                  <div className="p-2 mb-3 bg-background/40 rounded-md text-center">
                    <p className="font-mono text-lg">
                      {generateChemicalEquation()}
                    </p>
                  </div>
                )}
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: reactionResult.color }}
                    ></div>
                    <span className="text-sm">
                      {t('color.change')}
                    </span>
                  </div>
                  
                  {/* Include all the condition checks for different reaction properties */}
                  
                  {/* State change display - Make it prominent at the top of the results */}
                  <div className="col-span-4 mb-4 bg-background/60 p-3 rounded-md border border-primary/20 flex items-center justify-center gap-2">
                    <ChevronsUpDown className="w-5 h-5 text-primary" />
                    <span className="text-sm font-medium">
                      {stateChangeDescription ? stateChangeDescription : t('state.analyzing', 'Analyzing state changes...')}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
        
        <div className="lg:col-span-1">
          <ReactionControls 
            soundEnabled={soundEnabled}
            audioRefs={audioRefs}
          />
        </div>
      </div>
    </div>
  );
};

// Export the wrapper component instead of the content directly
export const SimulationArea = SimulationAreaWithProvider;
export default SimulationArea;
