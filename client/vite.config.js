import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://auth-app-server-tuhe.onrender.com',
        secure: true,
        changeOrigin: true,
      },
    },
  },
})
