/*
 * @Author: shen
 * @Date: 2022-06-08 20:07:35
 * @LastEditors: shen
 * @LastEditTime: 2026-01-14 09:23:54
 * @Description:
 */

import type { InjectionKey } from 'vue'
import type { ProFormInstance } from '@pro-design-vue/utils'
import type { FormStore } from '../hooks/useFormStore'
import type { BaseFormProps } from '../type'
import { inject, provide } from 'vue'

export interface FormContextProps {
  formProps: BaseFormProps
  form: ProFormInstance
  store: FormStore
}
export const FormContextKey: InjectionKey<FormContextProps> = Symbol('FormContext')

export const useProvideForm = (props: FormContextProps) => {
  provide(FormContextKey, props)
}

export const useInjectForm = () => {
  return inject(FormContextKey, {} as FormContextProps)
}
