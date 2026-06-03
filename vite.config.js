import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/act1Unit3Front/', // <-- AGREGA ESTA LÍNEA (con los slashes al inicio y al final)
})