/*
 * @Author: shen
 * @Date: 2025-06-23 16:43:18
 * @LastEditors: shen
 * @LastEditTime: 2025-08-27 13:30:15
 * @Description:
 */
import { withInstall } from '@pro-design-vue/utils'
import Page from './src/page.vue'
import type { SFCWithInstall } from '@pro-design-vue/utils'

export const ProPage: SFCWithInstall<typeof Page> = withInstall(Page)
export default ProPage
