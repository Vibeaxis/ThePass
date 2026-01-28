import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Use relative paths so it works on any GH Pages subfolder
  build: {
    outDir: 'dist',
    sourcemap: false, // Turn off for production to avoid extra noise
  }
})
