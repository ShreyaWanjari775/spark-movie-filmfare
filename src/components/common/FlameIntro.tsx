import React, { useEffect, useState, useCallback, useRef } from 'react';
import { ProceduralFlame } from './ProceduralFlame';

interface FlameIntroProps {
  onComplete: () => void;
  forcePlay?: boolean;
}

export const FlameIntro: React.FC<FlameIntroProps> = ({ 
  onComplete,
  forcePlay = false 
}) => {
  // Animation timeline state (0 to 1 progress)
  const [progress, setProgress] = useState(0);
  const [isTransitioningOut, setIsTransitioningOut] = useState(false);
  const animationFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  const durationMs = 2600; // Optimal 2.6s cinematic sequence

  const finishIntro = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    sessionStorage.setItem('spark_intro_seen', 'true');
    setIsTransitioningOut(true);
    setTimeout(() => {
      onComplete();
    }, 600); // Allow portal light fade to dissolve smoothly into the hero
  }, [onComplete]);

  useEffect(() => {
    // 1. Respect prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      finishIntro();
      return;
    }

    // 2. Play once per browser session unless forced
    if (!forcePlay && sessionStorage.getItem('spark_intro_seen') === 'true') {
      finishIntro();
      return;
    }

    // 3. Continuous frame-driven motion loop
    const step = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const currentProgress = Math.min(elapsed / durationMs, 1);
      setProgress(currentProgress);

      if (currentProgress < 1) {
        animationFrameRef.current = requestAnimationFrame(step);
      } else {
        finishIntro();
      }
    };

    animationFrameRef.current = requestAnimationFrame(step);

    // Keyboard support: Escape key skips
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        finishIntro();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [finishIntro, forcePlay]);

  // Derived timeline attributes
  const isPeak = progress > 0.88;
  const backgroundReveal = Math.min(progress * 0.95, 0.9);

  return (
    <div
      role="dialog"
      aria-label="SPark Cinematic Intro Animation"
      aria-modal="true"
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#02050b] select-none transition-opacity duration-700 ease-out overflow-hidden ${
        isTransitioningOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* 1. APPROVED CINEMATIC REFERENCE BACKGROUND (Matches reference: cinema seats, solitary figure, astronaut, film reel) */}
      <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
        <img
          src="/images/fnc-cinematic-reveal-bg.jpg"
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover object-center filter contrast-[1.1] brightness-[0.75] transition-opacity duration-1000 ease-out"
          style={{
            opacity: 0.15 + backgroundReveal * 0.75
          }}
        />

        {/* Atmospheric Dark Overlay Veil that gradually clears as flame awakens */}
        <div 
          className="absolute inset-0 bg-[#02050b] transition-opacity duration-700 pointer-events-none"
          style={{
            opacity: Math.max(0.15, 1 - progress * 1.15)
          }}
        />

        {/* Central dark vignette keeping contrast on the central flame */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(2,5,11,0.8)_0%,_rgba(2,5,11,0.5)_50%,_transparent_80%)] pointer-events-none" />
      </div>

      {/* 2. PROCEDURAL FLUID FLAME CENTERPIECE WITH STRICTLY PRESERVED OFFICIAL LOGO */}
      <div className="relative z-20 flex flex-col items-center justify-center px-4">
        <div 
          className="transition-transform duration-300 ease-out flex items-center justify-center"
          style={{
            transform: `scale(${0.96 + progress * 0.08})`
          }}
        >
          <ProceduralFlame
            width={300}
            height={380}
            intensity={progress}
            logoSrc="/spark-logo.png"
          />
        </div>

        {/* 3. CINEMATIC TITLE EMERGENCE */}
        <div 
          className="mt-2 text-center transition-all duration-700 ease-out"
          style={{
            opacity: progress > 0.4 ? (progress - 0.4) * 1.6 : 0,
            transform: `translateY(${(1 - progress) * 10}px)`
          }}
        >
          <p className="text-[10px] sm:text-[11px] tracking-[0.35em] uppercase font-semibold text-[#a5f3fc]/80 mb-1">
            SPark Cultural Committee
          </p>
          <h1 className="font-['Cinzel',serif] text-xl sm:text-2xl font-bold tracking-[0.2em] uppercase text-white drop-shadow-[0_0_15px_rgba(0,194,224,0.6)]">
            Movie Filmfare
          </h1>
          <div className="flex items-center justify-center gap-2 mt-2">
            <span className="h-[1px] w-6 bg-gradient-to-r from-transparent to-[#00c2e0]/60" />
            <span className="text-[10px] tracking-[0.28em] uppercase text-[#00f5d4] font-semibold">
              FnC Movie Night
            </span>
            <span className="h-[1px] w-6 bg-gradient-to-l from-transparent to-[#00c2e0]/60" />
          </div>
        </div>
      </div>

      {/* 4. CINEMATIC PORTAL TRANSITION AT PEAK */}
      <div 
        className={`absolute inset-0 pointer-events-none z-30 transition-all duration-700 ease-out ${
          isPeak ? 'animate-portal bg-[radial-gradient(circle,_rgba(0,245,212,0.35)_0%,_rgba(0,194,224,0.2)_30%,_transparent_70%)]' : 'opacity-0'
        }`}
      />

      {/* 5. ACCESSIBLE SKIP BUTTON */}
      <button
        onClick={finishIntro}
        className="absolute top-6 right-6 z-40 px-3.5 py-1.5 rounded-full bg-[#030712]/70 hover:bg-[#062831] border border-[#00c2e0]/30 hover:border-[#00f5d4]/50 text-[10px] sm:text-xs uppercase tracking-widest text-[#a5f3fc]/80 hover:text-white transition-all backdrop-blur-md"
        aria-label="Skip cinematic introduction"
      >
        Skip <span className="opacity-50 ml-1">Esc</span>
      </button>
    </div>
  );
};
