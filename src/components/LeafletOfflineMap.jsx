import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const MEDININAGAR_COORDS = [24.0416, 84.0700];
const MEDININAGAR_BOUNDS = [
  [23.7646, 83.6455], // Southwest (expanded Palamu district coverage)
  [24.3186, 84.4945]  // Northeast
];

export default function LeafletOfflineMap({
  zoom = 13,
  onZoomChange,
  resetTrigger,
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

    // Initialize Leaflet map instance with strict maxBounds panning lock
    const map = L.map(containerRef.current, {
      center: MEDININAGAR_COORDS,
      zoom: initialZoomRef.current,
      minZoom: 12,
      maxZoom: 15,
      maxBounds: MEDININAGAR_BOUNDS,
      maxBoundsViscosity: 1.0,
      zoomControl: false,
      attributionControl: true
    });
    mapRef.current = map;

    // Tile layer using local pre-downloaded tiles with bounded raster extent
    const tileUrl = `${import.meta.env.BASE_URL}assets/tiles/{z}/{x}/{y}.png`;
    const tileLayer = L.tileLayer(tileUrl, {
      minZoom: 12,
      maxZoom: 15,
      minNativeZoom: 12,
      maxNativeZoom: 15,
      bounds: MEDININAGAR_BOUNDS,
      keepBuffer: 2,
      updateWhenIdle: true,
      updateWhenZooming: true,
      errorTileUrl: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
      attribution: '&copy; OpenStreetMap contributors'
    });
    tileLayer.addTo(map);

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

  // Smooth Reset & Recenter to city level
  useEffect(() => {
    if (mapRef.current && resetTrigger > 0) {
      mapRef.current.flyTo(MEDININAGAR_COORDS, 13, { duration: 0.6, easeLinearity: 0.25 });
    }
  }, [resetTrigger]);

  // Sync external zoom prop changes with Leaflet map
  useEffect(() => {
    if (mapRef.current) {
      const currentZoom = mapRef.current.getZoom();
      if (currentZoom !== zoom && zoom >= 12 && zoom <= 15) {
        isInternalZoomUpdate.current = true;
        mapRef.current.setZoom(zoom, { animate: true });
        isInternalZoomUpdate.current = false;
      }
    }
  }, [zoom]);

  return (
    <div className={`relative w-full overflow-hidden select-none ${className}`}>
      <style>{`
        /* Solid fallback container background to eliminate ghosting and heavy asset load */
        .leaflet-offline-map-container.leaflet-container {
          background-color: #f2efe9 !important;
        }
        .dark .leaflet-offline-map-container.leaflet-container {
          background-color: #12161f !important;
        }
        .dark .leaflet-tile-pane {
          filter: invert(0.92) hue-rotate(180deg) contrast(1.1);
          will-change: transform;
        }
        .leaflet-tile {
          transition: opacity 0.15s ease-in-out;
        }
      `}</style>
      <div
        ref={containerRef}
        className="leaflet-offline-map-container w-full h-full min-h-[460px] sm:min-h-[500px] z-0 focus:outline-none bg-[#f2efe9] dark:bg-[#12161f]"
        tabIndex={-1}
        aria-label="Offline OpenStreetMap of Medininagar (Daltonganj), Jharkhand"
      />
    </div>
  );
}
