/*
 * @Author: shen
 * @Date: 2025-09-03 22:11:11
 * @LastEditors: shen
 * @LastEditTime: 2025-09-22 08:55:46
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
        { text: 'ProLayout - 高级布局', link: '/layout' },
        { text: 'ProPage - 页面容器', link: '/page' },
      ],
    },
    {
      text: '通用',
      items: [
        { text: 'ProButton - 按钮', link: '/button' },
        { text: 'ProClipboard - 复制', link: '/clipboard' },
        { text: 'ProCounter - 数字动画', link: '/counter' },
        // { text: 'ProCropper - 图片裁剪', link: '/cropper' },
        { text: 'ProDrawer - 抽屉', link: '/drawer' },
        // { text: 'ProIcon - 图标', link: '/icon' },
        { text: 'ProModal - 对话框', link: '/modal' },
        { text: 'ProLoading - 加载中', link: '/loading' },
        // { text: 'ProSpinner - 加载动画', link: '/spinner' },
      ],
    },
    {
      text: '高级',
      items: [
        { text: 'ProTable - 高级表格', link: '/table' },
        { text: 'ProForm - 高级表单', link: '/form' },
        { text: 'ProModalForm - 浮层表单', link: '/modal-form' },
        { text: 'ProQueryFilter - 筛选表单', link: '/query-filter' },
        { text: 'ProStepsForm - 分步表单', link: '/steps-form' },
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
