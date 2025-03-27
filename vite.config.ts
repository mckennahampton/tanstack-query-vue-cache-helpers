import { resolve } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig(({ command, mode, isSsrBuild, isPreview }) => ({   
    plugins: [
        vue()
    ],
    build: {
        lib: {
            entry: resolve(__dirname, 'lib/main.ts'),
            name: 'tanstack-query-vue-cache-helpers', // Change this lib name, ex: 'MyLib'
            // the proper extensions will be added
            fileName: 'hampton-vue' // Change your file name, ex: 'my-lib'
        },
        rollupOptions: {
            // make sure to externalize deps that shouldn't be bundled
            // into your library
            external: ['vue'],
            output: {
                // Provide global variables to use in the UMD build
                // for externalized deps
                globals: {
                    vue: 'Vue'
                }
            }
        },
    },
    esbuild: {
        pure: mode === 'production' ? ['console.log'] : [],
    }
}))
