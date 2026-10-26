import { useState, useCallback, useEffect, useRef } from 'react';

/**
 * use3DMicroTilt
 * High-performance hardware-accelerated micro-tilt hook for self-explanatory 3D buttons.
 * Computes normalized rotX and rotY based on cursor entry and movement.
 * Zero-dependency, 120 FPS capable, respecting prefers-reduced-motion.
 */
export function use3DMicroTilt({
  maxTilt = 10,
  scaleOnHover = 1.025,
  disabled = false,
  perspective = 600
} = {}) {
  const [tilt, setTilt] = useState({ rotX: 0, rotY: 0, isHovered: false, isPressed: false });
  const [reducedMotion, setReducedMotion] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);

    const handler = (e) => setReducedMotion(e.matches);
    mq.addEventListener?.('change', handler);
    return () => mq.removeEventListener?.('change', handler);
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (disabled || reducedMotion) return;
    const rect = e.currentTarget?.getBoundingClientRect();
    if (!rect || rect.width === 0 || rect.height === 0) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const normalizedX = (x / rect.width) * 2 - 1; // -1 to 1
    const normalizedY = (y / rect.height) * 2 - 1; // -1 to 1

    const rotX = -normalizedY * maxTilt;
    const rotY = normalizedX * maxTilt;

    setTilt((prev) => ({
      ...prev,
      rotX: Math.round(rotX * 10) / 10,
      rotY: Math.round(rotY * 10) / 10,
      isHovered: true
    }));
  }, [disabled, reducedMotion, maxTilt]);

  const handleMouseEnter = useCallback(() => {
    if (disabled || reducedMotion) return;
    setTilt((prev) => ({ ...prev, isHovered: true }));
  }, [disabled, reducedMotion]);

  const handleMouseLeave = useCallback(() => {
    setTilt({ rotX: 0, rotY: 0, isHovered: false, isPressed: false });
  }, []);

  const handleMouseDown = useCallback(() => {
    if (disabled) return;
    setTilt((prev) => ({ ...prev, isPressed: true }));
  }, [disabled]);

  const handleMouseUp = useCallback(() => {
    setTilt((prev) => ({ ...prev, isPressed: false }));
  }, []);

  const transform = (disabled || reducedMotion)
    ? 'none'
    : `perspective(${perspective}px) rotateX(${tilt.rotX}deg) rotateY(${tilt.rotY}deg) scale3d(${tilt.isHovered ? scaleOnHover : 1}, ${tilt.isHovered ? scaleOnHover : 1}, 1)`;

  const tiltStyle = {
    transform,
    transformStyle: 'preserve-3d',
    transition: tilt.isHovered
      ? 'transform 0.08s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.15s ease'
      : 'transform 0.28s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s ease',
    willChange: 'transform'
  };

  return {
    tilt,
    tiltStyle,
    elementRef,
    handleMouseMove,
    handleMouseEnter,
    handleMouseLeave,
    handleMouseDown,
    handleMouseUp,
    isHovered: tilt.isHovered,
    isPressed: tilt.isPressed
  };
}

export default use3DMicroTilt;
