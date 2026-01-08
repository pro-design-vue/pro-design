/*
 * @Author: shen
 * @Date: 2025-12-31 15:45:47
 * @LastEditors: shen
 * @LastEditTime: 2026-01-08 17:19:56
 * @Description:
 */
import type { SFCWithInstall } from '@pro-design-vue/utils'

import { withInstall, withNoopInstall } from '@pro-design-vue/utils'
import { FormItem, FormField } from './src/components'
import Form from './src/Form'
export const ProForm: SFCWithInstall<typeof Form> & {
  Item: typeof FormItem
  Field: typeof FormField
} = withInstall(Form, {
  Item: FormItem,
  Field: FormField,
})

export const ProFormItem: SFCWithInstall<typeof FormItem> = withNoopInstall(FormItem)
export const ProFormField: SFCWithInstall<typeof FormField> = withNoopInstall(FormField)

export default ProForm
