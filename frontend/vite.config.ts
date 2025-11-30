import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base : 'https://tinphan247.github.io/User-Registration-API-with-React-Frontend/',
  plugins: [react()],
})
