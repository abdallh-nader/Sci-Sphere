
import React, { useEffect } from 'react';
import { useTranslation } from '../utils/i18n';
import { useSimulation } from '../context/SimulationContext';
import { motion } from 'framer-motion';
import { AlertCircle, AlertTriangle, RefreshCw, Thermometer, Droplets } from 'lucide-react';
import { ChevronsUpDown } from 'lucide-react';
import TestTube from './TestTube';
import ChemicalBottle from './ChemicalBottle';
import { Chemical } from '../context/SimulationContext';

interface ChemicalWithQuantity extends Chemical {
  quantity: number;
}

interface TestTubeVisualizationProps {
  isPouring: boolean;
  pouringChemical: Chemical | null;
  onPourComplete: () => void;
  isReacting: boolean;
  reactionResult: any;
  chemicalsWithQuantity: ChemicalWithQuantity[];
  isTestTubeBroken: boolean;
  onRestoreTestTube: () => void;
  isDangerousReaction: boolean;
  onStopReaction: () => void;
  showStateChanges: boolean;
  reactionStateDescription: string;
  audioRefs?: {
    glassBreak?: React.RefObject<HTMLAudioElement>;
    pouring?: React.RefObject<HTMLAudioElement>;
    bubbling?: React.RefObject<HTMLAudioElement>;
    smoke?: React.RefObject<HTMLAudioElement>;
    danger?: React.RefObject<HTMLAudioElement>;
    explosion?: React.RefObject<HTMLAudioElement>;
  };
  soundEnabled?: boolean;
  playSound?: boolean;
  isReady?: boolean; // Add isReady prop to determine mode
}

const TestTubeVisualization = ({
  isPouring,
  pouringChemical,
  onPourComplete,
  isReacting,
  reactionResult,
  chemicalsWithQuantity,
  isTestTubeBroken,
  onRestoreTestTube,
  isDangerousReaction,
  onStopReaction,
  showStateChanges,
  reactionStateDescription,
  audioRefs,
  soundEnabled = true,
  playSound = true,
  isReady = true, // Default to Ready mode
}: TestTubeVisualizationProps) => {
  const { t } = useTranslation();
  const { stopAllSounds, setAudioRefs } = useSimulation();

  
  // دالة لتشغيل صوت معين
  const playSoundEffect = (audioRef: React.RefObject<HTMLAudioElement>, volume: number) => {
    if (!soundEnabled || !audioRef?.current) return;
    try {
      audioRef.current.volume = volume;
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(e => console.log('Could not play sound:', e));
    } catch (e) {
      console.log('Error playing sound:', e);
    }
  };

  // تشغيل صوت كسر الزجاج عندما يكون الأنبوب مكسورًا
  useEffect(() => {
    if (isTestTubeBroken && audioRefs?.glassBreak?.current) {
      playSoundEffect(audioRefs.glassBreak, 0.7);
      stopAllSounds(); // Stop all other sounds when the tube breaks
    }
  }, [isTestTubeBroken, soundEnabled, stopAllSounds, audioRefs]);

  // تشغيل صوت السكب عند بدء السكب، مع احترام playSound
  useEffect(() => {
    if (isPouring && playSound && audioRefs?.pouring?.current) {
      console.log('Playing pouring sound for chemical:', pouringChemical?.id);
      playSoundEffect(audioRefs.pouring, 0.5);
    } else {
      stopAllSounds(); // Stop all sounds when pouring stops
    }
    return () => stopAllSounds();
  }, [isPouring, playSound, pouringChemical, soundEnabled, stopAllSounds, audioRefs]);

  // تشغيل صوت الفقاعات عند ظهور الفقاعات
  useEffect(() => {
    if (reactionResult?.hasBubbles && isReacting && !isTestTubeBroken && audioRefs?.bubbling?.current) {
      playSoundEffect(audioRefs.bubbling, 0.3);
    } else {
      stopAllSounds();
    }
    return () => stopAllSounds();
  }, [reactionResult?.hasBubbles, isReacting, isTestTubeBroken, soundEnabled, stopAllSounds, audioRefs]);

  // تشغيل صوت الدخان عند ظهور الدخان
  useEffect(() => {
    if (reactionResult?.hasSmoke && isReacting && !isTestTubeBroken && audioRefs?.smoke?.current) {
      playSoundEffect(audioRefs.smoke, 0.3);
    } else {
      stopAllSounds();
    }
    return () => stopAllSounds();
  }, [reactionResult?.hasSmoke, isReacting, isTestTubeBroken, soundEnabled, stopAllSounds, audioRefs]);

  // تشغيل صوت الخطر عند ظهور النار
  useEffect(() => {
    if (reactionResult?.hasFire && isReacting && !isTestTubeBroken && audioRefs?.danger?.current) {
      playSoundEffect(audioRefs.danger, 0.3);
    } else {
      stopAllSounds();
    }
    return () => stopAllSounds();
  }, [reactionResult?.hasFire, isReacting, isTestTubeBroken, soundEnabled, stopAllSounds, audioRefs]);

  // تشغيل صوت الانفجار عند حدوث الانفجار
  useEffect(() => {
    if (reactionResult?.hasExplosion && isReacting && !isTestTubeBroken && audioRefs?.explosion?.current) {
      playSoundEffect(audioRefs.explosion, 0.5);
    } else {
      stopAllSounds();
    }
    return () => stopAllSounds();
  }, [reactionResult?.hasExplosion, isReacting, isTestTubeBroken, soundEnabled, stopAllSounds, audioRefs]);

  // Stop all sounds when the component unmounts
  useEffect(() => {
    return () => {
      stopAllSounds();
    };
  }, [stopAllSounds]);

  // Get combined color for all substances
  const getCombinedColor = () => {
    if (!reactionResult || !reactionResult.color || chemicalsWithQuantity.length === 0) return "#cccccc";
    return reactionResult.color;
  };

  // Calculate total chemical quantity for reaction intensity prediction
  const getTotalChemicalQuantity = () => {
    return chemicalsWithQuantity.reduce((sum, chem) => sum + chem.quantity, 0);
  };

  // Get reaction explanation based on current conditions
  const getReactionExplanation = () => {
    if (!reactionResult || !isReacting) return "";

    const totalQuantity = getTotalChemicalQuantity();
    const quantityFactor = totalQuantity > 5 ? t('reaction.high.quantity', 'زيادة الكمية تؤدي إلى تفاعل أقوى') : 
                          totalQuantity < 2 ? t('reaction.low.quantity', 'كمية قليلة تؤدي إلى تفاعل ضعيف') : 
                          t('reaction.balanced.quantity', 'كمية متوازنة تؤدي إلى تفاعل مثالي');

    let tempEffect = "";
    if (reactionResult.temperature > 90) {
      tempEffect = t('reaction.high.temp', 'درجة حرارة عالية تسرع التفاعل وقد تؤدي الى تكوين غازات');
    } else if (reactionResult.temperature < 20) {
      tempEffect = t('reaction.low.temp', 'درجة حرارة منخفضة تبطئ التفاعل وقد تؤدي إلى تكوين رواسب');
    } else {
      tempEffect = t('reaction.normal.temp', 'درجة حرارة معتدلة تساعد على تفاعل متوازن');
    }

    return `${quantityFactor}. ${tempEffect}`;
  };

  return (
    <div className="flex-1 flex items-center justify-center relative min-h-[400px]">
      {/* Chemical Bottle Animation */}
      {isPouring && pouringChemical && (
        <ChemicalBottle 
          chemical={pouringChemical}
          isPouring={isPouring}
          onPourComplete={onPourComplete}
          isReady={isReady} // Pass isReady to ChemicalBottle
        />
      )}

      <TestTube 
        width={100} 
        height={300} 
        substances={isReacting && reactionResult ? [
          { 
            substance: {
              id: "reaction-result",
              name: "Reaction Result",
              nameAr: "نتيجة التفاعل",
              color: reactionResult.color || getCombinedColor(),
              state: reactionResult.hasGas ? "gas" : reactionResult.hasPrecipitate ? "solid" : "liquid",
              density: 1
            },
            volume: chemicalsWithQuantity.reduce((sum, chem) => sum + chem.quantity, 0) * 10
          }
        ] : chemicalsWithQuantity.map(chem => ({
          substance: chem,
          volume: chem.quantity * 10
        }))}
        showBubbles={reactionResult?.hasBubbles}
        showSmoke={reactionResult?.hasSmoke}
        shake={isReacting && !isTestTubeBroken}
        glow={reactionResult?.hasGlow}
        glowColor={reactionResult?.glowColor}
        showFire={reactionResult?.hasFire}
        showExplosion={reactionResult?.hasExplosion && !isTestTubeBroken}
        intensity={reactionResult?.intensity || 1}
        broken={isTestTubeBroken}
      />

      {/* Restore button appears when tube is broken */}
      {isTestTubeBroken && (
        <motion.button
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-lg font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-200 flex items-center justify-center gap-2 mb-2"
          onClick={onRestoreTestTube}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <RefreshCw className="w-4 h-4 mr-1" />
          {t('restore.tube', 'Restore Test Tube')}
        </motion.button>
      )}

      {isTestTubeBroken && (
        <motion.div 
          className="absolute -top-10 left-1/2 transform -translate-x-1/2 px-3 py-2 rounded-lg bg-destructive text-destructive-foreground text-sm font-medium"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <AlertTriangle className="w-4 h-4 inline-block mr-1 animate-pulse" />
          {t('tube.broken', 'Test tube broke due to violent reaction!')}
        </motion.div>
      )}

      {isDangerousReaction && isReacting && !isTestTubeBroken && (
        <motion.button
          className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-lg font-medium bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors duration-200 animate-pulse flex items-center justify-center"
          onClick={onStopReaction}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <AlertTriangle className="w-4 h-4 mr-2" />
          {t('reaction.emergency.stop', 'Emergency Stop!')}
        </motion.button>
      )}

      {chemicalsWithQuantity.length === 0 && !isReacting && !isTestTubeBroken && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-muted-foreground p-4 rounded-lg bg-background/50 backdrop-blur-sm animate-fade-in max-w-[200px]">
          <AlertCircle className="w-6 h-6 mx-auto mb-2" />
          <p className="text-sm">
            {t('add.chemicals')}
          </p>
        </div>
      )}

      {/* State Change Display Below the Test Tube */}
      {showStateChanges && reactionResult && (
        <div className="mt-4 p-3 bg-background/30 rounded-md flex items-center justify-center absolute bottom-[-3rem] left-0 right-0">
          <ChevronsUpDown className="w-5 h-5 mr-2 text-primary" />
          <span className="text-sm font-medium">
            {reactionStateDescription || t('state.no.change')}
          </span>
        </div>
      )}

      {/* Reaction Explanation Panel */}
      {reactionResult && isReacting && !isTestTubeBroken && (
        <motion.div 
          className="absolute -top-20 left-0 right-0 p-3 bg-background/70 backdrop-blur-sm rounded-lg border border-primary/20 shadow-lg text-sm"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex flex-wrap gap-2 justify-center items-center">
            <div className="flex items-center mr-3">
              <Thermometer className="w-4 h-4 mr-1 text-primary" />
              <span>
                {reactionResult.temperature > 50 
                  ? t('reaction.exothermic', 'تفاعل طارد للحرارة') 
                  : t('reaction.endothermic', 'تفاعل ماص للحرارة')}
              </span>
            </div>

            <div className="flex items-center">
              <Droplets className="w-4 h-4 mr-1 text-primary" />
              <span>
                {getTotalChemicalQuantity() > 5 
                  ? t('reaction.concentrated', 'تركيز عالي') 
                  : t('reaction.diluted', 'تركيز منخفض')}
              </span>
            </div>
          </div>

          <p className="mt-2 text-center font-medium">
            {getReactionExplanation()}
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default TestTubeVisualization;