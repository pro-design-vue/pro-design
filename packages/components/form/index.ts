/*
 * @Author: shen
 * @Date: 2025-07-04 16:53:48
 * @LastEditors: shen
 * @LastEditTime: 2025-08-27 11:12:48
 * @Description:
 */
import type { ProFormActionType } from './src/type'
import type { SFCWithInstall } from '@pro-design-vue/utils'

import { withInstall, withNoopInstall } from '@pro-design-vue/utils'
import { registerField } from './src/registerField'
import { ProFieldType } from './src/fieldType'
import Form from './src/Form'
import DrawerForm from './src/layouts/DrawerForm'
import ModalForm from './src/layouts/ModalForm'
import QueryFilter from './src/layouts/QueryFilter'
import StepsForm from './src/layouts/StepsForm'
import FieldReadonly from './src/fields/FieldReadonly'
import type {
  ProFormProps,
  ProQueryFilterProps,
  ProStepsFormProps,
  ProDrawerOrModalFormProps,
} from './src/props'

export * from './src/type'
export * from './src/fieldType'

export const ProForm: SFCWithInstall<typeof Form> & {
  Drawer: typeof DrawerForm
  Modal: typeof ModalForm
  Filter: typeof QueryFilter
  Steps: typeof StepsForm
} = withInstall(Form, {
  Drawer: DrawerForm,
  Modal: ModalForm,
  Filter: QueryFilter,
  Steps: StepsForm,
})

export default ProForm
export const ProDrawerForm: SFCWithInstall<typeof DrawerForm> = withNoopInstall(DrawerForm)
export const ProModalForm: SFCWithInstall<typeof ModalForm> = withNoopInstall(ModalForm)
export const ProQueryFilter: SFCWithInstall<typeof QueryFilter> = withNoopInstall(QueryFilter)
export const ProStepsForm: SFCWithInstall<typeof StepsForm> = withNoopInstall(StepsForm)
export { ProFieldType, FieldReadonly as ProFieldReadonly, registerField }
export type { ProFormProps, ProQueryFilterProps, ProStepsFormProps, ProDrawerOrModalFormProps }
export type ProFormInstance = InstanceType<typeof ProForm> & ProFormActionType
export type ProDrawerFormInstance = InstanceType<typeof DrawerForm> & ProFormActionType
export type ProModalFormInstance = InstanceType<typeof ModalForm> & ProFormActionType
export type ProQueryFilterInstance = InstanceType<typeof QueryFilter> & ProFormActionType
