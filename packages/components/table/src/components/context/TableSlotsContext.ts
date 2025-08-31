/*
 * @Author: shen
 * @Date: 2022-04-08 16:18:07
 * @LastEditors: shen
 * @LastEditTime: 2024-03-13 11:18:22
 * @Description:
 */

import { provide, reactive, watch, defineComponent, inject } from 'vue'
import { objectToEmpty } from '../../utils/util'

import type { InjectionKey, PropType } from 'vue'
import type {
  CellEditorArgs,
  CellRenderArgs,
  ColumnDragGhostArg,
  ColumnType,
  ContextmenuPopupArg,
  DefaultRecordType,
  ExpandedRowRender,
  MenuPopupArg,
  RowDragGhostArg,
} from '../interface'

export type ContextSlots = {
  emptyText?: () => any
  expandIcon?: (...args: any[]) => any
  title?: () => any
  footer?: () => any
  summary?: (...args: any[]) => any
  bodyCell?: (args: CellRenderArgs) => any
  headerCell?: (opt: { title: any; column: ColumnType }) => any
  headerCellPopover?: (opt: { title: any; column: ColumnType }) => any
  customFilterIcon?: (...args: any[]) => any
  customFilterDropdown?: (...args: any[]) => any
  tooltipTitle?: (args: CellRenderArgs) => any
  rowDragGhost?: (arg: RowDragGhostArg<DefaultRecordType, ColumnType>) => any
  columnDragGhost?: (arg: ColumnDragGhostArg<ColumnType>) => any
  contextmenuPopup?: (arg: ContextmenuPopupArg<DefaultRecordType, ColumnType>) => any
  menuPopup?: (arg: MenuPopupArg<ColumnType>) => any
  menuIcon?: (arg: { column: ColumnType; filtered: boolean }) => any
  cellEditor?: (arg: CellEditorArgs) => any
  expandedRowRender?: ExpandedRowRender<DefaultRecordType>
  [key: string]: ((...args: any[]) => any) | undefined
}

export const ContextKey: InjectionKey<ContextSlots> = Symbol('TableSlotsContext')

export const useInjectSlots = () => {
  return inject(ContextKey, {} as ContextSlots)
}

export default defineComponent({
  name: 'TableSlotsContextProvider',
  inheritAttrs: false,
  props: {
    value: Object as PropType<ContextSlots>,
  },
  setup(props, { slots }) {
    const currentValue = reactive<ContextSlots>({})

    watch(
      () => props.value,
      () => {
        objectToEmpty(currentValue)
        Object.assign(currentValue, props.value)
      },
      { immediate: true },
    )

    provide(ContextKey, currentValue)

    return () => slots.default?.()
  },
})
