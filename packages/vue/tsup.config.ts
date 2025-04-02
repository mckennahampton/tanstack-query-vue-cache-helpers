import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ['vue', '@tanstack/vue-query', '@tanstack-query-cache-helpers/core'],
  noExternal: ['@tanstack-query-cache-helpers/vue'],
  treeshake: true,
  minify: true,
}) 