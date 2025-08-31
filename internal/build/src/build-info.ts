/*
 * @Author: shen
 * @Date: 2025-08-27 17:10:28
 * @LastEditors: shen
 * @LastEditTime: 2025-08-27 17:10:54
 * @Description:
 */
import path from 'path'
import { PKG_NAME } from '@pro-design-vue/build-constants'
import { pdOutput } from '@pro-design-vue/build-utils'

import type { ModuleFormat } from 'rollup'

export const modules = ['esm', 'cjs'] as const
export type Module = (typeof modules)[number]
export interface BuildInfo {
  module: 'ESNext' | 'CommonJS'
  format: ModuleFormat
  ext: 'mjs' | 'cjs' | 'js'
  output: {
    /** e.g: `es` */
    name: string
    /** e.g: `dist/pro-design-vue/es` */
    path: string
  }

  bundle: {
    /** e.g: `pro-design-vue/es` */
    path: string
  }
}

export const buildConfig: Record<Module, BuildInfo> = {
  esm: {
    module: 'ESNext',
    format: 'esm',
    ext: 'mjs',
    output: {
      name: 'es',
      path: path.resolve(pdOutput, 'es'),
    },
    bundle: {
      path: `${PKG_NAME}/es`,
    },
  },
  cjs: {
    module: 'CommonJS',
    format: 'cjs',
    ext: 'js',
    output: {
      name: 'lib',
      path: path.resolve(pdOutput, 'lib'),
    },
    bundle: {
      path: `${PKG_NAME}/lib`,
    },
  },
}
export const buildConfigEntries = Object.entries(buildConfig) as BuildConfigEntries

export type BuildConfig = typeof buildConfig
export type BuildConfigEntries = [Module, BuildInfo][]

export const target = 'es2018'
