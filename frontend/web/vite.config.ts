import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
      TanStackRouterVite(),
      react(),
      tailwindcss(),
  ],
  resolve: {
    // Enables non-relative imports from the 'src' folder using '@/'
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@nav": path.resolve(__dirname, "./nav"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
