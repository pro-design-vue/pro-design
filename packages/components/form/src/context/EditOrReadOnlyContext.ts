/*
 * @Author: shen
 * @Date: 2026-01-05 13:44:15
 * @LastEditors: shen
 * @LastEditTime: 2026-01-05 13:46:32
 * @Description:
 */
import { inject, provide, type ComputedRef, type InjectionKey } from 'vue'

export interface EditOrReadOnlyContextProps {
  mode?: ComputedRef<'edit' | 'read' | 'update'>
}

export const EditOrReadOnlyContextKey: InjectionKey<EditOrReadOnlyContextProps> =
  Symbol('EditOrReadOnlyContext')

export const useProvideFormEditOrReadOnly = (props: EditOrReadOnlyContextProps) => {
  provide(EditOrReadOnlyContextKey, props)
}

export const useInjectFormEditOrReadOnly = () => {
  return inject(EditOrReadOnlyContextKey, {} as EditOrReadOnlyContextProps)
}
