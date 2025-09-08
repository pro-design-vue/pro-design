/*
 * @Author: shen
 * @Date: 2025-08-26 14:48:43
 * @LastEditors: shen
 * @LastEditTime: 2025-09-08 10:59:33
 * @Description:
 */
import type { Theme } from 'vitepress'
import { isClient } from '@vueuse/core'
import { globals } from '../components'
import DefaultTheme from 'vitepress/theme'
import App from './App.vue'
import './style.css'
import '@pro-design-vue/theme-chalk/src/index.less'

export default {
  extends: DefaultTheme,
  Layout: App,
  enhanceApp: async ({ app, router }) => {
    globals.forEach(([name, Comp]) => {
      app.component(name, Comp)
    })

    if (!isClient) return
    const nprogress = await import('nprogress')
    router.onBeforeRouteChange = () => {
      nprogress.start()
    }
    router.onAfterRouteChange = () => {
      nprogress.done()
    }
  },
} satisfies Theme
