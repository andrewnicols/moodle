import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': {},
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'react/main.jsx'),
      name: 'ReactApp',
      fileName: 'app',
      formats: ['iife'], // Immediately Invoked Function Expression for browser use
    },
    outDir: 'build',
    emptyOutDir: true,
  },
});
