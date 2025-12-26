/*
 * @Author: shen
 * @Date: 2025-12-05 15:58:11
 * @LastEditors: shen
 * @LastEditTime: 2025-12-12 09:19:42
 * @Description:
 */
import type { SFCWithInstall } from '@pro-design-vue/utils'

import { withInstall, withNoopInstall } from '@pro-design-vue/utils'
import Field from './src/Field'
import FieldText from './src/components/Text'

export const ProField: SFCWithInstall<typeof Field> = withInstall(Field)

export const ProFieldText: SFCWithInstall<typeof FieldText> = withNoopInstall(FieldText)

export default ProField
