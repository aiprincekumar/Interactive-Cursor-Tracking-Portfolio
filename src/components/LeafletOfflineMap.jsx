import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const MEDININAGAR_COORDS = [24.0416, 84.0700];

export default function LeafletOfflineMap({
  zoom = 13,
  onZoomChange,
  className = ''
}) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const isInternalZoomUpdate = useRef(false);
  const onZoomChangeRef = useRef(onZoomChange);
  const initialZoomRef = useRef(typeof zoom === 'number' && zoom >= 12 && zoom <= 15 ? zoom : 13);

  useEffect(() => {
    onZoomChangeRef.current = onZoomChange;
  }, [onZoomChange]);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clean up any existing map instance on re-initialization
    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }

    // Initialize Leaflet map instance
    const map = L.map(containerRef.current, {
      center: MEDININAGAR_COORDS,
      zoom: initialZoomRef.current,
      minZoom: 12,
      maxZoom: 15,
      zoomControl: false,
      attributionControl: true
    });
    mapRef.current = map;

    // Tile layer using local pre-downloaded tiles
    const tileUrl = `${import.meta.env.BASE_URL}assets/tiles/{z}/{x}/{y}.png`;
    const tileLayer = L.tileLayer(tileUrl, {
      minZoom: 12,
      maxZoom: 15,
      maxNativeZoom: 15,
      attribution: '&copy; OpenStreetMap contributors'
    });
    tileLayer.addTo(map);

    // Custom pulsing marker pin HTML icon
    const pulsingIcon = L.divIcon({
      className: 'leaflet-pulsing-marker-wrapper',
      html: `
        <div class="relative flex items-center justify-center w-8 h-8 -translate-x-1/2 -translate-y-1/2 cursor-pointer">
          <span class="absolute inline-flex h-8 w-8 rounded-full bg-[#FF4D6D] opacity-40 animate-ping"></span>
          <span class="relative inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#FF4D6D] text-white shadow-lg border-2 border-white dark:border-stone-900">
            <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
          </span>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      popupAnchor: [0, -18]
    });

    // Create marker with popup
    const marker = L.marker(MEDININAGAR_COORDS, {
      icon: pulsingIcon,
      title: 'Medininagar (Daltonganj), Jharkhand'
    }).addTo(map);

    marker.bindPopup(
      `<div class="font-sans text-xs">
        <strong class="font-bold text-stone-900 dark:text-white">Medininagar (Daltonganj)</strong>
        <span class="text-stone-400 dark:text-stone-500 mx-1">•</span>
        <span class="text-stone-600 dark:text-stone-300">Jharkhand</span>
      </div>`,
      {
        closeButton: false,
        className: 'custom-leaflet-popup',
        offset: [0, -12]
      }
    ).openPopup();

    // Listen to user-initiated zoom changes
    const handleZoomEnd = () => {
      if (isInternalZoomUpdate.current) return;
      const currentZoom = map.getZoom();
      if (onZoomChangeRef.current) {
        onZoomChangeRef.current(currentZoom);
      }
    };
    map.on('zoomend', handleZoomEnd);

    // Invalidate size once DOM is laid out
    const resizeTimer = setTimeout(() => {
      map.invalidateSize();
    }, 150);

    return () => {
      clearTimeout(resizeTimer);
      map.off('zoomend', handleZoomEnd);
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Sync external zoom prop changes with Leaflet map
  useEffect(() => {
    if (mapRef.current) {
      const currentZoom = mapRef.current.getZoom();
      if (currentZoom !== zoom && zoom >= 12 && zoom <= 15) {
        isInternalZoomUpdate.current = true;
        mapRef.current.setZoom(zoom, { animate: false });
        isInternalZoomUpdate.current = false;
      }
    }
  }, [zoom]);

  return (
    <div className={`relative w-full overflow-hidden select-none ${className}`}>
      <style>{`
        .leaflet-pulsing-marker-wrapper {
          background: transparent !important;
          border: none !important;
        }
        .custom-leaflet-popup .leaflet-popup-content-wrapper {
          background: rgba(255, 255, 255, 0.96);
          border: 1px solid #E7E2D8;
          border-radius: 12px;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.1);
          padding: 2px 4px;
        }
        .dark .custom-leaflet-popup .leaflet-popup-content-wrapper {
          background: rgba(24, 24, 27, 0.96);
          border: 1px solid #3F3F46;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.4);
        }
        .custom-leaflet-popup .leaflet-popup-tip {
          background: rgba(255, 255, 255, 0.96);
        }
        .dark .custom-leaflet-popup .leaflet-popup-tip {
          background: rgba(24, 24, 27, 0.96);
        }
        .dark .leaflet-tile-pane {
          filter: brightness(0.72) invert(1) contrast(2.6) hue-rotate(200deg) saturate(0.25);
        }
      `}</style>
      <div
        ref={containerRef}
        className="w-full h-full min-h-[460px] sm:min-h-[500px] z-0 focus:outline-none"
        tabIndex={-1}
        aria-label="Offline OpenStreetMap of Medininagar (Daltonganj), Jharkhand"
      />
    </div>
  );
}
