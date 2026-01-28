import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/ThePass/', // This ensures assets load at vibeaxis.github.io/ThePass/
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  }
});
