import React, { useEffect, useRef } from 'react';
import { getInitialCursorPosition, saveCursorPosition } from '../../utils/cursorPersistence';

/**
 * LaserCursor Component (नियॉन लेज़र पॉइंटर / Neon Laser Pointer & Beam)
 * 
 * Kinematics & Optics:
 * - High-tech neon laser reticle with glowing target dot and crosshair optics
 * - Continuous illuminated neon laser light beam trailing on canvas
 * - Digital plasma sparks and target lock-on pulse shockwave
 * - Ultra-snappy response with zero lag (60-120+ FPS lock)
 */
const HISTORY_CAPACITY = 24;

export default function LaserCursor({
  heroRef,
  isInsideHero,
  isInsideHeroRef: propIsInsideHeroRef,
  speed = 0.22,
  trailEnabled = true,
  scale = 1,
  initialPosition
}) {
  const laserRef = useRef(null);
  const canvasRef = useRef(null);
  const fallbackHeroRef = useRef(false);
  const isInsideHeroRef = propIsInsideHeroRef || (isInsideHero && typeof isInsideHero === 'object' && 'current' in isInsideHero ? isInsideHero : fallbackHeroRef);
  const speedRef = useRef(speed);
  const scaleRef = useRef(scale);
  const trailEnabledRef = useRef(trailEnabled);

  const resolvedInitialPos = initialPosition || getInitialCursorPosition();
  const posRef = useRef({
    currentX: resolvedInitialPos.clientX,
    currentY: resolvedInitialPos.clientY,
    targetX: resolvedInitialPos.clientX,
    targetY: resolvedInitialPos.clientY,
    // Pre-allocated circular ring buffer for zero-GC neon laser beam ribbon
    history: Array.from({ length: HISTORY_CAPACITY }, () => ({ x: 0, y: 0, alpha: 1.0 })),
    historyHead: HISTORY_CAPACITY - 1,
    historyCount: 0,
    pulses: [],  // Shockwave rings on click
    isVisible: true
  });

  const particlesRef = useRef([]);

  useEffect(() => {
    if (isInsideHeroRef === fallbackHeroRef) {
      fallbackHeroRef.current = Boolean(isInsideHero);
    }
  }, [isInsideHero, isInsideHeroRef]);

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
        saveCursorPosition(clientX, clientY, false);
      }
    };

    const handlePointerLeave = () => {
      posRef.current.isVisible = false;
    };

    const handlePointerEnter = () => {
      posRef.current.isVisible = true;
    };

    // Laser target lock shockwave on click
    const handlePointerDown = () => {
      const state = posRef.current;
      posRef.current.pulses.push({
        x: state.currentX,
        y: state.currentY,
        radius: 4,
        maxRadius: 42,
        alpha: 1.0
      });

      if (trailEnabledRef.current) {
        for (let i = 0; i < 8; i++) {
          const ang = Math.random() * Math.PI * 2;
          const spd = Math.random() * 70 + 40;
          particlesRef.current.push({
            x: state.currentX,
            y: state.currentY,
            vx: Math.cos(ang) * spd,
            vy: Math.sin(ang) * spd,
            size: Math.random() * 2.2 + 1.0,
            alpha: 1.0,
            decay: Math.random() * 1.5 + 1.2
          });
        }
      }
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown, { passive: true });
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
      const dx = state.targetX - state.currentX;
      const dy = state.targetY - state.currentY;

      // Laser is calibrated for snappy, high-precision tracking
      const lambda = Math.max(8.0, (speedRef.current || 0.22) * 95.0);
      const lerpFactor = 1.0 - Math.exp(-lambda * dt);

      state.currentX += dx * lerpFactor;
      state.currentY += dy * lerpFactor;

      // Maintain breadcrumb history using circular ring buffer (zero unshift/pop allocation)
      const nextHead = (state.historyHead + 1) % HISTORY_CAPACITY;
      state.historyHead = nextHead;
      const point = state.history[nextHead];
      point.x = state.currentX;
      point.y = state.currentY;
      point.alpha = 1.0;
      if (state.historyCount < HISTORY_CAPACITY) {
        state.historyCount++;
      }

      // DOM Update: Centered reticle
      if (laserRef.current) {
        const l = laserRef.current;
        const posX = (state.currentX - 16).toFixed(2);
        const posY = (state.currentY - 16).toFixed(2);

        l.style.transform = `translate3d(${posX}px, ${posY}px, 0) scale(${scaleRef.current || 1})`;
        l.style.opacity = state.isVisible ? '1' : '0';
      }

      // Canvas: Continuous Laser Beam + Shockwaves + Plasma Sparks
      if (canvasRef.current) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        if (ctx) {
          const dpr = Math.min(window.devicePixelRatio || 1, 2);
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          ctx.save();
          ctx.scale(dpr, dpr);
          ctx.globalCompositeOperation = 'lighter';

          // 1. Continuous Neon Laser Beam line connecting history points (iterating ring buffer newest -> oldest)
          if (trailEnabledRef.current && state.historyCount > 2) {
            const headIdx = state.historyHead;
            const startPt = state.history[headIdx];

            ctx.beginPath();
            ctx.moveTo(startPt.x, startPt.y);
            for (let i = 1; i < state.historyCount; i++) {
              const idx = (headIdx - i + HISTORY_CAPACITY) % HISTORY_CAPACITY;
              const pt = state.history[idx];
              ctx.lineTo(pt.x, pt.y);
            }
            // Neon outer glow stroke
            ctx.strokeStyle = 'rgba(255, 30, 80, 0.35)';
            ctx.lineWidth = 4.5;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.stroke();

            // Intense inner neon core
            ctx.beginPath();
            ctx.moveTo(startPt.x, startPt.y);
            for (let i = 1; i < state.historyCount; i++) {
              const idx = (headIdx - i + HISTORY_CAPACITY) % HISTORY_CAPACITY;
              const pt = state.history[idx];
              ctx.lineTo(pt.x, pt.y);
            }
            ctx.strokeStyle = 'rgba(255, 230, 240, 0.85)';
            ctx.lineWidth = 1.8;
            ctx.stroke();
          }

          // 2. Shockwave pulse rings
          for (let i = state.pulses.length - 1; i >= 0; i--) {
            const p = state.pulses[i];
            p.radius += dt * 90;
            p.alpha -= dt * 2.2;

            if (p.alpha <= 0 || p.radius >= p.maxRadius) {
              state.pulses.splice(i, 1);
            } else {
              ctx.beginPath();
              ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
              ctx.strokeStyle = `rgba(255, 60, 100, ${p.alpha.toFixed(2)})`;
              ctx.lineWidth = 2.0;
              ctx.stroke();
            }
          }

          // 3. Digital plasma sparks
          if (trailEnabledRef.current && particlesRef.current.length > 0) {
            for (let i = particlesRef.current.length - 1; i >= 0; i--) {
              const p = particlesRef.current[i];
              p.x += p.vx * dt;
              p.y += p.vy * dt;
              p.alpha -= p.decay * dt;

              if (p.alpha <= 0) {
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

      {/* Cyberpunk Neon Laser Target Reticle */}
      <div
        ref={laserRef}
        aria-hidden="true"
        className="fixed top-0 left-0 pointer-events-none z-[70] will-change-transform"
        style={{
          width: '32px',
          height: '32px',
          opacity: 1
        }}
      >
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Outer Rotating Crosshair Ring */}
          <div className="absolute inset-0 rounded-full border border-red-500/40 animate-[spin_6s_linear_infinite]" />

          {/* Crosshair Ticks */}
          <span className="absolute top-0 w-[1.5px] h-[4px] bg-red-500" />
          <span className="absolute bottom-0 w-[1.5px] h-[4px] bg-red-500" />
          <span className="absolute left-0 w-[4px] h-[1.5px] bg-red-500" />
          <span className="absolute right-0 w-[4px] h-[1.5px] bg-red-500" />

          {/* Inner Laser Core Dot with Bloom Glow */}
          <div
            className="w-[7px] h-[7px] rounded-full bg-white border border-red-500"
            style={{
              boxShadow: '0 0 10px 4px rgba(255, 0, 60, 0.9), 0 0 20px 8px rgba(255, 50, 50, 0.5)'
            }}
          />
        </div>
      </div>
    </>
  );
}
