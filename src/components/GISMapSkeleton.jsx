import React from 'react';
import { Navigation, Compass } from 'lucide-react';

/**
 * GISMapSkeleton
 * High-fidelity Cyber/HUD GIS Map Loading Skeleton.
 * Displayed while Leaflet GIS modules and local OSM tile layers are lazily loaded.
 */
export default function GISMapSkeleton({ className = '' }) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading Interactive GIS Map for Medininagar HQ"
      className={`w-full h-full min-h-[300px] flex flex-col items-center justify-center bg-[#FAF8F5]/50 dark:bg-[#161122]/50 animate-pulse rounded-2xl relative overflow-hidden border border-slate-200/50 dark:border-white/10 ${className}`}
    >
      {/* Subtle Coordinate Grid Pattern Background (Cartographic Reticle) */}
      <svg
        className="absolute inset-0 w-full h-full opacity-40 dark:opacity-25 pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <pattern id="gis-grid-pattern" width="48" height="48" patternUnits="userSpaceOnUse">
            <path
              d="M 48 0 L 0 0 0 48"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.75"
              className="text-slate-300 dark:text-purple-400/40"
              strokeDasharray="2,2"
            />
            <circle
              cx="24"
              cy="24"
              r="1"
              fill="currentColor"
              className="text-slate-400 dark:text-purple-300/40"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#gis-grid-pattern)" />
      </svg>

      {/* Radar Scanline Animation Bar */}
      <div
        className="absolute inset-x-0 h-24 pointer-events-none bg-gradient-to-b from-transparent via-[#FF4D6D]/10 dark:via-purple-500/15 to-transparent animate-[scan_3s_ease-in-out_infinite]"
        aria-hidden="true"
      />

      {/* HUD-Style Corner Coordinate Badges */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/80 dark:bg-black/60 backdrop-blur-md border border-slate-200 dark:border-white/10 text-[10px] font-mono text-slate-600 dark:text-slate-300 select-none shadow-xs">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
        <span className="font-bold text-[#FF4D6D]">LAT:</span>
        <span>24.0416° N</span>
      </div>

      <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/80 dark:bg-black/60 backdrop-blur-md border border-slate-200 dark:border-white/10 text-[10px] font-mono text-slate-600 dark:text-slate-300 select-none shadow-xs">
        <span className="font-bold text-sky-500">LON:</span>
        <span>84.0700° E</span>
      </div>

      <div className="absolute bottom-4 left-4 z-10 hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/80 dark:bg-black/60 backdrop-blur-md border border-slate-200 dark:border-white/10 text-[10px] font-mono text-slate-500 dark:text-slate-400 select-none shadow-xs">
        <Compass className="w-3 h-3 text-[#FF4D6D]" />
        <span>DATUM: WGS-84 • DTO HUB</span>
      </div>

      <div className="absolute bottom-4 right-4 z-10 hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/80 dark:bg-black/60 backdrop-blur-md border border-slate-200 dark:border-white/10 text-[10px] font-mono text-slate-500 dark:text-slate-400 select-none shadow-xs">
        <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
        <span>GIS TILE SYNC</span>
      </div>

      {/* Central Radar Pulse & Navigation Reticle */}
      <div className="relative flex items-center justify-center mb-4 z-10">
        <span className="animate-ping absolute inline-flex h-24 w-24 rounded-full bg-[#FF4D6D]/15 dark:bg-[#FF4D6D]/25" />
        <span className="animate-ping absolute inline-flex h-36 w-36 rounded-full bg-sky-500/10 dark:bg-purple-500/20 [animation-delay:0.75s]" />

        <div className="w-16 h-16 rounded-2xl bg-white/90 dark:bg-stone-900/90 backdrop-blur-md border border-slate-200 dark:border-white/15 shadow-xl flex items-center justify-center text-[#FF4D6D] relative z-10">
          <Navigation className="w-7 h-7 text-[#FF4D6D] animate-bounce" />
        </div>
      </div>

      {/* Central HUD Information & Mono Loading Label */}
      <div className="z-10 flex flex-col items-center gap-2 text-center px-4">
        {/* Unified HUD Badge for Mobile / Viewport Center */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 dark:bg-stone-900/90 backdrop-blur-md border border-slate-200 dark:border-white/10 text-[11px] font-mono text-slate-700 dark:text-slate-300 font-semibold shadow-xs">
          <span className="text-[#FF4D6D]">LAT: 24.0416° N</span>
          <span className="text-slate-300 dark:text-slate-600">/</span>
          <span className="text-sky-500">LON: 84.0700° E</span>
        </div>

        {/* Clean Mono Text */}
        <p className="font-mono text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 tracking-wider">
          Loading Interactive GIS Map...
        </p>

        <p className="text-[10px] sm:text-[11px] font-mono text-slate-500 dark:text-slate-400">
          Initializing raster tiles & geographic viewport
        </p>
      </div>

      {/* Screen Reader Only Notification */}
      <span className="sr-only">Interactive Leaflet GIS Map is loading coordinates for Medininagar HQ.</span>
    </div>
  );
}
