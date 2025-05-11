import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import BrokenTestTube from './BrokenTestTube';

interface TestTubeProps {
  substances: {
    substance: any;
    volume: number;
  }[];
  height?: number;
  width?: number;
  className?: string;
  showBubbles?: boolean;
  showSmoke?: boolean;
  shake?: boolean;
  glow?: boolean;
  glowColor?: string;
  showFire?: boolean;
  showExplosion?: boolean;
  intensity?: number;
  broken?: boolean;
  temperature?: number;
  autoRestoreOnExplosion?: boolean;
  onRestoreAfterExplosion?: () => void;
  pouringTubeX?: number; // إحداثية X للزجاجة التي تصب
  pouringTubeY?: number; // إحداثية Y للزجاجة التي تصب
}

export const TestTube: React.FC<TestTubeProps> = ({
  substances = [],
  height = 320,
  width = 80,
  className,
  showBubbles = false,
  showSmoke = false,
  shake = false,
  glow = false,
  glowColor,
  showFire = false,
  showExplosion = false,
  intensity = 1,
  broken = false,
  temperature = 25,
  autoRestoreOnExplosion = false,
  onRestoreAfterExplosion,
  pouringTubeX = -width * 0.5, // القيمة الافتراضية للحفاظ على الموقع الأصلي
  pouringTubeY = -height * 0.8, // القيمة الافتراضية للحفاظ على الموقع الأصلي
}) => {
  // Auto restore after explosion
  useEffect(() => {
    if (showExplosion && autoRestoreOnExplosion) {
      const timer = setTimeout(() => {
        if (onRestoreAfterExplosion) {
          onRestoreAfterExplosion();
        }
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [showExplosion, autoRestoreOnExplosion, onRestoreAfterExplosion]);
  
  // If the test tube is broken, render the broken version
  if (broken) {
    return (
      <BrokenTestTube 
        width={width} 
        height={height} 
        className={className}
        color={substances.length > 0 ? substances[substances.length - 1].substance.color : "#cccccc"}
      />
    );
  }

  const [bubbles, setBubbles] = useState<{ id: number; left: number; size: number; delay: number; speed: number }[]>([]);
  const [smokeParticles, setSmokeParticles] = useState<{ id: number; left: number; size: number; delay: number }[]>([]);
  const [isPouring, setIsPouring] = useState(false);
  const [previousSubstanceCount, setPreviousSubstanceCount] = useState(0);
  const [droplets, setDroplets] = useState<{ id: number; left: number; size: number }[]>([]);
  const tubeRef = useRef<HTMLDivElement>(null);
  const liquidRef = useRef<HTMLDivElement>(null);
  const smokeContainerRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();
  
  const [showPouringTube, setShowPouringTube] = useState(false);
  const [pouringTubeRotation, setPouringTubeRotation] = useState(0);
  const [pouringSubstance, setPouringSubstance] = useState<any>(null);
  const pouringTubeAnimControls = useAnimation();

  useEffect(() => {
    const currentCount = substances.length;
    if (currentCount > previousSubstanceCount) {
      setIsPouring(true);
      
      const newSubstance = substances[currentCount - 1];
      setPouringSubstance(newSubstance.substance);
      
      setShowPouringTube(true);
      
      pouringTubeAnimControls.start({
        rotate: [0, -25, -30, -30, -25, 0],
        transition: { duration: 2, ease: "easeInOut" }
      });
      
      const newDroplets = Array.from({ length: 6 }, (_, i) => ({
        id: Date.now() + i,
        left: Math.random() * 30 + 35,
        size: Math.random() * 5 + 2,
      }));
      setDroplets(newDroplets);
      
      try {
        const splashSound = new Audio('/liquid-pour.mp3');
        splashSound.volume = 0.3;
        splashSound.play().catch(e => console.log('Could not play sound', e));
      } catch (e) {
        console.log('Sound not available');
      }
      
      const timer = setTimeout(() => {
        setIsPouring(false);
        setShowPouringTube(false);
        setDroplets([]);
      }, 1500);
      
      return () => clearTimeout(timer);
    }
    setPreviousSubstanceCount(currentCount);
  }, [substances.length, previousSubstanceCount]);

  useEffect(() => {
    if (showBubbles) {
      const newBubbles = Array.from({ length: 30 }, (_, i) => ({
        id: Date.now() + i,
        left: Math.random() * 90 + 5,
        size: Math.random() * 10 + 3,
        delay: Math.random() * 2,
        speed: Math.random() * 2 + 1,
      }));
      setBubbles(newBubbles);

      const interval = setInterval(() => {
        setBubbles(prev => [
          ...prev.slice(-25),
          {
            id: Date.now(),
            left: Math.random() * 90 + 5,
            size: Math.random() * 10 + 3,
            delay: Math.random() * 0.5,
            speed: Math.random() * 2 + 1,
          },
        ]);
      }, 400);

      return () => clearInterval(interval);
    } else {
      setBubbles([]);
    }
  }, [showBubbles]);

  useEffect(() => {
    if (showSmoke) {
      const newSmoke = Array.from({ length: 20 }, (_, i) => ({
        id: Date.now() + i,
        left: Math.random() * 100,
        size: Math.random() * 40 + 20,
        delay: Math.random() * 1.5,
      }));
      setSmokeParticles(newSmoke);

      const interval = setInterval(() => {
        setSmokeParticles(prev => [
          ...prev.slice(-18),
          {
            id: Date.now(),
            left: Math.random() * 100,
            size: Math.random() * 40 + 20,
            delay: Math.random() * 0.5,
          },
          {
            id: Date.now() + 1,
            left: Math.random() * 100,
            size: Math.random() * 30 + 25,
            delay: Math.random() * 0.3,
          },
        ]);
      }, 300);

      return () => clearInterval(interval);
    } else {
      setSmokeParticles([]);
    }
  }, [showSmoke]);

  useEffect(() => {
    if (shake) {
      controls.start({
        x: [0, -4, 4, -3, 3, -2, 2, 0],
        rotate: [0, -1.5, 1.5, -1, 1, -0.5, 0.5, 0],
        transition: { 
          duration: 0.6, 
          repeat: Infinity, 
          repeatType: "loop",
          ease: "easeInOut"
        }
      });
      
      try {
        const shakeSound = new Audio('/glass-shake.mp3');
        shakeSound.volume = 0.2;
        shakeSound.play().catch(e => console.log('Could not play sound', e));
      } catch (e) {
        console.log('Sound not available');
      }
    } else {
      controls.stop();
      controls.set({ x: 0, rotate: 0 });
    }
  }, [shake, controls]);

  const sortedSubstances = [...substances].sort((a, b) => a.substance.density - b.substance.density);
  
  const totalVolume = substances.reduce((sum, { volume }) => sum + volume, 0);
  
  let currentHeight = 0;
  const layers = sortedSubstances.map(({ substance, volume }) => {
    const heightPercentage = Math.min((volume / totalVolume) * 80, 80);
    const layer = {
      substance,
      heightPercentage,
      top: 100 - (currentHeight + heightPercentage),
    };
    currentHeight += heightPercentage;
    return layer;
  });

  const getColorWithOpacity = (color: string, opacity: number) => {
    if (color.startsWith('#')) {
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }
    return color;
  };

  const lightenColor = (color: string, amount: number) => {
    if (color.startsWith('#')) {
      let r = parseInt(color.slice(1, 3), 16);
      let g = parseInt(color.slice(3, 5), 16);
      let b = parseInt(color.slice(5, 7), 16);
      
      r = Math.min(255, r + amount);
      g = Math.min(255, g + amount);
      b = Math.min(255, b + amount);
      
      return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }
    return color;
  };

  const showHighTempGlow = temperature > 60;
  const tempGlowIntensity = Math.min((temperature - 60) / 90, 1);
  const tempGlowHue = Math.max(0, 30 - tempGlowIntensity * 20);

  return (
    <motion.div 
      ref={tubeRef}
      className={cn(
        "relative my-6 mx-auto perspective-800",
        glow && "animate-pulse-subtle",
        className
      )}
      style={{ 
        height: `${height}px`, 
        width: `${width}px`,
      }}
      animate={controls}
    >
      <div 
        className="absolute inset-0 overflow-hidden glass-container backdrop-blur-sm"
        style={{ 
          width: '100%',
          height: '100%',
          borderTopLeftRadius: width * 0.35,
          borderTopRightRadius: width * 0.35,
          borderBottomLeftRadius: width * 0.5,
          borderBottomRightRadius: width * 0.5,
          background: "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(230,240,255,0.05) 100%)",
          boxShadow: glow 
            ? `0 0 30px 10px ${getColorWithOpacity(glowColor || layers[0]?.substance.color || '#ffffff', 0.6)}, 
               inset 0 0 15px rgba(255, 255, 255, 0.15)` 
            : showHighTempGlow
            ? `0 0 25px 8px rgba(255, ${Math.round(100 - tempGlowIntensity * 80)}, 0, ${0.4 + tempGlowIntensity * 0.4}),
               inset 0 0 15px rgba(255, ${Math.round(100 - tempGlowIntensity * 80)}, 0, 0.3)`
            : "inset 0 0 20px rgba(255, 255, 255, 0.15), 0 10px 30px rgba(0, 0, 0, 0.15)",
          border: "1px solid rgba(255, 255, 255, 0.18)",
          backdropFilter: "blur(4px)",
        }}
      >
        <div className="absolute inset-0 z-5 pointer-events-none" style={{
          background: "linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.05) 30%, rgba(0,0,0,0.05) 100%)",
          borderTopLeftRadius: width * 0.35,
          borderTopRightRadius: width * 0.35,
          borderBottomLeftRadius: width * 0.5,
          borderBottomRightRadius: width * 0.5,
        }}></div>
        
        <div className="absolute top-0 left-0 right-0 h-2 bg-white/30" style={{
          borderTopLeftRadius: width * 0.35,
          borderTopRightRadius: width * 0.35,
        }}></div>
        
        <motion.div 
          className="absolute left-[12%] top-[3%] bottom-[3%] w-[0.5px] bg-gradient-to-b from-white/30 via-white/10 to-transparent"
          animate={{ opacity: [0.6, 0.2, 0.6], x: [0, 0.5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        ></motion.div>
        
        <motion.div 
          className="absolute right-[22%] top-[5%] bottom-[5%] w-[0.5px] bg-gradient-to-b from-white/20 via-white/10 to-transparent"
          animate={{ opacity: [0.5, 0.1, 0.5], x: [0, -0.5, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        ></motion.div>
        
        <div className="absolute top-0 bottom-0 left-[30%] flex flex-col justify-between py-[15%]">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center">
              <div className="w-[6px] h-[0.5px] bg-white/30"></div>
              <div className="ml-1 text-white/40 text-[6px]">
                {(5 - i) * 20}
              </div>
            </div>
          ))}
        </div>
        
        {showHighTempGlow && (
          <div 
            className="absolute inset-0 pointer-events-none mix-blend-screen"
            style={{
              borderRadius: 'inherit',
              background: `radial-gradient(circle at center, rgba(255, ${Math.round(100 - tempGlowIntensity * 80)}, 0, ${0.2 + tempGlowIntensity * 0.3}) 0%, transparent 80%)`,
              animation: 'high-temp-pulse 1.5s infinite alternate',
              opacity: 0.5 + tempGlowIntensity * 0.5
            }}
          />
        )}
        
        <div ref={liquidRef} className="relative w-full h-full">
          {layers.map((layer, index) => (
            <motion.div
              key={`${layer.substance.id}-${index}`}
              className="liquid absolute left-0 right-0"
              initial={{ height: 0 }}
              animate={{ height: `${layer.heightPercentage}%` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              style={{
                height: `${layer.heightPercentage}%`,
                bottom: `${index === 0 ? 0 : 'auto'}`,
                top: `${index !== 0 ? `${layer.top}%` : 'auto'}`,
                backgroundColor: getColorWithOpacity(layer.substance.color, 0.85),
                boxShadow: `inset 0 0 15px ${getColorWithOpacity(layer.substance.color, 0.3)}`,
                backdropFilter: "blur(2px)",
                borderRadius: index === layers.length - 1 ? "0 0 5px 5px" : 0,
                zIndex: 2 + (layers.length - index),
              }}
            >
              <motion.div 
                className="absolute top-0 left-0 right-0 h-3"
                style={{ 
                  background: `linear-gradient(to bottom, ${lightenColor(layer.substance.color, 40)} 0%, ${getColorWithOpacity(layer.substance.color, 0)} 100%)`,
                  filter: "blur(1.5px)",
                  zIndex: 3,
                }}
                animate={{ 
                  clipPath: [
                    "polygon(0% 0%, 20% 40%, 50% 20%, 80% 40%, 100% 0%, 100% 100%, 0% 100%)",
                    "polygon(0% 0%, 30% 50%, 50% 10%, 70% 50%, 100% 0%, 100% 100%, 0% 100%)",
                    "polygon(0% 0%, 20% 40%, 50% 20%, 80% 40%, 100% 0%, 100% 100%, 0% 100%)",
                  ]
                }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
              />

              <motion.div 
                className="absolute top-1 left-[15%] h-1 opacity-60 rounded-full" 
                style={{ 
                  background: "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.7) 50%, rgba(255,255,255,0) 100%)",
                  width: "40%",
                }}
                animate={{ x: [-5, 5, -5], opacity: [0.6, 0.8, 0.6] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />
              
              <div className="absolute inset-0" style={{
                background: `linear-gradient(to bottom, ${getColorWithOpacity(layer.substance.color, 0.1)} 0%, ${getColorWithOpacity(layer.substance.color, 0.4)} 100%)`,
                zIndex: -1,
              }}></div>
              
              {layer.substance.state === "solid" && (
                <div className="absolute inset-0 overflow-hidden">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div 
                      key={i}
                      className="absolute bg-white/20"
                      style={{
                        width: Math.random() * 12 + 5,
                        height: Math.random() * 12 + 5,
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        transform: `rotate(${Math.random() * 45}deg)`,
                        opacity: Math.random() * 0.4 + 0.2,
                        borderRadius: Math.random() > 0.5 ? '2px' : '50%',
                      }}
                    ></div>
                  ))}
                </div>
              )}
              
              {layer.substance.state === "gas" && (
                <div className="absolute inset-0 overflow-hidden">
                  {Array.from({ length: 15 }).map((_, i) => (
                    <motion.div 
                      key={i}
                      className="absolute rounded-full bg-white/15"
                      style={{
                        width: Math.random() * 20 + 10,
                        height: Math.random() * 15 + 10,
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        opacity: Math.random() * 0.3 + 0.1,
                      }}
                      animate={{
                        y: [0, -10, 0],
                        opacity: [0.1, 0.3, 0.1],
                      }}
                      transition={{
                        duration: 2 + Math.random() * 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: Math.random() * 2,
                      }}
                    ></motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>
        
        {showBubbles && bubbles.map(bubble => (
          <motion.div
            key={bubble.id}
            className="bubble-particle absolute rounded-full z-30"
            initial={{ 
              bottom: "5%", 
              left: `${bubble.left}%`,
              opacity: 0.8,
              scale: 0.8,
            }}
            animate={{ 
              bottom: "90%", 
              opacity: [0.8, 0.6, 0],
              scale: [0.8, 1, 1.5],
              x: bubble.left < 50 ? [0, 5, 2, 7] : [0, -5, -2, -7],
            }}
            transition={{ 
              duration: bubble.speed,
              delay: bubble.delay,
              repeat: Infinity,
              ease: "easeOut" 
            }}
            style={{
              width: `${bubble.size}px`,
              height: `${bubble.size}px`,
              background: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.3) 80%)",
              boxShadow: "0 0 2px rgba(255, 255, 255, 0.5)",
              backdropFilter: "blur(1px)",
            }}
          />
        ))}
        
        <div 
          ref={smokeContainerRef}
          className="absolute top-[-100px] left-[-50px] right-[-50px] h-[150px] pointer-events-none overflow-visible z-50"
        >
          {showSmoke && smokeParticles.map(particle => (
            <motion.div
              key={particle.id}
              className="smoke-particle absolute z-50"
              initial={{ 
                top: "100%", 
                left: `${particle.left}%`,
                opacity: 0.5,
                scale: 0.6,
                borderRadius: "50%",
              }}
              animate={{ 
                top: "-30%", 
                opacity: [0.5, 0.3, 0],
                scale: 4,
                x: particle.left > 50 ? [0, 15, 30] : [0, -15, -30],
              }}
              transition={{ 
                duration: 4,
                delay: particle.delay,
                repeat: Infinity,
                ease: "easeOut",
              }}
              style={{
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                background: "radial-gradient(circle, rgba(220,220,220,0.9) 0%, rgba(150,150,150,0.01) 80%)",
                filter: "blur(8px)",
              }}
            />
          ))}
        </div>
        
        {showFire && (
          <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 z-20 w-40 h-60 pointer-events-none">
            <motion.div 
              className="w-full h-full relative"
              animate={{ y: [0, -2, 1, -1, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatType: "mirror" }}
            >
              <motion.div 
                className="absolute bottom-0 left-1/2 transform -translate-x-1/2 rounded-full"
                style={{
                  background: "radial-gradient(circle, rgba(255,126,0,1) 0%, rgba(255,126,0,0.7) 50%, rgba(255,126,0,0) 100%)",
                  width: 60,
                  height: 40,
                }}
              />
              
              <motion.div 
                className="absolute bottom-0 left-1/2 transform -translate-x-1/2"
                style={{
                  width: 40,
                  height: 80,
                  background: "linear-gradient(to top, rgba(255,126,0,1) 0%, rgba(255,198,0,1) 60%, rgba(241, 255, 158,0.8) 100%)",
                  borderRadius: "0 0 50% 50% / 0 0 100% 100%",
                  boxShadow: "0 0 30px 15px rgba(255,126,0,0.6)",
                  filter: "blur(4px)"
                }}
                animate={{ 
                  height: [80, 90, 75, 85, 80],
                  width: [40, 38, 42, 40, 40]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  repeatType: "mirror"
                }}
              />
              
              {Array.from({ length: 15 }).map((_, i) => {
                const posX = -20 + Math.random() * 40;
                const size = 15 + Math.random() * 30;
                const delay = Math.random() * 2;
                
                return (
                  <motion.div
                    key={i}
                    className="absolute"
                    style={{
                      left: `calc(50% + ${posX}px)`,
                      bottom: 0,
                      width: size / 2,
                      height: size,
                      background: "linear-gradient(to top, rgba(255,126,0,1) 0%, rgba(255,198,0,1) 60%, rgba(241, 255, 158,0.8) 100%)",
                      borderRadius: "0 0 50% 50% / 0 0 100% 100%",
                      filter: "blur(2px)",
                      boxShadow: "0 0 10px 5px rgba(255,126,0,0.3)"
                    }}
                    animate={{
                      height: [size, size * 1.2, size * 0.9, size * 1.1, size],
                      opacity: [1, 0.9, 1, 0.8, 1]
                    }}
                    transition={{ 
                      duration: 1 + Math.random() * 1, 
                      delay: delay,
                      repeat: Infinity,
                      repeatType: "mirror"
                    }}
                  />
                );
              })}
            </motion.div>
          </div>
        )}
        
        {showExplosion && (
          <div className="absolute inset-0 z-30 pointer-events-none">
            <div className="w-full h-full relative">
              <motion.div 
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-500"
                initial={{ width: 0, height: 0, opacity: 0 }}
                animate={{ 
                  width: 200 * intensity, 
                  height: 200 * intensity, 
                  opacity: [0, 1, 0.8, 0.5, 0]
                }}
                transition={{ 
                  duration: 1, 
                  times: [0, 0.1, 0.3, 0.6, 1],
                  repeat: Infinity,
                  repeatDelay: 3
                }}
              />
              
              {Array.from({ length: 20 }).map((_, i) => {
                const angle = Math.random() * 360;
                const distance = (40 + Math.random() * 100) * intensity;
                const size = (5 + Math.random() * 15) * intensity;
                const delay = Math.random() * 0.2;
                
                return (
                  <motion.div
                    key={i}
                    className="absolute top-1/2 left-1/2 rounded-full"
                    initial={{ 
                      x: 0, 
                      y: 0,
                      width: size / 3,
                      height: size / 3,
                      opacity: 1,
                      backgroundColor: ['#FF6B00', '#FF9500', '#FFCC00', '#FF5500'][Math.floor(Math.random() * 4)]
                    }}
                    animate={{ 
                      x: Math.cos(angle * Math.PI / 180) * distance,
                      y: Math.sin(angle * Math.PI / 180) * distance,
                      width: size,
                      height: size,
                      opacity: 0
                    }}
                    transition={{ 
                      duration: 0.8 + Math.random() * 0.4,
                      delay: delay,
                      repeat: Infinity,
                      repeatDelay: 3
                    }}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showPouringTube && pouringSubstance && (
          <motion.div 
            className="absolute z-50 pointer-events-none"
            initial={{ opacity: 0, top: pouringTubeY, left: pouringTubeX, rotate: 0 }}
            animate={pouringTubeAnimControls}
            exit={{ opacity: 0, rotate: 0 }}
            style={{ 
              transformOrigin: "90% 90%",
              width: width * 0.8,
              height: height * 0.6,
            }}
          >
            <div 
              className="relative w-full h-full"
              style={{
                borderTopLeftRadius: width * 0.25,
                borderTopRightRadius: width * 0.25,
                borderBottomLeftRadius: width * 0.4,
                borderBottomRightRadius: width * 0.4,
                background: "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(230,240,255,0.05) 100%)",
                border: "1px solid rgba(255, 255, 255, 0.18)",
                overflow: "hidden",
                boxShadow: "inset 0 0 10px rgba(255, 255, 255, 0.1), 0 5px 15px rgba(0, 0, 0, 0.1)",
              }}
            >
              <motion.div 
                className="absolute bottom-0 left-0 right-0"
                initial={{ height: "60%" }}
                animate={{ height: "10%" }}
                transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
                style={{
                  backgroundColor: getColorWithOpacity(pouringSubstance.color, 0.85),
                  boxShadow: `inset 0 0 15px ${getColorWithOpacity(pouringSubstance.color, 0.3)}`,
                }}
              >
                <motion.div 
                  className="absolute top-0 left-0 right-0 h-3"
                  style={{ 
                    background: `linear-gradient(to bottom, ${lightenColor(pouringSubstance.color, 40)} 0%, ${getColorWithOpacity(pouringSubstance.color, 0)} 100%)`,
                    filter: "blur(1px)",
                  }}
                />
              </motion.div>
            </div>
            
            <motion.div 
              className="absolute bottom-0 right-[20%] z-40"
              initial={{ height: 0, opacity: 0 }}
              animate={{ 
                height: [0, height * 0.5, height * 0.7], 
                opacity: [0, 1, 0.8, 0.6, 0.3, 0] 
              }}
              transition={{ 
                duration: 1.5, 
                ease: "easeOut", 
                times: [0, 0.2, 0.4, 0.6, 0.8, 1] 
              }}
              style={{
                width: width * 0.08,
                background: `linear-gradient(to bottom, ${getColorWithOpacity(pouringSubstance.color, 0.9)} 0%, ${getColorWithOpacity(pouringSubstance.color, 0.7)} 100%)`,
                borderRadius: '3px',
                transformOrigin: 'top',
                boxShadow: '0 0 10px rgba(0,0,0,0.1)',
              }}
            >
              <motion.div 
                className="absolute inset-0"
                animate={{ y: [0, 15, 30] }}
                transition={{ duration: 0.8, repeat: Infinity, repeatType: "loop" }}
                style={{
                  background: `linear-gradient(to bottom, transparent 0%, ${getColorWithOpacity(pouringSubstance.color, 0.3)} 30%, transparent 100%)`,
                  opacity: 0.6,
                }}
              />
            </motion.div>
          </motion.div>
        )}

        {isPouring && (
          <>
            <motion.div 
              className="absolute -top-24 left-1/2 transform -translate-x-1/2 z-40"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 60, opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.8 }}
              style={{
                width: width * 0.08,
                background: `linear-gradient(to bottom, ${getColorWithOpacity(substances[substances.length - 1]?.substance.color || '#cccccc', 0.9)} 0%, ${getColorWithOpacity(substances[substances.length - 1]?.substance.color || '#cccccc', 0.7)} 100%)`,
                borderRadius: '3px',
                transformOrigin: 'bottom',
                boxShadow: '0 0 10px rgba(0,0,0,0.1)',
              }}
            >
              <motion.div 
                className="absolute inset-0"
                animate={{ y: [0, 15, 30] }}
                transition={{ duration: 0.8, repeat: Infinity, repeatType: "loop" }}
                style={{
                  background: `linear-gradient(to bottom, transparent 0%, ${getColorWithOpacity(substances[substances.length - 1]?.substance.color || '#cccccc', 0.3)} 30%, transparent 100%)`,
                  opacity: 0.6,
                }}
              />
            </motion.div>
            
            {droplets.map((droplet) => (
              <motion.div
                key={droplet.id}
                className="absolute rounded-full z-40"
                initial={{ 
                  top: -5, 
                  left: `${droplet.left}%`,
                  width: `${droplet.size}px`,
                  height: `${droplet.size}px`, 
                  opacity: 0.9,
                  backgroundColor: substances[substances.length - 1]?.substance.color || '#cccccc',
                }}
                animate={{ 
                  top: 50,
                  opacity: 0,
                  scale: 0.5,
                  x: droplet.left > 50 ? 10 : -10,
                }}
                transition={{ 
                  duration: 1 + Math.random() * 0.5,
                  ease: "easeIn" 
                }}
                style={{
                  boxShadow: `0 0 5px ${getColorWithOpacity(substances[substances.length - 1]?.substance.color || '#cccccc', 0.3)}`,
                }}
              />
            ))}
          </>
        )}
      </AnimatePresence>

      <div 
        className="absolute -top-3 left-1/2 transform -translate-x-1/2 rounded-t-xl overflow-hidden"
        style={{
          width: width * 0.5,
          height: width * 0.3,
          background: "linear-gradient(to bottom, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)",
          boxShadow: "inset 0 0 10px rgba(255, 255, 255, 0.1), 0 5px 15px rgba(0, 0, 0, 0.1)",
          border: "1px solid rgba(255, 255, 255, 0.18)",
          borderBottom: "none",
          zIndex: 1,
        }}
      >
        <div className="absolute left-[30%] top-0 bottom-0 w-[0.5px] bg-white/20"></div>
      </div>
      
      <div className="absolute bottom-[-20px] left-1/2 transform -translate-x-1/2 z-0">
        <div 
          className="rounded-md"
          style={{
            width: width * 1.4,
            height: height * 0.07,
            background: "linear-gradient(to bottom, rgba(80,80,100,0.7) 0%, rgba(40,40,50,0.8) 100%)",
            boxShadow: "0 5px 15px rgba(0, 0, 0, 0.2), inset 0 1px 1px rgba(255, 255, 255, 0.1)",
            border: "1px solid rgba(0, 0, 0, 0.3)",
            borderRadius: "5px",
          }}
        >
          <div 
            className="absolute top-0 left-0 right-0 h-[1px] bg-white/10 rounded-t-md"
          ></div>
        </div>
      </div>
      
      <style>
        {`
        @keyframes pulse-subtle {
          0%, 100% { box-shadow: 0 0 15px 5px rgba(255, 255, 255, 0.3); }
          50% { box-shadow: 0 0 25px 8px rgba(255, 255, 255, 0.5); }
        }
        
        @keyframes high-temp-pulse {
          0% { opacity: 0.5; transform: scale(0.98); }
          100% { opacity: 0.8; transform: scale(1.02); }
        }
        
        .animate-pulse-subtle {
          animation: pulse-subtle 2s ease-in-out infinite;
        }
        
        .perspective-800 {
          perspective: 800px;
        }
      `}
      </style>
    </motion.div>
  );
};

export default TestTube;