/*
 * @Author: shen
 * @Date: 2025-06-16 15:21:34
 * @LastEditors: shen
 * @LastEditTime: 2025-08-26 21:30:08
 * @Description:
 */
import type { SFCWithInstall } from '@pro-design-vue/utils'

import { withInstall } from '@pro-design-vue/utils'
import Icon from './src/icon.vue'

export const ProIcon: SFCWithInstall<typeof Icon> = withInstall(Icon)
export default ProIcon
