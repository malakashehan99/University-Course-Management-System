import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,   // frontend dev server
    open: true,   // auto-open in browser
    host: true    // allows access from local network (optional)
  }
})
