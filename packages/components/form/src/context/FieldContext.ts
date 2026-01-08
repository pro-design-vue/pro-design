/*
 * @Author: shen
 * @Date: 2026-01-06 16:38:46
 * @LastEditors: shen
 * @LastEditTime: 2026-01-08 10:39:18
 * @Description:
 */
import type { NamePath } from '@pro-design-vue/components/form11'
import type { FieldProps, ProFormGroupProps } from '../type'
import type {
  ProFieldProps,
  ProFieldValueType,
  ProFormInstance,
  SearchTransformKeyFn,
} from '@pro-design-vue/utils'
import type { FormItemProps } from 'ant-design-vue'
import { inject, provide, type ComputedRef, type InjectionKey } from 'vue'
import type { FormStore } from '../hooks/useFormStore'

export type FieldContextProps = {
  form: ProFormInstance
  store: FormStore
  fieldProps?: ComputedRef<FieldProps>
  proFieldProps?: ComputedRef<ProFieldProps>
  formItemProps?: ComputedRef<FormItemProps>
  groupProps?: ComputedRef<ProFormGroupProps>
  setFieldValueType?: (
    name: NamePath,
    obj: {
      valueType?: ProFieldValueType
      dateFormat?: string
      /** 数据转化的地方 */
      transform?: SearchTransformKeyFn
    },
  ) => void
  /** Form 组件的类型 */
  formComponentType?: ComputedRef<string>
  // /** 获取表单实例计数器 */
  formKey?: ComputedRef<string>
  grid?: ComputedRef<boolean>
  /** 表单的 getPopupContainer 控制 */
  getPopupContainer?: ComputedRef<((e: HTMLElement) => ParentNode) | undefined>
}
export const FieldContextKey: InjectionKey<FieldContextProps> = Symbol('FieldContext')

export const useProvideField = (props: FieldContextProps) => {
  provide(FieldContextKey, props)
}

export const useInjectField = () => {
  return inject(FieldContextKey, {} as FieldContextProps)
}
