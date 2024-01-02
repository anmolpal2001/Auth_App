import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const base_URL = 'https://auth-app-server-tuhe.onrender.com'
// const base_URL = 'http://localhost:3000'
// const base_URL = 'https://auth-app-client-3cbu.onrender.com'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: base_URL,
        secure: true,
        changeOrigin: true,
      },
    },
  },
  define: {
    BASE_URL : JSON.stringify(base_URL)
  }
})
