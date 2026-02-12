import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import Icons from 'unplugin-icons/vite';
import Components from 'unplugin-vue-components/vite';
import IconsResolver from 'unplugin-icons/resolver';
import { FileSystemIconLoader } from 'unplugin-icons/loaders';

export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    Icons({
      customCollections: {
        icon: FileSystemIconLoader('./src/assets/icons')
      }
    }),
    Components({
      resolvers: [
        IconsResolver({
          customCollections: ['icon'],
          prefix: false
        })
      ],
      globs: ['./src/components/**/*.vue', './src/assets/icons/*.svg'],
      dts: true,
      extensions: ['vue', 'svg']
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
