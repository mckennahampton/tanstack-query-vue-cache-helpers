import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "TanStack Query Cache Helpers",
  description: "Efficient cache mutations for TanStack Query - add, update, and remove items without invalidating entire caches",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Getting Started', link: '/getting-started' },
      { text: 'API Reference', link: '/api/' },
      { text: 'Examples', link: '/examples/' }
    ],
    outline: {
      level: 'deep'
    },
    sidebar: {
      '/api/': [
        {
          text: 'API Reference',
          items: [
            { text: 'Overview', link: '/api/' },
            { text: 'useTanstackCacheHelpers', link: '/api/use-tanstack-cache-helpers' },
            { text: 'Core Functions', link: '/api/core-functions' },
            { text: 'Types', link: '/api/types' }
          ]
        }
      ],
      '/examples/': [
        {
          text: 'Examples',
          items: [
            { text: 'Overview', link: '/examples/' },
            { text: 'Basic Operations', link: '/examples/basic-operations' },
            { text: 'Deep Operations', link: '/examples/deep-operations' },
            { text: 'Advanced Patterns', link: '/examples/advanced-patterns' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/your-username/tanstack-query-vue-cache-helpers' }
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024-present'
    }
  }
})
