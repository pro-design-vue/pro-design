/*
 * @Author: shen
 * @Date: 2026-01-14 10:49:21
 * @LastEditors: shen
 * @LastEditTime: 2026-01-14 11:14:47
 * @Description:
 */
import type { SFCWithInstall } from '@pro-design-vue/utils'

import { withInstall } from '@pro-design-vue/utils'
import LabelTip from './src/LabelTip'

export const ProLabelTip: SFCWithInstall<typeof LabelTip> = withInstall(LabelTip)
export default ProLabelTip
