import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://web-chat-app-rust.vercel.app/',
        // target: 'http://localhost:8000/',
        changeOrigin: true,
      },
    },
  },
})
