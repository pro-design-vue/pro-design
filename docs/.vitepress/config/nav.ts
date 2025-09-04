/*
 * @Author: shen
 * @Date: 2025-09-03 22:11:11
 * @LastEditors: shen
 * @LastEditTime: 2025-09-04 20:56:50
 * @Description:
 */
import { createRequire } from 'module'
import { DefaultTheme } from 'vitepress'

const require = createRequire(import.meta.url)
const pkg = require('pro-design-vue/package.json')

function getNav(): DefaultTheme.NavItem[] {
  return [
    { text: '首页', link: '/' },
    { text: '指南', link: '/guide/introduction/what-is', activeMatch: '/guide/' },
    { text: '组件', link: '/component/overview', activeMatch: '/component/' },
    {
      text: pkg.version,
      activeMatch: '/changelog/',
      items: [
        {
          text: 'Pro Design Vue',
          link: '/changelog/pro-design-vue',
        },
        {
          text: 'Pro Design Admin',
          link: '/changelog/pro-design-admin',
        },
      ],
    },
  ]
}

export const nav = getNav()
