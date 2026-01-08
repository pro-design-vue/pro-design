/*
 * @Author: shen
 * @Date: 2022-06-08 20:07:35
 * @LastEditors: shen
 * @LastEditTime: 2025-07-18 13:21:20
 * @Description:
 */
import type { ComputedRef, InjectionKey } from 'vue'
import type { Entity, NamePath } from '../type'

import { inject, provide } from 'vue'

export interface FormListContextProps {
  isList: boolean
  fieldKey: number
  originName?: NamePath
  index?: ComputedRef<number>
  listName?: ComputedRef<(string | number)[]>
  listKey?: string
  rowData: ComputedRef<Entity>
}

export const FormListContextKey: InjectionKey<FormListContextProps> = Symbol('FormListContext')

export const useProvideFormList = (props: FormListContextProps) => {
  provide(FormListContextKey, props)
}

export const useInjectFormList = () => {
  return inject(FormListContextKey, {} as FormListContextProps)
}
