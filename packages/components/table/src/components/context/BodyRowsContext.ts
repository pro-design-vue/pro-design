/*
 * @Author: shen
 * @Date: 2022-11-06 18:05:39
 * @LastEditors: shen
 * @LastEditTime: 2023-11-09 11:28:27
 * @Description:
 */
import { inject, provide } from 'vue'

import type { FinallyColumnType, Key, ExpandIconType } from '../interface'
import type { Ref, InjectionKey, ComputedRef, ShallowRef } from 'vue'
import type { TableContextProps } from './TableContext'
import type { BodyContextProps } from './BodyContext'
import type { ContextSlots } from './TableSlotsContext'
import type ResizeObserver from 'resize-observer-polyfill'

export interface BodyRowsContextProps {
  columns: Ref<FinallyColumnType[]>
  columnStartIndex: Ref<number>
  nestExpandable: ComputedRef<boolean>
  expandIconColumnIndex: ComputedRef<number>
  indentSize: ComputedRef<number>
  expandIconType: ComputedRef<ExpandIconType>
  xVirtual: ComputedRef<boolean>
  cellClass: Record<string, boolean>
  popupContainer: ComputedRef<HTMLDivElement | null>
  rowSelectionType: ComputedRef<string | undefined>
  sharedResizeObserver: ShallowRef<ResizeObserver | undefined>
  tableContext: TableContextProps
  tableSlotsContext: ContextSlots
  bodyContext: BodyContextProps
  level: number | undefined
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
