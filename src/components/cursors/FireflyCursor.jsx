import React, { useEffect, useRef } from 'react';

/**
 * FireflyCursor Component (जुगनू)
 * 
 * Kinematics & Aesthetics:
 * - Warm bioluminescent pulsating aura with amber/gold & lime glowing core
 * - Organic flight trajectory with multi-harmonic Lissajous drift and micro-jitter
 * - Additive canvas floating ember & spore trail with warm glowing decay
 * - Hardware-accelerated GPU transforms (60-120+ FPS lock)
 */
export default function FireflyCursor({
  heroRef,
  isInsideHero,
  speed = 0.12,
  trailEnabled = true,
  scale = 1
}) {
  const fireflyRef = useRef(null);
  const canvasRef = useRef(null);
  const isInsideHeroRef = useRef(isInsideHero);
  const speedRef = useRef(speed);
  const scaleRef = useRef(scale);
  const trailEnabledRef = useRef(trailEnabled);

  const posRef = useRef({
    currentX: typeof window !== 'undefined' ? window.innerWidth / 2 : 500,
    currentY: typeof window !== 'undefined' ? window.innerHeight / 2 : 300,
    targetX: typeof window !== 'undefined' ? window.innerWidth / 2 : 500,
    targetY: typeof window !== 'undefined' ? window.innerHeight / 2 : 300,
    lastEmitX: typeof window !== 'undefined' ? window.innerWidth / 2 : 500,
    lastEmitY: typeof window !== 'undefined' ? window.innerHeight / 2 : 300,
    vx: 0,
    vy: 0,
    angle: 0,
    pulseTime: 0,
    idleTime: 0,
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

    // Burst bioluminescent sparks on click
    const handlePointerDown = () => {
      if (!trailEnabledRef.current) return;
      const state = posRef.current;
      const palette = [
        'rgba(255, 230, 100,',
        'rgba(200, 255, 100,',
        'rgba(255, 190, 50,',
        'rgba(255, 255, 200,'
      ];
      for (let i = 0; i < 9; i++) {
        const ang = Math.random() * Math.PI * 2;
        const spd = Math.random() * 65 + 30;
        particlesRef.current.push({
          x: state.currentX,
          y: state.currentY,
          vx: Math.cos(ang) * spd,
          vy: Math.sin(ang) * spd,
          size: Math.random() * 3.2 + 1.6,
          alpha: 1.0,
          decay: Math.random() * 1.0 + 0.9,
          color: palette[Math.floor(Math.random() * palette.length)],
          isEmber: true
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

    // Main 60-120 FPS Loop
    const loop = (currentTime) => {
      const dt = Math.min(Math.max((currentTime - lastTime) / 1000, 0.001), 0.05);
      lastTime = currentTime;

      const state = posRef.current;
      state.pulseTime += dt * 4.2;

      const dx = state.targetX - state.currentX;
      const dy = state.targetY - state.currentY;
      const distance = Math.hypot(dx, dy);

      // Frame-rate independent exponential smoothing
      const lambda = Math.max(3.0, (speedRef.current || 0.12) * 70.0);
      const lerpFactor = 1.0 - Math.exp(-lambda * dt);

      const prevX = state.currentX;
      const prevY = state.currentY;
      state.currentX += dx * lerpFactor;
      state.currentY += dy * lerpFactor;

      const instVx = (state.currentX - prevX) / dt;
      const instVy = (state.currentY - prevY) / dt;
      state.vx += (instVx - state.vx) * (1.0 - Math.exp(-12.0 * dt));
      state.vy += (instVy - state.vy) * (1.0 - Math.exp(-12.0 * dt));

      // Organic drift & hover micro-jitter
      let renderX = state.currentX;
      let renderY = state.currentY;

      if (distance < 4.0) {
        state.idleTime += dt * 2.8;
        const driftX = Math.sin(state.idleTime * 2.2) * 4.5 + Math.cos(state.idleTime * 4.8) * 1.8;
        const driftY = Math.cos(state.idleTime * 1.8) * 4.0 + Math.sin(state.idleTime * 3.4) * 1.5;
        renderX += driftX;
        renderY += driftY;
      } else {
        state.idleTime = Math.max(0, state.idleTime - dt * 2.0);
        // Slight buzzing jitter during flight
        renderX += (Math.random() - 0.5) * 1.5;
        renderY += (Math.random() - 0.5) * 1.5;
      }

      // Orientation angle
      if (distance > 2.0) {
        const targetHeading = (Math.atan2(dy, dx) * 180) / Math.PI + 90;
        let angleDiff = (targetHeading - state.angle + 540) % 360 - 180;
        state.angle += angleDiff * (1.0 - Math.exp(-12.0 * dt));
      }

      // Bioluminescent glow pulse calculation (breathing effect: 0.65 to 1.0)
      const glowIntensity = 0.72 + 0.28 * Math.sin(state.pulseTime);
      const lanternGlowSize = (14 * glowIntensity).toFixed(1);

      // DOM Update without React re-renders
      if (fireflyRef.current) {
        const f = fireflyRef.current;
        const posX = (renderX - 16).toFixed(2);
        const posY = (renderY - 16).toFixed(2);
        const rotZ = state.angle.toFixed(1);

        f.style.transform = `translate3d(${posX}px, ${posY}px, 0) rotate(${rotZ}deg) scale(${scaleRef.current || 1})`;
        f.style.opacity = state.isVisible ? '1' : '0';

        // Update glow aura directly
        const lantern = f.querySelector('.firefly-lantern');
        if (lantern) {
          lantern.style.boxShadow = `0 0 ${lanternGlowSize}px ${lanternGlowSize / 2}px rgba(220, 255, 60, ${glowIntensity * 0.9}), 0 0 35px 12px rgba(255, 200, 30, ${glowIntensity * 0.45})`;
          lantern.style.opacity = (0.75 + 0.25 * glowIntensity).toFixed(2);
        }
      }

      // Canvas Trail: Floating bioluminescent glowing embers
      if (trailEnabledRef.current && canvasRef.current) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        if (ctx) {
          const dpr = Math.min(window.devicePixelRatio || 1, 2);
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          // Emit warm spore embers along trajectory
          const emitDist = Math.hypot(renderX - state.lastEmitX, renderY - state.lastEmitY);
          const step = 10;

          if (emitDist >= step) {
            const count = Math.min(Math.floor(emitDist / step), 3);
            for (let k = 1; k <= count; k++) {
              if (particlesRef.current.length < 55) {
                const t = k / count;
                const px = state.lastEmitX + (renderX - state.lastEmitX) * t + (Math.random() - 0.5) * 5;
                const py = state.lastEmitY + (renderY - state.lastEmitY) * t + (Math.random() - 0.5) * 5;

                const palette = [
                  'rgba(240, 255, 80,',
                  'rgba(255, 220, 50,',
                  'rgba(180, 255, 100,',
                  'rgba(255, 245, 150,'
                ];
                const color = palette[Math.floor(Math.random() * palette.length)];

                particlesRef.current.push({
                  x: px,
                  y: py,
                  vx: (Math.random() - 0.5) * 12 - state.vx * 0.04,
                  vy: -Math.random() * 18 - 8, // gentle upward drift like real firefly sparks
                  size: Math.random() * 2.8 + 1.4,
                  alpha: 0.85,
                  decay: Math.random() * 0.7 + 0.9,
                  color,
                  isEmber: true
                });
              }
            }
            state.lastEmitX = renderX;
            state.lastEmitY = renderY;
          }

          // Render embers
          if (particlesRef.current.length > 0) {
            ctx.save();
            ctx.scale(dpr, dpr);
            ctx.globalCompositeOperation = 'lighter';

            for (let i = particlesRef.current.length - 1; i >= 0; i--) {
              const p = particlesRef.current[i];
              p.x += p.vx * dt;
              p.y += p.vy * dt;
              p.vx *= 0.96;
              p.vy *= 0.96;
              p.alpha -= p.decay * dt;
              p.size = Math.max(0, p.size - dt * 0.5);

              if (p.alpha <= 0 || p.size <= 0) {
                particlesRef.current.splice(i, 1);
              } else {
                ctx.fillStyle = `${p.color} ${p.alpha.toFixed(2)})`;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
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

      <div
        ref={fireflyRef}
        aria-hidden="true"
        className="fixed top-0 left-0 pointer-events-none z-[70] will-change-transform"
        style={{
          width: '32px',
          height: '32px',
          opacity: 1
        }}
      >
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Bioluminescent Outer Glow Ring */}
          <div className="absolute inset-0 rounded-full bg-lime-400/20 blur-md animate-pulse pointer-events-none" />

          {/* Translucent buzzing wings */}
          <div className="absolute top-[3px] left-[4px] w-[11px] h-[16px] origin-bottom-right rotate-[-30deg] opacity-75">
            <div className="w-full h-full rounded-full bg-gradient-to-t from-emerald-100/40 via-yellow-100/60 to-white/90 border border-white/50 animate-[ping_0.15s_infinite]" />
          </div>
          <div className="absolute top-[3px] right-[4px] w-[11px] h-[16px] origin-bottom-left rotate-[30deg] opacity-75">
            <div className="w-full h-full rounded-full bg-gradient-to-t from-emerald-100/40 via-yellow-100/60 to-white/90 border border-white/50 animate-[ping_0.15s_infinite]" />
          </div>

          {/* Firefly Body: Head + Thorax */}
          <div className="relative z-10 flex flex-col items-center">
            {/* Tiny Antennae */}
            <div className="w-[8px] h-[4px] flex justify-between -mb-[1px]">
              <span className="w-[1px] h-[4px] bg-amber-900 rotate-[-20deg]" />
              <span className="w-[1px] h-[4px] bg-amber-900 rotate-[20deg]" />
            </div>
            {/* Dark carapace / head */}
            <div className="w-[6px] h-[6px] bg-[#291e13] rounded-full" />
            <div className="w-[7px] h-[7px] bg-[#3d2c1c] rounded-full -mt-[1px]" />

            {/* Glowing Lantern Abdomen (Heart of the Firefly) */}
            <div
              className="firefly-lantern w-[9px] h-[11px] -mt-[1px] rounded-full bg-gradient-to-b from-[#e5ff66] via-[#d4ff33] to-[#a6e600] transition-shadow duration-75"
              style={{
                boxShadow: '0 0 12px 6px rgba(220, 255, 60, 0.8), 0 0 28px 8px rgba(255, 200, 30, 0.4)'
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
