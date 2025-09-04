/*
 * @Author: shen
 * @Date: 2025-08-26 14:48:43
 * @LastEditors: shen
 * @LastEditTime: 2025-09-04 16:47:21
 * @Description:
 */
// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import { nextTick, watch } from 'vue'
import { useRoute } from 'vitepress'
import mediumZoom from 'medium-zoom'
import './style.css'
import './styles/medium-zoom.less'

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
    })
  },
  enhanceApp({ app, router, siteData }) {
    // ...
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
