import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/cart': 'http://localhost:3001',
      '/checkout': 'http://localhost:3001',
      '/admin': 'http://localhost:3001',
    },
  },
});
