import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Gauge, Crosshair, Activity, Sparkles, Orbit, RotateCcw } from 'lucide-react';
import { soundFX } from '../utils/audio';

// 7 Elastic Physics Orbs configuration with radiant neon palettes
const ORB_CONFIGS = [
  { id: 1, radius: 28, color: '#FF4D6D', name: 'Coral Rose', phase: 0.0 },
  { id: 2, radius: 24, color: '#00F2FE', name: 'Cyan Laser', phase: 0.9 },
  { id: 3, radius: 32, color: '#FFD700', name: 'Solar Gold', phase: 1.8 },
  { id: 4, radius: 22, color: '#10B981', name: 'Matrix Emerald', phase: 2.7 },
  { id: 5, radius: 30, color: '#A855F7', name: 'Cyber Purple', phase: 3.6 },
  { id: 6, radius: 20, color: '#F43F5E', name: 'Ruby Crimson', phase: 4.5 },
  { id: 7, radius: 26, color: '#38BDF8', name: 'Sky Blue', phase: 5.4 }
];

// Helper to convert hex to rgba
function hexToRgba(hex, alpha = 1) {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.substring(0, 2), 16) || 0;
  const g = parseInt(clean.substring(2, 4), 16) || 0;
  const b = parseInt(clean.substring(4, 6), 16) || 0;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default function PhysicsSandbox({
  gravity = 0,
  particleColor = '#FF4D6D',
  soundEnabled = true,
  className = '',
  onBurst = null
}) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  // Live Telemetry HUD direct DOM refs for ZERO React re-renders
  const speedTextRef = useRef(null);
  const coordsTextRef = useRef(null);
  const fpsTextRef = useRef(null);
  const speedBarRef = useRef(null);

  // Zero-G drift toggle state
  const [isZeroG, setIsZeroG] = useState(false);

  // Mutable physics simulation state
  const orbsRef = useRef([]);
  const sparksRef = useRef([]);
  const dimensionsRef = useRef({ width: 600, height: 380 });
  const rafIdRef = useRef(null);
  const lastTimeRef = useRef(0);
  const simTimeRef = useRef(0);
  const lastHudUpdateRef = useRef(0);

  // Props mirror refs to eliminate re-binding the RAF loop on prop updates
  const gravityRef = useRef(gravity);
  const isZeroGRef = useRef(isZeroG);
  const soundEnabledRef = useRef(soundEnabled);
  const particleColorRef = useRef(particleColor);

  useEffect(() => {
    gravityRef.current = gravity;
  }, [gravity]);

  useEffect(() => {
    isZeroGRef.current = isZeroG;
  }, [isZeroG]);

  useEffect(() => {
    soundEnabledRef.current = soundEnabled;
  }, [soundEnabled]);

  useEffect(() => {
    particleColorRef.current = particleColor;
  }, [particleColor]);

  // Pointer state inside canvas
  const pointerRef = useRef({
    x: 300,
    y: 190,
    lastX: 300,
    lastY: 190,
    vx: 0,
    vy: 0,
    smoothSpeed: 0,
    active: false,
    lastMoveTime: 0
  });

  // FPS Tracker
  const fpsTrackerRef = useRef({
    frames: 0,
    lastFpsCalc: 0,
    currentFps: 60
  });

  // Initialize or reset orbs with staggered positions and initial velocities
  const initOrbs = useCallback((w, h) => {
    const width = Math.max(w, 280);
    const height = Math.max(h, 200);

    return ORB_CONFIGS.map((cfg, index) => {
      const col = index % 4;
      const row = Math.floor(index / 4);
      const spacingX = width / 5;
      const spacingY = height / 3;

      const posX = Math.min(
        width - cfg.radius - 12,
        Math.max(cfg.radius + 12, spacingX * (col + 1) + (row % 2 ? 18 : -18))
      );
      const posY = Math.min(
        height - cfg.radius - 12,
        Math.max(cfg.radius + 12, spacingY * (row + 1) + (index * 7))
      );

      const angle = (index / ORB_CONFIGS.length) * Math.PI * 2;
      const speed = 25 + index * 6;

      return {
        id: cfg.id,
        radius: cfg.radius,
        mass: (cfg.radius * cfg.radius) / 400, // mass proportional to area
        color: cfg.color,
        name: cfg.name,
        phase: cfg.phase,
        x: posX,
        y: posY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed
      };
    });
  }, []);

  // Trigger Particle Burst programmatically or via button
  const triggerParticleBurst = useCallback(() => {
    const { width, height } = dimensionsRef.current;
    const pointer = pointerRef.current;

    // Determine explosion origin: pointer if active, else arena center
    const originX = pointer.active ? pointer.x : width / 2;
    const originY = pointer.active ? pointer.y : height / 2;

    // Spawn 40 radial spark particles
    const newSparks = [];
    const palette = ['#FF4D6D', '#00F2FE', '#FFD700', '#10B981', '#A855F7', '#38BDF8', '#FFFFFF', particleColorRef.current];

    for (let i = 0; i < 40; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 120 + Math.random() * 320;
      const life = 0.55 + Math.random() * 0.65;
      newSparks.push({
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: palette[Math.floor(Math.random() * palette.length)],
        size: 2.5 + Math.random() * 3,
        life,
        maxLife: life
      });
    }

    sparksRef.current.push(...newSparks);

    // Apply radial explosive impulse to all 7 elastic orbs
    orbsRef.current.forEach((orb) => {
      const dx = orb.x - originX;
      const dy = orb.y - originY;
      const dist = Math.max(Math.hypot(dx, dy), 14);
      const impulse = (420 / (dist + 35)) * 75;
      orb.vx += (dx / dist) * impulse;
      orb.vy += (dy / dist) * impulse;
    });

    // Synthesize acoustic feedback
    if (soundEnabledRef.current && soundFX) {
      soundFX.init();
      if (typeof soundFX.playPop === 'function') {
        soundFX.playPop();
      } else if (typeof soundFX.playSparkle === 'function') {
        soundFX.playSparkle();
      }
    }

    if (typeof onBurst === 'function') {
      onBurst({ originX, originY });
    }
  }, [onBurst]);

  // Toggle Zero-G Drift
  const toggleZeroG = useCallback(() => {
    setIsZeroG((prev) => {
      const next = !prev;
      if (soundEnabledRef.current && soundFX) {
        soundFX.init();
        if (typeof soundFX.playChipHover === 'function') {
          soundFX.playChipHover();
        }
      }
      return next;
    });
  }, []);

  // Reset orbs back to initial formation
  const resetOrbs = useCallback(() => {
    const { width, height } = dimensionsRef.current;
    orbsRef.current = initOrbs(width, height);
    sparksRef.current = [];
    if (soundEnabledRef.current && soundFX) {
      soundFX.init();
      if (typeof soundFX.playFocusBeep === 'function') {
        soundFX.playFocusBeep();
      }
    }
  }, [initOrbs]);

  // Pointer & Touch handlers
  const updatePointer = useCallback((clientX, clientY) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, clientX - rect.left));
    const y = Math.max(0, Math.min(rect.height, clientY - rect.top));

    const pointer = pointerRef.current;
    pointer.x = x;
    pointer.y = y;
    pointer.active = true;
    pointer.lastMoveTime = performance.now();
  }, []);

  const handleMouseMove = useCallback((e) => {
    updatePointer(e.clientX, e.clientY);
  }, [updatePointer]);

  const handleMouseEnter = useCallback((e) => {
    updatePointer(e.clientX, e.clientY);
  }, [updatePointer]);

  const handleMouseLeave = useCallback(() => {
    pointerRef.current.active = false;
  }, []);

  const handleTouchStart = useCallback((e) => {
    if (e.touches && e.touches[0]) {
      updatePointer(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, [updatePointer]);

  const handleTouchMove = useCallback((e) => {
    if (e.touches && e.touches[0]) {
      updatePointer(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, [updatePointer]);

  const handleTouchEnd = useCallback(() => {
    pointerRef.current.active = false;
  }, []);

  // Main Canvas & Simulation lifecycle
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Resize handling with High-DPI support
    const handleResize = () => {
      const width = container.clientWidth || 600;
      const height = container.clientHeight || 380;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      dimensionsRef.current = { width, height };
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Keep orbs inside new bounds
      if (orbsRef.current.length === 0) {
        orbsRef.current = initOrbs(width, height);
      } else {
        orbsRef.current.forEach((orb) => {
          orb.x = Math.max(orb.radius, Math.min(width - orb.radius, orb.x));
          orb.y = Math.max(orb.radius, Math.min(height - orb.radius, orb.y));
        });
      }
    };

    handleResize();

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    resizeObserver.observe(container);

    // Physics Animation Loop
    lastTimeRef.current = performance.now();
    fpsTrackerRef.current.lastFpsCalc = performance.now();

    const animate = (now) => {
      // Delta-time normalization with clamp
      const dt = Math.min((now - lastTimeRef.current) / 1000, 0.04);
      lastTimeRef.current = now;
      simTimeRef.current += dt;

      const { width, height } = dimensionsRef.current;
      const pointer = pointerRef.current;
      const orbs = orbsRef.current;
      const activeZeroG = isZeroGRef.current;
      const effGravity = activeZeroG ? 0 : gravityRef.current;

      // Calculate instantaneous pointer velocity & smoothed speed
      if (pointer.active) {
        const dxCur = pointer.x - pointer.lastX;
        const dyCur = pointer.y - pointer.lastY;
        const rawSpeed = Math.hypot(dxCur, dyCur) / Math.max(dt, 0.001);
        const clampedSpeed = Math.min(rawSpeed, 2200);

        pointer.smoothSpeed += (clampedSpeed - pointer.smoothSpeed) * 0.25;
        pointer.vx = (dxCur / Math.max(dt, 0.001)) * 0.35;
        pointer.vy = (dyCur / Math.max(dt, 0.001)) * 0.35;
        pointer.lastX = pointer.x;
        pointer.lastY = pointer.y;

        // Decay speed if cursor is stationary inside canvas
        if (now - pointer.lastMoveTime > 120) {
          pointer.smoothSpeed *= 0.88;
        }
      } else {
        pointer.smoothSpeed *= 0.86;
        pointer.vx = 0;
        pointer.vy = 0;
      }

      // Update Orbs Physics
      for (let i = 0; i < orbs.length; i++) {
        const orb = orbs[i];

        // 1. Gravity or Zero-G Orbital Float
        if (activeZeroG) {
          // Gentle sinusoidal orbital float
          orb.vx += Math.cos(simTimeRef.current * 1.3 + orb.phase) * 16 * dt;
          orb.vy += Math.sin(simTimeRef.current * 1.6 + orb.phase) * 16 * dt;
        } else {
          orb.vy += effGravity * dt;
        }

        // 2. Cursor repulsion & kinetic push
        if (pointer.active) {
          const dx = orb.x - pointer.x;
          const dy = orb.y - pointer.y;
          const dist = Math.hypot(dx, dy);
          const intRadius = orb.radius + 68;

          if (dist < intRadius) {
            const nx = dist > 0.001 ? dx / dist : 0;
            const ny = dist > 0.001 ? dy / dist : -1;
            const factor = (intRadius - dist) / intRadius;
            const repelAcc = factor * 850;

            orb.vx += (nx * repelAcc + pointer.vx * 0.35) * dt;
            orb.vy += (ny * repelAcc + pointer.vy * 0.35) * dt;

            // Direct push separation if pointer deeply penetrates orb
            if (dist < orb.radius + 14) {
              const pen = (orb.radius + 14) - dist;
              orb.x += nx * pen * 0.45;
              orb.y += ny * pen * 0.45;
            }
          }
        }

        // 3. Viscous drag / damping
        const damping = Math.max(0, 1 - 0.018 * 60 * dt);
        orb.vx *= damping;
        orb.vy *= damping;

        // 4. Integrate positions
        orb.x += orb.vx * dt;
        orb.y += orb.vy * dt;

        // 5. Wall collisions with restitution (e = 0.85)
        const eWall = 0.85;
        if (orb.x - orb.radius < 0) {
          orb.x = orb.radius;
          orb.vx = -orb.vx * eWall;
        } else if (orb.x + orb.radius > width) {
          orb.x = width - orb.radius;
          orb.vx = -orb.vx * eWall;
        }

        if (orb.y - orb.radius < 0) {
          orb.y = orb.radius;
          orb.vy = -orb.vy * eWall;
        } else if (orb.y + orb.radius > height) {
          orb.y = height - orb.radius;
          orb.vy = -orb.vy * eWall;
        }
      }

      // 6. Pairwise Elastic Collisions with Mass Conservation
      for (let i = 0; i < orbs.length; i++) {
        for (let j = i + 1; j < orbs.length; j++) {
          const orbA = orbs[i];
          const orbB = orbs[j];
          const dx = orbB.x - orbA.x;
          const dy = orbB.y - orbA.y;
          const dist = Math.hypot(dx, dy);
          const minDist = orbA.radius + orbB.radius;

          if (dist < minDist && dist > 0.0001) {
            const nx = dx / dist;
            const ny = dy / dist;
            const overlap = minDist - dist;

            // Positional separation weighted by inverse masses
            const totalMass = orbA.mass + orbB.mass;
            orbA.x -= nx * overlap * (orbB.mass / totalMass);
            orbA.y -= ny * overlap * (orbB.mass / totalMass);
            orbB.x += nx * overlap * (orbA.mass / totalMass);
            orbB.y += ny * overlap * (orbA.mass / totalMass);

            // Relative normal velocity
            const rvx = orbA.vx - orbB.vx;
            const rvy = orbA.vy - orbB.vy;
            const velAlongNormal = rvx * nx + rvy * ny;

            // Only collide if moving toward each other
            if (velAlongNormal > 0) {
              const restitution = 0.90;
              const impulse = (-(1 + restitution) * velAlongNormal) / (1 / orbA.mass + 1 / orbB.mass);
              orbA.vx += (impulse / orbA.mass) * nx;
              orbA.vy += (impulse / orbA.mass) * ny;
              orbB.vx -= (impulse / orbB.mass) * nx;
              orbB.vy -= (impulse / orbB.mass) * ny;
            }
          }
        }
      }

      // 7. Sparks Simulation
      const sparks = sparksRef.current;
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.x += s.vx * dt;
        s.y += s.vy * dt;
        s.vx *= Math.max(0, 1 - 0.04 * 60 * dt);
        s.vy *= Math.max(0, 1 - 0.04 * 60 * dt);
        s.life -= dt;
        if (s.life <= 0) {
          sparks.splice(i, 1);
        }
      }

      // ==========================================
      // CANVAS RENDERING
      // ==========================================
      ctx.clearRect(0, 0, width, height);

      // Subtle high-tech workbench dot grid
      const step = 38;
      ctx.save();
      ctx.fillStyle = 'rgba(140, 140, 160, 0.12)';
      for (let gx = step; gx < width; gx += step) {
        for (let gy = step; gy < height; gy += step) {
          ctx.fillRect(gx - 0.75, gy - 0.75, 1.5, 1.5);
        }
      }
      ctx.restore();

      // Kinetic influence reticle around cursor
      if (pointer.active) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(pointer.x, pointer.y, 68, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(0, 242, 254, 0.25)';
        ctx.lineWidth = 1.25;
        ctx.setLineDash([4, 6]);
        ctx.stroke();

        const curGrad = ctx.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, 68);
        curGrad.addColorStop(0, 'rgba(0, 242, 254, 0.07)');
        curGrad.addColorStop(1, 'rgba(0, 242, 254, 0)');
        ctx.fillStyle = curGrad;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(pointer.x, pointer.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#00F2FE';
        ctx.fill();
        ctx.restore();
      }

      // Draw 7 Elastic Orbs with radiant gradients and specular highlights
      for (let i = 0; i < orbs.length; i++) {
        const orb = orbs[i];
        const r = orb.radius;

        ctx.save();
        // Drop shadow glow
        ctx.shadowColor = orb.color;
        ctx.shadowBlur = 14;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 3;

        // Radial sphere gradient
        const grad = ctx.createRadialGradient(
          orb.x - r * 0.32,
          orb.y - r * 0.32,
          r * 0.1,
          orb.x,
          orb.y,
          r
        );
        grad.addColorStop(0, '#FFFFFF');
        grad.addColorStop(0.28, hexToRgba(orb.color, 0.95));
        grad.addColorStop(0.85, orb.color);
        grad.addColorStop(1, hexToRgba(orb.color, 0.65));

        ctx.beginPath();
        ctx.arc(orb.x, orb.y, r, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        // Inner rim stroke
        ctx.shadowBlur = 0;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Specular highlight crescent
        ctx.beginPath();
        ctx.arc(orb.x - r * 0.32, orb.y - r * 0.32, r * 0.28, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
        ctx.fill();

        ctx.restore();
      }

      // Draw Radial Sparks
      if (sparks.length > 0) {
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        for (let i = 0; i < sparks.length; i++) {
          const s = sparks[i];
          const alpha = Math.max(0, s.life / s.maxLife);
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.size * alpha, 0, Math.PI * 2);
          ctx.fillStyle = hexToRgba(s.color, alpha);
          ctx.fill();
        }
        ctx.restore();
      }

      // ==========================================
      // FPS & TELEMETRY DIRECT DOM UPDATE
      // ==========================================
      fpsTrackerRef.current.frames += 1;
      if (now - fpsTrackerRef.current.lastFpsCalc >= 500) {
        const elapsed = (now - fpsTrackerRef.current.lastFpsCalc) / 1000;
        fpsTrackerRef.current.currentFps = fpsTrackerRef.current.frames / elapsed;
        fpsTrackerRef.current.frames = 0;
        fpsTrackerRef.current.lastFpsCalc = now;
      }

      // Throttled DOM mutations (every ~65ms) for ZERO React re-renders!
      if (now - lastHudUpdateRef.current > 65) {
        const roundedSpeed = Math.round(pointer.smoothSpeed);
        if (speedTextRef.current) {
          speedTextRef.current.textContent = String(roundedSpeed);
        }
        if (coordsTextRef.current) {
          coordsTextRef.current.textContent = pointer.active
            ? `X: ${Math.round(pointer.x)}, Y: ${Math.round(pointer.y)}`
            : 'STANDBY';
        }
        if (fpsTextRef.current) {
          fpsTextRef.current.textContent = String(Math.round(fpsTrackerRef.current.currentFps));
        }
        if (speedBarRef.current) {
          const pct = Math.min(100, Math.round((roundedSpeed / 850) * 100));
          speedBarRef.current.style.width = `${pct}%`;
        }
        lastHudUpdateRef.current = now;
      }

      rafIdRef.current = requestAnimationFrame(animate);
    };

    rafIdRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      resizeObserver.disconnect();
    };
  }, [initOrbs]);

  return (
    <div className={`relative flex flex-col w-full ${className}`}>
      {/* 2D Canvas Arena Stage */}
      <div
        ref={containerRef}
        className="relative w-full h-[360px] md:h-[420px] rounded-2xl overflow-hidden bg-gradient-to-b from-[#FAF8F5] via-[#F4EFEA] to-[#ECE5DC] dark:from-[#0C0816] dark:via-[#130E22] dark:to-[#19132B] border border-stone-200/80 dark:border-stone-800 shadow-inner select-none cursor-crosshair touch-none"
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
      >
        {/* Canvas Element */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 block w-full h-full pointer-events-none"
        />

        {/* Live Telemetry HUD: Direct-ref DOM mutations inside RAF loop for 0 React re-renders */}
        <div className="absolute top-3 left-3 flex flex-wrap items-center gap-2 pointer-events-none z-20 select-none">
          <div className="bg-stone-900/90 dark:bg-black/85 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/10 flex items-center gap-3 text-xs font-mono shadow-xl text-stone-200">
            {/* Speedometer */}
            <div className="flex items-center gap-1.5 text-[#00F2FE]">
              <Gauge className="w-3.5 h-3.5 text-[#00F2FE] shrink-0" />
              <span className="font-bold text-white min-w-[2.25rem] text-right" ref={speedTextRef}>0</span>
              <span className="text-[10px] text-stone-400">px/s</span>
            </div>

            <span className="text-white/20">|</span>

            {/* Coordinates */}
            <div className="flex items-center gap-1.5 text-stone-300">
              <Crosshair className="w-3.5 h-3.5 text-[#FF4D6D] shrink-0" />
              <span className="font-medium text-stone-200 min-w-[5.25rem]" ref={coordsTextRef}>STANDBY</span>
            </div>

            <span className="text-white/20">|</span>

            {/* FPS */}
            <div className="flex items-center gap-1.5 text-emerald-400">
              <Activity className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="font-bold text-emerald-300 min-w-[1.75rem] text-right" ref={fpsTextRef}>60</span>
              <span className="text-[10px] text-stone-400">FPS</span>
            </div>
          </div>

          {/* Dynamic Speed Bar Meter */}
          <div className="hidden sm:flex items-center w-16 md:w-20 h-2 bg-stone-900/80 backdrop-blur-md rounded-full overflow-hidden border border-white/10">
            <div
              ref={speedBarRef}
              className="h-full bg-gradient-to-r from-[#00F2FE] via-[#FFD700] to-[#FF4D6D] transition-all duration-75"
              style={{ width: '0%' }}
            />
          </div>
        </div>
      </div>

      {/* Arena Interactive Controls Toolbar */}
      <div className="mt-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          {/* Particle Burst Button */}
          <button
            type="button"
            onClick={triggerParticleBurst}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#FF4D6D] to-[#E03554] text-white font-bold shadow-md hover:shadow-lg hover:brightness-110 active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4D6D]"
            aria-label="Trigger Particle Burst"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Particle Burst</span>
          </button>

          {/* Zero-G Drift Toggle */}
          <button
            type="button"
            onClick={toggleZeroG}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 active:scale-95 ${
              isZeroG
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-sm shadow-emerald-500/20'
                : 'bg-stone-100 dark:bg-stone-800/80 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:bg-stone-200 dark:hover:bg-stone-700'
            }`}
            aria-label="Toggle Zero-G Drift"
            aria-pressed={isZeroG}
          >
            <Orbit
              className={`w-3.5 h-3.5 ${isZeroG ? 'animate-spin text-emerald-400' : ''}`}
              style={{ animationDuration: '6s' }}
            />
            <span>{isZeroG ? 'Zero-G: ACTIVE' : 'Zero-G Drift'}</span>
          </button>

          {/* Reset Orbs */}
          <button
            type="button"
            onClick={resetOrbs}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl font-medium bg-stone-100 dark:bg-stone-800/80 text-stone-600 dark:text-stone-400 border border-stone-200 dark:border-stone-700 hover:bg-stone-200 dark:hover:bg-stone-700 active:scale-95 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-400"
            aria-label="Reset Orbs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>

        {/* Physics Arena Telemetry Metrics */}
        <div className="flex items-center gap-2 text-[11px] font-mono text-stone-500 dark:text-stone-400">
          <span className="px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/60">
            Gravity: <strong className="text-stone-800 dark:text-stone-200">{isZeroG ? '0' : gravity} px/s²</strong>
          </span>
          <span className="hidden sm:inline-block px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/60">
            Restitution: <strong className="text-stone-800 dark:text-stone-200">0.85</strong>
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/60">
            Orbs: <strong className="text-stone-800 dark:text-stone-200">7 Active</strong>
          </span>
        </div>
      </div>
    </div>
  );
}
