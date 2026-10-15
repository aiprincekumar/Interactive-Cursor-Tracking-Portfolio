import React, { useState, useEffect } from 'react';

export default function ScrollProgressBar({ className = '' }) {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    let ticking = false;

    const calculateScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
      const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight || 0;
      const innerHeight = window.innerHeight || document.documentElement.clientHeight || 0;
      const maxScroll = scrollHeight - innerHeight;

      if (maxScroll <= 0) {
        setScrollProgress(0);
      } else {
        const percentage = (scrollY / maxScroll) * 100;
        // Strictly clamp between 0% and 100% to handle rubber-banding / bounce
        const clamped = Math.min(100, Math.max(0, percentage));
        setScrollProgress(clamped);
      }

      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(calculateScroll);
        ticking = true;
      }
    };

    // Initial calculation
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
      role="progressbar"
      aria-label="Page scroll progress"
      aria-valuenow={Math.round(scrollProgress)}
      aria-valuemin={0}
      aria-valuemax={100}
      className={`absolute bottom-0 left-0 right-0 h-[2.5px] pointer-events-none overflow-hidden z-20 ${className}`}
    >
      <div
        className="h-full bg-gradient-to-r from-[#FF4D6D] to-[#FFAA00] transition-[width] duration-75 ease-out will-change-[width]"
        style={{ width: `${scrollProgress}%` }}
      />
    </div>
  );
}
