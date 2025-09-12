/*
 * @Author: shen
 * @Date: 2025-08-26 14:48:43
 * @LastEditors: shen
 * @LastEditTime: 2025-09-12 09:45:49
 * @Description:
 */
import { UserConfig } from 'vitepress'
import { nav } from './nav'
import { sidebar } from './sidebar'
import { mdPlugin } from './plugins'
import { getViteConfig } from './vite'
import { vueCompiler } from './vue-compiler'

// https://vitepress.dev/reference/site-config
const setupConfig = (configEnv) => {
  const config: UserConfig<any> = {
    title: 'Pro Design',

    lastUpdated: true,
    cleanUrls: true,
    metaChunk: true,
    lang: 'zh-CN',
    description: '基于 Vue 3 和 Ant Design Vue，企业级管理系统框架和组件库',
    head: [['link', { rel: 'icon', href: '/favicon.ico' }]],
    themeConfig: {
      // https://vitepress.dev/reference/default-theme-config
      nav,
      sidebar,
      logo: { src: '/logo.png', width: 24, height: 24 },
      socialLinks: [{ icon: 'github', link: 'https://github.com/pro-design-vue' }],
      search: {
        provider: 'local',
        options: {
          translations: {
            button: {
              buttonText: '搜索文档',
              buttonAriaLabel: '搜索文档',
            },
            modal: {
              noResultsText: '无法找到相关结果',
              resetButtonTitle: '清除查询条件',
              footer: {
                selectText: '选择',
                navigateText: '切换',
                closeText: '关闭',
              },
            },
          },
        },
      },
      footer: {
        message:
          '基于 <a target="_blank" href="https://opensource.org/license/MIT">MIT 许可发布</a>',
        copyright: `版权所有 © 2025-${new Date().getFullYear()} <a target="_blank" href="https://github.com/pro-design-vue"> Pro Design Vue</a>`,
      },
      editLink: {
        pattern: 'https://github.com/pro-design-vue/pro-design/edit/main/docs/:path',
        text: '在 GitHub 上编辑此页面',
      },

      docFooter: {
        prev: '上一页',
        next: '下一页',
      },

      outline: {
        label: '本页目录',
      },

      lastUpdated: {
        text: '最后更新于',
      },

      notFound: {
        title: '页面未找到',
        quote: '但如果你不改变方向，并且继续寻找，你可能最终会到达你所前往的地方。',
        linkLabel: '前往首页',
        linkText: '带我回首页',
      },

      langMenuLabel: '多语言',
      returnToTopLabel: '回到顶部',
      sidebarMenuLabel: '菜单',
      darkModeSwitchLabel: '主题',
      lightModeSwitchTitle: '切换到浅色模式',
      darkModeSwitchTitle: '切换到深色模式',
      skipToContentLabel: '跳转到内容',
    },
    locales: {
      en: { label: 'English', lang: 'en-US', dir: 'ltr' },
      root: { label: '简体中文', lang: 'zh-CN', dir: 'ltr' },
    },
    vite: getViteConfig(configEnv),
    markdown: {
      config: (md) => mdPlugin(md),
      container: {
        tipLabel: '提示',
        warningLabel: '警告',
        dangerLabel: '危险',
        infoLabel: '信息',
        detailsLabel: '详细信息',
      },
    },
    vue: {
      // compiler: vueCompiler,
      template: {
        compilerOptions: {
          hoistStatic: false,
        },
      },
    },
  }

  return config
}

export default setupConfig
// export default defineConfig({
//   title: 'Pro Design',

//   lastUpdated: true,
//   cleanUrls: true,
//   metaChunk: true,
//   lang: 'zh-CN',
//   description: '基于 Vue 3 和 Ant Design Vue，企业级管理系统框架和组件库',
//   head: [['link', { rel: 'icon', href: '/favicon.ico' }]],
//   themeConfig: {
//     // https://vitepress.dev/reference/default-theme-config
//     nav,
//     sidebar,
//     logo: { src: '/logo.png', width: 24, height: 24 },
//     socialLinks: [{ icon: 'github', link: 'https://github.com/pro-design-vue/pro-design' }],
//     search: {
//       provider: 'local',
//       options: {
//         translations: {
//           button: {
//             buttonText: '搜索文档',
//             buttonAriaLabel: '搜索文档',
//           },
//           modal: {
//             noResultsText: '无法找到相关结果',
//             resetButtonTitle: '清除查询条件',
//             footer: {
//               selectText: '选择',
//               navigateText: '切换',
//               closeText: '关闭',
//             },
//           },
//         },
//       },
//     },
//     footer: {
//       message: '基于 <a target="_blank" href="https://opensource.org/license/MIT">MIT 许可发布</a>',
//       copyright: `版权所有 © 2025-${new Date().getFullYear()} <a target="_blank" href="https://github.com/pro-design-vue"> Pro Design Vue</a>`,
//     },
//     editLink: {
//       pattern: 'https://github.com/pro-design-vue/pro-design/edit/main/docs/:path',
//       text: '在 GitHub 上编辑此页面',
//     },

//     docFooter: {
//       prev: '上一页',
//       next: '下一页',
//     },

//     outline: {
//       label: '本页目录',
//     },

//     lastUpdated: {
//       text: '最后更新于',
//     },

//     notFound: {
//       title: '页面未找到',
//       quote: '但如果你不改变方向，并且继续寻找，你可能最终会到达你所前往的地方。',
//       linkLabel: '前往首页',
//       linkText: '带我回首页',
//     },

//     langMenuLabel: '多语言',
//     returnToTopLabel: '回到顶部',
//     sidebarMenuLabel: '菜单',
//     darkModeSwitchLabel: '主题',
//     lightModeSwitchTitle: '切换到浅色模式',
//     darkModeSwitchTitle: '切换到深色模式',
//     skipToContentLabel: '跳转到内容',
//   },
//   locales: {
//     en: { label: 'English', lang: 'en-US', dir: 'ltr' },
//     root: { label: '简体中文', lang: 'zh-CN', dir: 'ltr' },
//   },
//   markdown: {
//     config: (md) => mdPlugin(md),
//     container: {
//       tipLabel: '提示',
//       warningLabel: '警告',
//       dangerLabel: '危险',
//       infoLabel: '信息',
//       detailsLabel: '详细信息',
//     },
//   },
// })
