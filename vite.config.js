import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode: _mode } = {}) => ({
  base: '/Interactive-Cursor-Tracking-Portfolio/',
  plugins: [
    tailwindcss(),
    react(),
  ],
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          const normalizedId = id.replace(/\\/g, '/')
          if (normalizedId.includes('node_modules')) {
            if (normalizedId.includes('/node_modules/react/') || normalizedId.includes('/node_modules/react-dom/')) {
              return 'vendor-react'
            }
            if (normalizedId.includes('/node_modules/leaflet/') || normalizedId.includes('/node_modules/react-leaflet/')) {
              return 'vendor-leaflet'
            }
            if (normalizedId.includes('/node_modules/jszip/')) {
              return 'vendor-jszip'
            }
            if (normalizedId.includes('/node_modules/canvas-confetti/')) {
              return 'vendor-confetti'
            }
            if (normalizedId.includes('/node_modules/lucide-react/')) {
              return 'vendor-lucide'
            }
          }
          if (normalizedId.includes('caseStudiesData.js')) {
            return 'data-case-studies'
          }
          if (normalizedId.includes('portfolioAssistantEngine.js')) {
            return 'portfolio-assistant-engine'
          }
        },
      },
    },
  },
  server: {
    host: true, // exposes on 0.0.0.0 (all LAN IPs)
  },
}))
