import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const MEDININAGAR_COORDS = [24.0416, 84.0700];
const MEDININAGAR_BOUNDS = [
  [23.8054, 83.7598],
  [24.2069, 84.3750]
];

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
      maxNativeZoom: 15,
      bounds: MEDININAGAR_BOUNDS,
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
