import React, { useEffect, useRef } from 'react';
import CursorIcon from '../CursorIcon';
import { getKinematicProfile } from './kinematicProfiles';

/**
 * ModularKinematicCursor
 * 
 * High-performance 60-120+ FPS Kinematic Renderer supporting all 35 cursor styles.
 * 
 * Features:
 * - Exponential delta-time normalized lerp physics (frame-rate independent at 60Hz, 120Hz, 240Hz)
 * - Shortest-arc angular interpolation preventing 360-degree rotation snap glitches
 * - Multi-mode kinematics: Heading, Aerodynamic Banking, Orbital Spin, Lissajous Bob, Pendulum Sway
 * - Dedicated Hardware-Accelerated 2D Canvas particle & trail physics engine
 * - Click reaction particle bursts tailored to each cursor's aesthetic
 * - Zero CPU/GPU overhead when unmounted; cleanly tears down animation loop & event listeners
 */
/**
 * Generates an array of tinted rgba color prefixes from a base hex or rgb string.
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

const MAX_PARTICLES = 70;

const resolveBaseColor = (colorStr) => {
  if (!colorStr) return '#FF4D6D';
  if (colorStr.endsWith(',')) {
    return colorStr.slice(0, -1).replace('rgba', 'rgb') + ')';
  }
  return colorStr;
};

function createModularParticlePool() {
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
      color: 'rgba(255, 77, 109,',
      baseColor: 'rgb(255, 77, 109)',
      type: 'spark',
      glyph: '1'
    };
  }
  return pool;
}

export default function ModularKinematicCursor({
  cursorId = 'butterfly',
  heroRef: _heroRef,
  isInsideHero = false,
  speed = 0.14,
  trailEnabled = true,
  scale = 1,
  gravity = 0,
  particleColor = null
}) {
  const avatarRef = useRef(null);
  const canvasRef = useRef(null);
  const isInsideHeroRef = useRef(isInsideHero);
  const speedRef = useRef(speed);
  const scaleRef = useRef(scale);
  const trailEnabledRef = useRef(trailEnabled);
  const gravityRef = useRef(gravity);
  const particleColorRef = useRef(particleColor);

  const profile = getKinematicProfile(cursorId);

  const posRef = useRef({
    currentX: typeof window !== 'undefined' ? window.innerWidth / 2 : 500,
    currentY: typeof window !== 'undefined' ? window.innerHeight / 2 : 300,
    targetX: typeof window !== 'undefined' ? window.innerWidth / 2 : 500,
    targetY: typeof window !== 'undefined' ? window.innerHeight / 2 : 300,
    lastEmitX: typeof window !== 'undefined' ? window.innerWidth / 2 : 500,
    lastEmitY: typeof window !== 'undefined' ? window.innerHeight / 2 : 300,
    vx: 0,
    vy: 0,
    angle: profile.rotationMode === 'fixed_tilt' ? (profile.tiltAngle || 0) : 0,
    bankAngle: 0,
    animTime: 0,
    isVisible: true,
    isCanvasDirty: true,
    particles: []
  });

  const particlesRef = useRef(createModularParticlePool());

  const spawnParticle = (props) => {
    const pool = particlesRef.current;
    for (let i = 0; i < MAX_PARTICLES; i++) {
      const p = pool[i];
      if (!p.active) {
        p.active = true;
        p.x = props.x;
        p.y = props.y;
        p.vx = props.vx;
        p.vy = props.vy;
        p.size = props.size;
        p.alpha = props.alpha;
        p.decay = props.decay;
        p.color = props.color;
        p.baseColor = resolveBaseColor(props.color);
        p.type = props.type;
        p.glyph = props.glyph || '1';
        if (posRef.current) {
          posRef.current.isCanvasDirty = true;
          if (posRef.current.particles) {
            posRef.current.particles.length = Math.min(MAX_PARTICLES, (posRef.current.particles.length || 0) + 1);
          }
        }
        return p;
      }
    }
    return null;
  };

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

  // Pointer event tracking
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

    // Click burst explosion
    const handlePointerDown = () => {
      if (!trailEnabledRef.current) return;
      const state = posRef.current;
      const burstConfig = profile.clickBurst || { count: 12, speed: 80 };
      const customPalette = particleColorRef.current ? getTintedPalette(particleColorRef.current) : null;
      const palette = customPalette || profile.trail.colors;

      for (let i = 0; i < burstConfig.count; i++) {
        const ang = Math.random() * Math.PI * 2;
        const spd = (Math.random() * 0.7 + 0.3) * burstConfig.speed;
        const color = palette[Math.floor(Math.random() * palette.length)];

        spawnParticle({
          x: state.currentX,
          y: state.currentY,
          vx: Math.cos(ang) * spd,
          vy: Math.sin(ang) * spd,
          size: Math.random() * 2.5 + (profile.trail.size[0] || 1.5),
          alpha: 1.0,
          decay: Math.random() * 0.6 + profile.trail.decay,
          color,
          type: profile.trail.type,
          glyph: Math.random() > 0.5 ? '1' : '0'
        });
      }
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown, { passive: true });
    document.addEventListener('mouseleave', handlePointerLeave);
    document.addEventListener('mouseenter', handlePointerEnter);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('mouseleave', handlePointerLeave);
      document.removeEventListener('mouseenter', handlePointerEnter);
    };
  }, [profile]);

  // Canvas resize listener
  useEffect(() => {
    const handleResize = () => {
      if (!canvasRef.current) return;
      const canvas = canvasRef.current;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.scale(dpr, dpr);
      if (posRef.current) {
        posRef.current.isCanvasDirty = true;
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Main high-performance 60-120fps Kinematic Loop
  useEffect(() => {
    let animId;
    let lastTime = performance.now();
    const canvasEl = canvasRef.current;
    let ctx = canvasEl ? canvasEl.getContext('2d') : null;

    const loop = (now) => {
      const dt = Math.min((now - lastTime) / 1000, 0.08);
      lastTime = now;

      const state = posRef.current;
      const currentSpeed = speedRef.current || 0.14;
      const inertia = profile.inertia || 14.0;

      // Exponential lerp dampening
      const factor = 1.0 - Math.exp(-inertia * (currentSpeed / 0.14) * dt);
      const prevX = state.currentX;
      const prevY = state.currentY;

      state.currentX += (state.targetX - state.currentX) * factor;
      state.currentY += (state.targetY - state.currentY) * factor;

      state.vx = (state.currentX - prevX) / Math.max(dt, 0.001);
      state.vy = (state.currentY - prevY) / Math.max(dt, 0.001);

      const dx = state.targetX - state.currentX;
      const dy = state.targetY - state.currentY;
      const distance = Math.hypot(dx, dy);

      state.animTime += dt;

      // Kinematic Mode Handling
      switch (profile.rotationMode) {
        case 'heading':
        case 'heading_smooth': {
          if (distance > 1.8) {
            const targetHeading = (Math.atan2(dy, dx) * 180) / Math.PI + (profile.rotationOffset || 0);
            const angleDiff = (targetHeading - state.angle + 540) % 360 - 180;
            const turnSpeed = profile.rotationMode === 'heading_smooth' ? 10.0 : 16.0;
            state.angle += angleDiff * (1.0 - Math.exp(-turnSpeed * dt));

            if (profile.maxBank) {
              const targetBank = Math.max(-profile.maxBank, Math.min(profile.maxBank, angleDiff * 0.5));
              state.bankAngle += (targetBank - state.bankAngle) * (1.0 - Math.exp(-14.0 * dt));
            }
          } else {
            state.bankAngle *= Math.exp(-8.0 * dt);
          }
          break;
        }

        case 'sway': {
          const freq = profile.swayFrequency || 2.0;
          const amp = profile.swayAmplitude || 24;
          const targetSway = Math.sin(state.animTime * freq) * amp;
          state.angle += (targetSway - state.angle) * (1.0 - Math.exp(-10.0 * dt));
          break;
        }

        case 'bob':
        case 'bob_buzz':
        case 'buoyant_bob': {
          const freq = profile.bobFrequency || 3.0;
          const amp = profile.bobAmplitude || 6;
          const bobTilt = Math.cos(state.animTime * freq) * (amp * 1.5);
          state.angle += (bobTilt - state.angle) * (1.0 - Math.exp(-12.0 * dt));
          break;
        }

        case 'spin':
        case 'spin_subtle': {
          const spinSpeed = profile.spinSpeed || 60;
          state.angle = (state.angle + spinSpeed * dt) % 360;
          break;
        }

        case 'velocity_tilt': {
          const targetTilt = Math.max(-25, Math.min(25, state.vx * 0.03));
          state.angle += (targetTilt - state.angle) * (1.0 - Math.exp(-12.0 * dt));
          break;
        }

        case 'fixed_tilt': {
          const baseTilt = profile.tiltAngle || 0;
          const microWobble = Math.sin(state.animTime * 3) * 2;
          state.angle += (baseTilt + microWobble - state.angle) * (1.0 - Math.exp(-10.0 * dt));
          break;
        }

        case 'fixed':
        default: {
          state.angle = 0;
          break;
        }
      }

      // Update GPU-accelerated cursor avatar
      if (avatarRef.current) {
        const el = avatarRef.current;
        const posX = (state.currentX - 18).toFixed(2);
        const posY = (state.currentY - 18).toFixed(2);
        const rotZ = state.angle.toFixed(1);
        const rollY = (state.bankAngle * 0.7).toFixed(1);

        let dynamicScale = scaleRef.current || 1;
        if (profile.scaleWithSpeed) {
          const speedPx = Math.hypot(state.vx, state.vy);
          const stretch = Math.min(1.25, 1.0 + speedPx * 0.0003);
          dynamicScale *= stretch;
        }

        el.style.transform = `translate3d(${posX}px, ${posY}px, 0) rotate(${rotZ}deg) rotateY(${rollY}deg) scale(${dynamicScale.toFixed(3)})`;
        el.style.opacity = state.isVisible ? '1' : '0';
      }

      // Render Particle Canvas Trail
      if (canvasEl) {
        if (!ctx) ctx = canvasEl.getContext('2d');

        // Check active particles
        const hasActiveParticles = state.particles && state.particles.length > 0;
        if (hasActiveParticles || distance > 1.5) state.isCanvasDirty = true;

        if (state.isCanvasDirty && ctx) {
          ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
          if (!hasActiveParticles && distance <= 1.5) {
            state.isCanvasDirty = false;
          }
        }

        if (trailEnabledRef.current && ctx) {
            ctx.globalCompositeOperation = profile.trail.composite || 'lighter';

            // Spawn particles along motion path
            const emitDist = Math.hypot(state.currentX - state.lastEmitX, state.currentY - state.lastEmitY);
            const threshold = profile.trail.emitThreshold || 6;

            if (emitDist >= threshold && distance > 1.5) {
              state.lastEmitX = state.currentX;
              state.lastEmitY = state.currentY;

              const customPalette = particleColorRef.current ? getTintedPalette(particleColorRef.current) : null;
              const palette = customPalette || profile.trail.colors;
              const color = palette[Math.floor(Math.random() * palette.length)];
              const sizeRange = profile.trail.size || [1.5, 3.5];
              const size = Math.random() * (sizeRange[1] - sizeRange[0]) + sizeRange[0];

              let pVx = -state.vx * 0.08 + (Math.random() - 0.5) * 12;
              let pVy = -state.vy * 0.08 + (Math.random() - 0.5) * 12;

              // Special handling for upward flames
              if (profile.trail.type === 'rising_flames') {
                pVy -= Math.random() * 45 + 25;
              }

              spawnParticle({
                x: state.currentX,
                y: state.currentY,
                vx: pVx,
                vy: pVy,
                size,
                alpha: 1.0,
                decay: profile.trail.decay || 1.2,
                color,
                type: profile.trail.type,
                glyph: Math.random() > 0.5 ? '1' : '0'
              });
            }

            // Update & draw active particles
            ctx.save();
            let activeCount = 0;
            for (let i = 0; i < MAX_PARTICLES; i++) {
              const p = particlesRef.current[i];
              if (!p.active) continue;

              p.vy += (gravityRef.current || 0) * dt;
              p.x += p.vx * dt;
              p.y += p.vy * dt;
              p.alpha -= p.decay * dt;

              if (p.alpha <= 0) {
                p.active = false;
                continue;
              }

              activeCount++;

              // Draw particle by type with zero string allocations
              ctx.globalAlpha = Math.max(0, p.alpha);
              ctx.fillStyle = p.baseColor;

              if (p.type === 'matrix_glyphs') {
                ctx.font = `${p.size}px monospace`;
                ctx.fillText(p.glyph, p.x, p.y);
              } else if (p.type === 'stars') {
                // 4-point diamond star
                const s = p.size;
                ctx.beginPath();
                ctx.moveTo(p.x, p.y - s);
                ctx.quadraticCurveTo(p.x, p.y, p.x + s, p.y);
                ctx.quadraticCurveTo(p.x, p.y, p.x, p.y + s);
                ctx.quadraticCurveTo(p.x, p.y, p.x - s, p.y);
                ctx.quadraticCurveTo(p.x, p.y, p.x, p.y - s);
                ctx.fill();
              } else if (p.type === 'pixel_dust' || p.type === 'pac_dots') {
                // Square pixel
                ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
              } else {
                // Soft circular spark
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
              }
            }
            ctx.restore();
            if (state.particles) {
              state.particles.length = activeCount;
            }
          } else {
            for (let i = 0; i < MAX_PARTICLES; i++) {
              particlesRef.current[i].active = false;
            }
            if (state.particles) {
              state.particles.length = 0;
            }
          }
        }

        animId = requestAnimationFrame(loop);
      };

    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
      for (let i = 0; i < MAX_PARTICLES; i++) {
        particlesRef.current[i].active = false;
      }
      if (posRef.current && posRef.current.particles) {
        posRef.current.particles.length = 0;
      }
      if (canvasEl) {
        const cleanupCtx = ctx || canvasEl.getContext('2d');
        if (cleanupCtx) cleanupCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      }
    };
  }, [profile]);

  return (
    <div
      className="fixed inset-0 pointer-events-none z-50 overflow-hidden"
      aria-hidden="true"
    >
      {/* 60-120 FPS High-Performance Particle Trail Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
      />

      {/* Hardware-Accelerated Dynamic GPU Cursor Avatar */}
      <div
        ref={avatarRef}
        className="absolute top-0 left-0 w-9 h-9 pointer-events-none flex items-center justify-center will-change-transform"
        style={{
          filter: `drop-shadow(0 0 8px ${profile.glow || 'rgba(255,255,255,0.4)'})`
        }}
      >
        <CursorIcon cursorId={cursorId} size={32} />
      </div>
    </div>
  );
}
