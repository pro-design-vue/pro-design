/*
 * @Author: shen
 * @Date: 2022-11-06 18:05:39
 * @LastEditors: shen
 * @LastEditTime: 2023-11-09 11:28:27
 * @Description:
 */
import { inject, provide } from 'vue'

import type { FinallyColumnType, Key } from '../interface'
import type { Ref, InjectionKey } from 'vue'

export interface BodyRowsContextProps {
  columns: Ref<FinallyColumnType[]>
  columnStartIndex: Ref<number>
}
export const BodyRowsContextKey: InjectionKey<BodyRowsContextProps> = Symbol('BodyRowsContextProps')
export const useProvideBodyRows = (props: BodyRowsContextProps) => {
  provide(BodyRowsContextKey, props)
}
export const useInjectBodyRows = () => {
  return inject(BodyRowsContextKey, {} as BodyRowsContextProps)
}

export interface BodyRowContextProps {
  top: Ref<number>
  height: Ref<number>
  rowKey: Ref<Key>
}
export const BodyRowContextKey: InjectionKey<BodyRowContextProps> = Symbol('BodyRowContextProps')
export const useProvideBodyRow = (props: BodyRowContextProps) => {
  provide(BodyRowContextKey, props)
}
export const useInjectBodyRow = () => {
  return inject(BodyRowContextKey, {} as BodyRowContextProps)
}
