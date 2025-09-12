/*
 * @Author: shen
 * @Date: 2025-09-12 09:41:08
 * @LastEditors: shen
 * @LastEditTime: 2025-09-12 09:41:19
 * @Description:
 */
// TODO: delete this file after upgrading vue in root package.json
import { createRequire } from 'node:module'

const _require = createRequire(import.meta.url)
const vitepressPath = _require.resolve('vitepress')

export const vueCompiler = _require(
  _require.resolve('vue/compiler-sfc', { paths: [vitepressPath] }),
)
