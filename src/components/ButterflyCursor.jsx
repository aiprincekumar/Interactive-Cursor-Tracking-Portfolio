import React, { useEffect, useRef } from 'react';

/**
 * High-Performance Butterfly Cursor System
 * 
 * Kinematics & Physics:
 * - Exponential decay lerp (frame-rate independent at 60/120/144/240 FPS)
 * - Heading rotation via atan2 with shortest-arc modulo wrap-around
 * - Aerodynamic banking (3D roll) proportional to turn angular velocity
 * - Multi-harmonic Lissajous idle hover drift without target coordinate distortion
 * - Dynamic wing flutter frequency based on instantaneous cursor velocity
 * - High-speed additive canvas stardust trail emitter (zero shadowBlur for 120 FPS lock)
 * - Zero layout thrashing (GPU composited transforms, passive pointer events)
 */
/**
 * Generates an array of tinted rgba color prefixes from a base hex or rgb string.
 * Accents include radiant primary, pastel glow, cosmic warm/gold shimmer, and pure diamond sparkle.
 */
function getTintedPalette(baseColor) {
  if (!baseColor || typeof baseColor !== 'string') return null;
  let r = 255, g = 77, b = 109;
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

export default function ButterflyCursor({
  heroRef,
  isInsideHero,
  speed = 0.14,
  trailEnabled = true,
  scale = 1,
  gravity = 0,
  particleColor = '#FF4D6D'
}) {
  const butterflyRef = useRef(null);
  const canvasRef = useRef(null);
  const isInsideHeroRef = useRef(isInsideHero);
  const speedRef = useRef(speed);
  const scaleRef = useRef(scale);
  const trailEnabledRef = useRef(trailEnabled);
  const gravityRef = useRef(gravity);
  const particleColorRef = useRef(particleColor);

  // Kinematic state store (persists across frames without triggering React re-renders)
  const posRef = useRef({
    currentX: typeof window !== 'undefined' ? window.innerWidth / 2 : 500,
    currentY: typeof window !== 'undefined' ? window.innerHeight / 2 : 300,
    targetX: typeof window !== 'undefined' ? window.innerWidth / 2 : 500,
    targetY: typeof window !== 'undefined' ? window.innerHeight / 2 : 300,
    lastEmitX: typeof window !== 'undefined' ? window.innerWidth / 2 : 500,
    lastEmitY: typeof window !== 'undefined' ? window.innerHeight / 2 : 300,
    vx: 0,
    vy: 0,
    speedPxPerSec: 0,
    angle: 0,
    bankAngle: 0,
    idleTime: 0,
    flutterDuration: 0.12,
    hasHoverState: false,
    lastOpacity: null,
    isVisible: true
  });

  const particlesRef = useRef([]);

  // Sync controls into refs to allow seamless 120 FPS dynamic tuning without restarting rAF loop
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
    // Passive pointer tracking
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

    // Burst sparkles on any click across the page
    const handlePointerDown = () => {
      if (!trailEnabledRef.current) return;
      const state = posRef.current;
      const defaultBurstPalette = [
        'rgba(255, 77, 109,',
        'rgba(255, 105, 180,',
        'rgba(255, 215, 0,',
        'rgba(255, 255, 255,'
      ];
      const burstPalette = getTintedPalette(particleColorRef.current) || defaultBurstPalette;
      for (let i = 0; i < 7; i++) {
        const angle = Math.random() * Math.PI * 2;
        const spd = Math.random() * 55 + 25;
        particlesRef.current.push({
          x: state.currentX,
          y: state.currentY,
          vx: Math.cos(angle) * spd,
          vy: Math.sin(angle) * spd,
          size: Math.random() * 2.8 + 1.4,
          alpha: 1.0,
          decay: Math.random() * 1.2 + 1.2,
          color: burstPalette[Math.floor(Math.random() * burstPalette.length)],
          isStar: Math.random() > 0.35,
          rot: Math.random() * Math.PI,
          rotSpeed: (Math.random() - 0.5) * 8
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

    // Canvas sizing with High-DPI support capped at 2x
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

    // Main 120 FPS Animation Loop
    const loop = (currentTime) => {
      // Delta time in seconds, clamped to protect against tab defocus hitches
      const dt = Math.min(Math.max((currentTime - lastTime) / 1000, 0.001), 0.05);
      lastTime = currentTime;

      const state = posRef.current;
      const dx = state.targetX - state.currentX;
      const dy = state.targetY - state.currentY;
      const distance = Math.hypot(dx, dy);

      // 1. Frame-rate independent exponential smoothing
      // Speed parameter (0.07 to 0.25) calibrated into exact exponential decay lambda
      const lambda = Math.max(3.0, (speedRef.current || 0.14) * 75.0);
      const lerpFactor = 1.0 - Math.exp(-lambda * dt);

      const prevX = state.currentX;
      const prevY = state.currentY;
      state.currentX += dx * lerpFactor;
      state.currentY += dy * lerpFactor;

      // Calculate instantaneous velocity (px/sec) with smoothing
      const instVx = (state.currentX - prevX) / dt;
      const instVy = (state.currentY - prevY) / dt;
      const vDecay = 1.0 - Math.exp(-12.0 * dt);
      state.vx += (instVx - state.vx) * vDecay;
      state.vy += (instVy - state.vy) * vDecay;
      state.speedPxPerSec = Math.hypot(state.vx, state.vy);

      // 2. Multi-harmonic Lissajous idle hovering drift (applied strictly to render coordinates)
      let renderX = state.currentX;
      let renderY = state.currentY;

      if (distance < 3.0) {
        state.idleTime += dt * 3.0;
        const hoverX = Math.sin(state.idleTime * 1.8) * 3.4 + Math.cos(state.idleTime * 3.6) * 1.2;
        const hoverY = Math.cos(state.idleTime * 1.4) * 3.8 + Math.sin(state.idleTime * 2.8) * 1.1;
        renderX += hoverX;
        renderY += hoverY;
      } else {
        state.idleTime = Math.max(0, state.idleTime - dt * 2.5);
      }

      // 3. Rotation Angle Calculation (atan2) & Aerodynamic Banking
      if (distance > 1.8) {
        // atan2 heading: 0deg = pointing UP (-Y)
        const targetHeading = (Math.atan2(dy, dx) * 180) / Math.PI + 90;

        // Shortest arc difference in range [-180, 180]
        let angleDiff = (targetHeading - state.angle + 540) % 360 - 180;

        // Exponential angular smoothing
        const angleLerp = 1.0 - Math.exp(-14.0 * dt);
        state.angle += angleDiff * angleLerp;

        // Aerodynamic banking: roll into the curve proportional to turning rate
        const targetBank = Math.max(-26, Math.min(26, angleDiff * 0.42));
        state.bankAngle += (targetBank - state.bankAngle) * (1.0 - Math.exp(-16.0 * dt));
      } else {
        // Idle tilt sway
        const idleTilt = Math.sin(state.idleTime * 1.6) * 4.0;
        state.bankAngle += (idleTilt - state.bankAngle) * (1.0 - Math.exp(-8.0 * dt));
      }

      // 4. Dynamic Wing Flutter Frequency
      // Fast flight (> 200 px/s): 0.08s rapid flap | Glide / hover (< 40 px/s): 0.16s gentle flap
      const targetFlutter = state.speedPxPerSec > 220 ? 0.08 : state.speedPxPerSec > 50 ? 0.11 : 0.16;
      state.flutterDuration += (targetFlutter - state.flutterDuration) * (1.0 - Math.exp(-8.0 * dt));

      // 5. Zero Layout Thrashing DOM Update
      if (butterflyRef.current) {
        const b = butterflyRef.current;
        const posX = (renderX - 19).toFixed(2);
        const posY = (renderY - 19).toFixed(2);
        const rotZ = state.angle.toFixed(1);
        const rollY = (state.bankAngle * 0.65).toFixed(1);

        // Hardware-accelerated 3D transform combining translate, heading rotation, and bank roll
        b.style.transform = `translate3d(${posX}px, ${posY}px, 0) rotate(${rotZ}deg) rotateY(${rollY}deg) scale(${scaleRef.current || 1})`;
        b.style.setProperty('--flutter-duration', `${state.flutterDuration.toFixed(2)}s`);

        // Maintain full visibility across the entire page
        const nextOpacity = '1';
        if (state.lastOpacity !== nextOpacity) {
          b.style.opacity = nextOpacity;
          state.lastOpacity = nextOpacity;
        }
      }

      // 6. High-Performance Stardust Particle Trail Emitter (Active across full page)
      if (trailEnabledRef.current && canvasRef.current) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        if (ctx) {
          const dpr = Math.min(window.devicePixelRatio || 1, 2);

          // Clear previous canvas frame
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          // Sub-step particle emission along path across entire page
          if (distance > 2.0) {
            const emitDist = Math.hypot(renderX - state.lastEmitX, renderY - state.lastEmitY);
            const step = isInsideHeroRef.current ? 9 : 12; // slightly denser in hero, but active everywhere

            if (emitDist >= step) {
              const count = Math.min(Math.floor(emitDist / step), 4);
              for (let k = 1; k <= count; k++) {
                if (particlesRef.current.length < 65) {
                  const t = k / count;
                  const px = state.lastEmitX + (renderX - state.lastEmitX) * t + (Math.random() - 0.5) * 6;
                  const py = state.lastEmitY + (renderY - state.lastEmitY) * t + (Math.random() - 0.5) * 6;
                  
                  // Palette: Hot Pink, Radiant Salmon, Stardust Gold, Pure Rose Pearl (or dynamic tinted shades)
                  const defaultPalette = [
                    'rgba(255, 63, 108,',
                    'rgba(255, 105, 180,',
                    'rgba(255, 215, 0,',
                    'rgba(255, 182, 193,'
                  ];
                  const palette = getTintedPalette(particleColorRef.current) || defaultPalette;
                  const color = palette[Math.floor(Math.random() * palette.length)];

                  particlesRef.current.push({
                    x: px,
                    y: py,
                    vx: (Math.random() - 0.5) * 16 - state.vx * 0.05,
                    vy: (Math.random() - 0.5) * 14 + 12 - state.vy * 0.05,
                    size: Math.random() * 2.6 + 1.2,
                    alpha: 0.9,
                    decay: Math.random() * 0.8 + 1.1,
                    color,
                    isStar: Math.random() > 0.45,
                    rot: Math.random() * Math.PI,
                    rotSpeed: (Math.random() - 0.5) * 6
                  });
                }
              }
              state.lastEmitX = renderX;
              state.lastEmitY = renderY;
            }
          } else {
            state.lastEmitX = renderX;
            state.lastEmitY = renderY;
          }

          // Render active particles with hardware-accelerated additive blending
          if (particlesRef.current.length > 0) {
            ctx.save();
            ctx.scale(dpr, dpr);
            ctx.globalCompositeOperation = 'lighter';

            for (let i = particlesRef.current.length - 1; i >= 0; i--) {
              const p = particlesRef.current[i];
              p.vy += (gravityRef.current || 0) * dt;
              p.x += p.vx * dt;
              p.y += p.vy * dt;
              p.vx *= 0.97; // Aerodynamic drag
              p.vy *= 0.97;
              p.rot += p.rotSpeed * dt;
              p.alpha -= p.decay * dt;
              p.size = Math.max(0, p.size - dt * 0.6);

              if (p.alpha <= 0 || p.size <= 0) {
                particlesRef.current.splice(i, 1);
              } else {
                ctx.fillStyle = `${p.color} ${p.alpha.toFixed(2)})`;

                if (p.isStar) {
                  // 4-point diamond sparkle star
                  ctx.save();
                  ctx.translate(p.x, p.y);
                  ctx.rotate(p.rot);
                  ctx.beginPath();
                  const s = p.size * 1.5;
                  ctx.moveTo(0, -s);
                  ctx.quadraticCurveTo(0, 0, s, 0);
                  ctx.quadraticCurveTo(0, 0, 0, s);
                  ctx.quadraticCurveTo(0, 0, -s, 0);
                  ctx.quadraticCurveTo(0, 0, 0, -s);
                  ctx.fill();
                  ctx.restore();
                } else {
                  // Soft glowing stardust orb
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
      {/* 120 FPS Additive Particle Canvas Overlay */}
      {trailEnabled && (
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="fixed inset-0 pointer-events-none z-[60] w-full h-full"
        />
      )}

      {/* Butterfly Cursor DOM Element with 3D Perspective Stage */}
      <div
        ref={butterflyRef}
        aria-hidden="true"
        className="fixed top-0 left-0 pointer-events-none z-[70] transition-opacity duration-300 will-change-transform butterfly-perspective-stage"
        style={{
          width: '38px',
          height: '38px',
          opacity: 1
        }}
      >
        <div className="relative w-full h-full flex items-center justify-center filter drop-shadow-[0_4px_14px_rgba(255,63,108,0.45)]">
          {/* Left Wing with True 3D Hinge Flap */}
          <div className="absolute left-[3px] top-[2px] w-[18px] h-[32px] flutter-wing-left origin-right">
            <svg viewBox="0 0 40 60" fill="none" className="w-full h-full">
              {/* Forewing Top */}
              <path
                d="M38 32 C38 12 18 2 4 10 C-4 15 2 34 22 36 C34 37 38 34 38 32 Z"
                fill="url(#pinkGradientWingL)"
                stroke="#FF3F6C"
                strokeWidth="1.2"
              />
              {/* Hindwing Bottom */}
              <path
                d="M36 34 C36 44 26 58 12 56 C2 54 8 40 24 35 C32 32 36 33 36 34 Z"
                fill="url(#softPinkWingL)"
                stroke="#FF3F6C"
                strokeWidth="1.2"
              />
              {/* Subtle Wing Veins */}
              <path d="M38 32 Q 22 20 8 16" stroke="#FFE4E8" strokeWidth="1" strokeLinecap="round" opacity="0.9" />
              <path d="M38 32 Q 24 28 14 30" stroke="#FFE4E8" strokeWidth="1" strokeLinecap="round" opacity="0.9" />
              <path d="M36 34 Q 24 44 14 50" stroke="#FFE4E8" strokeWidth="1" strokeLinecap="round" opacity="0.9" />
              <circle cx="10" cy="18" r="2.5" fill="#FFFFFF" opacity="0.85" />
              <circle cx="16" cy="46" r="2" fill="#FFFFFF" opacity="0.85" />
              <defs>
                <linearGradient id="pinkGradientWingL" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#FF1493" stopOpacity="0.88" />
                  <stop offset="0.6" stopColor="#FF69B4" stopOpacity="0.92" />
                  <stop offset="1" stopColor="#FFC0CB" stopOpacity="0.96" />
                </linearGradient>
                <linearGradient id="softPinkWingL" x1="0" y1="20" x2="40" y2="60" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#FF3F6C" stopOpacity="0.88" />
                  <stop offset="1" stopColor="#FFE4E8" stopOpacity="0.92" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Right Wing with True 3D Hinge Flap */}
          <div className="absolute right-[3px] top-[2px] w-[18px] h-[32px] flutter-wing-right origin-left">
            <svg viewBox="0 0 40 60" fill="none" className="w-full h-full scale-x-[-1]">
              <path
                d="M38 32 C38 12 18 2 4 10 C-4 15 2 34 22 36 C34 37 38 34 38 32 Z"
                fill="url(#pinkGradientWingR)"
                stroke="#FF3F6C"
                strokeWidth="1.2"
              />
              <path
                d="M36 34 C36 44 26 58 12 56 C2 54 8 40 24 35 C32 32 36 33 36 34 Z"
                fill="url(#softPinkWingR)"
                stroke="#FF3F6C"
                strokeWidth="1.2"
              />
              <path d="M38 32 Q 22 20 8 16" stroke="#FFE4E8" strokeWidth="1" strokeLinecap="round" opacity="0.9" />
              <path d="M38 32 Q 24 28 14 30" stroke="#FFE4E8" strokeWidth="1" strokeLinecap="round" opacity="0.9" />
              <path d="M36 34 Q 24 44 14 50" stroke="#FFE4E8" strokeWidth="1" strokeLinecap="round" opacity="0.9" />
              <circle cx="10" cy="18" r="2.5" fill="#FFFFFF" opacity="0.85" />
              <circle cx="16" cy="46" r="2" fill="#FFFFFF" opacity="0.85" />
              <defs>
                <linearGradient id="pinkGradientWingR" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#FF1493" stopOpacity="0.88" />
                  <stop offset="0.6" stopColor="#FF69B4" stopOpacity="0.92" />
                  <stop offset="1" stopColor="#FFC0CB" stopOpacity="0.96" />
                </linearGradient>
                <linearGradient id="softPinkWingR" x1="0" y1="20" x2="40" y2="60" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#FF3F6C" stopOpacity="0.88" />
                  <stop offset="1" stopColor="#FFE4E8" stopOpacity="0.92" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Center Body & Antennae */}
          <div className="relative z-10 w-[5px] h-[24px] flex flex-col items-center">
            {/* Antennae */}
            <div className="w-[12px] h-[6px] -mt-[3px] flex justify-between">
              <span className="w-[1px] h-[5px] bg-[#991B1B] rotate-[-25deg] origin-bottom rounded-full" />
              <span className="w-[1px] h-[5px] bg-[#991B1B] rotate-[25deg] origin-bottom rounded-full" />
            </div>
            {/* Slender Thorax and Abdomen */}
            <div className="w-[3px] h-[20px] bg-gradient-to-b from-[#4A0E17] via-[#881337] to-[#4A0E17] rounded-full shadow-[0_0_4px_rgba(255,63,108,0.8)]" />
          </div>
        </div>
      </div>
    </>
  );
}
