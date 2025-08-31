/*
 * @Author: shen
 * @Date: 2025-07-02 16:10:52
 * @LastEditors: shen
 * @LastEditTime: 2025-08-27 10:08:38
 * @Description:
 */
import type { SFCWithInstall } from '@pro-design-vue/utils'

import { withInstall } from '@pro-design-vue/utils'
import Counter from './src/counter.vue'

export const ProCounter: SFCWithInstall<typeof Counter> = withInstall(Counter)
export default ProCounter
