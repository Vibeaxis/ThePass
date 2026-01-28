import { defineConfig } from 'vite'

export default defineConfig({
  // This must match your repository name exactly
  base: '/ThePass/', 
  build: {
    outDir: 'dist',
  }
})
