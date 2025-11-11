import { fileURLToPath, URL } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import tailwindcss from 'tailwindcss';

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [tailwindcss()]
    }
  },
  base: '/growondaily',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    chunkSizeWarningLimit: 3000
  },
  
  // --- CORRECTED SECTION ---
  server: {
    port: 3000, 
    proxy: {
      // Any request to your dev server that starts with /api
      // will be forwarded to the target URL.
      '/api': {
        target: 'https://api.growondaily.com',
        // This is crucial. It changes the 'Host' header of the request
        // to match the target, which most APIs require.
        changeOrigin: true,
      }
    }
  }
  // -------------------------
});