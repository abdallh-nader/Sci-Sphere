
import React from 'react';
import { motion } from 'framer-motion';

interface BrokenTestTubeProps {
  width?: number;
  height?: number;
  className?: string;
  color?: string;
}

const BrokenTestTube: React.FC<BrokenTestTubeProps> = ({
  width = 120,
  height = 350,
  className = "",
  color = "#cccccc"
}) => {
  // Generate glass shards
  const generateShards = () => {
    const shards = [];
    const shardCount = 30; // Good balance for performance
    
    for (let i = 0; i < shardCount; i++) {
      const size = Math.random() * 50 + 15;
      const angle = Math.random() * 360;
      const distance = Math.random() * 250 + 80;
      const delay = Math.random() * 0.15;
      const duration = Math.random() * 0.8 + 0.8;
      const rotation = Math.random() * 1440 - 720;
      
      shards.push(
        <motion.div
          key={i}
          className="absolute bg-white/80 backdrop-blur-sm will-change-transform"
          style={{ 
            width: size, 
            height: size * (0.5 + Math.random() * 0.5),
            borderRadius: Math.random() > 0.5 ? '2px' : '0px',
            background: `linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.6) 100%)`,
            boxShadow: `0 0 15px rgba(255, 255, 255, 0.7), inset 0 0 10px rgba(255, 255, 255, 0.7)`,
            transformOrigin: 'center',
            zIndex: 40,
            transform: 'translate3d(0,0,0)', // Force GPU acceleration
          }}
          initial={{ 
            x: 0, 
            y: 0, 
            opacity: 0,
            rotate: 0,
            scale: 0.2,
          }}
          animate={{ 
            x: Math.cos(angle * Math.PI / 180) * distance, 
            y: Math.sin(angle * Math.PI / 180) * distance, 
            opacity: [0, 1, 0.8, 0],
            rotate: rotation,
            scale: [0.2, 1.5, 1, 0.5]
          }}
          transition={{ 
            duration: duration,
            delay: delay,
            ease: [0.2, 0.65, 0.3, 0.9]
          }}
        />
      );
    }
    
    // Liquid splash particles - optimized count for better performance
    for (let i = 0; i < 45; i++) {
      const size = Math.random() * 35 + 8;
      const angle = Math.random() * 360;
      const distance = Math.random() * 350 + 60;
      const delay = Math.random() * 0.12;
      const duration = Math.random() * 1.4 + 0.6;
      
      shards.push(
        <motion.div
          key={`liquid-${i}`}
          className="absolute rounded-full z-30 will-change-transform"
          style={{ 
            width: size, 
            height: size,
            backgroundColor: color,
            boxShadow: `0 0 12px ${color}dd`,
            transform: 'translate3d(0,0,0)', // Force GPU acceleration
          }}
          initial={{ 
            x: 0, 
            y: 0, 
            opacity: 0,
            scale: 0.5
          }}
          animate={{ 
            x: Math.cos(angle * Math.PI / 180) * distance, 
            y: Math.sin(angle * Math.PI / 180) * distance, 
            opacity: [0, 1, 0.7, 0],
            scale: [0.5, 1.7, 0.9, 0.2]
          }}
          transition={{ 
            duration: duration,
            delay: delay,
            ease: [0.2, 0.65, 0.3, 0.9]
          }}
        />
      );
    }
    
    return shards;
  };

  // Flash effect - enhanced
  const flashEffect = (
    <motion.div 
      className="absolute inset-0 bg-white rounded-full z-20 will-change-transform"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ 
        opacity: [0, 1, 0], 
        scale: [0.5, 2.5, 6]
      }}
      transition={{ duration: 1.1, ease: "easeOut" }}
    />
  );

  // Smoke particles - improved and reduced count for better performance
  const smokeParticles = Array.from({ length: 25 }).map((_, i) => {
    const size = Math.random() * 180 + 90;
    const posX = Math.random() * 320 - 160;
    const posY = Math.random() * 120 - 170;
    const delay = Math.random() * 0.25;
    const duration = Math.random() * 3.5 + 2.5;
    
    return (
      <motion.div
        key={`smoke-${i}`}
        className="absolute rounded-full will-change-transform"
        style={{ 
          width: size, 
          height: size,
          background: 'radial-gradient(circle, rgba(150,150,150,0.98) 0%, rgba(100,100,100,0.18) 70%)',
          filter: 'blur(15px)',
          zIndex: 20,
          transform: 'translate3d(0,0,0)', // Force GPU acceleration
        }}
        initial={{ 
          x: posX, 
          y: height / 2 + posY, 
          opacity: 0,
          scale: 0.2
        }}
        animate={{ 
          y: [height / 2 + posY, -size * 2],
          opacity: [0, 0.95, 0.6, 0],
          scale: [0.2, 1.5, 2.2, 3]
        }}
        transition={{ 
          duration: duration,
          delay: delay,
          ease: "easeOut"
        }}
      />
    );
  });

  // Wave effect radiating from explosion center - enhanced
  const waveEffect = (
    <motion.div
      className="absolute rounded-full border-2 border-white/60 z-10 will-change-transform"
      style={{
        width: 20,
        height: 20,
        top: "50%",
        left: "50%",
        marginLeft: -10,
        marginTop: -10,
        transform: 'translate3d(0,0,0)', // Force GPU acceleration
      }}
      initial={{ opacity: 0.9, scale: 0 }}
      animate={{ 
        opacity: [0.9, 0],
        scale: [0, 20],
      }}
      transition={{ duration: 1.2, ease: "easeOut" }}
    />
  );

  // Secondary wave for extra effect
  const secondaryWave = (
    <motion.div
      className="absolute rounded-full border border-white/40 z-10 will-change-transform"
      style={{
        width: 10,
        height: 10,
        top: "50%",
        left: "50%",
        marginLeft: -5,
        marginTop: -5,
        transform: 'translate3d(0,0,0)', // Force GPU acceleration
      }}
      initial={{ opacity: 0.7, scale: 0 }}
      animate={{ 
        opacity: [0.7, 0],
        scale: [0, 25],
      }}
      transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
    />
  );

  return (
    <div
      className={`relative ${className}`}
      style={{ 
        width: `${width}px`, 
        height: `${height}px`,
        transform: 'translate3d(0,0,0)', // Force GPU acceleration
      }}
    >
      {flashEffect}
      {waveEffect}
      {secondaryWave}
      {generateShards()}
      {smokeParticles}
    </div>
  );
};

export default BrokenTestTube;
