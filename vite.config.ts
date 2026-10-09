import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: false
      },
      includeAssets: ['favicon.ico', 'robots.txt', 'pwa-192x192.svg', 'pwa-512x512.svg'],
      manifest: {
        name: 'Sheikh Farid AI Studio & Project Hub',
        short_name: 'SF AI Studio',
        description: 'উন্নত বাংলা এআই অ্যাসিস্ট্যান্ট, গভর্নেন্স ও নাগরিক সেবা টুলস, এবং শেখ ফরিদের উদ্ভাবনী প্রজেক্ট হাব।',
        theme_color: '#0f172a',
        background_color: '#0f172a',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/pwa-192x192.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          },
          {
            src: '/pwa-512x512.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json}']
      }
    })
  ],
  server: {
    port: 3000,
    host: '0.0.0.0'
  }
});
