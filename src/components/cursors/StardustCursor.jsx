import React, { useEffect, useRef } from 'react';

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

export default function StardustCursor({
  heroRef,
  isInsideHero,
  speed = 0.16,
  trailEnabled = true,
  scale = 1,
  gravity = 0,
  particleColor = null
}) {
  const wandRef = useRef(null);
  const canvasRef = useRef(null);
  const isInsideHeroRef = useRef(isInsideHero);
  const speedRef = useRef(speed);
  const scaleRef = useRef(scale);
  const trailEnabledRef = useRef(trailEnabled);
  const gravityRef = useRef(gravity);
  const particleColorRef = useRef(particleColor);

  const posRef = useRef({
    currentX: typeof window !== 'undefined' ? window.innerWidth / 2 : 500,
    currentY: typeof window !== 'undefined' ? window.innerHeight / 2 : 300,
    targetX: typeof window !== 'undefined' ? window.innerWidth / 2 : 500,
    targetY: typeof window !== 'undefined' ? window.innerHeight / 2 : 300,
    lastEmitX: typeof window !== 'undefined' ? window.innerWidth / 2 : 500,
    lastEmitY: typeof window !== 'undefined' ? window.innerHeight / 2 : 300,
    vx: 0,
    vy: 0,
    wandAngle: -25,
    sparkleTime: 0,
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
    gravityRef.current = gravity;
  }, [gravity]);

  useEffect(() => {
    particleColorRef.current = particleColor;
  }, [particleColor]);

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

    // Magic wand click burst
    const handlePointerDown = () => {
      if (!trailEnabledRef.current) return;
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
        particlesRef.current.push({
          x: state.currentX,
          y: state.currentY,
          vx: Math.cos(ang) * spd,
          vy: Math.sin(ang) * spd,
          size: Math.random() * 3.5 + 2.0,
          alpha: 1.0,
          decay: Math.random() * 1.1 + 0.9,
          color: celestialColors[Math.floor(Math.random() * celestialColors.length)],
          isStar: true,
          rot: Math.random() * Math.PI,
          rotSpeed: (Math.random() - 0.5) * 12
        });
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
      state.sparkleTime += dt * 5.0;

      const dx = state.targetX - state.currentX;
      const dy = state.targetY - state.currentY;
      const distance = Math.hypot(dx, dy);

      // Frame-rate independent exponential smoothing
      const lambda = Math.max(3.0, (speedRef.current || 0.16) * 85.0);
      const lerpFactor = 1.0 - Math.exp(-lambda * dt);

      const prevX = state.currentX;
      const prevY = state.currentY;
      state.currentX += dx * lerpFactor;
      state.currentY += dy * lerpFactor;

      const instVx = (state.currentX - prevX) / dt;
      const instVy = (state.currentY - prevY) / dt;
      state.vx += (instVx - state.vx) * (1.0 - Math.exp(-12.0 * dt));
      state.vy += (instVy - state.vy) * (1.0 - Math.exp(-12.0 * dt));

      // Wand tilt based on movement direction
      let targetWandAngle = -25;
      if (distance > 2) {
        const moveAng = (Math.atan2(dy, dx) * 180) / Math.PI;
        targetWandAngle = Math.max(-45, Math.min(10, moveAng * 0.25 - 20));
      }
      state.wandAngle += (targetWandAngle - state.wandAngle) * (1.0 - Math.exp(-10.0 * dt));

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
      if (trailEnabledRef.current && canvasRef.current) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        if (ctx) {
          const dpr = Math.min(window.devicePixelRatio || 1, 2);
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          const emitDist = Math.hypot(state.currentX - state.lastEmitX, state.currentY - state.lastEmitY);
          const step = 8;

          if (emitDist >= step) {
            const count = Math.min(Math.floor(emitDist / step), 3);
            for (let k = 1; k <= count; k++) {
              if (particlesRef.current.length < 70) {
                const t = k / count;
                const px = state.lastEmitX + (state.currentX - state.lastEmitX) * t + (Math.random() - 0.5) * 6;
                const py = state.lastEmitY + (state.currentY - state.lastEmitY) * t + (Math.random() - 0.5) * 6;

                const defaultPalette = [
                  'rgba(255, 215, 0,',
                  'rgba(244, 114, 182,',
                  'rgba(192, 132, 252,',
                  'rgba(96, 165, 250,',
                  'rgba(255, 255, 255,'
                ];
                const palette = (particleColorRef.current && getTintedPalette(particleColorRef.current)) || defaultPalette;
                const color = palette[Math.floor(Math.random() * palette.length)];

                particlesRef.current.push({
                  x: px,
                  y: py,
                  vx: (Math.random() - 0.5) * 14 - state.vx * 0.05,
                  vy: (Math.random() - 0.5) * 14 - state.vy * 0.05 + 8,
                  size: Math.random() * 2.8 + 1.2,
                  alpha: 0.95,
                  decay: Math.random() * 0.9 + 1.1,
                  color,
                  isStar: Math.random() > 0.4,
                  rot: Math.random() * Math.PI,
                  rotSpeed: (Math.random() - 0.5) * 8
                });
              }
            }
            state.lastEmitX = state.currentX;
            state.lastEmitY = state.currentY;
          }

          if (particlesRef.current.length > 0) {
            ctx.save();
            ctx.scale(dpr, dpr);
            ctx.globalCompositeOperation = 'lighter';

            for (let i = particlesRef.current.length - 1; i >= 0; i--) {
              const p = particlesRef.current[i];
              p.vy += (gravityRef.current || 0) * dt;
              p.x += p.vx * dt;
              p.y += p.vy * dt;
              p.vx *= 0.96;
              p.vy *= 0.96;
              p.rot += p.rotSpeed * dt;
              p.alpha -= p.decay * dt;
              p.size = Math.max(0, p.size - dt * 0.5);

              if (p.alpha <= 0 || p.size <= 0) {
                particlesRef.current.splice(i, 1);
              } else {
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
            }
            ctx.restore();
          }
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
      {trailEnabled && (
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="fixed inset-0 pointer-events-none z-[60] w-full h-full"
        />
      )}

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
