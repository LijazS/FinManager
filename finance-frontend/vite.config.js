import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss() ],
   server: {
    proxy: {
      // Redirects requests starting with /api to your FastAPI server
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        secure: false,
        // Optional: if your backend routes don't start with /api, remove it:
        // rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
