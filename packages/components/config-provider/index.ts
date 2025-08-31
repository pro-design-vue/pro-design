/*
 * @Author: shen
 * @Date: 2025-05-21 09:13:09
 * @LastEditors: shen
 * @LastEditTime: 2025-08-26 17:19:47
 * @Description:
 */
import type { SFCWithInstall } from '@pro-design-vue/utils'

import { withInstall } from '@pro-design-vue/utils'
import ConfigProvider from './src/config-provider.vue'

export const ProConfigProvider: SFCWithInstall<typeof ConfigProvider> = withInstall(ConfigProvider)
export default ProConfigProvider

export * from './src/typing'
export * from './src/intl'
export * from './src/constants'
export * from './src/context'
export * from './src/useIntl'
