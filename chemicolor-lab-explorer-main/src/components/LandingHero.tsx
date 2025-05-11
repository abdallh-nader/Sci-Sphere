
import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from '../utils/i18n';
import { ArrowRight } from 'lucide-react';

export const LandingHero = () => {
  const { language } = useTheme();
  const { t } = useTranslation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Particle animation effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    setCanvasDimensions();
    window.addEventListener('resize', setCanvasDimensions);
    
    // Particle class
    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
      
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 5 + 1;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
        
        // Colors based on theme from the laboratory
        const colors = [
          'rgba(168, 217, 79, 0.5)',  // Acid green
          'rgba(79, 148, 217, 0.5)',  // Base blue
          'rgba(217, 108, 79, 0.5)',  // Copper
          'rgba(192, 192, 192, 0.5)', // Silver
        ];
        
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }
      
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        // Bounce off edges
        if (this.x > canvas.width || this.x < 0) {
          this.speedX = -this.speedX;
        }
        
        if (this.y > canvas.height || this.y < 0) {
          this.speedY = -this.speedY;
        }
      }
      
      draw() {
        if (!ctx) return;
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    }
    
    // Create particles
    const particlesArray: Particle[] = [];
    const numberOfParticles = Math.min(50, Math.floor(canvas.width * canvas.height / 20000));
    
    for (let i = 0; i < numberOfParticles; i++) {
      particlesArray.push(new Particle());
    }
    
    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw particles
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
      }
      
      // Draw connections between particles
      connectParticles();
      
      requestAnimationFrame(animate);
    };
    
    // Connect particles with lines
    const connectParticles = () => {
      for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
          const dx = particlesArray[a].x - particlesArray[b].x;
          const dy = particlesArray[a].y - particlesArray[b].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.2 - distance / 500})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
            ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
            ctx.stroke();
          }
        }
      }
    };
    
    animate();
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', setCanvasDimensions);
    };
  }, []);
  
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Canvas */}
      <canvas 
        ref={canvasRef} 
        className="absolute top-0 left-0 w-full h-full -z-10"
      ></canvas>
      
      {/* Content */}
      <div className="container mx-auto px-6 py-24 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-block px-3 py-1 mb-6 rounded-full glass text-sm font-medium animate-fade-in">
            {language === 'en' 
              ? 'SciSphere - Next-Generation Chemistry Simulation' 
              : 'ساي سفير - محاكاة الكيمياء من الجيل التالي'}
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight animate-fade-in">
            {t('home.hero.title')}
          </h1>
          
          <p className="text-xl mb-8 text-foreground/80 animate-fade-in">
            {t('home.hero.subtitle')}
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in">
            <Link 
              to="/simulation" 
              className="px-8 py-3 rounded-full bg-gradient-to-r from-violet-500 to-indigo-600 text-white font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center"
            >
              {t('home.cta.button')}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
          
          {/* Floating test tubes - decorative */}
          <div className="absolute -bottom-16 -left-16 opacity-20 blur-sm">
            <div className="w-32 h-80 rounded-b-3xl border-2 border-white/30 transform rotate-12"></div>
          </div>
          
          <div className="absolute -top-16 -right-16 opacity-20 blur-sm">
            <div className="w-24 h-64 rounded-b-3xl border-2 border-white/30 transform -rotate-12"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
