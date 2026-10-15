import React, { useEffect, useRef } from 'react';

/**
 * MinimalCursor Component (मैग्नेटिक मिनिमल रिंग और स्मूथ स्मॉल डॉट)
 * 
 * Kinematics & Aesthetics:
 * - Dual-layer precision system: instantaneous center dot + fluid magnetic follower ring
 * - Micro-inertia spring damping on follower ring (60-120+ FPS lock)
 * - Click expansion pulse and subtle geometric trail
 * - Ultra-clean, modern luxury design aesthetic
 */
export default function MinimalCursor({
  heroRef,
  isInsideHero,
  speed = 0.14,
  trailEnabled = true,
  scale = 1
}) {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const canvasRef = useRef(null);
  const isInsideHeroRef = useRef(isInsideHero);
  const speedRef = useRef(speed);
  const scaleRef = useRef(scale);
  const trailEnabledRef = useRef(trailEnabled);

  const posRef = useRef({
    // Snappy inner dot coordinates
    dotX: typeof window !== 'undefined' ? window.innerWidth / 2 : 500,
    dotY: typeof window !== 'undefined' ? window.innerHeight / 2 : 300,
    // Smooth magnetic follower ring coordinates
    ringX: typeof window !== 'undefined' ? window.innerWidth / 2 : 500,
    ringY: typeof window !== 'undefined' ? window.innerHeight / 2 : 300,
    targetX: typeof window !== 'undefined' ? window.innerWidth / 2 : 500,
    targetY: typeof window !== 'undefined' ? window.innerHeight / 2 : 300,
    lastEmitX: typeof window !== 'undefined' ? window.innerWidth / 2 : 500,
    lastEmitY: typeof window !== 'undefined' ? window.innerHeight / 2 : 300,
    ringScale: 1,
    targetRingScale: 1,
    ripples: [],
    isVisible: true
  });

  const particlesRef = useRef([]);

  useEffect(() => {
    isInsideHeroRef.current = isInsideHero;
  }, [isInsideHero]);

  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  useEffect(() => {
    scaleRef.current = scale;
  }, [scale]);

  useEffect(() => {
    trailEnabledRef.current = trailEnabled;
  }, [trailEnabled]);

  useEffect(() => {
    const handlePointerMove = (e) => {
      const clientX = e.clientX ?? (e.touches && e.touches[0]?.clientX);
      const clientY = e.clientY ?? (e.touches && e.touches[0]?.clientY);

      if (clientX !== undefined && clientY !== undefined) {
        posRef.current.targetX = clientX;
        posRef.current.targetY = clientY;
        posRef.current.isVisible = true;
      }
    };

    const handlePointerLeave = () => {
      posRef.current.isVisible = false;
    };

    const handlePointerEnter = () => {
      posRef.current.isVisible = true;
    };

    // Click expansion and ripple ring
    const handlePointerDown = () => {
      const state = posRef.current;
      state.targetRingScale = 1.45;

      state.ripples.push({
        x: state.targetX,
        y: state.targetY,
        radius: 6,
        maxRadius: 36,
        alpha: 0.8
      });
    };

    const handlePointerUp = () => {
      posRef.current.targetRingScale = 1.0;
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown, { passive: true });
    window.addEventListener('pointerup', handlePointerUp, { passive: true });
    document.addEventListener('mouseleave', handlePointerLeave);
    document.addEventListener('mouseenter', handlePointerEnter);

    let animationFrameId;
    let lastTime = performance.now();

    const updateCanvasDimensions = () => {
      if (!canvasRef.current) return;
      const canvas = canvasRef.current;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = window.innerWidth;
      const height = window.innerHeight;

      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
      }
    };
    updateCanvasDimensions();
    window.addEventListener('resize', updateCanvasDimensions, { passive: true });

    const loop = (currentTime) => {
      const dt = Math.min(Math.max((currentTime - lastTime) / 1000, 0.001), 0.05);
      lastTime = currentTime;

      const state = posRef.current;

      // 1. Inner dot: fast/snappy response
      const dotLambda = 35.0;
      const dotLerp = 1.0 - Math.exp(-dotLambda * dt);
      state.dotX += (state.targetX - state.dotX) * dotLerp;
      state.dotY += (state.targetY - state.dotY) * dotLerp;

      // 2. Magnetic outer ring: smooth fluid inertia
      const ringLambda = Math.max(3.5, (speedRef.current || 0.14) * 75.0);
      const ringLerp = 1.0 - Math.exp(-ringLambda * dt);
      state.ringX += (state.targetX - state.ringX) * ringLerp;
      state.ringY += (state.targetY - state.ringY) * ringLerp;

      // Smooth scale interpolation for ring
      state.ringScale += (state.targetRingScale - state.ringScale) * (1.0 - Math.exp(-18.0 * dt));

      // DOM Updates
      if (dotRef.current) {
        const dot = dotRef.current;
        const posX = (state.dotX - 3.5).toFixed(2);
        const posY = (state.dotY - 3.5).toFixed(2);
        dot.style.transform = `translate3d(${posX}px, ${posY}px, 0) scale(${scaleRef.current || 1})`;
        dot.style.opacity = state.isVisible ? '1' : '0';
      }

      if (ringRef.current) {
        const ring = ringRef.current;
        const posX = (state.ringX - 18).toFixed(2);
        const posY = (state.ringY - 18).toFixed(2);
        const curScale = ((scaleRef.current || 1) * state.ringScale).toFixed(3);
        ring.style.transform = `translate3d(${posX}px, ${posY}px, 0) scale(${curScale})`;
        ring.style.opacity = state.isVisible ? '1' : '0';
      }

      // Canvas Minimalist Ripples & Subtle Ghost Trail
      if (canvasRef.current) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        if (ctx) {
          const dpr = Math.min(window.devicePixelRatio || 1, 2);
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          ctx.save();
          ctx.scale(dpr, dpr);

          // 1. Click Ripple Rings
          for (let i = state.ripples.length - 1; i >= 0; i--) {
            const r = state.ripples[i];
            r.radius += dt * 80;
            r.alpha -= dt * 2.2;

            if (r.alpha <= 0 || r.radius >= r.maxRadius) {
              state.ripples.splice(i, 1);
            } else {
              ctx.beginPath();
              ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
              ctx.strokeStyle = `rgba(24, 24, 27, ${r.alpha.toFixed(2)})`;
              ctx.lineWidth = 1.2;
              ctx.stroke();
            }
          }

          // 2. Subtle Ghost Dot Trail
          if (trailEnabledRef.current) {
            const emitDist = Math.hypot(state.ringX - state.lastEmitX, state.ringY - state.lastEmitY);
            if (emitDist >= 14 && particlesRef.current.length < 30) {
              particlesRef.current.push({
                x: state.ringX,
                y: state.ringY,
                alpha: 0.35,
                decay: 2.2,
                size: 2.0
              });
              state.lastEmitX = state.ringX;
              state.lastEmitY = state.ringY;
            }

            for (let i = particlesRef.current.length - 1; i >= 0; i--) {
              const p = particlesRef.current[i];
              p.alpha -= p.decay * dt;
              p.size = Math.max(0, p.size - dt * 0.8);

              if (p.alpha <= 0 || p.size <= 0) {
                particlesRef.current.splice(i, 1);
              } else {
                ctx.fillStyle = `rgba(255, 77, 109, ${p.alpha.toFixed(2)})`;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
              }
            }
          }

          ctx.restore();
        }
      }

      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
      document.removeEventListener('mouseleave', handlePointerLeave);
      document.removeEventListener('mouseenter', handlePointerEnter);
      window.removeEventListener('resize', updateCanvasDimensions);
    };
  }, [heroRef]);

  return (
    <>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none z-[60] w-full h-full"
      />

      {/* Instantaneous Center Dot */}
      <div
        ref={dotRef}
        aria-hidden="true"
        className="fixed top-0 left-0 pointer-events-none z-[75] will-change-transform"
        style={{
          width: '7px',
          height: '7px',
          opacity: 1
        }}
      >
        <div className="w-full h-full rounded-full bg-[#18181B] shadow-[0_0_6px_rgba(24,24,27,0.3)]" />
      </div>

      {/* Smooth Magnetic Follower Ring */}
      <div
        ref={ringRef}
        aria-hidden="true"
        className="fixed top-0 left-0 pointer-events-none z-[70] will-change-transform"
        style={{
          width: '36px',
          height: '36px',
          opacity: 1
        }}
      >
        <div className="w-full h-full rounded-full border-[1.5px] border-[#18181B]/75 transition-colors duration-150 backdrop-blur-[0.5px]" />
      </div>
    </>
  );
}
