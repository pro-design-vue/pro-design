/*
 * @Author: shen
 * @Date: 2025-05-21 09:13:09
 * @LastEditors: shen
 * @LastEditTime: 2025-08-27 13:30:58
 * @Description:
 */
import type { SFCWithInstall } from '@pro-design-vue/utils'

import { withInstall } from '@pro-design-vue/utils'
import Spinner from './src/spinner.vue'

export const ProSpinner: SFCWithInstall<typeof Spinner> = withInstall(Spinner)
export default ProSpinner
