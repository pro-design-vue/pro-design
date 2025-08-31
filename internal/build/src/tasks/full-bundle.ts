/*
 * @Author: shen
 * @Date: 2025-08-27 17:25:20
 * @LastEditors: shen
 * @LastEditTime: 2025-08-29 14:51:52
 * @Description:
 */
import path from 'path'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import { rollup } from 'rollup'
import replace from '@rollup/plugin-replace'
import commonjs from '@rollup/plugin-commonjs'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import esbuild, { minify as minifyPlugin } from 'rollup-plugin-esbuild'
import { parallel } from 'gulp'
import { PKG_BRAND_NAME, PKG_CAMELCASE_NAME } from '@pro-design-vue/build-constants'
import { pdOutput, pdRoot } from '@pro-design-vue/build-utils'
// import { version } from '../../../../packages/pro-design-vue/version'
import { ProDesignAlias } from '../plugins/pro-design-vue-alias'
import { formatBundleFilename, generateExternal, withTaskName, writeBundles } from '../utils'
import { target } from '../build-info'

import type { TaskFunction } from 'gulp'
import type { Plugin } from 'rollup'

// const banner = `/*! ${PKG_BRAND_NAME} v${version} */\n`
const banner = `/*! ${PKG_BRAND_NAME} v1.0.0 */\n`

async function buildFullEntry(minify: boolean) {
  const plugins: Plugin[] = [
    ProDesignAlias(),
    vue(),
    vueJsx(),
    nodeResolve({
      extensions: ['.mjs', '.js', '.json', '.ts'],
    }),
    commonjs(),
    esbuild({
      exclude: [],
      sourceMap: minify,
      target,
      loaders: {
        '.vue': 'ts',
      },
      define: {
        'import.meta.env.NODE_ENV': JSON.stringify('production'),
      },
      treeShaking: true,
      legalComments: 'eof',
    }),
    replace({
      'import.meta.env.NODE_ENV': JSON.stringify('production'),
    }),
  ]
  if (minify) {
    plugins.push(
      minifyPlugin({
        target,
        sourceMap: true,
      }),
    )
  }

  const bundle = await rollup({
    input: path.resolve(pdRoot, 'index.ts'),
    plugins,
    external: await generateExternal({ full: true }),
    treeshake: true,
  })
  await writeBundles(bundle, [
    {
      format: 'umd',
      file: path.resolve(pdOutput, 'dist', formatBundleFilename('index.full', minify, 'js')),
      exports: 'named',
      name: PKG_CAMELCASE_NAME,
      globals: {
        vue: 'Vue',
        'ant-design-vue/es': 'AntDesignVue',
      },
      sourcemap: minify,
      banner,
    },
    {
      format: 'esm',
      file: path.resolve(pdOutput, 'dist', formatBundleFilename('index.full', minify, 'mjs')),
      sourcemap: minify,
      banner,
    },
  ])
}

export const buildFull = (minify: boolean) => async () => Promise.all([buildFullEntry(minify)])

export const buildFullBundle: TaskFunction = parallel(
  withTaskName('buildFullMinified', buildFull(true)),
  withTaskName('buildFull', buildFull(false)),
)
