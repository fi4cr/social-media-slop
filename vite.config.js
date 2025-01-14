import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './' // This ensures assets are loaded correctly both locally and on GitHub Pages
})
