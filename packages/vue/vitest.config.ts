import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['src/**/*.{test,spec}.{js,ts,jsx,tsx}'],
    // setupFiles: ['./src/tests/setup.ts'],
    testTimeout: 10000,
    hookTimeout: 10000,
    deps: {
      inline: [/@vue/, /@tanstack/]
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      reportsDirectory: './coverage'
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
}) 