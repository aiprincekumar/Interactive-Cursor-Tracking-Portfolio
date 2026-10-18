import React, { useState } from 'react';
import { Camera, Download, Heart, ZoomIn, X, Share2, Archive, Loader2 } from 'lucide-react';
import { soundFX } from '../utils/audio';
import { exportAllPolaroidsZip, downloadSinglePolaroid } from '../utils/polaroidExport';

const BASE_URL = import.meta.env.BASE_URL || './';

const INITIAL_PHOTOS = [
  {
    id: 1,
    imageSrc: `${BASE_URL}assets/hero_poses/05-center-front.png`,
    state: 'center',
    title: 'First Shutter • Tokyo Studio',
    timestamp: 'ATUL VERMA • 17 OCT 2026 10:42 AM',
    note: 'The butterfly paused right before the lens. Captured with 35mm f/1.8.',
    likes: 142
  },
  {
    id: 2,
    imageSrc: `${BASE_URL}assets/hero_poses/03-center-left.png`,
    state: 'left',
    title: 'Drift to the West Horizon',
    timestamp: 'ATUL VERMA • 17 OCT 2026 11:15 AM',
    note: 'Quick flick of the wrist, framed the butterfly against the pastel light.',
    likes: 98
  },
  {
    id: 3,
    imageSrc: `${BASE_URL}assets/hero_poses/04-center-right.png`,
    state: 'right',
    title: 'Right-Side Shutter Snap',
    timestamp: 'ATUL VERMA • 17 OCT 2026 01:30 PM',
    note: 'A soft smile as the stardust trail settled across the creative workspace.',
    likes: 187
  }
];

export default function CameraRollGallery({ capturedPhotos }) {
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [likes, setLikes] = useState({});
  const [poppingId, setPoppingId] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(null);
  const [isDownloadingSingle, setIsDownloadingSingle] = useState(false);

  const allPhotos = [...capturedPhotos, ...INITIAL_PHOTOS];

  // Close modal on Escape
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setSelectedPhoto(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleCardClick = (photo) => {
    soundFX.playFocusBeep();
    setSelectedPhoto(photo);
  };

  const handleLike = (id, e) => {
    e.stopPropagation();
    soundFX.playSparkle();
    setLikes(prev => ({
      ...prev,
      [id]: (prev[id] || 0) + 1
    }));
    setPoppingId(id);
    setTimeout(() => setPoppingId(null), 400);
  };

  const handleExportAll = async () => {
    if (isExporting || allPhotos.length === 0) return;
    soundFX.playShutter();
    setIsExporting(true);
    setExportProgress({ current: 0, total: allPhotos.length });
    try {
      await exportAllPolaroidsZip(allPhotos, (current, total) => {
        setExportProgress({ current, total });
      });
      soundFX.playSparkle();
    } catch (err) {
      console.error('Failed to export polaroid archive:', err);
    } finally {
      setIsExporting(false);
      setExportProgress(null);
    }
  };

  const handleDownloadSingle = async () => {
    if (!selectedPhoto || isDownloadingSingle) return;
    soundFX.playShutter();
    setIsDownloadingSingle(true);
    try {
      await downloadSinglePolaroid(selectedPhoto);
      soundFX.playSparkle();
    } catch (err) {
      console.error('Failed to download polaroid:', err);
    } finally {
      setIsDownloadingSingle(false);
    }
  };

  return (
    <section id="gallery" className="relative w-full py-20 px-4 sm:px-6 lg:px-8 scroll-mt-28">
      <div className="max-w-7xl mx-auto">
        {/* Section Header with Export All (ZIP) Action */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8">
        <div className="text-left max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-[#161122] border border-[#E7E2D8] dark:border-[#2D2340] text-[#18181B] dark:text-[#F5F2F8] text-xs font-bold uppercase tracking-wider mb-4 shadow-xs whitespace-nowrap max-w-full overflow-x-auto">
            <span className="w-2 h-2 rounded-full bg-[#FF4D6D] shrink-0" />
            <Camera className="w-3.5 h-3.5 text-[#FF4D6D] shrink-0" />
            <span className="truncate sm:overflow-visible">Camera Roll &amp; Moments</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-[#18181B] dark:text-white tracking-tight font-['Outfit',sans-serif] leading-[1.08] mb-3 whitespace-normal sm:whitespace-nowrap">
            Captured <span className="text-[#FF4D6D]">Polaroid Studio</span>.
          </h2>
          <div className="w-12 h-1 rounded-full bg-[#FF4D6D] mb-4" />
          <p className="text-stone-600 dark:text-stone-400 text-sm md:text-base font-normal leading-relaxed">
            Every shutter click in the interactive hero records a frame directly to this physical reel. Tap any photo to inspect details.
          </p>
        </div>

        {/* Export All (ZIP) Action Button */}
        <div className="flex items-center gap-3 shrink-0 self-start sm:self-end">
          <button
            type="button"
            onClick={handleExportAll}
            disabled={isExporting || allPhotos.length === 0}
            className={`inline-flex items-center gap-2.5 px-5 py-3 rounded-2xl font-bold text-xs uppercase tracking-wider shadow-md transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[#FF4D6D] focus-visible:outline-hidden ${
              isExporting
                ? 'bg-stone-200 dark:bg-stone-800 text-stone-500 cursor-wait'
                : allPhotos.length === 0
                ? 'bg-stone-100 dark:bg-stone-800/50 text-stone-400 cursor-not-allowed border border-stone-200 dark:border-stone-800'
                : 'bg-[#18181B] dark:bg-white text-white dark:text-[#18181B] hover:bg-[#FF4D6D] dark:hover:bg-[#FF4D6D] dark:hover:text-white hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 cursor-pointer'
            }`}
            aria-label="Export all polaroids as ZIP archive"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-[#FF4D6D]" />
                <span>
                  {exportProgress
                    ? `Exporting... (${exportProgress.current}/${exportProgress.total})`
                    : 'Exporting...'}
                </span>
              </>
            ) : (
              <>
                <Archive className="w-4 h-4 text-[#FF4D6D]" />
                <span>Export All (ZIP)</span>
                <span className="ml-0.5 px-2 py-0.5 rounded-full text-[10px] font-mono bg-white/20 dark:bg-black/10 text-current font-extrabold">
                  {allPhotos.length}
                </span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Grid of Polaroid Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {allPhotos.map((photo, index) => {
          const rotationClass = index % 3 === 0 ? '-rotate-1 hover:rotate-0' : index % 3 === 1 ? 'rotate-2 hover:rotate-0' : '-rotate-2 hover:rotate-0';
          const currentLikes = (photo.likes || 0) + (likes[photo.id] || 0);
          const isPopping = poppingId === photo.id;

          return (
            <div
              key={photo.id}
              role="button"
              tabIndex={0}
              onClick={() => handleCardClick(photo)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleCardClick(photo);
                }
              }}
              aria-label={`Inspect polaroid: ${photo.title}`}
              className={`bg-white p-4 pb-6 rounded-2xl shadow-md shadow-stone-900/5 border border-[#E7E2D8] cursor-pointer transition-all duration-300 hover:shadow-xl hover:border-[#18181B]/25 hover:-translate-y-2 group focus-visible:ring-2 focus-visible:ring-[#FF4D6D] focus-visible:outline-hidden ${rotationClass}`}
            >
              {/* Alternating Pin & Washi Tape Styling */}
              {index % 2 === 0 ? (
                <div className="relative -mt-6 mb-3 mx-auto w-6 h-6 flex items-center justify-center pointer-events-none">
                  {/* 3D Push-Pin with Coral Gloss & Metallic Highlight */}
                  <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-[#FF4D6D] via-[#FF6B8B] to-[#FFE4E8] shadow-md border border-white/90 relative z-10 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-white/90" />
                  </div>
                  <div className="absolute w-3 h-1 bg-stone-900/25 rounded-full blur-[1px] bottom-0" />
                </div>
              ) : (
                /* Textured Parchment Washi Tape */
                <div className="w-20 h-5 bg-[#F2ECE4]/95 border border-[#E4DFD5] mx-auto -mt-6 mb-3 rounded-xs rotate-1 backdrop-blur-xs opacity-90 shadow-xs flex items-center justify-center">
                  <div className="w-14 h-[1px] bg-white/50" />
                </div>
              )}

              {/* Polaroid Image Frame */}
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-gradient-to-b from-[#8C9EB2] via-[#B8C8D8] to-[#DCE4ED] border border-[#ECE7DE]">
                <div className="w-full h-full transition-transform duration-500 group-hover:scale-105">
                  <img
                    src={photo.imageSrc}
                    alt={photo.title}
                    className="w-full h-full object-cover object-[center_32%] origin-center"
                    style={{ transform: `scale(${photo.scale || 1.0})` }}
                    loading="lazy"
                  />
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                  <span className="text-xs font-bold text-white bg-black/65 backdrop-blur-xs px-3 py-1 rounded-full flex items-center gap-1.5 shadow-md">
                    <ZoomIn className="w-3.5 h-3.5" /> Inspect Polaroid
                  </span>
                </div>
              </div>

              {/* Bottom White Chin - Stacked Left-Aligned Layout */}
              <div className="mt-4 px-1 flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1 flex flex-col items-start text-left">
                  {/* Line 1: Polaroid Handwritten Title */}
                  <h3 className="font-['Caveat',cursive] text-2xl font-bold text-[#18181B] leading-tight truncate w-full text-left">
                    {photo.title}
                  </h3>

                  {/* Line 2: Vintage Amber LED Digital Timestamp Badge */}
                  <div className="mt-1 self-start inline-flex items-center px-2 py-0.5 rounded-md bg-[#1c1917] border border-[#292524] text-[#FF7700] font-mono text-[10px] font-bold tracking-wider select-none shadow-xs"
                    style={{
                      textShadow: '0 0 6px rgba(255, 119, 0, 0.65)',
                      fontFamily: '"Courier New", Courier, monospace, monospace'
                    }}
                    title={photo.timestamp}
                  >
                    {photo.timestamp}
                  </div>

                  {/* Line 3: Caption / Note */}
                  <p className="text-xs text-stone-500 mt-1 line-clamp-1 w-full text-left">
                    {photo.note || 'Snapshot captured with custom interactive cursor.'}
                  </p>
                </div>

                {/* Like Button with Spring Bounce Micro-Interaction */}
                <button
                  type="button"
                  onClick={(e) => handleLike(photo.id, e)}
                  aria-label={`Like ${photo.title}, ${currentLikes} likes`}
                  className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[#FF4D6D] focus-visible:outline-hidden shrink-0 mt-0.5 ${
                    likes[photo.id]
                      ? 'bg-rose-50 text-[#FF4D6D] border-rose-200 shadow-xs'
                      : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  <Heart
                    className={`w-3.5 h-3.5 transition-transform duration-300 ${
                      isPopping ? 'scale-140 rotate-[-12deg]' : 'scale-100'
                    } ${likes[photo.id] ? 'fill-[#FF4D6D] text-[#FF4D6D]' : 'text-[#FF4D6D]'}`}
                  />
                  <span className="font-mono text-xs">{currentLikes}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Dialog for Enlarged Photo */}
      {selectedPhoto && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Enlarged view: ${selectedPhoto.title}`}
          onClick={() => setSelectedPhoto(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-sm animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-[#161122] rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl border border-[#E7E2D8] dark:border-[#2D2340] relative animate-in zoom-in-95 duration-200 text-left"
          >
            <button
              type="button"
              onClick={() => setSelectedPhoto(null)}
              aria-label="Close enlarged polaroid view"
              className="absolute top-4 right-4 p-2 rounded-full bg-stone-100 dark:bg-[#201830] hover:bg-stone-200 dark:hover:bg-[#2D2340] text-stone-700 dark:text-stone-300 transition-colors focus-visible:ring-2 focus-visible:ring-[#FF4D6D] focus-visible:outline-hidden"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="aspect-[16/9] rounded-2xl overflow-hidden mb-4 border border-stone-200 dark:border-[#2D2340] shadow-inner bg-gradient-to-b from-[#8C9EB2] via-[#B8C8D8] to-[#DCE4ED] relative">
              <img
                src={selectedPhoto.imageSrc}
                alt={selectedPhoto.title}
                className="w-full h-full object-cover object-[center_32%] origin-center"
                style={{ transform: `scale(${selectedPhoto.scale || 1.0})` }}
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 mb-2 text-left">
              <span className="text-xs font-mono text-[#FF4D6D] font-bold bg-[#FAF8F5] dark:bg-[#100C1A] border border-[#E7E2D8] dark:border-[#2D2340] px-2.5 py-1 rounded-full">
                SHUTTER LOG • {selectedPhoto.timestamp}
              </span>
              <span className="text-xs text-stone-600 dark:text-stone-400 font-mono font-medium capitalize">
                {selectedPhoto.state || 'Camera Capture'} • {selectedPhoto.scale ? `${Math.round(selectedPhoto.scale * 100)}% scale` : '35mm f/1.8'}
              </span>
            </div>

            <h3 className="font-['Outfit',sans-serif] text-2xl font-bold text-[#18181B] dark:text-white text-left">
              {selectedPhoto.title}
            </h3>

            <p className="text-sm text-stone-600 dark:text-stone-300 mt-2 font-normal leading-relaxed text-left">
              {selectedPhoto.note || 'Recorded in high-fidelity from the interactive character viewpoint tracking the butterfly cursor.'}
            </p>

            <div className="mt-6 flex items-center gap-3">
              <button
                type="button"
                onClick={handleDownloadSingle}
                disabled={isDownloadingSingle}
                className="flex-1 py-2.5 px-4 bg-[#18181B] dark:bg-stone-100 hover:bg-[#FF4D6D] dark:hover:bg-[#FF4D6D] text-white dark:text-stone-900 dark:hover:text-white font-bold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-60 cursor-pointer disabled:cursor-wait"
              >
                {isDownloadingSingle ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#FF4D6D]" /> Downloading...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" /> Download Frame
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  setCopiedLink(true);
                  soundFX.playSparkle();
                  setTimeout(() => setCopiedLink(false), 2000);
                }}
                className="py-2.5 px-4 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 font-bold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                {copiedLink ? 'Link Copied!' : 'Share'}
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </section>
  );
}
