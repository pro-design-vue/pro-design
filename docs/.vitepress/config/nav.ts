/*
 * @Author: shen
 * @Date: 2025-09-03 22:11:11
 * @LastEditors: shen
 * @LastEditTime: 2025-09-04 09:14:33
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
    { text: '组件', link: '/markdown-examples', activeMatch: '/component/' },
    {
      text: pkg.version,
      items: [
        {
          text: 'Changelog',
          link: 'https://github.com/vuejs/vitepress/blob/main/CHANGELOG.md',
        },
        {
          text: 'Contributing',
          link: 'https://github.com/vuejs/vitepress/blob/main/.github/contributing.md',
        },
      ],
    },
  ]
}

export const nav = getNav()
