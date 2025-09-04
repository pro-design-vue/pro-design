/*
 * @Author: shen
 * @Date: 2025-09-03 22:11:11
 * @LastEditors: shen
 * @LastEditTime: 2025-09-04 21:20:10
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
        { text: '快速开始', link: '/introduction/quick-start' },
        { text: '最佳实践', link: '/introduction/best-practices' },
      ],
    },
    {
      text: '进阶',
      collapsed: false,
      items: [
        { text: '国际化', link: '/advanced/i18n' },
        { text: '主题', link: '/advanced/theming' },
        { text: '暗黑模式', link: '/advanced/dark-mode' },
        { text: '自定义命名空间', link: '/advanced/namespace' },
      ],
    },
    {
      text: '开发',
      collapsed: false,
      items: [
        { text: '本地开发', link: '/development/local' },
        { text: '路由和菜单', link: '/development/route' },
        { text: '配置', link: '/development/setting' },
        { text: '图标', link: '/development/icon' },
        { text: '国际化', link: '/development/i18n' },
        { text: '微前端', link: '/development/micro-app' },
        { text: '构建和部署', link: '/development/build' },
      ],
    },
  ]
}

function getComponentSidebar(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: '组件概览',
      link: '/overview',
    },
    {
      text: '布局',
      items: [
        { text: 'ProLayout - 高级布局', link: '/layout/layout' },
        { text: 'ProPage - 页面容器', link: '/layout/page' },
      ],
    },
  ]
}

function getChangelogSidebar(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: 'Pro Design Vue',
      link: '/pro-design-vue',
    },
    {
      text: 'Pro Design Admin',
      link: '/pro-design-admin',
    },
  ]
}

function getSidebar() {
  return {
    '/guide/': { base: '/guide/', items: getGuideSidebar() },
    '/component/': { base: '/component/', items: getComponentSidebar() },
    '/changelog/': { base: '/changelog/', items: getChangelogSidebar() },
  }
}

export const sidebar = getSidebar()
