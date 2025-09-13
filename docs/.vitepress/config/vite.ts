/*
 * @Author: shen
 * @Date: 2025-09-05 10:47:34
 * @LastEditors: shen
 * @LastEditTime: 2025-09-13 11:09:58
 * @Description:
 */
import path from 'path'
import Inspect from 'vite-plugin-inspect'
import mkcert from 'vite-plugin-mkcert'
import prismjs from 'vite-plugin-prismjs'
import glob from 'fast-glob'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { loadEnv } from 'vitepress'
import {
  docPackage,
  pdPackage,
  getPackageDependencies,
  projRoot,
} from '@pro-design-vue/build-utils'
import { MarkdownTransform } from '../plugins/markdown-transform'

import type { Plugin, UserConfig } from 'vitepress'

type ViteConfig = Required<UserConfig>['vite']
type ResolveOptions = Required<ViteConfig>['resolve']
type AliasOptions = Required<ResolveOptions>['alias']

const { dependencies: pdDeps } = getPackageDependencies(pdPackage)
const { dependencies: docsDeps } = getPackageDependencies(docPackage)
const optimizeDeps = [...new Set([...pdDeps, ...docsDeps])].filter(
  (dep) => !dep.startsWith('@types/') && !['pro-design-vue'].includes(dep),
)
optimizeDeps.push(
  ...(await glob(['dayjs/plugin/*.js'], {
    cwd: path.resolve(projRoot, 'node_modules'),
    onlyFiles: true,
  })),
)

const alias: AliasOptions = [
  {
    find: '~/',
    replacement: `${path.resolve(__dirname, '../vitepress')}/`,
  },
  ...(process.env.DOC_ENV === 'production'
    ? []
    : [
        {
          find: /^pro-design-vue(\/(es|lib))?$/,
          replacement: path.resolve(projRoot, 'packages/pro-design-vue/index.ts'),
        },
        {
          find: /^pro-design-vue\/(es|lib)\/(.*)$/,
          replacement: `${path.resolve(projRoot, 'packages')}/$2`,
        },
      ]),
]
console.log('🚀 ~ alias:', alias)

export const getViteConfig = ({ mode }: { mode: string }): ViteConfig => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    server: {
      host: true,
      port: 2000,
      fs: {
        allow: [projRoot],
      },
    },
    resolve: {
      alias,
    },
    plugins: [
      vueJsx() as Plugin,
      MarkdownTransform() as Plugin,
      Inspect(),
      prismjs({
        languages: 'all',
      }),
      env.HTTPS ? (mkcert() as Plugin) : undefined,
    ],
    optimizeDeps: {
      include: optimizeDeps,
    },
    ssr: {
      // 解决打包找不到包问题
      noExternal: ['ant-design-vue', '@ant-design/icons-vue'],
    },
  }
}
