import React, { useEffect, useRef } from 'react';

interface ProceduralFlameProps {
  className?: string;
  intensity?: number; // 0 to 1 for progressive awakening
  logoSrc?: string;
  width?: number;
  height?: number;
}

interface FireParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  life: number;
  maxLife: number;
  colorType: number; // 0: teal, 1: cyan, 2: aqua, 3: ice
}

interface FlameTongue {
  baseX: number;
  baseY: number;
  targetHeight: number;
  currentHeight: number;
  width: number;
  curl: number;
  curlSpeed: number;
  phase: number;
  frequency: number;
  color: string;
  glowColor: string;
}

export const ProceduralFlame: React.FC<ProceduralFlameProps> = ({
  className = '',
  intensity = 1,
  logoSrc = '/spark-logo.png',
  width = 280,
  height = 360,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const particlesRef = useRef<FireParticle[]>([]);
  const tonguesRef = useRef<FlameTongue[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // High DPI scaling
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    // Initialize organic flame tongues anchored along the SPark flame base and ribbon curves
    // Following SPark palette: Deep Teal (#062831), Vibrant Cyan (#00C2E0), Electric Aqua (#00F5D4), Ice Blue (#A5F3FC)
    tonguesRef.current = [
      // Left outer ribbon tongue
      {
        baseX: width * 0.35,
        baseY: height * 0.76,
        targetHeight: height * 0.45,
        currentHeight: height * 0.4,
        width: 24,
        curl: -18,
        curlSpeed: 2.2,
        phase: 0.2,
        frequency: 2.8,
        color: 'rgba(0, 194, 224, 0.65)',
        glowColor: 'rgba(6, 40, 49, 0.4)'
      },
      // Left inner ribbon tongue
      {
        baseX: width * 0.42,
        baseY: height * 0.78,
        targetHeight: height * 0.58,
        currentHeight: height * 0.5,
        width: 28,
        curl: -8,
        curlSpeed: 3.1,
        phase: 1.1,
        frequency: 3.5,
        color: 'rgba(0, 245, 212, 0.75)',
        glowColor: 'rgba(0, 194, 224, 0.5)'
      },
      // Central apex flame tongue (main rising tip)
      {
        baseX: width * 0.50,
        baseY: height * 0.80,
        targetHeight: height * 0.72,
        currentHeight: height * 0.65,
        width: 32,
        curl: 12,
        curlSpeed: 2.7,
        phase: 2.4,
        frequency: 3.2,
        color: 'rgba(165, 243, 252, 0.85)',
        glowColor: 'rgba(0, 245, 212, 0.6)'
      },
      // Right inner curve tongue
      {
        baseX: width * 0.58,
        baseY: height * 0.78,
        targetHeight: height * 0.54,
        currentHeight: height * 0.48,
        width: 26,
        curl: 16,
        curlSpeed: 3.4,
        phase: 3.7,
        frequency: 2.9,
        color: 'rgba(0, 245, 212, 0.7)',
        glowColor: 'rgba(0, 194, 224, 0.45)'
      },
      // Right outer feather tongue
      {
        baseX: width * 0.66,
        baseY: height * 0.72,
        targetHeight: height * 0.42,
        currentHeight: height * 0.38,
        width: 20,
        curl: 22,
        curlSpeed: 2.5,
        phase: 4.8,
        frequency: 3.8,
        color: 'rgba(0, 194, 224, 0.6)',
        glowColor: 'rgba(6, 40, 49, 0.35)'
      }
    ];

    // Particle pool
    const maxParticles = 65;
    particlesRef.current = [];

    const spawnParticle = () => {
      if (particlesRef.current.length >= maxParticles) return;
      // Spawn along the lower flame ribbon curve
      const angle = (Math.random() - 0.5) * Math.PI * 0.8;
      const radius = width * 0.22 * Math.random();
      const px = width * 0.5 + Math.sin(angle) * radius;
      const py = height * 0.72 + (Math.random() - 0.3) * (height * 0.15);

      particlesRef.current.push({
        x: px,
        y: py,
        vx: (Math.random() - 0.5) * 1.2,
        vy: -(1.5 + Math.random() * 2.8),
        size: 2 + Math.random() * 4.5,
        alpha: 0.3 + Math.random() * 0.6,
        life: 0,
        maxLife: 40 + Math.random() * 50,
        colorType: Math.floor(Math.random() * 4)
      });
    };

    let time = 0;

    const render = () => {
      time += 0.025;
      ctx.clearRect(0, 0, width, height);

      const effIntensity = Math.max(0.1, intensity);

      // 1. DYNAMIC RADIANT AURA (Irregular luminous heat glow)
      const flicker = Math.sin(time * 3.7) * 0.06 + Math.cos(time * 7.1) * 0.04 + Math.sin(time * 11.3) * 0.02;
      const auraRadius = (width * 0.55 + flicker * 25) * effIntensity;
      const auraGradient = ctx.createRadialGradient(
        width * 0.5,
        height * 0.52,
        width * 0.05,
        width * 0.5,
        height * 0.52,
        auraRadius
      );
      auraGradient.addColorStop(0, `rgba(0, 245, 212, ${0.35 * effIntensity})`);
      auraGradient.addColorStop(0.35, `rgba(0, 194, 224, ${0.22 * effIntensity})`);
      auraGradient.addColorStop(0.7, `rgba(6, 40, 49, ${0.15 * effIntensity})`);
      auraGradient.addColorStop(1, 'rgba(6, 40, 49, 0)');

      ctx.fillStyle = auraGradient;
      ctx.beginPath();
      ctx.arc(width * 0.5, height * 0.52, auraRadius, 0, Math.PI * 2);
      ctx.fill();

      // 2. PROCEDURAL FLAME TONGUES (Fluid bezier shapes with shifting curling tips)
      ctx.globalCompositeOperation = 'lighter';

      tonguesRef.current.forEach((tongue, index) => {
        // Organic irregular wave oscillation
        const wave1 = Math.sin(time * tongue.frequency + tongue.phase);
        const wave2 = Math.cos(time * (tongue.frequency * 1.6) + tongue.phase * 0.7);
        const wave3 = Math.sin(time * 0.8 + index);

        // Height flickers organically
        const dynamicHeight = tongue.targetHeight * (0.85 + 0.18 * wave1 + 0.08 * wave2) * effIntensity;
        // Tip curls like real licking fire
        const curlOffset = (tongue.curl + wave2 * 14 + wave3 * 8) * effIntensity;

        const tipX = tongue.baseX + curlOffset;
        const tipY = tongue.baseY - dynamicHeight;

        // Draw individual flame tongue using quadratic/cubic bezier curves
        ctx.beginPath();
        ctx.moveTo(tongue.baseX - tongue.width * 0.5, tongue.baseY);

        // Left flame flank curve
        const cp1x = tongue.baseX - tongue.width * 0.7 + wave1 * 6;
        const cp1y = tongue.baseY - dynamicHeight * 0.45;
        const cp2x = tipX - tongue.width * 0.2 + wave2 * 8;
        const cp2y = tongue.baseY - dynamicHeight * 0.8;
        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, tipX, tipY);

        // Right flame flank curve returning to base
        const cp3x = tipX + tongue.width * 0.2 - wave2 * 8;
        const cp3y = tongue.baseY - dynamicHeight * 0.8;
        const cp4x = tongue.baseX + tongue.width * 0.7 - wave1 * 6;
        const cp4y = tongue.baseY - dynamicHeight * 0.45;
        ctx.bezierCurveTo(cp3x, cp3y, cp4x, cp4y, tongue.baseX + tongue.width * 0.5, tongue.baseY);

        ctx.closePath();

        // Tongue gradient from deep teal base to bright cyan/ice tip
        const tongueGrad = ctx.createLinearGradient(tongue.baseX, tongue.baseY, tipX, tipY);
        tongueGrad.addColorStop(0, 'rgba(6, 40, 49, 0.1)');
        tongueGrad.addColorStop(0.3, tongue.glowColor);
        tongueGrad.addColorStop(0.7, tongue.color);
        tongueGrad.addColorStop(1, 'rgba(255, 255, 255, 0.95)');

        ctx.fillStyle = tongueGrad;
        ctx.shadowColor = '#00f5d4';
        ctx.shadowBlur = 18 * effIntensity;
        ctx.fill();
      });

      // 3. FLUID PARTICLE & EMBER SIMULATION (Sparks & flame puffs)
      if (Math.random() < 0.65 * effIntensity) {
        spawnParticle();
      }

      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.life++;
        p.x += p.vx + Math.sin(time * 3 + p.y * 0.05) * 0.6;
        p.y += p.vy;
        p.size *= 0.985;

        const progress = p.life / p.maxLife;
        const currentAlpha = p.alpha * (1 - progress) * effIntensity;

        if (p.life >= p.maxLife || p.size <= 0.4 || currentAlpha <= 0.01) {
          particlesRef.current.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);

        // Particle color according to SPark palette
        let colorStr = 'rgba(0, 245, 212, ';
        if (p.colorType === 0) colorStr = 'rgba(6, 40, 49, ';
        else if (p.colorType === 1) colorStr = 'rgba(0, 194, 224, ';
        else if (p.colorType === 2) colorStr = 'rgba(0, 245, 212, ';
        else colorStr = 'rgba(165, 243, 252, ';

        ctx.fillStyle = `${colorStr}${currentAlpha})`;
        ctx.shadowColor = '#00c2e0';
        ctx.shadowBlur = 8;
        ctx.fill();
      }

      // Reset composite operation
      ctx.globalCompositeOperation = 'source-over';
      ctx.shadowBlur = 0;

      animationRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [intensity, width, height]);

  return (
    <div 
      className={`relative flex items-center justify-center select-none ${className}`}
      style={{ width, height }}
    >
      {/* Dynamic procedural canvas rendering organic flame movement */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
        style={{ filter: 'blur(0.5px)' }}
      />

      {/* STRICTLY PRESERVED OFFICIAL SPARK LOGO (Unchanged proportions, shape, and artwork) */}
      <div 
        className="relative z-20 flex items-center justify-center pointer-events-none"
        style={{
          width: width * 0.62,
          height: height * 0.62
        }}
      >
        <img
          src={logoSrc}
          alt="SPark Logo"
          className="w-full h-full object-contain filter drop-shadow-[0_0_20px_rgba(0,194,224,0.6)] drop-shadow-[0_0_40px_rgba(0,245,212,0.35)]"
        />
      </div>
    </div>
  );
};
