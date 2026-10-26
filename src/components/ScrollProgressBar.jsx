import React, { useRef, useEffect } from 'react';

export default function ScrollProgressBar({ className = '' }) {
  const barRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    let ticking = false;
    let lastAriaValue = 0;

    const calculateScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
      const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight || 0;
      const innerHeight = window.innerHeight || document.documentElement.clientHeight || 0;
      const maxScroll = scrollHeight - innerHeight;

      const ratio = maxScroll > 0 ? Math.min(1, Math.max(0, scrollY / maxScroll)) : 0;

      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${ratio})`;
      }

      // Accessibility: Update aria-valuenow in discrete 5% steps to prevent DOM mutation thrashing
      const currentPercent = Math.round(ratio * 100);
      if (Math.abs(currentPercent - lastAriaValue) >= 5 || currentPercent === 0 || currentPercent === 100) {
        lastAriaValue = currentPercent;
        if (containerRef.current) {
          containerRef.current.setAttribute('aria-valuenow', String(currentPercent));
        }
      }

      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(calculateScroll);
      }
    };

    // Initial calculation on mount
    calculateScroll();

    // Passive event listeners for optimal 60-120fps scrolling performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      role="progressbar"
      aria-label="Page scroll progress"
      aria-valuenow={0}
      aria-valuemin={0}
      aria-valuemax={100}
      className={`absolute bottom-0 left-0 right-0 h-[2.5px] pointer-events-none overflow-hidden rounded-b-full z-20 ${className}`}
    >
      <div
        ref={barRef}
        className="w-full h-full bg-gradient-to-r from-[#FF4D6D] to-[#FFAA00] will-change-transform"
        style={{ transform: 'scaleX(0)', transformOrigin: 'left center' }}
      />
    </div>
  );
}
