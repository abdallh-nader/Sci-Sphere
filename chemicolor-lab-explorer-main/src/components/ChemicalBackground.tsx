import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

// إنشاء كائن الصوت
const pouringSound = new Audio('/sounds/pouring.mp3');

export const ChemicalBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Create a collection of atoms and tubes to be animated
    const atomCount = Math.floor(window.innerWidth / 100); // Responsive atom count
    const container = containerRef.current;
    
    // Clean up any existing elements
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    
    // Create and append atoms
    for (let i = 0; i < atomCount; i++) {
      createAndAppendAtom(container, i);
    }
    
    // Create and append test tubes
    for (let i = 0; i < Math.floor(atomCount / 3); i++) {
      createAndAppendTube(container, i);
    }
    
    // Handle window resize with throttling
    let resizeTimeout: number | null = null;
    const handleResize = () => {
      if (resizeTimeout) {
        window.clearTimeout(resizeTimeout);
      }
      
      resizeTimeout = window.setTimeout(() => {
        // Rerun the setup on window resize
        while (container.firstChild) {
          container.removeChild(container.firstChild);
        }
        
        const newAtomCount = Math.floor(window.innerWidth / 100);
        for (let i = 0; i < newAtomCount; i++) {
          createAndAppendAtom(container, i);
        }
        
        for (let i = 0; i < Math.floor(newAtomCount / 3); i++) {
          createAndAppendTube(container, i);
        }
        
        resizeTimeout = null;
      }, 300); // Throttle to once every 300ms
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      if (resizeTimeout) {
        window.clearTimeout(resizeTimeout);
      }
    };
  }, []);
  
  const createAndAppendAtom = (container: HTMLDivElement, index: number) => {
    const atom = document.createElement('div');
    atom.className = 'absolute rounded-full animate-float';
    
    // Random properties for diverse appearance
    const size = Math.floor(Math.random() * 30) + 10; // 10-40px
    const colors = ['#9b87f5', '#7E69AB', '#D6BCFA', '#8B5CF6', '#D946EF', '#F97316', '#0EA5E9'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    // Position randomly but ensure good distribution
    const left = (Math.random() * 100) + '%';
    const top = (Math.random() * 100) + '%';
    const delay = Math.random() * 5; // Random animation delay
    const duration = Math.random() * 8 + 15; // Longer animation duration (15-23s)
    
    atom.style.width = `${size}px`;
    atom.style.height = `${size}px`;
    atom.style.backgroundColor = color;
    atom.style.opacity = '0.3';
    atom.style.left = left;
    atom.style.top = top;
    atom.style.animationDelay = `${delay}s`;
    atom.style.animationDuration = `${duration}s`;
    atom.style.boxShadow = `0 0 ${size/2}px ${color}`;
    atom.style.willChange = 'transform'; // Performance optimization
    
    // Add an orbital effect to some atoms
    if (Math.random() > 0.7) {
      const orbital = document.createElement('div');
      orbital.className = 'absolute rounded-full border-2 border-white/20 animate-spin';
      orbital.style.width = `${size * 2.5}px`;
      orbital.style.height = `${size * 2.5}px`;
      orbital.style.left = `-${size * 0.75}px`;
      orbital.style.top = `-${size * 0.75}px`;
      orbital.style.animationDuration = `${Math.random() * 10 + 5}s`;
      
      atom.appendChild(orbital);
    }
    
    container.appendChild(atom);
  };
  
  const createAndAppendTube = (container: HTMLDivElement, index: number) => {
    const tube = document.createElement('div');
    tube.className = 'absolute animate-float';
    
    // Test tube styling
    const height = Math.floor(Math.random() * 60) + 40; // 40-100px
    const width = height / 3;
    
    const left = (Math.random() * 100) + '%';
    const top = (Math.random() * 100) + '%';
    const rotation = (Math.random() * 40) - 20; // -20 to 20 degrees
    const delay = Math.random() * 5;
    const duration = 8 + Math.random() * 8; // Longer animation duration (8-16s)
    
    tube.style.width = `${width}px`;
    tube.style.height = `${height}px`;
    tube.style.left = left;
    tube.style.top = top;
    tube.style.transform = `rotate(${rotation}deg)`;
    tube.style.animationDelay = `${delay}s`;
    tube.style.animationDuration = `${duration}s`;
    tube.style.willChange = 'transform'; // Performance optimization
    
    // Create the tube shape
    tube.innerHTML = `
      <div class="w-full h-full flex flex-col">
        <div class="w-full h-1/6 bg-white/30 rounded-t-full"></div>
        <div class="w-full h-5/6 bg-gradient-to-b from-cyan-400/30 to-violet-500/30 rounded-b-lg"></div>
      </div>
    `;
    
    // تشغيل صوت السكب عند إنشاء الأنبوب
    pouringSound.currentTime = 0; // إعادة تعيين الصوت ليبدأ من البداية
    pouringSound.play().catch((error) => console.error("Error playing pouring sound:", error));
    
    container.appendChild(tube);
  };
  
  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-full h-full pointer-events-none overflow-hidden z-0"
      style={{ transform: 'translate3d(0,0,0)' }} // Force GPU acceleration
      aria-hidden="true"
    />
  );
};