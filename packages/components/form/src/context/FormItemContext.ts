/*
 * @Author: shen
 * @Date: 2026-01-05 13:44:15
 * @LastEditors: shen
 * @LastEditTime: 2026-01-08 10:22:09
 * @Description:
 */
import type { ProVNode } from '@pro-design-vue/utils'
import type { NamePath } from 'ant-design-vue/es/form/interface'
import { inject, provide, type ComputedRef, type InjectionKey } from 'vue'

export interface FormItemContextProps {
  name?: ComputedRef<NamePath>
  label?: ComputedRef<ProVNode>
}

export const FormItemContextKey: InjectionKey<FormItemContextProps> = Symbol('FormItemContext')

export const useProvideFormItem = (props: FormItemContextProps) => {
  provide(FormItemContextKey, props)
}

export const useInjectFormItem = () => {
  return inject(FormItemContextKey, {} as FormItemContextProps)
}
