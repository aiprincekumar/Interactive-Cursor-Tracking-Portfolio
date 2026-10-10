import React, { useState } from 'react';
import { Camera, Download, Heart, ZoomIn, X, Share2 } from 'lucide-react';
import { soundFX } from '../utils/audio';

const BASE_URL = import.meta.env.BASE_URL || './';

const INITIAL_PHOTOS = [
  {
    id: 1,
    imageSrc: `${BASE_URL}assets/character-center.jpg`,
    state: 'center',
    title: 'First Shutter • Tokyo Studio',
    timestamp: '10:42 AM',
    note: 'The butterfly paused right before the lens. Captured with 35mm f/1.8.',
    likes: 142
  },
  {
    id: 2,
    imageSrc: `${BASE_URL}assets/character-left.jpg`,
    state: 'left',
    title: 'Drift to the West Horizon',
    timestamp: '11:15 AM',
    note: 'Quick flick of the wrist, framed the butterfly against the pastel light.',
    likes: 98
  },
  {
    id: 3,
    imageSrc: `${BASE_URL}assets/character-right.jpg`,
    state: 'right',
    title: 'Right-Side Shutter Snap',
    timestamp: '01:30 PM',
    note: 'A soft smile as the stardust trail settled across the creative workspace.',
    likes: 187
  }
];

export default function CameraRollGallery({ capturedPhotos }) {
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [likes, setLikes] = useState({});
  const [poppingId, setPoppingId] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);

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

  return (
    <section id="gallery" className="py-20 px-4 md:px-8 max-w-6xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E7E2D8] text-[#18181B] text-xs font-bold uppercase tracking-wider mb-3 shadow-xs">
          <Camera className="w-3.5 h-3.5 text-[#FF4D6D]" />
          Camera Roll & Moments
        </div>
        <h2 className="text-3xl md:text-4xl font-extrabold text-[#18181B] tracking-tight font-['Outfit',sans-serif]">
          Captured Polaroid Studio
        </h2>
        <p className="mt-3 text-stone-600 text-sm md:text-base font-normal leading-relaxed">
          Every shutter click in the interactive hero records a frame directly to this physical reel. Tap any photo to inspect details.
        </p>
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
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-[#FAF8F5] border border-[#ECE7DE]">
                <img
                  src={photo.imageSrc}
                  alt={photo.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-xs text-[10px] font-mono text-stone-700 font-semibold border border-stone-200">
                  {photo.timestamp}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-3">
                  <span className="text-xs font-bold text-white bg-black/60 backdrop-blur-xs px-3 py-1 rounded-full flex items-center gap-1.5">
                    <ZoomIn className="w-3.5 h-3.5" /> Inspect Polaroid
                  </span>
                </div>
              </div>

              {/* Handwritten Note / Caption */}
              <div className="mt-4 px-1 flex items-start justify-between">
                <div className="min-w-0 pr-2">
                  <h3 className="font-['Caveat',cursive] text-2xl font-bold text-[#18181B] leading-none truncate">
                    {photo.title}
                  </h3>
                  <p className="text-xs text-stone-500 mt-1 line-clamp-1">
                    {photo.note || 'Snapshot captured with custom interactive cursor.'}
                  </p>
                </div>

                {/* Like Button with Spring Bounce Micro-Interaction */}
                <button
                  type="button"
                  onClick={(e) => handleLike(photo.id, e)}
                  aria-label={`Like ${photo.title}, ${currentLikes} likes`}
                  className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[#FF4D6D] focus-visible:outline-hidden shrink-0 ${
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
            className="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl border border-[#E7E2D8] relative animate-in zoom-in-95 duration-200"
          >
            <button
              type="button"
              onClick={() => setSelectedPhoto(null)}
              aria-label="Close enlarged polaroid view"
              className="absolute top-4 right-4 p-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors focus-visible:ring-2 focus-visible:ring-[#FF4D6D] focus-visible:outline-hidden"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="aspect-[16/9] rounded-2xl overflow-hidden mb-4 border border-stone-200 shadow-inner">
              <img
                src={selectedPhoto.imageSrc}
                alt={selectedPhoto.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono text-[#FF4D6D] font-bold bg-[#FAF8F5] border border-[#E7E2D8] px-2.5 py-1 rounded-full">
                SHUTTER LOG • {selectedPhoto.timestamp}
              </span>
              <span className="text-xs text-stone-600 font-mono font-medium capitalize">
                {selectedPhoto.state || 'Camera Capture'} • 35mm f/1.8
              </span>
            </div>

            <h3 className="font-['Outfit',sans-serif] text-2xl font-bold text-[#18181B]">
              {selectedPhoto.title}
            </h3>

            <p className="text-sm text-stone-600 mt-2 font-normal leading-relaxed">
              {selectedPhoto.note || 'Recorded in high-fidelity from the interactive character viewpoint tracking the butterfly cursor.'}
            </p>

            <div className="mt-6 flex items-center gap-3">
              <a
                href={selectedPhoto.imageSrc}
                download={`polaroid-${selectedPhoto.id}.jpg`}
                className="flex-1 py-2.5 px-4 bg-[#18181B] hover:bg-[#FF4D6D] text-white font-bold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <Download className="w-4 h-4" /> Download Frame
              </a>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  setCopiedLink(true);
                  soundFX.playSparkle();
                  setTimeout(() => setCopiedLink(false), 2000);
                }}
                className="py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                <Share2 className="w-4 h-4" />
                {copiedLink ? 'Link Copied!' : 'Share'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
