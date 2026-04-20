import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5175,
    allowedHosts: ['sopian.nurulaitam.my.id', 'sofianhariyanti.nurulaitam.my.id', 'wedding.nurulaitam.my.id'],
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true
      }
    }
  }
})
