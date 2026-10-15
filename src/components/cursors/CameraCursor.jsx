import React, { useEffect, useRef } from 'react';

/**
 * CameraCursor Component (व्यूफाइंडर / Camera Focus Ring & Shutter Aperture)
 * 
 * Kinematics & Aesthetics:
 * - Photography viewfinder with 4-corner targeting brackets and central focus ring
 * - Dynamic aperture snap on click with flash shockwave
 * - Golden optical lens flare & bokeh dust particle trail
 * - Cinematic smooth panning inertia (60-120+ FPS lock)
 */
export default function CameraCursor({
  heroRef,
  isInsideHero,
  speed = 0.16,
  trailEnabled = true,
  scale = 1
}) {
  const cameraRef = useRef(null);
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
    isShutterSnapping: false,
    shutterTimer: 0,
    flashRings: [],
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

    // Camera shutter snap click
    const handlePointerDown = () => {
      const state = posRef.current;
      state.isShutterSnapping = true;
      state.shutterTimer = 0.18; // duration of snap animation

      // Trigger shutter flash ring
      state.flashRings.push({
        x: state.currentX,
        y: state.currentY,
        radius: 6,
        maxRadius: 50,
        alpha: 1.0
      });

      if (trailEnabledRef.current) {
        // Optical lens flare bokeh burst
        const bokehColors = [
          'rgba(255, 255, 255,',
          'rgba(255, 220, 150,',
          'rgba(255, 77, 109,',
          'rgba(200, 230, 255,'
        ];
        for (let i = 0; i < 10; i++) {
          const ang = Math.random() * Math.PI * 2;
          const spd = Math.random() * 55 + 25;
          particlesRef.current.push({
            x: state.currentX,
            y: state.currentY,
            vx: Math.cos(ang) * spd,
            vy: Math.sin(ang) * spd,
            size: Math.random() * 4.0 + 2.0,
            alpha: 0.9,
            decay: Math.random() * 1.1 + 0.9,
            color: bokehColors[Math.floor(Math.random() * bokehColors.length)]
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

      // Smooth cinematic lerp
      const lambda = Math.max(4.0, (speedRef.current || 0.16) * 80.0);
      const lerpFactor = 1.0 - Math.exp(-lambda * dt);

      state.currentX += dx * lerpFactor;
      state.currentY += dy * lerpFactor;

      // Shutter snap countdown
      if (state.shutterTimer > 0) {
        state.shutterTimer -= dt;
        if (state.shutterTimer <= 0) {
          state.isShutterSnapping = false;
        }
      }

      // DOM Update: Centered 44x44 viewfinder
      if (cameraRef.current) {
        const c = cameraRef.current;
        const posX = (state.currentX - 22).toFixed(2);
        const posY = (state.currentY - 22).toFixed(2);
        const snapScale = state.isShutterSnapping ? 0.85 : 1.0;
        const finalScale = ((scaleRef.current || 1) * snapScale).toFixed(3);

        c.style.transform = `translate3d(${posX}px, ${posY}px, 0) scale(${finalScale})`;
        c.style.opacity = state.isVisible ? '1' : '0';

        const ring = c.querySelector('.focus-ring');
        if (ring) {
          ring.style.borderColor = state.isShutterSnapping ? '#FF4D6D' : '#18181B';
        }
      }

      // Canvas Optical Bokeh Trail & Shutter Flash Rings
      if (canvasRef.current) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        if (ctx) {
          const dpr = Math.min(window.devicePixelRatio || 1, 2);
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          ctx.save();
          ctx.scale(dpr, dpr);
          ctx.globalCompositeOperation = 'lighter';

          // 1. Shutter flash ring shockwave
          for (let i = state.flashRings.length - 1; i >= 0; i--) {
            const f = state.flashRings[i];
            f.radius += dt * 110;
            f.alpha -= dt * 2.8;

            if (f.alpha <= 0 || f.radius >= f.maxRadius) {
              state.flashRings.splice(i, 1);
            } else {
              ctx.beginPath();
              ctx.arc(f.x, f.y, f.radius, 0, Math.PI * 2);
              ctx.strokeStyle = `rgba(255, 77, 109, ${f.alpha.toFixed(2)})`;
              ctx.lineWidth = 2.2;
              ctx.stroke();
            }
          }

          // 2. Optical bokeh / dust trail
          if (trailEnabledRef.current) {
            const emitDist = Math.hypot(state.currentX - state.lastEmitX, state.currentY - state.lastEmitY);
            if (emitDist >= 12 && particlesRef.current.length < 50) {
              particlesRef.current.push({
                x: state.currentX + (Math.random() - 0.5) * 8,
                y: state.currentY + (Math.random() - 0.5) * 8,
                vx: (Math.random() - 0.5) * 10,
                vy: (Math.random() - 0.5) * 10,
                size: Math.random() * 3.0 + 1.5,
                alpha: 0.7,
                decay: 1.2,
                color: 'rgba(255, 200, 140,'
              });
              state.lastEmitX = state.currentX;
              state.lastEmitY = state.currentY;
            }

            for (let i = particlesRef.current.length - 1; i >= 0; i--) {
              const p = particlesRef.current[i];
              p.x += p.vx * dt;
              p.y += p.vy * dt;
              p.alpha -= p.decay * dt;
              p.size = Math.max(0, p.size - dt * 0.4);

              if (p.alpha <= 0 || p.size <= 0) {
                particlesRef.current.splice(i, 1);
              } else {
                ctx.fillStyle = `${p.color} ${p.alpha.toFixed(2)})`;
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

      {/* Viewfinder Camera Stage */}
      <div
        ref={cameraRef}
        aria-hidden="true"
        className="fixed top-0 left-0 pointer-events-none z-[70] will-change-transform"
        style={{
          width: '44px',
          height: '44px',
          opacity: 1
        }}
      >
        <div className="relative w-full h-full flex items-center justify-center">
          {/* 4 Corner Viewfinder Brackets */}
          <div className="absolute top-0 left-0 w-[7px] h-[7px] border-t-2 border-l-2 border-[#18181B]" />
          <div className="absolute top-0 right-0 w-[7px] h-[7px] border-t-2 border-r-2 border-[#18181B]" />
          <div className="absolute bottom-0 left-0 w-[7px] h-[7px] border-b-2 border-l-2 border-[#18181B]" />
          <div className="absolute bottom-0 right-0 w-[7px] h-[7px] border-b-2 border-r-2 border-[#18181B]" />

          {/* Central Circular Focus Ring with Crosshair ticks */}
          <div className="focus-ring w-[18px] h-[18px] rounded-full border border-dashed border-[#18181B] flex items-center justify-center transition-colors duration-150">
            {/* Center target dot */}
            <div className="w-[3px] h-[3px] rounded-full bg-[#FF4D6D]" />
          </div>

          {/* Mini Telemetry Badge */}
          <div className="absolute -top-[14px] left-1/2 -translate-x-1/2 px-1 py-0.2 bg-[#18181B] text-white text-[7px] font-mono font-bold tracking-widest rounded-xs uppercase">
            AF-C
          </div>
        </div>
      </div>
    </>
  );
}
