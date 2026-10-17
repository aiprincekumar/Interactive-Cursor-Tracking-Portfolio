import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import basicSsl from '@vitejs/plugin-basic-ssl'

// https://vite.dev/config/
export default defineConfig(({ mode: _mode } = {}) => ({
  base: '/Interactive-Cursor-Tracking-Portfolio/',
  plugins: [
    tailwindcss(),
    react(),
    basicSsl(),
  ],
  server: {
    host: true, // exposes on 0.0.0.0 (all LAN IPs)
  },
}))
