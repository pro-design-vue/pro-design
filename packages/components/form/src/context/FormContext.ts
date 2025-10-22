/*
 * @Author: shen
 * @Date: 2022-06-08 20:07:35
 * @LastEditors: shen
 * @LastEditTime: 2025-10-22 10:29:11
 * @Description:
 */

import type { InjectionKey, ComputedRef, ShallowRef, Ref } from 'vue'
import type { RowProps, ColProps } from 'ant-design-vue'
import type {
  ProFormItemType,
  Entity,
  ProFormActionType,
  ReadonlyProps,
  Theme,
  KeyboardEventHandler,
} from '../type'
import type { Linkage } from '../hooks/useLinkage'

import { inject, provide } from 'vue'

export interface FormContextProps extends Linkage {
  action: ProFormActionType
  formKey: Ref<string>
  prefixCls?: string
  mountedRef: Ref<boolean>
  initialValues?: ShallowRef<Entity>
  formData: Ref<Entity>
  hasInitial: Ref<boolean>
  theme: ComputedRef<Theme>
  customUi: ComputedRef<boolean>
  grid?: ComputedRef<boolean>
  readonly?: ComputedRef<boolean>
  readonlyProps?: ComputedRef<ReadonlyProps | undefined>
  rowProps?: ComputedRef<RowProps>
  colProps?: ComputedRef<ColProps>
  labelCol?: ComputedRef<ColProps>
  wrapperCol?: ComputedRef<ColProps>
  gutter?: ComputedRef<number>
  disabled?: ComputedRef<boolean>
  onPressEnter?: KeyboardEventHandler
  formatItems?: (items: ProFormItemType[]) => ProFormItemType[]
}
export const FormContextKey: InjectionKey<FormContextProps> = Symbol('FormContext')

export const useProvideForm = (props: FormContextProps) => {
  provide(FormContextKey, props)
}

export const useInjectForm = () => {
  return inject(FormContextKey, {} as FormContextProps)
}
