import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';

export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },

  server: {
    port: 5173,
    open: true,
  },

  preview: {
    port: 4173,
    open: true,
  },

  build: {
    sourcemap: true,
  },
});