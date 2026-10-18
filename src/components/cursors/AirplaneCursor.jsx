import React, { useEffect, useRef } from 'react';

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
export default function AirplaneCursor({
  heroRef,
  isInsideHero,
  speed = 0.15,
  trailEnabled = true,
  scale = 1
}) {
  const planeRef = useRef(null);
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
    bankAngle: 0,
    speedPxPerSec: 0,
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

    // Aerodynamic jet puff on click
    const handlePointerDown = () => {
      if (!trailEnabledRef.current) return;
      const state = posRef.current;
      for (let i = 0; i < 8; i++) {
        const ang = Math.random() * Math.PI * 2;
        const spd = Math.random() * 50 + 20;
        particlesRef.current.push({
          x: state.currentX,
          y: state.currentY,
          vx: Math.cos(ang) * spd,
          vy: Math.sin(ang) * spd,
          size: Math.random() * 4.0 + 2.0,
          alpha: 0.8,
          decay: Math.random() * 1.2 + 1.0,
          color: 'rgba(255, 255, 255,'
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
      const dx = state.targetX - state.currentX;
      const dy = state.targetY - state.currentY;
      const distance = Math.hypot(dx, dy);

      // Frame-rate independent exponential smoothing
      const lambda = Math.max(3.0, (speedRef.current || 0.15) * 80.0);
      const lerpFactor = 1.0 - Math.exp(-lambda * dt);

      const prevX = state.currentX;
      const prevY = state.currentY;
      state.currentX += dx * lerpFactor;
      state.currentY += dy * lerpFactor;

      const instVx = (state.currentX - prevX) / dt;
      const instVy = (state.currentY - prevY) / dt;
      state.vx += (instVx - state.vx) * (1.0 - Math.exp(-14.0 * dt));
      state.vy += (instVy - state.vy) * (1.0 - Math.exp(-14.0 * dt));
      state.speedPxPerSec = Math.hypot(state.vx, state.vy);

      // Orientation Heading & Aerodynamic Banking
      if (distance > 2.0) {
        const targetHeading = (Math.atan2(dy, dx) * 180) / Math.PI + 90;
        let angleDiff = (targetHeading - state.angle + 540) % 360 - 180;
        state.angle += angleDiff * (1.0 - Math.exp(-14.0 * dt));

        // Banking into turn
        const targetBank = Math.max(-32, Math.min(32, angleDiff * 0.55));
        state.bankAngle += (targetBank - state.bankAngle) * (1.0 - Math.exp(-16.0 * dt));
      } else {
        // Idle gentle float sway
        state.idleTime += dt * 2.5;
        const idleTilt = Math.sin(state.idleTime * 1.5) * 5.0;
        state.bankAngle += (idleTilt - state.bankAngle) * (1.0 - Math.exp(-8.0 * dt));
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
      if (trailEnabledRef.current && canvasRef.current) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        if (ctx) {
          const dpr = Math.min(window.devicePixelRatio || 1, 2);
          ctx.clearRect(0, 0, canvas.width, canvas.height);

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

            // Emit dual wingtip ribbon vapor
            if (particlesRef.current.length < 60) {
              // Left contrail
              particlesRef.current.push({
                x: leftWingX,
                y: leftWingY,
                vx: -state.vx * 0.05 + (Math.random() - 0.5) * 4,
                vy: -state.vy * 0.05 + (Math.random() - 0.5) * 4,
                size: Math.random() * 2.0 + 1.2,
                alpha: 0.65,
                decay: 1.4,
                color: 'rgba(255, 255, 255,'
              });
              // Right contrail
              particlesRef.current.push({
                x: rightWingX,
                y: rightWingY,
                vx: -state.vx * 0.05 + (Math.random() - 0.5) * 4,
                vy: -state.vy * 0.05 + (Math.random() - 0.5) * 4,
                size: Math.random() * 2.0 + 1.2,
                alpha: 0.65,
                decay: 1.4,
                color: 'rgba(255, 255, 255,'
              });
            }
            state.lastEmitX = state.currentX;
            state.lastEmitY = state.currentY;
          }

          if (particlesRef.current.length > 0) {
            ctx.save();
            ctx.scale(dpr, dpr);

            for (let i = particlesRef.current.length - 1; i >= 0; i--) {
              const p = particlesRef.current[i];
              p.x += p.vx * dt;
              p.y += p.vy * dt;
              p.alpha -= p.decay * dt;
              p.size = Math.max(0, p.size + dt * 1.5); // expand slightly like vapor

              if (p.alpha <= 0) {
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
      } else if (!trailEnabledRef.current && canvasRef.current) {
        if (particlesRef.current.length > 0) particlesRef.current = [];
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
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
