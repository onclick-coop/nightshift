import { defineConfig } from 'vite'
import shopify from 'vite-plugin-shopify'

export default defineConfig({
  plugins: [
    shopify({
      sourceCodeDir: 'src',
      entrypointsDir: 'src/entrypoints',
    }),
  ],
  build: {
    manifest: 'manifest.json', // Put manifest in root of assets, not .vite subfolder
  },
})
