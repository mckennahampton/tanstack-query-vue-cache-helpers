import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['./src/**/*.{test,spec}.{js,ts,jsx,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['./src/**/*.{js,ts,jsx,tsx}'],
      exclude: [
        './src/**/*.{test,spec}.{js,ts,jsx,tsx}',
        './src/**/types.{js,ts,jsx,tsx}',
        './src/**/types/**/*.{js,ts,jsx,tsx}'
      ]
    }
  }
}) 