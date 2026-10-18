import React, { useState, useEffect, useRef } from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Compass, 
  MapPin, 
  Navigation, 
  Layers, 
  Copy, 
  Check, 
  Sparkles, 
  Train, 
  Building2 
} from 'lucide-react';

const LANDMARKS = [
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
  showLandmarks = true,
  showHeader = true,
  showFooter = true,
  interactive = true,
  onLandmarkSelect
}) {
  const [internalZoom, setInternalZoom] = useState(1);
  const [activeLandmark, setActiveLandmark] = useState(null);
  const [copied, setCopied] = useState(false);
  const [showTags, setShowTags] = useState(showLandmarks);
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
    setActiveLandmark(null);
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
            <MapPin className="w-4 h-4 animate-pulse" />
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
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                Offline Vector
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] font-mono text-stone-500 dark:text-stone-400 truncate">
              PIN: 822101 &bull; Palamu District, Jharkhand
            </p>
          </div>
        </div>

        {/* Top-Right Quick Controls: Copy Coords & Landmark Filter */}
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

          {/* Toggle Landmark Badges */}
          <button
            type="button"
            onClick={() => setShowTags((prev) => !prev)}
            aria-label={showTags ? 'Hide Landmark Tags' : 'Show Landmark Tags'}
            title={showTags ? 'Hide Landmark Tags' : 'Show Landmark Tags'}
            className={`p-1.5 rounded-lg border text-xs transition-colors cursor-pointer ${
              showTags
                ? 'bg-[#FF4D6D]/15 text-[#FF4D6D] border-[#FF4D6D]/40'
                : resolvedTheme === 'light'
                  ? 'bg-white border-stone-200 text-stone-600 hover:text-stone-900'
                  : 'bg-[#181226] border-[#2D2340] text-stone-400 hover:text-stone-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
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

          {/* Dynamic Interactive Landmark Overlays */}
          {showTags && LANDMARKS.map((landmark) => {
            const isSelected = activeLandmark?.id === landmark.id;
            const Icon = landmark.icon;

            return (
              <div
                key={landmark.id}
                style={{
                  left: `${landmark.x}%`,
                  top: `${landmark.y}%`
                }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-10 group"
              >
                <button
                  type="button"
                  onClick={() => {
                    setActiveLandmark(isSelected ? null : landmark);
                    if (onLandmarkSelect) onLandmarkSelect(landmark);
                  }}
                  aria-label={`Inspect landmark: ${landmark.name}`}
                  className={`relative flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-semibold border transition-all cursor-pointer backdrop-blur-md shadow-md ${
                    landmark.highlight
                      ? 'bg-[#FF4D6D] text-white border-white/40 ring-2 ring-[#FF4D6D]/40 scale-105'
                      : isSelected
                        ? 'bg-stone-900 text-white border-stone-700 dark:bg-white dark:text-stone-900 scale-110'
                        : resolvedTheme === 'light'
                          ? 'bg-white/95 text-stone-800 border-stone-200/90 hover:scale-105 hover:border-stone-400'
                          : 'bg-[#181226]/90 text-stone-200 border-[#2D2340] hover:scale-105 hover:border-[#FF4D6D]/50'
                  }`}
                >
                  <Icon 
                    className="w-3 h-3 shrink-0" 
                    style={{ color: landmark.highlight ? '#FFFFFF' : landmark.color }} 
                  />
                  <span className="hidden sm:inline-block font-sans whitespace-nowrap">
                    {landmark.name}
                  </span>
                </button>

                {/* Popover Card for Selected Landmark */}
                {isSelected && (
                  <div className={`absolute top-full left-1/2 -translate-x-1/2 mt-2 w-52 sm:w-60 p-3 rounded-xl border z-30 shadow-2xl backdrop-blur-lg animate-in fade-in zoom-in-95 duration-200 ${
                    resolvedTheme === 'light'
                      ? 'bg-white/95 border-stone-200 text-stone-800'
                      : 'bg-[#181226]/95 border-[#2D2340] text-stone-100'
                  }`}>
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#FF4D6D] font-bold">
                        {landmark.category}
                      </span>
                      <span className="text-[10px] font-mono text-stone-500 dark:text-stone-400">
                        {landmark.tag}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold leading-snug">{landmark.name}</h4>
                    <p className="text-[11px] text-stone-600 dark:text-stone-400 mt-1 leading-relaxed">
                      {landmark.desc}
                    </p>
                    <div className="mt-2 pt-2 border-t border-stone-200/60 dark:border-stone-700/60 flex items-center justify-between text-[9.5px] font-mono text-stone-500">
                      <span>{landmark.coords}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
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
