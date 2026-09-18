import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  // Served under /admin in dev (proxied by the storefront on :5173) and in production.
  base: '/admin/',
  plugins: [
    react(),
    tailwindcss(),

  ],
  server: {
    host: '127.0.0.1',
    port: 5174,
    strictPort: true,
    hmr: { clientPort: 5173 },
  },
})
