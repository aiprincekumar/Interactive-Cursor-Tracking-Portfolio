import React, { useState, useEffect, useRef } from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Compass, 
  MapPin, 
  Navigation, 
  Copy, 
  Check, 
  Sparkles, 
  Train, 
  Building2 
} from 'lucide-react';

export const LANDMARKS = [
  {
    id: 'center',
    name: 'Medininagar Center',
    category: 'City Center',
    tag: 'PIN: 822101',
    coords: '24.0416° N, 84.0700° E',
    desc: 'Central commercial and municipal hub of Medininagar (Daltonganj).',
    x: 52.0, // % from left (viewBox 1000)
    y: 49.2, // % from top (viewBox 650)
    icon: MapPin,
    color: '#FF4D6D',
    highlight: true
  },
  {
    id: 'dto',
    name: 'DTO Railway Station',
    category: 'Transit',
    tag: 'ECR Junction',
    coords: '24.0472° N, 84.0785° E',
    desc: 'Medininagar / Daltonganj Railway Station (DTO) on Barkakana–Garhwa line.',
    x: 74.0,
    y: 54.6,
    icon: Train,
    color: '#3B82F6'
  },
  {
    id: 'admin',
    name: 'Palamu Admin Hub',
    category: 'Government',
    tag: 'Collectorate',
    coords: '24.0531° N, 84.0652° E',
    desc: 'District Collectorate, Commissioner Office & Judicial Hub.',
    x: 50.5,
    y: 20.8,
    icon: Building2,
    color: '#F59E0B'
  },
  {
    id: 'river',
    name: 'North Koel River',
    category: 'Geography',
    tag: 'Lifeline River',
    coords: '24.0390° N, 84.0510° E',
    desc: 'Winding perennial river flowing south-to-north past the city center.',
    x: 18.5,
    y: 64.0,
    icon: Navigation,
    color: '#06B6D4'
  },
  {
    id: 'nh39',
    name: 'NH-39 Highway Corridor',
    category: 'Artery',
    tag: 'National Highway',
    coords: '24.0350° N, 84.0850° E',
    desc: 'Major route connecting Ranchi, Latehar, Daltonganj and Garhwa.',
    x: 79.8,
    y: 67.0,
    icon: Navigation,
    color: '#F97316'
  }
];

export default function OfflineMapSnapshot({
  theme = 'auto',
  zoom: externalZoom,
  className = '',
  showControls = true,
  showHeader = true,
  showFooter = true,
  interactive = true
}) {
  const [internalZoom, setInternalZoom] = useState(1);
  const [copied, setCopied] = useState(false);
  const [headingDegrees, setHeadingDegrees] = useState(0);
  const containerRef = useRef(null);

  const [systemIsDark, setSystemIsDark] = useState(() => {
    if (typeof document !== 'undefined') {
      return document.documentElement.classList.contains('dark') ||
             window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return true;
  });

  // Track system or document dark mode mutations for 'auto' theme
  useEffect(() => {
    if (theme !== 'auto') return;
    const checkDarkMode = () => {
      const isDark = document.documentElement.classList.contains('dark') ||
                     window.matchMedia('(prefers-color-scheme: dark)').matches;
      setSystemIsDark(isDark);
    };

    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, [theme]);

  const resolvedTheme = (theme === 'light' || theme === 'dark')
    ? theme
    : (systemIsDark ? 'dark' : 'light');

  const currentZoom = typeof externalZoom === 'number' && !Number.isNaN(externalZoom)
    ? Math.min(2.5, Math.max(1, externalZoom))
    : internalZoom;

  const handleZoomIn = () => {
    setInternalZoom((prev) => Math.min(2.2, +(prev + 0.25).toFixed(2)));
  };

  const handleZoomOut = () => {
    setInternalZoom((prev) => Math.max(1, +(prev - 0.25).toFixed(2)));
  };

  const handleReset = () => {
    setInternalZoom(1);
    setHeadingDegrees(0);
  };

  const handleRotateCompass = () => {
    setHeadingDegrees((prev) => (prev + 90) % 360);
  };

  const handleCopyCoords = async () => {
    const coords = '24.0416° N, 84.0700° E';
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(coords);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = coords;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // Graceful fallback
    }
  };

  const mapRealSrc = resolvedTheme === 'light'
    ? '/assets/maps/medininagar-real-light.png'
    : '/assets/maps/medininagar-real-dark.png';

  const mapSvgSrc = resolvedTheme === 'light' 
    ? '/assets/maps/medininagar-light.svg' 
    : '/assets/maps/medininagar-dark.svg';

  return (
    <div
      ref={containerRef}
      role="region"
      aria-label="Offline Cartographic Map of Medininagar (Daltonganj)"
      className={`relative w-full rounded-2xl overflow-hidden select-none border transition-colors duration-300 ${
        resolvedTheme === 'light'
          ? 'bg-[#FAF8F5] border-[#ECE7DF] shadow-md text-stone-800'
          : 'bg-[#100C1A] border-[#2D2340] shadow-xl text-stone-100'
      } ${className}`}
    >
      {/* Top HUD Header Bar */}
      {showHeader && (
        <div className={`absolute top-0 inset-x-0 z-20 px-3 sm:px-4 py-2.5 flex items-center justify-between backdrop-blur-md border-b transition-colors ${
        resolvedTheme === 'light'
          ? 'bg-[#FAF8F5]/85 border-[#ECE7DF]'
          : 'bg-[#100C1A]/85 border-[#2D2340]'
      }`}>
        {/* Geographic Title & Offline Indicator */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#FF4D6D]/15 text-[#FF4D6D] shrink-0 border border-[#FF4D6D]/30">
            <MapPin className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs sm:text-sm tracking-tight truncate">
                Medininagar &bull; Daltonganj
              </span>
              <span className={`hidden sm:inline-flex items-center gap-1 text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full border ${
                resolvedTheme === 'light'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-emerald-950/60 text-emerald-400 border-emerald-800/60'
              }`}>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Offline Vector
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] font-mono text-stone-500 dark:text-stone-400 truncate">
              PIN: 822101 &bull; Palamu District, Jharkhand
            </p>
          </div>
        </div>

        {/* Top-Right Quick Controls: Copy Coords */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Copy Coordinates Button */}
          <button
            type="button"
            onClick={handleCopyCoords}
            aria-label="Copy latitude and longitude coordinates"
            title="Copy 24.0416° N, 84.0700° E"
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-medium border transition-all cursor-pointer ${
              copied
                ? 'bg-emerald-500 text-white border-emerald-600 scale-95'
                : resolvedTheme === 'light'
                  ? 'bg-white hover:bg-stone-50 border-stone-200 text-stone-700 shadow-2xs'
                  : 'bg-[#181226] hover:bg-[#201833] border-[#2D2340] text-stone-300'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3 text-[#FF4D6D]" />
                <span className="hidden md:inline">24.0416° N, 84.0700° E</span>
                <span className="md:hidden">Coords</span>
              </>
            )}
          </button>
        </div>
      </div>
      )}

      {/* Main Map Canvas Area with Zoom Container */}
      <div 
        className="relative w-full aspect-16/10 sm:aspect-16/9 overflow-hidden flex items-center justify-center cursor-grab active:cursor-grabbing"
      >
        <div
          className="relative w-full h-full transition-transform duration-300 ease-out origin-[52%_49%]"
          style={{
            transform: `scale(${currentZoom}) rotate(${headingDegrees}deg)`
          }}
        >
          {/* Real Cartographic Map Image Asset with Seamless SVG Fallback */}
          <img
            src={mapRealSrc}
            onError={(e) => {
              if (e.currentTarget.src !== mapSvgSrc) {
                e.currentTarget.src = mapSvgSrc;
              }
            }}
            alt="Cartographic map showing Medininagar town center, North Koel river, and NH-39"
            className="w-full h-full object-cover block pointer-events-none select-none"
            loading="eager"
            decoding="async"
          />
        </div>
      </div>

      {/* Floating Interactive Controls (Zoom & Compass) */}
      {showControls && interactive && (
        <div className={`absolute right-3 bottom-14 sm:bottom-4 z-20 flex flex-col items-center gap-1.5 p-1 rounded-xl backdrop-blur-md border shadow-lg transition-colors ${
          resolvedTheme === 'light'
            ? 'bg-white/90 border-stone-200'
            : 'bg-[#181226]/90 border-[#2D2340]'
        }`}>
          {/* Compass Orientation Button */}
          <button
            type="button"
            onClick={handleRotateCompass}
            aria-label="Rotate map compass orientation"
            title={`Compass Heading: ${headingDegrees}° (Click to rotate)`}
            className="p-1.5 rounded-lg text-stone-700 dark:text-stone-300 hover:text-[#FF4D6D] dark:hover:text-[#FF4D6D] hover:bg-stone-100 dark:hover:bg-stone-800 transition-all cursor-pointer"
          >
            <Compass 
              className="w-4 h-4 transition-transform duration-300" 
              style={{ transform: `rotate(${-headingDegrees}deg)` }}
            />
          </button>

          <div className="w-4 h-px bg-stone-200 dark:bg-stone-700 my-0.5" />

          {/* Zoom In */}
          <button
            type="button"
            onClick={handleZoomIn}
            disabled={currentZoom >= 2.2}
            aria-label="Zoom in on Medininagar map"
            title="Zoom In"
            className="p-1.5 rounded-lg text-stone-700 dark:text-stone-300 hover:text-[#FF4D6D] dark:hover:text-[#FF4D6D] hover:bg-stone-100 dark:hover:bg-stone-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          {/* Current Zoom Level Indicator */}
          <div className="px-1 text-[10px] font-mono font-bold text-stone-500 dark:text-stone-400">
            {currentZoom.toFixed(1)}x
          </div>

          {/* Zoom Out */}
          <button
            type="button"
            onClick={handleZoomOut}
            disabled={currentZoom <= 1}
            aria-label="Zoom out of Medininagar map"
            title="Zoom Out"
            className="p-1.5 rounded-lg text-stone-700 dark:text-stone-300 hover:text-[#FF4D6D] dark:hover:text-[#FF4D6D] hover:bg-stone-100 dark:hover:bg-stone-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          <div className="w-4 h-px bg-stone-200 dark:bg-stone-700 my-0.5" />

          {/* Reset View */}
          <button
            type="button"
            onClick={handleReset}
            aria-label="Reset map view to default"
            title="Reset Map View"
            className="p-1.5 rounded-lg text-stone-700 dark:text-stone-300 hover:text-[#FF4D6D] dark:hover:text-[#FF4D6D] hover:bg-stone-100 dark:hover:bg-stone-800 transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Bottom Bar: Key Travel & Navigation Specs */}
      {showFooter && (
        <div className={`px-3 sm:px-4 py-2 border-t flex flex-wrap items-center justify-between gap-2 text-[11px] backdrop-blur-sm transition-colors ${
          resolvedTheme === 'light'
            ? 'bg-[#FAF8F5]/90 border-[#ECE7DF] text-stone-600'
            : 'bg-[#100C1A]/90 border-[#2D2340] text-stone-400'
        }`}>
          <div className="flex items-center gap-2">
            <Navigation className="w-3.5 h-3.5 text-[#FF4D6D] shrink-0" />
            <span className="font-medium truncate">
              North Koel Riverfront &bull; 5 mins from DTO Junction &bull; NH-39 Hub
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 font-mono text-[10px] text-stone-500">
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>Vector Graphics Rendered Locally</span>
          </div>
        </div>
      )}
    </div>
  );
}
