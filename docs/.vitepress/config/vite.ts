/*
 * @Author: shen
 * @Date: 2025-09-05 10:47:34
 * @LastEditors: shen
 * @LastEditTime: 2025-09-08 09:49:10
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
  docRoot,
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
console.log('🚀 ~ process.env.DOC_ENV:', process.env.DOC_ENV)

const alias: AliasOptions = [
  ...(process.env.DOC_ENV === 'production'
    ? []
    : [
        {
          find: /^pro-design-vue(\/(es|lib))?$/,
          replacement: path.resolve(projRoot, 'packages/pro-design-vue/index.ts'),
        },
        {
          find: /^pro-design-vue\/(.*)$/,
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
      alias: [
        ...alias,
        {
          find: /^ant-design-vue\/(es|lib)\/(.*)$/,
          replacement: `${path.resolve(docRoot, './node_modules/ant-design-vue')}/$2`,
        },
      ],
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
