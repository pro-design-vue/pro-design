/*
 * @Author: shen
 * @Date: 2025-08-26 14:37:53
 * @LastEditors: shen
 * @LastEditTime: 2025-08-27 10:40:20
 * @Description:
 */
import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx(), vueDevTools()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  css: {
    preprocessorOptions: {
      less: {
        modifyVars: {
          'pro-prefix': 'pro1',
          'ant-prefix': 'pro-ant',
        },
        javascriptEnabled: true,
      },
    },
  },
})
