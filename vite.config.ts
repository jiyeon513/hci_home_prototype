import { copyFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const repoBase = '/hci_home_prototype/'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const isPagesBuild = mode === 'pages'

  return {
    base: isPagesBuild ? repoBase : '/',
    plugins: [
      react(),
      {
        name: 'gh-pages-spa-fallback',
        closeBundle() {
          if (!isPagesBuild) {
            return
          }

          const indexPath = resolve(__dirname, 'dist/index.html')
          copyFileSync(indexPath, resolve(__dirname, 'dist/404.html'))
        },
      },
    ],
    server: {
      port: 5180,
      strictPort: true,
    },
    preview: {
      port: 5180,
      strictPort: true,
    },
  }
})
