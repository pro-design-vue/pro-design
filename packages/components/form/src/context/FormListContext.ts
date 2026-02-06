/*
 * @Author: shen
 * @Date: 2026-01-06 16:38:46
 * @LastEditors: shen
 * @LastEditTime: 2026-02-05 14:39:01
 * @Description:
 */
import { inject, provide, type ComputedRef, type InjectionKey } from 'vue'

export interface FormListContextProps {
  listName: ComputedRef<any>
  name: ComputedRef<any>
  key: ComputedRef<any>
}

export const FormListContextKey: InjectionKey<FormListContextProps> = Symbol('FormListContext')

export const useProvideFormList = (props: FormListContextProps) => {
  provide(FormListContextKey, props)
}

export const useInjectFormList = () => {
  return inject(FormListContextKey, {} as FormListContextProps)
}
