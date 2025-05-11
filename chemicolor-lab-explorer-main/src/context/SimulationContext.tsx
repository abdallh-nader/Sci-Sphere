import { createContext, useContext, useState, useCallback, useRef } from 'react';
import { reactions } from '../data/reactions';
import { chemicals } from '../data/chemicals';

export interface Chemical {
  id: string;
  name: string;
  nameAr: string;
  color: string;
  density: number;
  state: 'solid' | 'liquid' | 'gas';
  quantity?: number;
  formula?: string;
}

export interface Reaction {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  reactants: string[];
  products: string[];
  conditions: {
    temperature: number;
    pressure: number;
    catalyst?: string;
  };
  effects: {
    color: string;
    smoke?: boolean;
    bubbles?: boolean;
    precipitate?: boolean;
    temperature?: 'increase' | 'decrease';
    fire?: boolean;
    ice?: boolean;
    glow?: boolean;
    glowColor?: string;
    explosion?: boolean;
  };
  formula?: string;
}

interface AudioRefs {
  bubbling: React.MutableRefObject<HTMLAudioElement | null>;
  hissing: React.MutableRefObject<HTMLAudioElement | null>;
  explosion: React.MutableRefObject<HTMLAudioElement | null>;
  fizzing: React.MutableRefObject<HTMLAudioElement | null>;
  pouring: React.MutableRefObject<HTMLAudioElement | null>;
  smoke: React.MutableRefObject<HTMLAudioElement | null>;
  glass_break: React.MutableRefObject<HTMLAudioElement | null>;
  danger: React.MutableRefObject<HTMLAudioElement | null>;
}

interface SimulationContextType {
  selectedReaction: Reaction | null;
  selectReaction: (id: string) => void;
  selectedChemicals: Chemical[];
  addChemical: (id: string, playSound?: boolean) => void;
  removeChemical: (id: string) => void;
  clearTestTube: () => void;
  temperature: number;
  setTemperature: (temp: number) => void;
  pressure: number;
  setPressure: (press: number) => void;
  isReacting: boolean;
  startReaction: () => void;
  stopReaction: () => void;
  reactionResult: {
    color: string;
    hasSmoke: boolean;
    hasBubbles: boolean;
    hasPrecipitate: boolean;
    temperatureChange: 'increase' | 'decrease' | 'none';
    temperature: number;
    hasFire: boolean;
    hasIce: boolean;
    hasGlow: boolean;
    glowColor?: string;
    hasExplosion: boolean;
    hasGas?: boolean;
    intensity?: number;
    soundEffect?: 'bubbling' | 'hissing' | 'explosion' | 'fizzing' | null;
    formula?: string;
  } | null;
  stopAllSounds: () => void;
  setAudioRefs: (refs: AudioRefs) => void;
  audioRefs: AudioRefs;
  playPouringSound: () => void; // دالة جديدة لتشغيل صوت السكب
  stopPouringSound: () => void; // دالة جديدة لإيقاف صوت السكب
}

const SimulationContext = createContext<SimulationContextType | undefined>(undefined);

// Helper functions for formula generation
const generateChemicalFormula = (chemicals: Chemical[]) => {
  if (chemicals.length === 0) return '';
  const formulas = chemicals.map(c => c.formula || c.id.toUpperCase());
  return formulas.join(' + ');
};

const generateReactionFormula = (
  reactants: Chemical[], 
  products: string[] = [],
  isSpontaneous: boolean = false
) => {
  const leftSide = reactants.map(r => r.formula || r.id.toUpperCase()).join(' + ');
  if (products.length > 0) {
    const rightSide = products.map(p => {
      const chemical = chemicals.find(c => c.id === p);
      return chemical?.formula || p.toUpperCase();
    }).join(' + ');
    return `${leftSide} → ${rightSide}`;
  }
  if (isSpontaneous) {
    if (reactants.some(r => r.id === 'hcl' || r.id === 'h2so4') && 
        reactants.some(r => r.id === 'na' || r.id === 'zn')) {
      return `${leftSide} → Metal salt + H₂↑`;
    }
    if (reactants.some(r => r.id === 'hcl' || r.id === 'h2so4') && 
        reactants.some(r => r.id === 'nahco3' || r.id === 'na2co3')) {
      return `${leftSide} → Salt + H₂O + CO₂↑`;
    }
    if (reactants.some(r => r.id === 'naoh' || r.id === 'koh') && 
        reactants.some(r => r.id === 'hcl' || r.id === 'h2so4')) {
      return `${leftSide} → Salt + H₂O`;
    }
    return `${leftSide} → Products`;
  }
  return leftSide;
};

export function SimulationProvider({ children }: { children: React.ReactNode }) {
  const [selectedReaction, setSelectedReaction] = useState<Reaction | null>(null);
  const [selectedChemicals, setSelectedChemicals] = useState<Chemical[]>([]);
  const [temperature, setTemperature] = useState(25);
  const [pressure, setPressure] = useState(1);
  const [isReacting, setIsReacting] = useState(false);
  const [reactionResult, setReactionResult] = useState<SimulationContextType['reactionResult']>(null);

  // Initialize audioRefs using useRef to persist across renders
  const audioRefs = useRef<AudioRefs>({
    bubbling: { current: null },
    hissing: { current: null },
    explosion: { current: null },
    fizzing: { current: null },
    pouring: { current: null },
    smoke: { current: null },
    glass_break: { current: null },
    danger: { current: null },
  });

  console.log('SimulationContext state:', {
    selectedReaction: selectedReaction?.id,
    selectedChemicals: selectedChemicals.map(c => c.id),
    isReacting,
    reactionResult: reactionResult ? 'exists' : 'null'
  });

  const selectReaction = useCallback((id: string) => {
    console.log('Selecting reaction with ID:', id);
    const reaction = reactions.find(r => r.id === id) || null;
    if (!reaction) {
      console.error('Reaction not found for ID:', id);
      return;
    }
    console.log('Found reaction:', reaction.name);
    setSelectedReaction(reaction);
    setSelectedChemicals([]);
    setReactionResult(null);
    setIsReacting(false);
  }, []);

  const addChemical = useCallback((id: string, playSound?: boolean) => {
    console.log('Adding chemical with ID:', id, 'playSound:', playSound);
    const chemical = chemicals.find(c => c.id === id);
    if (!chemical) {
      console.error('Chemical not found for ID:', id);
      return;
    }
    console.log('Found chemical:', chemical.name);
    if (!selectedReaction && selectedChemicals.some(c => c.id === chemical.id)) {
      console.log('Skipping duplicate chemical');
      return;
    }
    setSelectedChemicals(prev => [...prev, chemical]);
  }, [selectedReaction, selectedChemicals]);

  const removeChemical = useCallback((id: string) => {
    console.log('Removing chemical with ID:', id);
    setSelectedChemicals(prev => prev.filter(chemical => chemical.id !== id));
  }, []);

  const clearTestTube = useCallback(() => {
    console.log('Clearing test tube');
    setSelectedChemicals([]);
    setReactionResult(null);
    setIsReacting(false);
    stopAllSounds();
  }, []);

  const startReaction = useCallback(() => {
    if (selectedChemicals.length < 2) {
      console.log('Not enough chemicals to start reaction');
      return;
    }
    console.log('Starting reaction with chemicals:', selectedChemicals.map(c => c.id));
    setIsReacting(true);
    
    if (selectedReaction) {
      console.log('Using predefined reaction effects for:', selectedReaction.id);
      setTimeout(() => {
        let temperatureChange: 'increase' | 'decrease' | 'none';
        if (selectedReaction.effects.temperature === 'increase') {
          temperatureChange = 'increase';
        } else if (selectedReaction.effects.temperature === 'decrease') {
          temperatureChange = 'decrease';
        } else {
          temperatureChange = 'none';
        }
        let finalTemp = selectedReaction.conditions.temperature;
        if (temperature > finalTemp && temperatureChange === 'increase') {
          finalTemp += 10 + Math.random() * 15;
        } else if (temperature < finalTemp && temperatureChange === 'decrease') {
          finalTemp -= 5 + Math.random() * 10;
        }
        if (pressure > 1.5) {
          if (temperatureChange === 'increase') {
            finalTemp += (pressure - 1) * 10;
          } else if (temperatureChange === 'decrease') {
            finalTemp -= (pressure - 1) * 5;
          }
        }
        const hasExplosion = !!selectedReaction.effects.explosion || 
                          (temperatureChange === 'increase' && finalTemp > 130 && Math.random() > 0.7);
        const hasFire = !!selectedReaction.effects.fire || 
                    (temperatureChange === 'increase' && finalTemp > 90 && Math.random() > 0.6);
        const hasIce = !!selectedReaction.effects.ice || 
                    (temperatureChange === 'decrease' && finalTemp < 5);
        const hasSmoke = !!selectedReaction.effects.smoke || 
                      (finalTemp > 85 && Math.random() > 0.5) || 
                      hasExplosion || 
                      hasFire;
        const hasGas = !!selectedReaction.effects.bubbles || 
                      (pressure < 0.8 && Math.random() > 0.5) || 
                      (finalTemp > 70 && Math.random() > 0.7);
        const intensity = calculateReactionIntensity(temperatureChange, finalTemp, hasExplosion, hasFire);
        const soundEffect = determineSoundEffect(hasExplosion, hasFire, !!selectedReaction.effects.bubbles);
        let formula = selectedReaction.formula || 
                    generateReactionFormula(selectedChemicals, selectedReaction.products);
        const result = {
          color: selectedReaction.effects.color,
          hasSmoke,
          hasBubbles: !!selectedReaction.effects.bubbles || 
                    (pressure < 0.8 && Math.random() > 0.5) || 
                    (finalTemp > 70 && Math.random() > 0.7),
          hasPrecipitate: !!selectedReaction.effects.precipitate || 
                        (Math.random() > 0.8 && selectedChemicals.some(c => c.state === 'solid')),
          temperatureChange,
          temperature: finalTemp,
          hasFire,
          hasIce,
          hasGlow: !!selectedReaction.effects.glow || (Math.random() > 0.85),
          glowColor: selectedReaction.effects.glowColor,
          hasExplosion,
          hasGas,
          intensity,
          soundEffect,
          formula
        };
        console.log('Setting reaction result:', result);
        setReactionResult(result);
      }, 1500);
    } else {
      console.log('Simulating free mode reaction effects');
      setTimeout(() => {
        const hasAcid = selectedChemicals.some(c => ['hcl', 'h2so4', 'hno3', 'c2h4o2'].includes(c.id));
        const hasBase = selectedChemicals.some(c => ['naoh', 'koh', 'nh4oh', 'mgoh2', 'caoh2'].includes(c.id));
        const hasMetal = selectedChemicals.some(c => ['fe', 'zn', 'cu', 'na', 'mg', 'ca', 'al', 'k', 'ag', 'pb'].includes(c.id));
        const hasSalt = selectedChemicals.some(c => [
          'nacl', 'cuso4', 'agno3', 'nahco3', 'na2co3', 'mgcl2', 'caso4'
        ].includes(c.id));
        const hasOxidizer = selectedChemicals.some(c => ['h2o2', 'kclo3', 'hno3', 'o2'].includes(c.id));
        const hasReducer = selectedChemicals.some(c => ['fe', 'zn', 'h2', 'c', 'na', 'ca'].includes(c.id));
        const hasWater = selectedChemicals.some(c => ['h2o'].includes(c.id));
        const hasSolid = selectedChemicals.some(c => c.state === 'solid');
        const hasLiquid = selectedChemicals.some(c => c.state === 'liquid');
        const hasGas = selectedChemicals.some(c => c.state === 'gas');
        const totalQuantity = selectedChemicals.reduce((sum, chem) => sum + (chem.quantity || 1), 0);
        const isHighlyReactive = 
          (hasAcid && hasMetal) || 
          (hasOxidizer && hasReducer) || 
          (selectedChemicals.some(c => ['na', 'k'].includes(c.id)) && hasWater) ||
          (hasAcid && hasBase && pressure > 1.5) ||
          (selectedChemicals.some(c => ['kclo3'].includes(c.id)) && selectedChemicals.some(c => ['s', 'c'].includes(c.id)));
        let mixedColor: string;
        if (hasAcid && hasBase) {
          mixedColor = '#e6f7ff';
        } else if (hasMetal && hasAcid) {
          mixedColor = '#c8e6c9';
        } else if (hasOxidizer && hasReducer) {
          mixedColor = '#ffccbc';
        } else if (hasOxidizer && hasMetal) {
          mixedColor = '#bcaaa4';
        } else if (selectedChemicals.some(c => ['na', 'k'].includes(c.id)) && hasWater) {
          mixedColor = '#ffeb3b';
        } else if (selectedChemicals.some(c => ['agno3'].includes(c.id)) && hasSalt) {
          mixedColor = '#f5f5f5';
        } else if (selectedChemicals.some(c => ['cuso4'].includes(c.id)) && selectedChemicals.some(c => ['fe'].includes(c.id))) {
          mixedColor = '#a5d6a7';
        } else if (selectedChemicals.some(c => ['i2'].includes(c.id)) && selectedChemicals.some(c => ['starch'].includes(c.id))) {
          mixedColor = '#3f51b5';
        } else {
          mixedColor = blendColors(selectedChemicals.map(c => c.color));
        }
        let tempChange: 'increase' | 'decrease' | 'none';
        let finalTemp = temperature;
        const quantityFactor = Math.min(3, totalQuantity / 2);
        if (hasAcid && hasBase) {
          tempChange = 'increase';
          finalTemp = temperature + (15 + Math.random() * 10) * quantityFactor;
        } else if (hasMetal && hasAcid) {
          tempChange = 'increase';
          finalTemp = temperature + (20 + Math.random() * 15) * quantityFactor;
        } else if (hasOxidizer && hasReducer) {
          tempChange = 'increase';
          finalTemp = temperature + (25 + Math.random() * 20) * quantityFactor;
        } else if (selectedChemicals.some(c => ['na', 'k'].includes(c.id)) && hasWater) {
          tempChange = 'increase';
          finalTemp = temperature + (40 + Math.random() * 30) * quantityFactor;
        } else if (hasSolid && hasLiquid && selectedChemicals.some(c => ['nahco3', 'nh4cl'].includes(c.id))) {
          tempChange = 'decrease';
          finalTemp = Math.max(temperature - (15 + Math.random() * 10) * quantityFactor, 0);
        } else if (selectedChemicals.some(c => ['nh4no3'].includes(c.id)) && hasWater) {
          tempChange = 'decrease';
          finalTemp = Math.max(temperature - (20 + Math.random() * 10) * quantityFactor, -5);
        } else {
          const rand = Math.random();
          if (rand > 0.4) {
            tempChange = rand > 0.7 ? 'increase' : 'decrease';
            finalTemp = tempChange === 'increase' 
              ? temperature + (10 + Math.random() * 30) * quantityFactor
              : Math.max(temperature - (10 + Math.random() * 15) * quantityFactor, 0);
          } else {
            tempChange = 'none';
            finalTemp = temperature;
          }
        }
        if (pressure > 1.5) {
          if (tempChange === 'increase') {
            finalTemp += (pressure - 1) * 10 * quantityFactor;
          }
        } else if (pressure < 0.7) {
          if (finalTemp > 40 && hasLiquid) {
            finalTemp += 10 * quantityFactor;
          }
        }
        const hasBubbles = (hasAcid && hasMetal) || 
                          (hasAcid && hasSalt && selectedChemicals.some(c => ['nahco3', 'na2co3', 'caco3'].includes(c.id))) ||
                          (hasLiquid && finalTemp > 70) || 
                          (hasGas) ||
                          (hasAcid && hasBase && Math.random() > 0.5) ||
                          (pressure < 0.7) ||
                          (Math.random() > 0.7);
        const hasGasEffect = hasBubbles || hasGas || 
                           (hasLiquid && finalTemp > 85) || 
                           (pressure < 0.7);
        const hasSmoke = (hasGas && hasOxidizer) || 
                         (finalTemp > 85) || 
                         (selectedChemicals.some(c => ['nh3', 'hcl'].includes(c.id))) ||
                         (hasOxidizer && hasReducer) ||
                         (isHighlyReactive) ||
                         (totalQuantity > 5 && Math.random() > 0.5) ||
                         (Math.random() > 0.7);
        const hasPrecipitate = (hasSalt && selectedChemicals.some(c => ['agno3', 'pbcl2', 'bacl2'].includes(c.id))) ||
                              (hasAcid && hasBase) ||
                              (selectedChemicals.some(c => ['agno3'].includes(c.id)) && selectedChemicals.some(c => ['nacl'].includes(c.id))) ||
                              (hasSolid && hasLiquid && Math.random() > 0.5);
        const hasFire = (hasOxidizer && hasReducer && finalTemp > 80) || 
                       (selectedChemicals.some(c => ['na', 'k'].includes(c.id)) && selectedChemicals.some(c => ['h2o'].includes(c.id))) ||
                       (isHighlyReactive && Math.random() > 0.6) ||
                       (finalTemp > 100 && Math.random() > 0.6) || 
                       (totalQuantity > 7 && isHighlyReactive && Math.random() > 0.4);
        const hasIce = finalTemp < 5;
        const hasGlow = (selectedChemicals.some(c => ['h2o2'].includes(c.id)) && selectedChemicals.some(c => ['kcl', 'nacl'].includes(c.id))) ||
                       (selectedChemicals.some(c => ['luminol'].includes(c.id)) && hasOxidizer) ||
                       (hasFire && Math.random() > 0.5) ||
                       (isHighlyReactive && Math.random() > 0.7) ||
                       (Math.random() > 0.85);
        let glowColor = '#ffff00';
        if (selectedChemicals.some(c => ['cu', 'cuso4'].includes(c.id))) {
          glowColor = '#00ffff';
        } else if (selectedChemicals.some(c => ['na'].includes(c.id))) {
          glowColor = '#ffaa00';
        } else if (selectedChemicals.some(c => ['k'].includes(c.id))) {
          glowColor = '#ff00ff';
        } else if (selectedChemicals.some(c => ['ca', 'caoh2'].includes(c.id))) {
          glowColor = '#ff0000';
        } else if (selectedChemicals.some(c => ['h3bo3', 'ba'].includes(c.id))) {
          glowColor = '#00ff00';
        }
        const hasExplosion = (selectedChemicals.some(c => ['kclo3'].includes(c.id)) && selectedChemicals.some(c => ['s', 'c'].includes(c.id))) ||
                           (selectedChemicals.some(c => ['h2', 'o2'].includes(c.id)) && finalTemp > 90) ||
                           (isHighlyReactive && finalTemp > 100 && Math.random() > 0.7) ||
                           (selectedChemicals.some(c => ['na', 'k'].includes(c.id)) && hasWater && Math.random() > 0.5) ||
                           (finalTemp > 140) ||
                           (totalQuantity > 8 && finalTemp > 120 && Math.random() > 0.5);
        const intensity = calculateReactionIntensity(tempChange, finalTemp, hasExplosion, hasFire, totalQuantity);
        const soundEffect = determineSoundEffect(hasExplosion, hasFire, hasBubbles);
        let formula = generateReactionFormula(selectedChemicals, [], true);
        const result = {
          color: mixedColor,
          hasSmoke,
          hasBubbles,
          hasPrecipitate,
          temperatureChange: tempChange,
          temperature: finalTemp,
          hasFire,
          hasIce,
          hasGlow,
          glowColor,
          hasExplosion,
          hasGas: hasGasEffect,
          intensity,
          soundEffect,
          formula
        };
        console.log('Setting simulated reaction result:', result);
        setReactionResult(result);
      }, 1500);
    }
  }, [selectedChemicals, selectedReaction, temperature, pressure]);

  const stopReaction = useCallback(() => {
    console.log('Stopping reaction');
    setIsReacting(false);
    stopAllSounds();
  }, []);

  const stopAllSounds = useCallback(() => {
    Object.values(audioRefs.current).forEach(ref => {
      if (ref.current) {
        try {
          ref.current.pause();
          ref.current.currentTime = 0;
        } catch (error) {
          console.error("Error stopping audio:", error);
        }
      }
    });
  }, []);

  const setAudioRefs = useCallback((refs: AudioRefs) => {
    audioRefs.current = refs;
  }, []);

  const playPouringSound = useCallback(() => {
    console.log('Playing pouring sound');
    if (audioRefs.current.pouring.current) {
      try {
        audioRefs.current.pouring.current.volume = 0.5;
        audioRefs.current.pouring.current.currentTime = 0;
        audioRefs.current.pouring.current.play().catch(e => console.error('Could not play pouring sound:', e));
      } catch (error) {
        console.error('Error playing pouring sound:', error);
      }
    } else {
      console.warn('pouring audio ref is not initialized');
    }
  }, []);

  const stopPouringSound = useCallback(() => {
    console.log('Stopping pouring sound');
    if (audioRefs.current.pouring.current) {
      try {
        audioRefs.current.pouring.current.pause();
        audioRefs.current.pouring.current.currentTime = 0;
      } catch (error) {
        console.error('Error stopping pouring sound:', error);
      }
    } else {
      console.warn('pouring audio ref is not initialized');
    }
  }, []);

  const calculateReactionIntensity = (
    temperatureChange: 'increase' | 'decrease' | 'none', 
    finalTemp: number, 
    hasExplosion: boolean, 
    hasFire: boolean,
    totalQuantity: number = 2
  ) => {
    let intensity = 1;
    if (hasExplosion) {
      intensity = 5;
    } else if (hasFire) {
      intensity = 4;
    } else if (temperatureChange === 'increase') {
      if (finalTemp > 100) {
        intensity = 3;
      } else if (finalTemp > 60) {
        intensity = 2;
      } else {
        intensity = 1.5;
      }
    }
    const quantityFactor = Math.sqrt(totalQuantity / 2);
    return intensity * quantityFactor;
  };

  const determineSoundEffect = (hasExplosion: boolean, hasFire: boolean, hasBubbles: boolean): 'explosion' | 'hissing' | 'bubbling' | 'fizzing' | null => {
    if (hasExplosion) {
      return 'explosion';
    } else if (hasFire) {
      return 'hissing';
    } else if (hasBubbles) {
      return 'bubbling';
    } else {
      return Math.random() > 0.5 ? 'fizzing' : null;
    }
  };

  const blendColors = (colors: string[]): string => {
    if (colors.length === 0) return '#FFFFFF';
    if (colors.length === 1) return colors[0];
    let r = 0, g = 0, b = 0;
    let totalWeight = 0;
    const chemicalColors = selectedChemicals.map(c => c.color);
    chemicalColors.forEach(color => {
      const chemical = selectedChemicals.find(c => c.color === color);
      const quantity = chemical?.quantity || 1;
      const weight = (chemical ? chemical.density * quantity : 1);
      totalWeight += weight;
      const hex = color.replace('#', '');
      r += parseInt(hex.substring(0, 2), 16) * weight;
      g += parseInt(hex.substring(2, 4), 16) * weight;
      b += parseInt(hex.substring(4, 6), 16) * weight;
    });
    r = Math.round(r / totalWeight);
    g = Math.round(g / totalWeight);
    b = Math.round(b / totalWeight);
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  };

  return (
    <SimulationContext.Provider value={{
      selectedReaction,
      selectReaction,
      selectedChemicals,
      addChemical,
      removeChemical,
      clearTestTube,
      temperature,
      setTemperature,
      pressure,
      setPressure,
      isReacting,
      startReaction,
      stopReaction,
      reactionResult,
      stopAllSounds,
      setAudioRefs,
      audioRefs: audioRefs.current,
      playPouringSound,
      stopPouringSound,
    }}>
      {children}
    </SimulationContext.Provider>
  );
}

export function useSimulation() {
  const context = useContext(SimulationContext);
  if (context === undefined) {
    throw new Error('useSimulation must be used within a SimulationProvider');
  }
  return context;
}