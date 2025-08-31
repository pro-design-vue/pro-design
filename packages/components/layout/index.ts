/*
 * @Author: shen
 * @Date: 2025-05-21 09:13:09
 * @LastEditors: shen
 * @LastEditTime: 2025-08-27 11:23:21
 * @Description:
 */
import type { SFCWithInstall } from '@pro-design-vue/utils'

import { withInstall } from '@pro-design-vue/utils'
import Layout from './src/layout.vue'

export const ProLayout: SFCWithInstall<typeof Layout> = withInstall(Layout)
export default ProLayout

export * from './src/typing'
export * from './src/context'
