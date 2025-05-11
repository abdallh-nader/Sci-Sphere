// Liquid wave animation
export const createWaveEffect = (element: HTMLElement, color: string) => {
  if (!element) return;
  
  // Create wave elements
  const wave = document.createElement('div');
  wave.className = 'absolute top-0 left-0 w-full h-3';
  wave.style.background = `linear-gradient(90deg, transparent, ${color}40, transparent)`;
  wave.style.animation = 'wave 2s ease-in-out infinite';
  
  element.appendChild(wave);
  
  return () => {
    if (element.contains(wave)) {
      element.removeChild(wave);
    }
  };
};

// Enhanced bubble animation - more visible and varied
export const createBubbleEffect = (container: HTMLElement, intensity: number = 1) => {
  if (!container) return;
  
  const bubbleCount = Math.floor(Math.random() * 7 * intensity) + 8;
  const bubbles: HTMLElement[] = [];
  
  const createBubble = () => {
    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    
    // Random properties with enhanced size
    const size = Math.random() * 10 + 5;
    const left = Math.random() * 80 + 10; // % from left
    const delay = Math.random() * 2; // seconds
    
    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;
    bubble.style.left = `${left}%`;
    bubble.style.bottom = '10%';
    bubble.style.opacity = '0.8'; // Increased opacity for better visibility
    bubble.style.animationDelay = `${delay}s`;
    bubble.style.background = 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.9), rgba(255,255,255,0.3))';
    bubble.style.backdropFilter = 'blur(1px)';
    bubble.style.boxShadow = '0 0 2px rgba(255,255,255,0.5)';
    
    container.appendChild(bubble);
    bubbles.push(bubble);
  };
  
  // Create multiple bubbles
  for (let i = 0; i < bubbleCount; i++) {
    createBubble();
  }
  
  // Cleanup function
  return () => {
    bubbles.forEach(bubble => {
      if (container.contains(bubble)) {
        container.removeChild(bubble);
      }
    });
  };
};

// Enhanced smoke animation - more visible and extends outside container
export const createSmokeEffect = (container: HTMLElement) => {
  if (!container) return;
  
  // Create smoke container that extends beyond the test tube
  const smokeContainer = document.createElement('div');
  smokeContainer.className = 'absolute top-[-100px] left-0 right-0 h-[150px] pointer-events-none overflow-visible';
  container.appendChild(smokeContainer);
  
  const smokeCount = Math.floor(Math.random() * 5) + 8; // More smoke particles
  const smokes: HTMLElement[] = [];
  
  const createSmoke = () => {
    const smoke = document.createElement('div');
    smoke.className = 'absolute animate-smoke';
    
    // Random properties with larger size
    const size = Math.random() * 40 + 20; // Larger smoke particles
    const left = Math.random() * 120 - 10; // % from left, allowing some to go outside container
    const delay = Math.random() * 1.5; // seconds
    const opacity = Math.random() * 0.5 + 0.3; // Higher opacity for better visibility
    
    smoke.style.width = `${size}px`;
    smoke.style.height = `${size}px`;
    smoke.style.left = `${left}%`;
    smoke.style.bottom = '0';
    smoke.style.borderRadius = '50%';
    smoke.style.background = 'radial-gradient(circle, rgba(200,200,200,0.8) 0%, rgba(150,150,150,0.01) 70%)';
    smoke.style.animationDelay = `${delay}s`;
    smoke.style.opacity = `${opacity}`;
    smoke.style.filter = 'blur(5px)';
    smoke.style.transform = 'translateY(0)';
    smoke.style.animation = `smoke-rise ${2 + Math.random() * 2}s ease-out forwards`;
    
    smokeContainer.appendChild(smoke);
    smokes.push(smoke);
  };
  
  // Create CSS for smoke animation if it doesn't exist
  if (!document.getElementById('enhanced-smoke-animation-styles')) {
    const style = document.createElement('style');
    style.id = 'enhanced-smoke-animation-styles';
    style.textContent = `
      @keyframes smoke-rise {
        0% { transform: translateY(0) scale(0.8); opacity: 0.8; }
        100% { transform: translateY(-150px) scale(1.8); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }
  
  // Create multiple smoke particles
  for (let i = 0; i < smokeCount; i++) {
    createSmoke();
  }
  
  // Create smoke at intervals for a continuous effect
  const interval = setInterval(() => {
    for (let i = 0; i < Math.floor(Math.random() * 2) + 1; i++) {
      createSmoke();
    }
  }, 400);
  
  // Cleanup function
  return () => {
    clearInterval(interval);
    smokes.forEach(smoke => {
      if (smokeContainer.contains(smoke)) {
        smokeContainer.removeChild(smoke);
      }
    });
    if (container.contains(smokeContainer)) {
      container.removeChild(smokeContainer);
    }
  };
};

// Enhanced fire animation effect
export const createFireEffect = (container: HTMLElement) => {
  if (!container) return;
  
  const fireBase = document.createElement('div');
  fireBase.className = 'absolute bottom-0 left-0 right-0 overflow-hidden';
  fireBase.style.height = '40%';
  
  const fireCount = Math.floor(Math.random() * 8) + 12;
  const flames: HTMLElement[] = [];
  
  const createFlame = () => {
    const flame = document.createElement('div');
    flame.className = 'absolute bottom-0';
    
    // Random properties
    const width = Math.random() * 30 + 10;
    const height = Math.random() * 60 + 40;
    const left = Math.random() * 80 + 10; // % from left
    const animationDuration = Math.random() * 2 + 1; // seconds
    
    flame.style.width = `${width}px`;
    flame.style.height = `${height}px`;
    flame.style.left = `${left}%`;
    flame.style.borderRadius = '50% 50% 20% 20%';
    flame.style.background = 'linear-gradient(to top, #ff7b00, #ff4500, #ff0000)';
    flame.style.filter = 'blur(4px)';
    flame.style.opacity = `${Math.random() * 0.4 + 0.6}`;
    flame.style.animation = `flicker ${animationDuration}s infinite alternate`;
    
    fireBase.appendChild(flame);
    flames.push(flame);
  };
  
  // Create CSS for flame animation if it doesn't exist
  if (!document.getElementById('fire-animation-styles')) {
    const style = document.createElement('style');
    style.id = 'fire-animation-styles';
    style.textContent = `
      @keyframes flicker {
        0% { transform: scale(1); opacity: 0.8; }
        100% { transform: scale(0.8, 1.1); opacity: 1; }
      }
    `;
    document.head.appendChild(style);
  }
  
  // Create multiple flames
  for (let i = 0; i < fireCount; i++) {
    createFlame();
  }
  
  container.appendChild(fireBase);
  
  // Cleanup function
  return () => {
    if (container.contains(fireBase)) {
      container.removeChild(fireBase);
    }
  };
};

// Ice/frost formation effect
export const createIceEffect = (container: HTMLElement) => {
  if (!container) return;
  
  const frostOverlay = document.createElement('div');
  frostOverlay.className = 'absolute top-0 left-0 right-0 bottom-0 pointer-events-none';
  frostOverlay.style.background = 'radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, rgba(200,240,255,0.3) 100%)';
  frostOverlay.style.backdropFilter = 'blur(1px)';
  frostOverlay.style.borderRadius = 'inherit';
  frostOverlay.style.border = '2px solid rgba(255,255,255,0.3)';
  frostOverlay.style.boxShadow = 'inset 0 0 10px rgba(255,255,255,0.5)';
  frostOverlay.style.animation = 'frost-form 3s forwards';
  
  // Add frost crystals
  const crystalCount = Math.floor(Math.random() * 10) + 15;
  
  // Create CSS for frost animation if it doesn't exist
  if (!document.getElementById('frost-animation-styles')) {
    const style = document.createElement('style');
    style.id = 'frost-animation-styles';
    style.textContent = `
      @keyframes frost-form {
        0% { opacity: 0; }
        100% { opacity: 1; }
      }
    `;
    document.head.appendChild(style);
  }
  
  for (let i = 0; i < crystalCount; i++) {
    const crystal = document.createElement('div');
    
    // Random properties
    const size = Math.random() * 15 + 5;
    const left = Math.random() * 100;
    const top = Math.random() * 100;
    const opacity = Math.random() * 0.5 + 0.2;
    const rotation = Math.random() * 360;
    
    crystal.style.position = 'absolute';
    crystal.style.width = `${size}px`;
    crystal.style.height = `${size}px`;
    crystal.style.left = `${left}%`;
    crystal.style.top = `${top}%`;
    crystal.style.opacity = `${opacity}`;
    crystal.style.background = 'rgba(255,255,255,0.8)';
    crystal.style.clipPath = 'polygon(50% 0%, 80% 30%, 100% 50%, 80% 70%, 50% 100%, 20% 70%, 0% 50%, 20% 30%)';
    crystal.style.transform = `rotate(${rotation}deg) scale(${Math.random() * 0.5 + 0.5})`;
    
    frostOverlay.appendChild(crystal);
  }
  
  container.appendChild(frostOverlay);
  
  // Cleanup function
  return () => {
    if (container.contains(frostOverlay)) {
      container.removeChild(frostOverlay);
    }
  };
};

// Enhanced glow/light emission effect - more visible and pulsating
export const createGlowEffect = (container: HTMLElement, color: string = '#ffff00') => {
  if (!container) return;
  
  // Inner glow
  const innerGlow = document.createElement('div');
  innerGlow.className = 'absolute inset-0 pointer-events-none';
  innerGlow.style.borderRadius = 'inherit';
  innerGlow.style.boxShadow = `inset 0 0 20px 5px ${color}`;
  innerGlow.style.animation = 'pulse-glow-inner 1.5s infinite alternate';
  
  // Outer glow - stronger and more visible
  const outerGlow = document.createElement('div');
  outerGlow.className = 'absolute inset-0 pointer-events-none';
  outerGlow.style.borderRadius = 'inherit';
  outerGlow.style.boxShadow = `0 0 30px 15px ${color}`;
  outerGlow.style.animation = 'pulse-glow-outer 2s infinite alternate';
  outerGlow.style.filter = 'blur(5px)';
  
  // Create CSS for enhanced glow animation if it doesn't exist
  if (!document.getElementById('glow-animation-styles')) {
    const style = document.createElement('style');
    style.id = 'glow-animation-styles';
    style.textContent = `
      @keyframes pulse-glow-inner {
        0% { opacity: 0.7; }
        100% { opacity: 1; }
      }
      @keyframes pulse-glow-outer {
        0% { opacity: 0.5; transform: scale(0.98); }
        100% { opacity: 0.8; transform: scale(1.02); }
      }
    `;
    document.head.appendChild(style);
  }
  
  container.appendChild(innerGlow);
  container.appendChild(outerGlow);
  
  // Cleanup function
  return () => {
    if (container.contains(innerGlow)) {
      container.removeChild(innerGlow);
    }
    if (container.contains(outerGlow)) {
      container.removeChild(outerGlow);
    }
  };
};

// New high-temperature glow effect
export const createHighTemperatureGlow = (container: HTMLElement, temperature: number) => {
  if (!container || temperature < 60) return;
  
  // Create temperature-based glow effect
  const glowIntensity = Math.min((temperature - 60) / 100, 1); // Normalized 0-1 based on temperature
  const glowOverlay = document.createElement('div');
  glowOverlay.className = 'absolute inset-0 pointer-events-none';
  glowOverlay.style.borderRadius = 'inherit';
  glowOverlay.style.mixBlendMode = 'screen';
  glowOverlay.style.opacity = `${0.3 + glowIntensity * 0.5}`; // Increase opacity with temperature
  
  // Color ranges from orange to bright red as temperature increases
  const hue = Math.max(0, 30 - glowIntensity * 20);
  const saturation = 100;
  const lightness = 50 + glowIntensity * 10;
  
  glowOverlay.style.backgroundColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  glowOverlay.style.boxShadow = `inset 0 0 20px 5px hsl(${hue}, ${saturation}%, ${lightness}%), 0 0 30px 10px hsl(${hue}, ${saturation}%, ${lightness-10}%)`;
  glowOverlay.style.animation = 'high-temp-pulse 1.5s infinite alternate';
  
  // Create CSS for temperature glow animation if it doesn't exist
  if (!document.getElementById('high-temp-styles')) {
    const style = document.createElement('style');
    style.id = 'high-temp-styles';
    style.textContent = `
      @keyframes high-temp-pulse {
        0% { opacity: ${0.3 + glowIntensity * 0.5}; }
        100% { opacity: ${0.5 + glowIntensity * 0.5}; }
      }
    `;
    document.head.appendChild(style);
  }
  
  container.appendChild(glowOverlay);
  
  // Cleanup function
  return () => {
    if (container.contains(glowOverlay)) {
      container.removeChild(glowOverlay);
    }
  };
};

// Explosion animation
export const createExplosionEffect = (container: HTMLElement) => {
  if (!container) return;
  
  // Create explosion overlay
  const explosion = document.createElement('div');
  explosion.className = 'absolute inset-0 z-10';
  
  // Flash of light
  explosion.style.animation = 'explosion 1s forwards';
  explosion.style.background = 'radial-gradient(circle at center, rgba(255,200,50,1) 0%, rgba(255,120,50,0.8) 50%, rgba(255,50,50,0) 100%)';
  explosion.style.borderRadius = 'inherit';
  
  // Create CSS for explosion animation if it doesn't exist
  if (!document.getElementById('explosion-animation-styles')) {
    const style = document.createElement('style');
    style.id = 'explosion-animation-styles';
    style.textContent = `
      @keyframes explosion {
        0% { transform: scale(0.1); opacity: 0; }
        25% { transform: scale(1.2); opacity: 1; }
        100% { transform: scale(2); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }
  
  // Create particles
  const particleCount = Math.floor(Math.random() * 15) + 20;
  const particles: HTMLElement[] = [];
  
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'absolute';
    
    // Random properties
    const size = Math.random() * 6 + 2;
    const direction = Math.random() * 360;
    const distance = Math.random() * 100 + 50;
    const duration = Math.random() * 1 + 0.5;
    const delay = Math.random() * 0.3;
    
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = '50%';
    particle.style.top = '50%';
    particle.style.backgroundColor = `hsl(${Math.random() * 30 + 20}, 100%, 50%)`;
    particle.style.borderRadius = '50%';
    particle.style.transform = 'translate(-50%, -50%)';
    particle.style.animation = `particle-explosion ${duration}s forwards`;
    particle.style.animationDelay = `${delay}s`;
    particle.dataset.angle = direction.toString();
    particle.dataset.distance = distance.toString();
    
    container.appendChild(particle);
    particles.push(particle);
  }
  
  // Create CSS for particle animation if it doesn't exist
  if (!document.getElementById('particle-animation-styles')) {
    const style = document.createElement('style');
    style.id = 'particle-animation-styles';
    style.textContent = `
      @keyframes particle-explosion {
        0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        100% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }
  
  // Animate particles in their directions
  particles.forEach(particle => {
    const angle = parseFloat(particle.dataset.angle || '0');
    const distance = parseFloat(particle.dataset.distance || '0');
    const radians = angle * (Math.PI / 180);
    const x = Math.cos(radians) * distance;
    const y = Math.sin(radians) * distance;
    
    particle.animate([
      { transform: 'translate(-50%, -50%)' },
      { transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))` }
    ], {
      duration: 1000,
      easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      fill: 'forwards'
    });
  });
  
  container.appendChild(explosion);
  
  // Shake the container
  const originalPosition = {
    x: container.offsetLeft,
    y: container.offsetTop
  };
  
  // Shake animation
  const shakeAnimation = container.animate([
    { transform: 'translate(0, 0)' },
    { transform: 'translate(-5px, -5px)' },
    { transform: 'translate(5px, 5px)' },
    { transform: 'translate(-5px, 5px)' },
    { transform: 'translate(5px, -5px)' },
    { transform: 'translate(0, 0)' }
  ], {
    duration: 500,
    iterations: 2,
    easing: 'ease-in-out'
  });
  
  // Cleanup function
  return () => {
    if (container.contains(explosion)) {
      container.removeChild(explosion);
    }
    
    particles.forEach(particle => {
      if (container.contains(particle)) {
        container.removeChild(particle);
      }
    });
    
    if (shakeAnimation.playState !== 'finished') {
      shakeAnimation.cancel();
    }
  };
};

// Shaking animation for reaction
export const shakeElement = (element: HTMLElement, intensity: number = 1) => {
  if (!element) return;
  
  element.style.animation = `stir ${0.3 / intensity}s ease-in-out ${intensity * 3}`;
  
  const cleanup = () => {
    element.style.animation = '';
  };
  
  setTimeout(cleanup, intensity * 1000);
  
  return cleanup;
};

// Transition helper for React components
export const transitions = {
  fadeIn: 'transition-opacity duration-500 ease-in-out',
  transform: 'transition-transform duration-500 ease-in-out',
  scale: 'hover:scale-105 transition-transform duration-300 ease-in-out',
  pulse: 'hover:animate-pulse',
  color: 'transition-colors duration-300 ease-in-out',
};
