import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  base: "./",
  build: {
    outDir: "./dist", // ✅ correct spelling and case
  },
  server: {
    port: 5554,
  },
  plugins: [tailwindcss(), react()],
});
