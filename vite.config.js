import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    // PWA con auto-actualización (mismo patrón de Plataforma Aula): la app se
    // instala en el celular, funciona sin internet (la base de universidades
    // viaja precacheada) y cada deploy llega solo a los dispositivos.
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        id: '/',
        start_url: '/',
        scope: '/',
        lang: 'es',
        name: 'Buscador de Oportunidades Universitarias',
        short_name: 'Buscador U',
        description:
          'Encuentra tu carrera en las universidades de Colombia: links oficiales, fechas, costos, pasos de inscripción, becas y simulador de admisión.',
        theme_color: '#2563eb',
        background_color: '#f8fafc',
        display: 'standalone',
        orientation: 'portrait',
        dir: 'ltr',
        categories: ['education'],
        icons: [
          { src: '/pwa-192x192.png', sizes: '192x192', type: 'image/png', purpose: 'any maskable' },
          { src: '/pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
        ],
      },
    }),
  ],
  server: {
    port: 5180,
    strictPort: true,
  },
});
