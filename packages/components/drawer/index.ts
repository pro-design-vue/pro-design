/*
 * @Author: shen
 * @Date: 2025-06-23 16:43:18
 * @LastEditors: shen
 * @LastEditTime: 2025-08-27 10:26:13
 * @Description:
 */
import type { SFCWithInstall } from '@pro-design-vue/utils'
import type { Props } from './src/drawer.vue'
import { withInstall } from '@pro-design-vue/utils'
import Drawer from './src/drawer.vue'

export const ProDrawer: SFCWithInstall<typeof Drawer> = withInstall(Drawer)
export type { Props as ProDrawerProps }
export default ProDrawer
