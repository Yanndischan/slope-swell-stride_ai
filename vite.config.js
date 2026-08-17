import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Standard Vite configuration for React & Tailwind / Lucide
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});