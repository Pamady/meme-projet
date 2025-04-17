import { defineConfig } from 'vite'
import réagis from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', 
    port: process.env.PORT || 5173 
  }
})
