/*
 * @Author: shen
 * @Date: 2025-12-05 15:58:11
 * @LastEditors: shen
 * @LastEditTime: 2026-01-05 13:54:57
 * @Description:
 */
import type { SFCWithInstall } from '@pro-design-vue/utils'

import { withInstall, withNoopInstall } from '@pro-design-vue/utils'
import Field from './src/Field'
import FieldText from './src/components/Text'
export * from './src/type'

export const ProField: SFCWithInstall<typeof Field> = withInstall(Field)

export const ProFieldText: SFCWithInstall<typeof FieldText> = withNoopInstall(FieldText)

export default ProField
