/*
 * @Author: shen
 * @Date: 2025-09-03 22:11:11
 * @LastEditors: shen
 * @LastEditTime: 2025-09-04 10:37:25
 * @Description:
 */
import { DefaultTheme } from 'vitepress'

function getGuideSidebar(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: '简介',
      collapsed: false,
      items: [
        { text: '什么是 Pro Design？', link: '/introduction/what-is' },
        // { text: '快速开始', link: '/introduction/quick-start' },
      ],
    },
    // {
    //   text: '写作',
    //   collapsed: false,
    //   items: [
    //     { text: 'Markdown 扩展', link: 'markdown' },
    //     { text: '资源处理', link: 'asset-handling' },
    //     { text: 'frontmatter', link: 'frontmatter' },
    //     { text: '在 Markdown 使用 Vue', link: 'using-vue' },
    //     { text: '国际化', link: 'i18n' },
    //   ],
    // },
    // {
    //   text: '自定义',
    //   collapsed: false,
    //   items: [
    //     { text: '自定义主题', link: 'custom-theme' },
    //     { text: '扩展默认主题', link: 'extending-default-theme' },
    //     { text: '构建时数据加载', link: 'data-loading' },
    //     { text: 'SSR 兼容性', link: 'ssr-compat' },
    //     { text: '连接 CMS', link: 'cms' },
    //   ],
    // },
  ]
}

function getSidebar() {
  return {
    '/guide/': { base: '/guide/', items: getGuideSidebar() },
    '/component/': { base: '/component/', items: getGuideSidebar() },
  }
}

export const sidebar = getSidebar()
