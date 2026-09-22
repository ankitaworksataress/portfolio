import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages project site: https://ankitaworksataress.github.io/portfolio/
export default defineConfig({
  plugins: [react()],
  base: '/portfolio/',
})
