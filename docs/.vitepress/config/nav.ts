/*
 * @Author: shen
 * @Date: 2025-09-03 22:11:11
 * @LastEditors: shen
 * @LastEditTime: 2025-10-07 13:09:46
 * @Description:
 */
import { createRequire } from 'module'
import { DefaultTheme } from 'vitepress'
import { pdPackage } from '@pro-design-vue/build-utils'

const require = createRequire(import.meta.url)
const pkg =
  process.env.DOC_ENV === 'production' ? require('pro-design-vue/package.json') : require(pdPackage)

function getNav(): DefaultTheme.NavItem[] {
  return [
    { text: '首页', link: '/' },
    { text: '指南', link: '/guide/introduction/what-is', activeMatch: '/guide/' },
    { text: '组件', link: '/component/design', activeMatch: '/component/' },
    {
      text: '相关链接',
      items: [
        {
          text: '框架',
          items: [
            {
              text: 'Vue',
              link: 'https://cn.vuejs.org/',
            },
            {
              text: 'Vue Router',
              link: 'https://router.vuejs.org/zh/',
            },
            {
              text: 'Pinia',
              link: 'https://pinia.vuejs.org/zh/',
            },
            {
              text: 'Ant Design Vue',
              link: 'https://www.antdv.com/components/overview-cn',
            },

            {
              text: 'Vue I18n',
              link: ' https://vue-i18n.intlify.dev/',
            },
            {
              text: 'Micro App',
              link: 'https://jd-opensource.github.io/micro-app/',
            },
            {
              text: 'Echarts',
              link: 'https://echarts.apache.org/zh/index.html',
            },
          ],
        },
        {
          text: '工具',
          items: [
            {
              text: 'VueUse',
              link: 'https://vueuse.org/',
            },
            {
              text: 'Axios',
              link: 'https://axios-http.com/zh/docs/intro',
            },
            {
              text: 'Day.js',
              link: 'https://day.js.org/zh-CN/',
            },
            {
              text: 'Lodash',
              link: 'https://lodash.com/',
            },
            {
              text: 'LocalForage',
              link: 'https://localforage.docschina.org/',
            },
            {
              text: 'CryptoJS',
              link: 'https://cryptojs.gitbook.io/docs/',
            },
            {
              text: 'JSEncrypt',
              link: 'https://travistidwell.com/jsencrypt/',
            },
          ],
        },
        {
          text: '构建工具',
          items: [
            {
              text: 'Vite',
              link: 'https://cn.vite.dev/',
            },
            {
              text: 'Rollup',
              link: 'https://cn.rollupjs.org/',
            },
            {
              text: 'Gulp',
              link: 'https://www.gulpjs.com.cn/',
            },
            {
              text: 'Less',
              link: 'https://lesscss.org/',
            },
          ],
        },
      ],
    },
    {
      text: pkg.version,
      items: [
        {
          text: 'Pro Design Vue',
          link: 'https://github.com/pro-design-vue/pro-design/releases',
        },
        {
          text: 'Pro Design Admin',
          link: 'https://github.com/pro-design-vue/pro-design-admin/releases',
        },
      ],
    },
  ]
}

export const nav = getNav()
