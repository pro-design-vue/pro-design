/*
 * @Author: shen
 * @Date: 2025-05-21 09:13:09
 * @LastEditors: shen
 * @LastEditTime: 2025-08-27 14:47:56
 * @Description:
 */
import type { SFCWithInstall } from '@pro-design-vue/utils'

import { withInstall } from '@pro-design-vue/utils'
import Loading from './src/loading.vue'

export const ProLoading: SFCWithInstall<typeof Loading> = withInstall(Loading)
export default ProLoading
