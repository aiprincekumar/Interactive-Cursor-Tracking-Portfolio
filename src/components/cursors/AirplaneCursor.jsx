import React, { useEffect, useRef } from 'react';
import { getInitialCursorPosition, saveCursorPosition } from '../../utils/cursorPersistence';

/**
 * AirplaneCursor Component (ओरिगेमी पेपर प्लेन / Origami Paper Plane)
 * 
 * Kinematics & Aerodynamics:
 * - Geometric origami faceted paper glider with 3D paper shading
 * - Authentic flight heading via atan2 with shortest-arc modulo wrap-around
 * - Aerodynamic banking (3D roll) proportional to turn angular velocity
 * - Dual wingtip aerodynamic vapor / wind condensation trails on canvas
 * - Hardware-accelerated GPU transforms (60-120+ FPS lock)
 */
const MAX_PARTICLES = 75;

function createAirplaneParticlePool() {
  const pool = new Array(MAX_PARTICLES);
  for (let i = 0; i < MAX_PARTICLES; i++) {
    pool[i] = {
      active: false,
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      size: 0,
      alpha: 0,
      decay: 0,
      color: 'rgba(255, 255, 255,'
    };
  }
  return pool;
}

export default function AirplaneCursor({
  heroRef,
  isInsideHero,
  isInsideHeroRef: propIsInsideHeroRef,
  speed = 0.15,
  trailEnabled = true,
  scale = 1,
  initialPosition
}) {
  const planeRef = useRef(null);
  const canvasRef = useRef(null);
  const fallbackHeroRef = useRef(false);
  const isInsideHeroRef = propIsInsideHeroRef || (isInsideHero && typeof isInsideHero === 'object' && 'current' in isInsideHero ? isInsideHero : fallbackHeroRef);
  const speedRef = useRef(speed);
  const scaleRef = useRef(scale);
  const trailEnabledRef = useRef(trailEnabled);
  const isCanvasDirtyRef = useRef(false);
  const wakeLoopRef = useRef(null);

  const resolvedInitialPos = initialPosition || getInitialCursorPosition();
  const posRef = useRef({
    currentX: resolvedInitialPos.clientX,
    currentY: resolvedInitialPos.clientY,
    targetX: resolvedInitialPos.clientX,
    targetY: resolvedInitialPos.clientY,
    lastEmitX: resolvedInitialPos.clientX,
    lastEmitY: resolvedInitialPos.clientY,
    vx: 0,
    vy: 0,
    angle: 0,
    bankAngle: 0,
    speedPxPerSec: 0,
    idleTime: 0,
    isVisible: true
  });

  const particlesRef = useRef(createAirplaneParticlePool());

  useEffect(() => {
    if (isInsideHeroRef === fallbackHeroRef) {
      fallbackHeroRef.current = Boolean(isInsideHero);
    }
  }, [isInsideHero, isInsideHeroRef]);

  useEffect(() => {
    speedRef.current = speed;
    wakeLoopRef.current?.();
  }, [speed]);

  useEffect(() => {
    scaleRef.current = scale;
    wakeLoopRef.current?.();
  }, [scale]);

  useEffect(() => {
    trailEnabledRef.current = trailEnabled;
    wakeLoopRef.current?.();
  }, [trailEnabled]);

  useEffect(() => {
    let poolHead = 0;
    const spawnParticle = (x, y, vx, vy, size, alpha, decay, color) => {
      const pool = particlesRef.current;
      let slot = null;
      for (let i = 0; i < MAX_PARTICLES; i++) {
        const idx = (poolHead + i) % MAX_PARTICLES;
        if (!pool[idx].active) {
          slot = pool[idx];
          poolHead = (idx + 1) % MAX_PARTICLES;
          break;
        }
      }
      if (!slot) {
        slot = pool[poolHead];
        poolHead = (poolHead + 1) % MAX_PARTICLES;
      }
      slot.active = true;
      slot.x = x;
      slot.y = y;
      slot.vx = vx;
      slot.vy = vy;
      slot.size = size;
      slot.alpha = alpha;
      slot.decay = decay;
      slot.color = color;
      return slot;
    };

    let isRunning = false;
    let animationFrameId = null;
    let lastTime = performance.now();

    const startLoop = () => {
      if (!isRunning) {
        isRunning = true;
        lastTime = performance.now();
        animationFrameId = requestAnimationFrame(loop);
      }
    };
    wakeLoopRef.current = startLoop;

    const handlePointerMove = (e) => {
      const clientX = e.clientX ?? (e.touches && e.touches[0]?.clientX);
      const clientY = e.clientY ?? (e.touches && e.touches[0]?.clientY);

      if (clientX !== undefined && clientY !== undefined) {
        posRef.current.targetX = clientX;
        posRef.current.targetY = clientY;
        posRef.current.isVisible = true;
        saveCursorPosition(clientX, clientY, false);
        startLoop();
      }
    };

    const handlePointerLeave = () => {
      posRef.current.isVisible = false;
      if (planeRef.current) {
        planeRef.current.style.opacity = '0';
      }
    };

    const handlePointerEnter = () => {
      posRef.current.isVisible = true;
      startLoop();
    };

    // Aerodynamic jet puff on click
    const handlePointerDown = () => {
      if (!trailEnabledRef.current) return;
      startLoop();
      const state = posRef.current;
      for (let i = 0; i < 8; i++) {
        const ang = Math.random() * Math.PI * 2;
        const spd = Math.random() * 50 + 20;
        spawnParticle(
          state.currentX,
          state.currentY,
          Math.cos(ang) * spd,
          Math.sin(ang) * spd,
          Math.random() * 4.0 + 2.0,
          0.8,
          Math.random() * 1.2 + 1.0,
          'rgba(255, 255, 255,'
        );
      }
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown, { passive: true });
    document.addEventListener('mouseleave', handlePointerLeave);
    document.addEventListener('mouseenter', handlePointerEnter);

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
      const distance = Math.hypot(dx, dy);

      // Frame-rate independent exponential smoothing
      const lambda = Math.max(3.0, (speedRef.current || 0.15) * 80.0);
      const lerpFactor = 1.0 - Math.exp(-lambda * dt);

      if (distance < 0.2) {
        state.currentX = state.targetX;
        state.currentY = state.targetY;
        state.vx = 0;
        state.vy = 0;
        state.speedPxPerSec = 0;
      } else {
        const prevX = state.currentX;
        const prevY = state.currentY;
        state.currentX += dx * lerpFactor;
        state.currentY += dy * lerpFactor;

        const instVx = (state.currentX - prevX) / dt;
        const instVy = (state.currentY - prevY) / dt;
        state.vx += (instVx - state.vx) * (1.0 - Math.exp(-14.0 * dt));
        state.vy += (instVy - state.vy) * (1.0 - Math.exp(-14.0 * dt));
        state.speedPxPerSec = Math.hypot(state.vx, state.vy);
      }

      // Orientation Heading & Aerodynamic Banking
      if (distance > 2.0) {
        const targetHeading = (Math.atan2(dy, dx) * 180) / Math.PI + 90;
        let angleDiff = (targetHeading - state.angle + 540) % 360 - 180;
        state.angle += angleDiff * (1.0 - Math.exp(-14.0 * dt));

        // Banking into turn
        const targetBank = Math.max(-32, Math.min(32, angleDiff * 0.55));
        state.bankAngle += (targetBank - state.bankAngle) * (1.0 - Math.exp(-16.0 * dt));
      } else {
        // Wings level out when stopping
        state.bankAngle += (0 - state.bankAngle) * (1.0 - Math.exp(-12.0 * dt));
        if (Math.abs(state.bankAngle) < 0.05) {
          state.bankAngle = 0;
        }
      }

      // DOM Update
      if (planeRef.current) {
        const p = planeRef.current;
        const posX = (state.currentX - 18).toFixed(2);
        const posY = (state.currentY - 18).toFixed(2);
        const rotZ = state.angle.toFixed(1);
        const rollY = (state.bankAngle * 0.75).toFixed(1);

        p.style.transform = `translate3d(${posX}px, ${posY}px, 0) rotate(${rotZ}deg) rotateY(${rollY}deg) scale(${scaleRef.current || 1})`;
        p.style.opacity = state.isVisible ? '1' : '0';
      }

      // Canvas Contrail & Wind Vapor Trail
      let activeCount = 0;
      const pool = particlesRef.current;

      if (trailEnabledRef.current && canvasRef.current) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        if (ctx) {
          const dpr = Math.min(window.devicePixelRatio || 1, 2);

          const emitDist = Math.hypot(state.currentX - state.lastEmitX, state.currentY - state.lastEmitY);
          const step = 8;

          if (emitDist >= step && distance > 2.0) {
            const rad = ((state.angle - 90) * Math.PI) / 180;
            // Wingtip offsets (-90deg and +90deg to plane nose)
            const wingDist = 10;
            const leftWingX = state.currentX + Math.cos(rad - Math.PI / 2) * wingDist;
            const leftWingY = state.currentY + Math.sin(rad - Math.PI / 2) * wingDist;
            const rightWingX = state.currentX + Math.cos(rad + Math.PI / 2) * wingDist;
            const rightWingY = state.currentY + Math.sin(rad + Math.PI / 2) * wingDist;

            // Emit dual wingtip ribbon vapor using pool
            spawnParticle(
              leftWingX,
              leftWingY,
              -state.vx * 0.05 + (Math.random() - 0.5) * 4,
              -state.vy * 0.05 + (Math.random() - 0.5) * 4,
              Math.random() * 2.0 + 1.2,
              0.65,
              1.4,
              'rgba(255, 255, 255,'
            );
            spawnParticle(
              rightWingX,
              rightWingY,
              -state.vx * 0.05 + (Math.random() - 0.5) * 4,
              -state.vy * 0.05 + (Math.random() - 0.5) * 4,
              Math.random() * 2.0 + 1.2,
              0.65,
              1.4,
              'rgba(255, 255, 255,'
            );

            state.lastEmitX = state.currentX;
            state.lastEmitY = state.currentY;
          }

          // Update active particles in pool
          for (let i = 0; i < MAX_PARTICLES; i++) {
            const p = pool[i];
            if (!p.active) continue;

            p.x += p.vx * dt;
            p.y += p.vy * dt;
            p.alpha -= p.decay * dt;
            p.size = Math.max(0, p.size + dt * 1.5); // expand slightly like vapor

            if (p.alpha <= 0) {
              p.active = false;
            } else {
              activeCount++;
            }
          }

          // Render only when canvas has active particles or needs cleaning
          const isDirty = activeCount > 0 || isCanvasDirtyRef.current;
          if (isDirty) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            if (activeCount > 0) {
              ctx.save();
              ctx.scale(dpr, dpr);
              for (let i = 0; i < MAX_PARTICLES; i++) {
                const p = pool[i];
                if (!p.active) continue;
                ctx.fillStyle = `${p.color} ${p.alpha.toFixed(2)})`;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
              }
              ctx.restore();
              isCanvasDirtyRef.current = true;
            } else {
              isCanvasDirtyRef.current = false;
            }
          }
        }
      } else if (!trailEnabledRef.current && canvasRef.current) {
        if (isCanvasDirtyRef.current) {
          for (let i = 0; i < MAX_PARTICLES; i++) pool[i].active = false;
          const ctx = canvasRef.current.getContext('2d');
          if (ctx) ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
          isCanvasDirtyRef.current = false;
        }
      }

      // Idle Sleep Mode: when cursor velocity is zero and all particles have settled/faded, pause rAF
      if (distance < 0.2 && Math.abs(state.bankAngle) < 0.05 && activeCount === 0 && !isCanvasDirtyRef.current) {
        isRunning = false;
        animationFrameId = null;
        return;
      }

      animationFrameId = requestAnimationFrame(loop);
    };

    startLoop();

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      isRunning = false;
      wakeLoopRef.current = null;
      for (let i = 0; i < MAX_PARTICLES; i++) {
        particlesRef.current[i].active = false;
      }
      isCanvasDirtyRef.current = false;
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

      {/* Origami Paper Plane Stage */}
      <div
        ref={planeRef}
        aria-hidden="true"
        className="fixed top-0 left-0 pointer-events-none z-[70] will-change-transform"
        style={{
          width: '36px',
          height: '36px',
          perspective: '600px',
          opacity: 1
        }}
      >
        <div className="relative w-full h-full flex items-center justify-center filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.18)]">
          <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
            {/* Origami Paper Plane Polygons with Shading */}
            {/* Left Top Wing (Highlight side) */}
            <polygon
              points="24,4 4,42 24,32"
              fill="#FFFFFF"
              stroke="#E4E4E7"
              strokeWidth="0.75"
              strokeLinejoin="round"
            />
            {/* Left Inner Fold / Keel shadow */}
            <polygon
              points="24,4 24,32 18,34"
              fill="#E2E8F0"
              stroke="#CBD5E1"
              strokeWidth="0.5"
            />
            {/* Right Top Wing (Shadow side) */}
            <polygon
              points="24,4 44,42 24,32"
              fill="#F8FAFC"
              stroke="#E2E8F0"
              strokeWidth="0.75"
              strokeLinejoin="round"
            />
            {/* Right Inner Fold / Keel shade */}
            <polygon
              points="24,4 24,32 30,34"
              fill="#CBD5E1"
              stroke="#94A3B8"
              strokeWidth="0.5"
            />
            {/* Center Spine Keel */}
            <line
              x1="24"
              y1="4"
              x2="24"
              y2="32"
              stroke="#94A3B8"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
            {/* Origami wingtip aerodynamic winglet dots */}
            <circle cx="4" cy="42" r="1.2" fill="#FF4D6D" opacity="0.9" />
            <circle cx="44" cy="42" r="1.2" fill="#FF4D6D" opacity="0.9" />
          </svg>
        </div>
      </div>
    </>
  );
}
