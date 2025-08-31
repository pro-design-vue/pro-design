/*
 * @Author: shen
 * @Date: 2025-05-21 09:13:09
 * @LastEditors: shen
 * @LastEditTime: 2025-08-27 13:20:55
 * @Description:
 */
import { withInstall } from '@pro-design-vue/utils'
import Slot from './src/Slot'
import type { SFCWithInstall } from '@pro-design-vue/utils'

export const ProSlot: SFCWithInstall<typeof Slot> = withInstall(Slot)
export default ProSlot
