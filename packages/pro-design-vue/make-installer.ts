/*
 * @Author: shen
 * @Date: 2025-08-26 21:19:07
 * @LastEditors: shen
 * @LastEditTime: 2025-08-31 17:46:54
 * @Description:
 */
import { INSTALLED_KEY } from '@pro-design-vue/constants'
import { version } from './version'

import type { App, Plugin } from 'vue'

export const makeInstaller = (components: Plugin[] = []) => {
  const install = (app: App) => {
    if (app[INSTALLED_KEY]) return
    app[INSTALLED_KEY] = true
    components.forEach((c) => app.use(c))
  }

  return {
    install,
    version,
  }
}
