import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['./src/**/*.{test,spec}.{js,ts,jsx,tsx}'],
    deps: {
      inline: [/@tanstack/, /@testing-library/]
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      reportsDirectory: './coverage',
      exclude: [
        './tsup.config.ts',
        './vitest.config.ts',
        './dist/**/',
        'src/**/*.{test,spec}.{js,ts,jsx,tsx}',
        'src/tests/**/*',
        './src/**/types.{js,ts,jsx,tsx}',
        './src/**/types/**/*.{js,ts,jsx,tsx}',
        './src/**/index.{js,ts,jsx,tsx}',
        'src/**/*.d.ts',
        'src/**/*.config.{js,ts}',
        'src/**/index.{js,ts}',
        'src/**/types.{js,ts}'
      ]
    }
  }
}) 