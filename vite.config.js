import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        short_name: "Tilawat",
        name: "Tilawat Tracker",
        icons: [
          {
            src: "/ikon-standar.png",
            type: "image/png",
            sizes: "408x408"
          },
          {
            src: "/ikon-splash-screen.png",
            type: "image/png",
            sizes: "512x512"
          }
        ],
        start_url: "/",
        background_color: "#ffffff",
        display: "standalone",
        scope: "/",
        theme_color: "#317EFB",
        description: "Tracker tilawah harian Anda."
      }
    })
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      }
    }
  }
})
