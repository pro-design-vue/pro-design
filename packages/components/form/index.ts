/*
 * @Author: shen
 * @Date: 2025-12-31 15:45:47
 * @LastEditors: shen
 * @LastEditTime: 2026-01-16 16:53:29
 * @Description:
 */
import type { SFCWithInstall } from '@pro-design-vue/utils'

import { withInstall, withNoopInstall } from '@pro-design-vue/utils'
import { FormItem, Field, Group, FieldSet } from './src/components'
import Form from './src/Form'
export const ProForm: SFCWithInstall<typeof Form> & {
  Item: typeof FormItem
  Field: typeof Field
  Group: typeof Group
} = withInstall(Form, {
  Item: FormItem,
  Field: Field,
  Group: Group,
})

export const ProFormItem: SFCWithInstall<typeof FormItem> = withNoopInstall(FormItem)
export const ProFormField: SFCWithInstall<typeof Field> = withNoopInstall(Field)
export const ProFormGroup: SFCWithInstall<typeof Group> = withNoopInstall(Group)
export const ProFormFieldSet: SFCWithInstall<typeof FieldSet> = withNoopInstall(FieldSet)

export default ProForm
