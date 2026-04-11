import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      // '@/' maps to '/src/' — prevents deep relative imports like '../../../utils/cn'
      '@': path.resolve(__dirname, './src'),
    },
  },

  // Treat GLSL shader files as raw text strings
  assetsInclude: ['**/*.glsl'],

  build: {
    chunkSizeWarningLimit: 800,
  }
});
