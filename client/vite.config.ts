import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: true,
    port: 5173,
    hmr: {
      clientPort: 80,
    },
    watch: {
      usePolling: true,
    }
  },
    theme: {
    extend: {
      margin: {
        '18': '4.5rem',
      }
    }
  }
})