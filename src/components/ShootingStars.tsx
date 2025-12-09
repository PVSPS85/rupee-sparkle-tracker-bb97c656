import { useEffect, useRef, useCallback } from 'react';

interface Star {
  x: number;
  y: number;
  length: number;
  speed: number;
  opacity: number;
  angle: number;
  trail: { x: number; y: number; opacity: number }[];
}

interface ShootingStarsProps {
  enabled?: boolean;
  starCount?: number;
  className?: string;
}

const ShootingStars = ({ 
  enabled = true, 
  starCount = 8,
  className = "" 
}: ShootingStarsProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const animationRef = useRef<number>();
  const staticStarsRef = useRef<{ x: number; y: number; size: number; twinkle: number }[]>([]);

  const prefersReducedMotion = typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
    : false;

  const getAdjustedStarCount = useCallback(() => {
    if (typeof window === 'undefined') return starCount;
    const isMobile = window.innerWidth < 768;
    return isMobile ? Math.floor(starCount * 0.5) : starCount;
  }, [starCount]);

  const createStar = useCallback((canvas: HTMLCanvasElement): Star => {
    const angle = Math.PI / 4 + (Math.random() - 0.5) * 0.3; // ~45 degrees with variation
    return {
      x: Math.random() * canvas.width * 1.5,
      y: -50 - Math.random() * 200,
      length: 80 + Math.random() * 120,
      speed: 8 + Math.random() * 12,
      opacity: 0.6 + Math.random() * 0.4,
      angle,
      trail: [],
    };
  }, []);

  const initStaticStars = useCallback((canvas: HTMLCanvasElement) => {
    const count = Math.floor((canvas.width * canvas.height) / 8000);
    staticStarsRef.current = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 1.5 + 0.5,
      twinkle: Math.random() * Math.PI * 2,
    }));
  }, []);

  const initStars = useCallback((canvas: HTMLCanvasElement) => {
    const count = getAdjustedStarCount();
    starsRef.current = Array.from({ length: count }, () => {
      const star = createStar(canvas);
      // Randomize initial positions
      star.y = Math.random() * canvas.height;
      star.x = Math.random() * canvas.width;
      return star;
    });
    initStaticStars(canvas);
  }, [createStar, getAdjustedStarCount, initStaticStars]);

  useEffect(() => {
    if (!enabled || prefersReducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
      initStars(canvas);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let lastTime = 0;
    const targetFPS = 60;
    const frameInterval = 1000 / targetFPS;
    let twinkleTime = 0;

    const animate = (currentTime: number) => {
      const deltaTime = currentTime - lastTime;
      
      if (deltaTime >= frameInterval) {
        lastTime = currentTime - (deltaTime % frameInterval);
        twinkleTime += 0.02;
        
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        
        // Check if dark mode
        const isDark = document.documentElement.classList.contains('dark');
        const starColor = isDark ? '255, 255, 255' : '100, 100, 120';
        const shootingColor = isDark ? '255, 255, 255' : '80, 80, 100';
        
        // Draw static twinkling stars
        staticStarsRef.current.forEach((star) => {
          const twinkleOpacity = 0.3 + Math.sin(twinkleTime + star.twinkle) * 0.3;
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${starColor}, ${twinkleOpacity})`;
          ctx.fill();
        });
        
        // Draw shooting stars
        starsRef.current.forEach((star) => {
          // Update position
          star.x += Math.cos(star.angle) * star.speed;
          star.y += Math.sin(star.angle) * star.speed;
          
          // Add to trail
          star.trail.unshift({ x: star.x, y: star.y, opacity: star.opacity });
          
          // Limit trail length
          const maxTrailLength = Math.floor(star.length / 4);
          if (star.trail.length > maxTrailLength) {
            star.trail.pop();
          }
          
          // Draw trail with gradient
          star.trail.forEach((point, index) => {
            const trailOpacity = (1 - index / maxTrailLength) * point.opacity * 0.8;
            const trailSize = (1 - index / maxTrailLength) * 2;
            
            ctx.beginPath();
            ctx.arc(point.x, point.y, trailSize, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${shootingColor}, ${trailOpacity})`;
            ctx.fill();
          });
          
          // Draw head glow
          const gradient = ctx.createRadialGradient(
            star.x, star.y, 0,
            star.x, star.y, 6
          );
          gradient.addColorStop(0, `rgba(${shootingColor}, ${star.opacity})`);
          gradient.addColorStop(0.5, `rgba(${shootingColor}, ${star.opacity * 0.4})`);
          gradient.addColorStop(1, `rgba(${shootingColor}, 0)`);
          
          ctx.beginPath();
          ctx.arc(star.x, star.y, 6, 0, Math.PI * 2);
          ctx.fillStyle = gradient;
          ctx.fill();
          
          // Reset star when off screen
          if (star.y > window.innerHeight + 100 || star.x > window.innerWidth + 100) {
            const newStar = createStar(canvas);
            Object.assign(star, newStar);
          }
        });
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [enabled, prefersReducedMotion, createStar, initStars]);

  if (!enabled || prefersReducedMotion) return null;

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-0 ${className}`}
      aria-hidden="true"
    />
  );
};

export default ShootingStars;