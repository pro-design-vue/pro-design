/*
 * @Author: shen
 * @Date: 2025-08-27 17:25:46
 * @LastEditors: shen
 * @LastEditTime: 2025-08-28 09:28:27
 * @Description:
 */
import { PKG_NAME, PKG_PREFIX } from '@pro-design-vue/build-constants'

import type { Plugin } from 'rollup'

export function ProDesignAlias(): Plugin {
  const themeChalk = 'theme-chalk'
  const sourceThemeChalk = `${PKG_PREFIX}/${themeChalk}` as const
  const bundleThemeChalk = `${PKG_NAME}/${themeChalk}` as const

  return {
    name: 'pro-design-vue-alias-plugin',
    resolveId(id) {
      if (!id.startsWith(sourceThemeChalk)) return
      return {
        id: id.replaceAll(sourceThemeChalk, bundleThemeChalk),
        external: 'absolute',
      }
    },
  }
}
