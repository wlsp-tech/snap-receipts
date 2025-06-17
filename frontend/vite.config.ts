import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
      react(),
      tailwindcss(),
  ],
  resolve: {
    // Enables non-relative imports from the 'src' folder using '@/'
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@nav": path.resolve(__dirname, "./nav"),
      "@assets": path.resolve(__dirname, "./assets"),
      "@components": path.resolve(__dirname, "./components"),
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
