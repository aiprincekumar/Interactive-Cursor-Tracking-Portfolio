import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { soundFX } from '../utils/audio';
import { useLab } from '../context/LabContext';

/**
 * Floating Back-To-Top Button with Scroll Progress Indicator
 * 
 * Features:
 * - Circular SVG progress indicator with vibrant gradient stroke (#FF4D6D to #FFAA00)
 * - Scroll threshold visibility (>400px past Hero section) with smooth fade/scale
 * - Unified floating cluster alongside the Control Center FAB
 * - Web Audio API sparkle sound trigger upon click
 * - WCAG AAA Accessible with tooltip, aria-label, and keyboard focus states
 */
export default function BackToTopButton() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const { soundEnabled } = useLab();

  useEffect(() => {
    let ticking = false;

    const calculateScroll = () => {
      if (typeof window === 'undefined') return;

      const scrollTop = window.scrollY || document.documentElement.scrollTop || 0;
      const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;

      // Visibility threshold: ~400px past Hero
      setIsVisible(scrollTop > 400);

      if (docHeight > 0) {
        const progress = Math.min(100, Math.max(0, (scrollTop / docHeight) * 100));
        setScrollProgress(progress);
      } else {
        setScrollProgress(0);
      }
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(calculateScroll);
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Initial check
    calculateScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }

    if (soundEnabled && soundFX?.playSparkle) {
      soundFX.playSparkle();
    }
  };

  // Circular progress calculations (Radius 22, Circumference 2 * PI * 22 = 138.23)
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;

  return (
    <div
      className={`fixed bottom-22 right-6 sm:bottom-24 sm:right-8 z-40 select-none transition-all duration-300 ease-out ${
        isVisible
          ? 'opacity-100 scale-100 pointer-events-auto translate-y-0'
          : 'opacity-0 scale-75 pointer-events-none translate-y-3'
      }`}
    >
      <button
        type="button"
        onClick={scrollToTop}
        aria-label={`Back to top (scrolled ${Math.round(scrollProgress)}%)`}
        title={`Back to Top (${Math.round(scrollProgress)}%)`}
        className="group relative flex items-center justify-center w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-[#FAF8F5]/90 dark:bg-[#161122]/90 border border-[#E7E2D8] dark:border-[#2D2340] backdrop-blur-md text-[#18181B] dark:text-[#F5F2F8] shadow-lg shadow-black/10 dark:shadow-purple-950/30 hover:border-[#FF4D6D]/60 hover:shadow-xl hover:shadow-[#FF4D6D]/20 hover:scale-105 active:scale-90 transition-all duration-200 cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#FF4D6D]"
      >
        {/* SVG Circular Scroll Progress Ring */}
        <svg
          className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none"
          viewBox="0 0 52 52"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="backToTopGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF4D6D" />
              <stop offset="100%" stopColor="#FFAA00" />
            </linearGradient>
          </defs>
          {/* Track Circle */}
          <circle
            cx="26"
            cy="26"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            className="text-stone-300/40 dark:text-stone-700/40"
          />
          {/* Progress Indicator Circle */}
          <circle
            cx="26"
            cy="26"
            r={radius}
            fill="none"
            stroke="url(#backToTopGradient)"
            strokeWidth="2.5"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-[stroke-dashoffset] duration-150 ease-out"
          />
        </svg>

        {/* Center Icon with Hover Bounce & Electric Rose Glow */}
        <ArrowUp className="w-5 h-5 text-stone-700 dark:text-stone-200 group-hover:text-[#FF4D6D] group-hover:-translate-y-0.5 transition-all duration-200" />

        {/* Accessible Tooltip */}
        <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-xl bg-stone-900/95 px-2.5 py-1 text-xs font-medium text-white opacity-0 shadow-lg backdrop-blur-md transition-opacity duration-200 group-hover:opacity-100 hidden sm:block border border-stone-700/60">
          Back to Top ({Math.round(scrollProgress)}%)
        </span>
      </button>
    </div>
  );
}
