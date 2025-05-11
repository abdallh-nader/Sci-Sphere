
import { useState, useEffect } from 'react';
import { useSimulation } from '../context/SimulationContext';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from '../utils/i18n';
import { motion } from 'framer-motion';
import { 
  Beaker, 
  CirclePlay,
  CircleStop,
  Trash2, 
  Plus,
  RefreshCw 
} from 'lucide-react';
import { chemicals } from '../data/chemicals';
import { Chemical } from '../context/SimulationContext';
import { Button } from "@/components/ui/button";
import { useIsMobile } from '@/hooks/use-mobile';
import { useToast } from '@/hooks/use-toast';
import MobileReactionControls from './MobileReactionControls';
import ChemicalSelector from './ChemicalSelector';
import ChemicalList from './ChemicalList';
import ReactionParameters from './ReactionParameters';
import ReactionResults from './ReactionResults';
import TestTubeVisualization from './TestTubeVisualization';

interface ChemicalWithQuantity extends Chemical {
  quantity: number;
}

interface FreeModeSimulationProps {
  showResultsAboveReactants?: boolean;
}

export const FreeModeSimulation = ({ 
  showResultsAboveReactants = false 
}: FreeModeSimulationProps) => {
  const { language } = useTheme();
  const { t } = useTranslation();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const { 
    selectedChemicals,
    addChemical,
    clearTestTube,
    temperature,
    setTemperature,
    pressure,
    setPressure,
    isReacting,
    startReaction,
    stopReaction,
    reactionResult
  } = useSimulation();
  
  // Initialize all state hooks at the top level
  const [isSelectingChemical, setIsSelectingChemical] = useState(false);
  const [pouringChemical, setPouringChemical] = useState<Chemical | null>(null);
  const [isPouring, setIsPouring] = useState(false);
  const [chemicalsWithQuantity, setChemicalsWithQuantity] = useState<ChemicalWithQuantity[]>([]);
  const [globalQuantity, setGlobalQuantity] = useState<number>(2); // Default quantity value (2ml)
  const [reactionStateDescription, setReactionStateDescription] = useState<string>('');
  const [showStateChanges, setShowStateChanges] = useState<boolean>(false);
  const [isTestTubeBroken, setIsTestTubeBroken] = useState<boolean>(false);
  const [shouldResetTube, setShouldResetTube] = useState<boolean>(false);
  const [savedChemicalsBeforeExplosion, setSavedChemicalsBeforeExplosion] = useState<ChemicalWithQuantity[]>([]);

  // Update chemicals with quantity
  useEffect(() => {
    const newChemicalsWithQuantity = selectedChemicals.map(chem => {
      const existingChem = chemicalsWithQuantity.find(c => c.id === chem.id && c.color === chem.color);
      return {
        ...chem,
        quantity: existingChem ? existingChem.quantity : globalQuantity
      };
    });
    setChemicalsWithQuantity(newChemicalsWithQuantity);
  }, [selectedChemicals, globalQuantity]);
  
  // Reset the test tube after it breaks, but don't clear chemicals
  useEffect(() => {
    if (shouldResetTube) {
      setIsTestTubeBroken(false);
      setShouldResetTube(false);
      stopReaction();
    }
  }, [shouldResetTube, stopReaction]);
  
  // Update reaction state description
  useEffect(() => {
    if (isReacting && reactionResult) {
      let newState = '';
      
      if (reactionResult.hasGas || reactionResult.hasBubbles) {
        newState = t('state.gas');
      } else if (reactionResult.hasPrecipitate || reactionResult.hasIce) {
        newState = t('state.solid');
      } else {
        newState = t('state.liquid');
      }
      
      const description = t('state.change.description', 'Reactants transformed into {{state}} state', { state: newState });
      setReactionStateDescription(description);
      setShowStateChanges(true);
    } else {
      setShowStateChanges(false);
    }
  }, [reactionResult, isReacting, t]);

  // Handle the chemical selection with pouring animation
  const handleSelectChemical = (chemicalId: string) => {
    console.log('Chemical selected:', chemicalId);
    const chemical = chemicals.find(c => c.id === chemicalId);
    if (!chemical) {
      console.error('Chemical not found:', chemicalId);
      return;
    }
    
    setPouringChemical(chemical);
    setIsPouring(true);
    setIsSelectingChemical(false);
    
    console.log('Pouring state:', { chemical: chemical.name, isPouring: true });
  };
  
  // Called when pouring animation is complete
  const handlePourComplete = () => {
    if (pouringChemical) {
      console.log('Pour completed for chemical:', pouringChemical.id);
      addChemical(pouringChemical.id);
      
      toast({
        title: t('chemical.added', 'Chemical Added'),
        description: `${language === 'en' ? pouringChemical.name : pouringChemical.nameAr} ${t('added.to.tube', 'added to test tube')}`,
        duration: 2000,
      });
      
      setTimeout(() => {
        setIsPouring(false);
        setPouringChemical(null);
        console.log('Pouring animation ended');
      }, 500);
    }
  };

  const updateChemicalQuantity = (index: number, amount: number) => {
    const newChemicals = [...chemicalsWithQuantity];
    const newQuantity = Math.max(0.5, Math.min(10, newChemicals[index].quantity + amount));
    newChemicals[index].quantity = newQuantity;
    setChemicalsWithQuantity(newChemicals);
  };
  
  const handleGlobalQuantityChange = (value: number[]) => {
    setGlobalQuantity(value[0]);
  };
  
  // Toggle reaction (start/stop)
  const handleToggleReaction = () => {
    if (isReacting) {
      stopReaction();
      toast({
        title: t('reaction.stopped', 'Reaction Stopped'),
        description: t('reaction.completed', 'Chemical reaction has been stopped'),
        duration: 3000,
      });
    } else {
      if (chemicalsWithQuantity.length < 2) {
        toast({
          title: t('error'),
          description: t('reaction.min.chemicals', 'You need at least two chemicals to start a reaction'),
          variant: "destructive"
        });
        return;
      }
      
      startReaction();
      toast({
        title: t('reaction.started', 'Reaction Started'),
        description: t('reaction.in.progress', 'Chemical reaction is in progress'),
        duration: 3000,
      });
    }
  };
  
  // Restore chemicals from before the explosion
  const handleRestoreChemicals = () => {
    if (savedChemicalsBeforeExplosion.length > 0) {
      const originalChemicals = savedChemicalsBeforeExplosion.map(chem => {
        const originalChemical = chemicals.find(c => c.id === chem.id);
        return originalChemical || chem;
      });
      
      clearTestTube();
      
      originalChemicals.forEach(chem => {
        addChemical(chem.id);
      });
      
      toast({
        title: t('chemicals.restored', 'Chemicals Restored'),
        description: t('chemicals.restored.description', 'Previous chemicals have been restored'),
        duration: 3000,
      });
      
      setIsTestTubeBroken(false);
    }
  };
  
  // Restore the test tube after an explosion while keeping the same chemicals
  const handleRestoreTestTube = () => {
    setIsTestTubeBroken(false);
    stopReaction();
    toast({
      title: t('tube.restored', 'Test Tube Restored'),
      description: t('tube.restored.description', 'The test tube has been restored with the same chemicals'),
      duration: 3000,
    });
  };
  
  // Check if the reaction is dangerous
  const isDangerousReaction = reactionResult && (
    reactionResult.hasFire || 
    reactionResult.hasExplosion || 
    reactionResult.temperature > 100
  );

  // Log simulation state for debugging
  useEffect(() => {
    console.log('FreeModeSimulation state:', { 
      isSelectingChemical,
      isPouring,
      pouringChemical: pouringChemical?.id,
      chemicalsCount: chemicalsWithQuantity.length,
      selectedChemicalsCount: selectedChemicals.length
    });
  }, [isSelectingChemical, isPouring, pouringChemical, chemicalsWithQuantity, selectedChemicals]);
  
  return (
    <div className="container mx-auto px-4 py-6 relative z-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <motion.div 
            className="glass rounded-xl p-6 shadow-lg h-full flex flex-col"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <TestTubeVisualization 
              isPouring={isPouring}
              pouringChemical={pouringChemical}
              onPourComplete={handlePourComplete}
              isReacting={isReacting}
              reactionResult={reactionResult}
              chemicalsWithQuantity={chemicalsWithQuantity}
              isTestTubeBroken={isTestTubeBroken}
              onRestoreTestTube={handleRestoreTestTube}
              isDangerousReaction={isDangerousReaction}
              onStopReaction={stopReaction}
              showStateChanges={showStateChanges}
              reactionStateDescription={reactionStateDescription}
              isReady={false} // Add isReady=false for Free Mode
            />
            
            {isMobile && (
              <MobileReactionControls
                temperature={temperature}
                pressure={pressure}
                isReacting={isReacting}
                hasSufficientReactants={chemicalsWithQuantity.length >= 2}
                onTemperatureChange={setTemperature}
                onPressureChange={setPressure}
                onToggleReaction={handleToggleReaction}
                onResetSimulation={clearTestTube}
                onAddChemical={() => setIsSelectingChemical(true)}
              />
            )}

            {reactionResult && !showResultsAboveReactants && (
              <ReactionResults 
                reactionResult={reactionResult}
                stateDescription={reactionStateDescription}
                showStateChanges={showStateChanges}
              />
            )}
            
            {chemicalsWithQuantity.length > 0 && (
              <div className="mt-6 p-4 rounded-lg bg-primary/10 animate-fade-in">
                <h3 className="text-lg font-medium mb-2">
                  {t('current.reactants')}
                </h3>
                <ChemicalList 
                  chemicals={chemicalsWithQuantity}
                  isReacting={isReacting}
                  onUpdateQuantity={updateChemicalQuantity}
                />
              </div>
            )}
            
            {reactionResult && showResultsAboveReactants && (
              <ReactionResults 
                reactionResult={reactionResult}
                stateDescription={reactionStateDescription}
                showStateChanges={showStateChanges}
              />
            )}
          </motion.div>
        </div>
        
        <div className="lg:col-span-1">
          <motion.div 
            className="glass rounded-xl p-6 shadow-lg"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-3 flex items-center">
                  <Beaker className="w-5 h-5 mr-2" />
                  {t('sim.add.chemical')}
                </h3>
                
                {isSelectingChemical ? (
                  <ChemicalSelector 
                    onSelectChemical={handleSelectChemical}
                    onCancel={() => setIsSelectingChemical(false)}
                    isPouring={isPouring}
                  />
                ) : (
                  <div className="space-y-3">
                    <ChemicalList 
                      chemicals={chemicalsWithQuantity}
                      isReacting={isReacting}
                      onUpdateQuantity={updateChemicalQuantity}
                    />
                    
                    <div className="flex gap-2">
                      <Button
                        onClick={() => {
                          console.log("Add chemical button clicked");
                          setIsSelectingChemical(true);
                        }}
                        className="flex-1 px-4 py-2 rounded-lg text-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-200 flex items-center justify-center button-shine"
                        disabled={isPouring}
                        variant="default"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        {t('sim.add.chemical')}
                      </Button>
                      <Button
                        onClick={clearTestTube}
                        className="px-4 py-2 rounded-lg text-sm bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors duration-200"
                        disabled={isReacting || chemicalsWithQuantity.length === 0 || isPouring}
                        variant="destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
              
              <ReactionParameters
                temperature={temperature}
                pressure={pressure}
                globalQuantity={globalQuantity}
                isReacting={isReacting}
                onTemperatureChange={setTemperature}
                onPressureChange={setPressure}
                onGlobalQuantityChange={handleGlobalQuantityChange}
              />
              
              <div className="flex gap-2">
                <Button
                  onClick={handleToggleReaction}
                  className={`flex-1 px-4 py-3 rounded-lg font-medium ${
                    isReacting 
                      ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" 
                      : "bg-primary text-primary-foreground hover:bg-primary/90"
                  } transition-colors duration-200 flex items-center justify-center button-shine`}
                  disabled={chemicalsWithQuantity.length < 2 && !isReacting}
                >
                  {isReacting ? (
                    <>
                      <CircleStop className="w-5 h-5 mr-2" />
                      {t('sim.stop.reaction')}
                    </>
                  ) : (
                    <>
                      <CirclePlay className="w-5 h-5 mr-2" />
                      {t('sim.start.reaction')}
                    </>
                  )}
                </Button>
                
                {savedChemicalsBeforeExplosion.length > 0 && (
                  <Button 
                    onClick={handleRestoreChemicals}
                    className="px-4 py-3 rounded-lg font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors duration-200 flex items-center justify-center"
                    disabled={isReacting}
                  >
                    <RefreshCw className="w-5 h-5 mr-1" />
                    {t('restore.chemicals', 'Restore')}
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};