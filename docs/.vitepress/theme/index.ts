/*
 * @Author: shen
 * @Date: 2025-08-26 14:48:43
 * @LastEditors: shen
 * @LastEditTime: 2025-09-07 23:29:25
 * @Description:
 */
// https://vitepress.dev/guide/custom-theme
import type { Theme } from 'vitepress'

import { nextTick, watch } from 'vue'
import { useRoute } from 'vitepress'
import { isClient } from '@vueuse/core'
import { globals } from '../components'
import DefaultTheme from 'vitepress/theme'
import App from './App.vue'
import mediumZoom from 'medium-zoom'
import './style.css'
import './styles/medium-zoom.less'
import '@pro-design-vue/theme-chalk/src/index.less'

export default {
  extends: DefaultTheme,
  // Layout: () => {
  //   return h(DefaultTheme.Layout, null, {
  //     // https://vitepress.dev/guide/extending-default-theme#layout-slots
  //   })
  // },
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
  setup() {
    // 为img元素添加点击放大功能
    const route = useRoute()
    watch(
      () => route.path,
      () => nextTick(() => mediumZoom('.main img', { background: 'var(--vp-c-bg)' })),
      { immediate: true },
    )
  },
} satisfies Theme
