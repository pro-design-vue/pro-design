/*
 * @Author: shen
 * @Date: 2025-09-05 10:47:34
 * @LastEditors: shen
 * @LastEditTime: 2025-09-07 22:09:14
 * @Description:
 */
import path from 'path'
import Inspect from 'vite-plugin-inspect'
import mkcert from 'vite-plugin-mkcert'
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

const { dependencies: epDeps } = getPackageDependencies(pdPackage)
const { dependencies: docsDeps } = getPackageDependencies(docPackage)
const optimizeDeps = [...new Set([...epDeps, ...docsDeps])].filter(
  (dep) => !dep.startsWith('@types/') && !['element-plus'].includes(dep),
)
optimizeDeps.push(
  ...(await glob(['dayjs/plugin/*.js'], {
    cwd: path.resolve(projRoot, 'node_modules'),
    onlyFiles: true,
  })),
)
console.log('🚀 ~ process.env.DOC_ENV:', process.env.DOC_ENV)

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
      vueJsx(),
      MarkdownTransform() as Plugin,
      Inspect(),
      env.HTTPS ? (mkcert() as Plugin) : undefined,
    ],
    optimizeDeps: {
      include: optimizeDeps,
    },
  }
}
