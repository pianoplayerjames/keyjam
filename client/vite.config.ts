import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  server: {
    // This is the default, but it's good to be explicit
    // This makes the server accessible from your host machine
    host: true,
    port: 5173, // This is the port you're exposing in Docker
    // This is the crucial part for HMR to work with Nginx
    hmr: {
      clientPort: 80,
    },
    watch: {
      // Required for live-reloading to work in some containerized environments
      usePolling: true,
    }
  },
    theme: {
    extend: {
      margin: {
        '18': '4.5rem', // 72px to match your nav width
      }
    }
  }
})