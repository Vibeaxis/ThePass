import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  base: '/ThePass/', 
  resolve: {
    alias: {
      // This tells Vite that "@" means the "src" folder
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
  }
})
