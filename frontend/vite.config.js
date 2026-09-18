import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      // The admin app's base is /admin/, so send bare /admin there.
      name: 'admin-trailing-slash',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url === '/admin' || req.url?.startsWith('/admin?')) {
            res.statusCode = 302
            res.setHeader('Location', req.url.replace('/admin', '/admin/'))
            return res.end()
          }
          next()
        })
      },
    },
  ],
  server: {
    port: 5173,
    strictPort: true,
    // Mirror production: /admin is served by the admin app (see vercel.json).
    proxy: {
      '/admin': { target: 'http://127.0.0.1:5174', ws: true },
    },
  },
})
