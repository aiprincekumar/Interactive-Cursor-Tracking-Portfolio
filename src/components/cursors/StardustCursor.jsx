import React, { useEffect, useRef } from 'react';
import { getInitialCursorPosition, saveCursorPosition } from '../../utils/cursorPersistence';

/**
 * StardustCursor Component (मैजिक वैंड / Stardust & Celestial Wand)
 * 
 * Kinematics & Aesthetics:
 * - Sleek celestial magic wand with glowing prismatic crystal tip
 * - Rich sparkling starbursts & glittering cosmic stardust trail
 * - Additive canvas 4-point diamond sparkle stars and iridescent dust
 * - Hardware-accelerated GPU transforms (60-120+ FPS lock)
 */
/**
 * Generates an array of tinted rgba color prefixes from a base hex or rgb string.
 */
function getTintedPalette(baseColor) {
  if (!baseColor || typeof baseColor !== 'string') return null;
  let r = 255, g = 215, b = 0;
  const trimmed = baseColor.trim();

  if (trimmed.startsWith('#')) {
    let hex = trimmed.slice(1);
    if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
    if (hex.length === 6) {
      const num = parseInt(hex, 16);
      if (!isNaN(num)) {
        r = (num >> 16) & 255;
        g = (num >> 8) & 255;
        b = num & 255;
      }
    }
  } else if (trimmed.startsWith('rgb')) {
    const parts = trimmed.match(/\d+/g);
    if (parts && parts.length >= 3) {
      r = Math.min(255, Math.max(0, parseInt(parts[0], 10)));
      g = Math.min(255, Math.max(0, parseInt(parts[1], 10)));
      b = Math.min(255, Math.max(0, parseInt(parts[2], 10)));
    }
  } else {
    return null;
  }

  const tintR = Math.min(255, Math.round(r * 0.75 + 64));
  const tintG = Math.min(255, Math.round(g * 0.75 + 64));
  const tintB = Math.min(255, Math.round(b * 0.75 + 64));

  const warmR = Math.min(255, Math.round(r * 0.9 + 25));
  const warmG = Math.min(255, Math.round(g * 0.85 + 20));
  const warmB = Math.max(0, Math.round(b * 0.65));

  return [
    `rgba(${r}, ${g}, ${b},`,
    `rgba(${tintR}, ${tintG}, ${tintB},`,
    `rgba(${warmR}, ${warmG}, ${warmB},`,
    'rgba(255, 255, 255,'
  ];
}

const MAX_PARTICLES = 75;

function createStardustParticlePool() {
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
      color: 'rgba(255, 215, 0,',
      isStar: false,
      rot: 0,
      rotSpeed: 0
    };
  }
  return pool;
}

export default function StardustCursor({
  heroRef,
  isInsideHero,
  isInsideHeroRef: propIsInsideHeroRef,
  speed = 0.16,
  trailEnabled = true,
  scale = 1,
  gravity = 0,
  particleColor = null,
  initialPosition
}) {
  const wandRef = useRef(null);
  const canvasRef = useRef(null);
  const fallbackHeroRef = useRef(false);
  const isInsideHeroRef = propIsInsideHeroRef || (isInsideHero && typeof isInsideHero === 'object' && 'current' in isInsideHero ? isInsideHero : fallbackHeroRef);
  const speedRef = useRef(speed);
  const scaleRef = useRef(scale);
  const trailEnabledRef = useRef(trailEnabled);
  const gravityRef = useRef(gravity);
  const particleColorRef = useRef(particleColor);
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
    wandAngle: -25,
    sparkleTime: 0,
    isVisible: true
  });

  const particlesRef = useRef(createStardustParticlePool());

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
    gravityRef.current = gravity;
    wakeLoopRef.current?.();
  }, [gravity]);

  useEffect(() => {
    particleColorRef.current = particleColor;
    wakeLoopRef.current?.();
  }, [particleColor]);

  useEffect(() => {
    let poolHead = 0;
    const spawnParticle = (x, y, vx, vy, size, alpha, decay, color, isStar, rot, rotSpeed) => {
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
      slot.isStar = Boolean(isStar);
      slot.rot = rot || 0;
      slot.rotSpeed = rotSpeed || 0;
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
      if (wandRef.current) {
        wandRef.current.style.opacity = '0';
      }
    };

    const handlePointerEnter = () => {
      posRef.current.isVisible = true;
      startLoop();
    };

    // Magic wand click burst
    const handlePointerDown = () => {
      if (!trailEnabledRef.current) return;
      startLoop();
      const state = posRef.current;
      const defaultCelestialColors = [
        'rgba(255, 215, 0,',   // Gold
        'rgba(255, 105, 180,', // Hot pink
        'rgba(167, 139, 250,', // Purple / Lavender
        'rgba(56, 189, 248,',  // Cyan / Sky
        'rgba(255, 255, 255,'  // Pure diamond white
      ];
      const celestialColors = (particleColorRef.current && getTintedPalette(particleColorRef.current)) || defaultCelestialColors;

      for (let i = 0; i < 14; i++) {
        const ang = Math.random() * Math.PI * 2;
        const spd = Math.random() * 80 + 35;
        spawnParticle(
          state.currentX,
          state.currentY,
          Math.cos(ang) * spd,
          Math.sin(ang) * spd,
          Math.random() * 3.5 + 2.0,
          1.0,
          Math.random() * 1.1 + 0.9,
          celestialColors[Math.floor(Math.random() * celestialColors.length)],
          true,
          Math.random() * Math.PI,
          (Math.random() - 0.5) * 12
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
      state.sparkleTime += dt * 5.0;

      const dx = state.targetX - state.currentX;
      const dy = state.targetY - state.currentY;
      const distance = Math.hypot(dx, dy);

      // Frame-rate independent exponential smoothing
      const lambda = Math.max(3.0, (speedRef.current || 0.16) * 85.0);
      const lerpFactor = 1.0 - Math.exp(-lambda * dt);

      if (distance < 0.2) {
        state.currentX = state.targetX;
        state.currentY = state.targetY;
        state.vx = 0;
        state.vy = 0;
      } else {
        const prevX = state.currentX;
        const prevY = state.currentY;
        state.currentX += dx * lerpFactor;
        state.currentY += dy * lerpFactor;

        const instVx = (state.currentX - prevX) / dt;
        const instVy = (state.currentY - prevY) / dt;
        state.vx += (instVx - state.vx) * (1.0 - Math.exp(-12.0 * dt));
        state.vy += (instVy - state.vy) * (1.0 - Math.exp(-12.0 * dt));
      }

      // Wand tilt based on movement direction
      let targetWandAngle = -25;
      if (distance > 2) {
        const moveAng = (Math.atan2(dy, dx) * 180) / Math.PI;
        targetWandAngle = Math.max(-45, Math.min(10, moveAng * 0.25 - 20));
      }
      state.wandAngle += (targetWandAngle - state.wandAngle) * (1.0 - Math.exp(-10.0 * dt));
      if (distance <= 2 && Math.abs(state.wandAngle - (-25)) < 0.05) {
        state.wandAngle = -25;
      }

      // Wand DOM Position
      if (wandRef.current) {
        const w = wandRef.current;
        // Tip of wand aligns to currentX, currentY
        const posX = (state.currentX - 5).toFixed(2);
        const posY = (state.currentY - 5).toFixed(2);
        const rotZ = state.wandAngle.toFixed(1);

        w.style.transform = `translate3d(${posX}px, ${posY}px, 0) rotate(${rotZ}deg) scale(${scaleRef.current || 1})`;
        w.style.opacity = state.isVisible ? '1' : '0';
      }

      // Stardust Canvas Trail
      let activeCount = 0;
      const pool = particlesRef.current;

      if (trailEnabledRef.current && canvasRef.current) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        if (ctx) {
          const dpr = Math.min(window.devicePixelRatio || 1, 2);

          const emitDist = Math.hypot(state.currentX - state.lastEmitX, state.currentY - state.lastEmitY);
          const step = 8;

          if (emitDist >= step) {
            const count = Math.min(Math.floor(emitDist / step), 3);
            const defaultPalette = [
              'rgba(255, 215, 0,',
              'rgba(244, 114, 182,',
              'rgba(192, 132, 252,',
              'rgba(96, 165, 250,',
              'rgba(255, 255, 255,'
            ];
            const palette = (particleColorRef.current && getTintedPalette(particleColorRef.current)) || defaultPalette;
            for (let k = 1; k <= count; k++) {
              const t = k / count;
              const px = state.lastEmitX + (state.currentX - state.lastEmitX) * t + (Math.random() - 0.5) * 6;
              const py = state.lastEmitY + (state.currentY - state.lastEmitY) * t + (Math.random() - 0.5) * 6;
              const color = palette[Math.floor(Math.random() * palette.length)];

              spawnParticle(
                px,
                py,
                (Math.random() - 0.5) * 14 - state.vx * 0.05,
                (Math.random() - 0.5) * 14 - state.vy * 0.05 + 8,
                Math.random() * 2.8 + 1.2,
                0.95,
                Math.random() * 0.9 + 1.1,
                color,
                Math.random() > 0.4,
                Math.random() * Math.PI,
                (Math.random() - 0.5) * 8
              );
            }
            state.lastEmitX = state.currentX;
            state.lastEmitY = state.currentY;
          }

          // In-place updates without garbage generation
          const currentGravity = gravityRef.current || 0;
          for (let i = 0; i < MAX_PARTICLES; i++) {
            const p = pool[i];
            if (!p.active) continue;

            p.vy += currentGravity * dt;
            p.x += p.vx * dt;
            p.y += p.vy * dt;
            p.vx *= 0.96;
            p.vy *= 0.96;
            p.rot += p.rotSpeed * dt;
            p.alpha -= p.decay * dt;
            p.size = Math.max(0, p.size - dt * 0.5);

            if (p.alpha <= 0 || p.size <= 0) {
              p.active = false;
            } else {
              activeCount++;
            }
          }

          const isDirty = activeCount > 0 || isCanvasDirtyRef.current;
          if (isDirty) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            if (activeCount > 0) {
              ctx.save();
              ctx.scale(dpr, dpr);
              ctx.globalCompositeOperation = 'lighter';

              for (let i = 0; i < MAX_PARTICLES; i++) {
                const p = pool[i];
                if (!p.active) continue;

                ctx.fillStyle = `${p.color} ${p.alpha.toFixed(2)})`;

                if (p.isStar) {
                  ctx.save();
                  ctx.translate(p.x, p.y);
                  ctx.rotate(p.rot);
                  ctx.beginPath();
                  const s = p.size * 1.6;
                  ctx.moveTo(0, -s);
                  ctx.quadraticCurveTo(0, 0, s, 0);
                  ctx.quadraticCurveTo(0, 0, 0, s);
                  ctx.quadraticCurveTo(0, 0, -s, 0);
                  ctx.quadraticCurveTo(0, 0, 0, -s);
                  ctx.fill();
                  ctx.restore();
                } else {
                  ctx.beginPath();
                  ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                  ctx.fill();
                }
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

      // Idle Sleep Mode: stop rAF loop when cursor is stationary and active particles count reaches 0
      if (distance < 0.2 && state.wandAngle === -25 && activeCount === 0 && !isCanvasDirtyRef.current) {
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

      {/* Magic Wand Cursor */}
      <div
        ref={wandRef}
        aria-hidden="true"
        className="fixed top-0 left-0 pointer-events-none z-[70] will-change-transform origin-top-left"
        style={{
          width: '36px',
          height: '36px',
          opacity: 1
        }}
      >
        <div className="relative w-full h-full">
          {/* Glowing Crystal Star at tip (Hot Spot at 0,0) */}
          <div className="absolute top-[2px] left-[2px] w-[14px] h-[14px] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
            {/* Pulsing Star Core */}
            <div className="absolute inset-0 bg-amber-300 rounded-full blur-[3px] animate-pulse" />
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 relative z-10 text-yellow-300 drop-shadow-[0_0_8px_rgba(255,215,0,0.9)]">
              <path
                d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"
                fill="url(#starGrad)"
                stroke="#FFFFFF"
                strokeWidth="0.8"
              />
              <defs>
                <linearGradient id="starGrad" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#FFFBEB" />
                  <stop offset="0.5" stopColor="#FDE047" />
                  <stop offset="1" stopColor="#F59E0B" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Magic Wand Shaft */}
          <div
            className="absolute top-[6px] left-[6px] w-[2.5px] h-[30px] origin-top bg-gradient-to-b from-[#FAF5FF] via-[#DDD6FE] to-[#8B5CF6] rounded-full shadow-[0_0_6px_rgba(167,139,250,0.6)] rotate-[45deg]"
          />
        </div>
      </div>
    </>
  );
}
