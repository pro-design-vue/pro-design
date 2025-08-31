/*
 * @Author: shen
 * @Date: 2023-11-05 12:12:38
 * @LastEditors: shen
 * @LastEditTime: 2024-01-11 18:05:16
 * @Description:
 */
import { inject, provide } from 'vue'

import type { ComputedRef, InjectionKey, Ref, ShallowRef } from 'vue'
import type { CalType } from '../../hooks/useCal'
import type { UseCellPropsRes } from '../../hooks/useCellProps'
import type { UseColumnsType } from '../../hooks/useColumns'
import type { FilterState } from '../../hooks/useFilter'
import type { FlattenRecordsType } from '../../hooks/useFlattenRecords'
import type { FlattenAllRecordsType } from '../../hooks/useKVMap'
import type { SelectionsRes } from '../../hooks/useRowSelection'
import type { SortState } from '../../hooks/useSorter'
import type {
  ColumnsType,
  DragColumnEventInfo,
  DragRowEventInfo,
  ExpandType,
  GetPopupContainer,
  GetRowKey,
  Key,
  Position,
  SummaryFixed,
  ProTableProps,
  TableLocale,
  TableRowSelection,
  TriggerEventHandler,
} from '../interface'

type PaginationPos = {
  bottom?: 'left' | 'right'
  top?: 'left' | 'right'
}

export interface TableContextProps
  extends CalType,
    UseColumnsType,
    FlattenRecordsType,
    FlattenAllRecordsType,
    UseCellPropsRes {
  rawColumns: Ref<ColumnsType>
  bodyHeight: Ref<number>
  scrollTop: Ref<number>
  scrollLeft: Ref<number>
  rowPosition: Ref<number[]>
  dataRowPosition: Ref<number[]>
  startIndex: Ref<number>
  data: Ref<any[]>
  rawData: ShallowRef<any[]>
  pageData: Ref<any[]>
  props: ProTableProps
  bodyWidth: Ref<number>
  bodyScrollWidth: Ref<number>
  scrollBarSize: Ref<number>
  scrollTo: (pos: number | Position, behavior?: 'auto' | 'smooth', skipAnimate?: boolean) => void
  leftWidth: Ref<number>
  centerWidth: Ref<number>
  rightWidth: Ref<number>
  showVerticalScrollbar: ComputedRef<boolean>
  showHorizontalScrollbar: Ref<boolean>
  getRowKey: ComputedRef<GetRowKey<any>>
  selection: SelectionsRes
  locale: ComputedRef<TableLocale>
  sorterStates: Ref<SortState<any>[]>
  changeSorter: (sortState: SortState<any>) => void
  changeFilter: (filterState: FilterState<any>) => void
  filterStates: Ref<FilterState<any>[]>
  updateSelectedRowKeys: (keys: Key[]) => void
  baseHeight: Ref<number>
  expandedRowKeys: Ref<Set<Key>>
  indentSize: Ref<number>
  onTriggerExpand: TriggerEventHandler<any>
  childrenColumnName: Ref<string>
  expandType: Ref<ExpandType>
  supportSticky: boolean
  mergedRowSelection: Ref<TableRowSelection>
  getPopupContainer: Ref<GetPopupContainer>
  virtual: Ref<boolean>
  xVirtual: Ref<boolean>
  onResizeColumn: ProTableProps['onResizeColumn']
  onRowDragEnd: (opt: DragRowEventInfo) => void
  status: Ref<{
    code: number
  }>
  watermarkMsg: Ref<string>
  useAnimate: Ref<boolean>
  animateRows: ComputedRef<boolean>
  dragRowsHandle: Map<Key, Set<HTMLSpanElement>>
  draggingRowKey: Ref<Key | null>
  insertToRowKey: Ref<Key | null>
  dragColumnsHandle: Map<Key, Set<HTMLDivElement>>
  draggingColumnKey: Ref<Key>
  onColumnDragEnd: (arg: DragColumnEventInfo) => void
  onColumnDrag: (arg: DragColumnEventInfo) => void
  prefixCls: ComputedRef<string>
  columnDrag: ComputedRef<boolean>
  summaryFixed: ComputedRef<SummaryFixed>
  realHeaderHeight: Ref<number>
  bottomPaginationHeight: Ref<number>
  pos: ComputedRef<PaginationPos>
  rootRef: Ref<HTMLDivElement | undefined>
}

export const TableContextKey: InjectionKey<TableContextProps> = Symbol('TableContextProps')

export const useProvideTable = (props: TableContextProps) => {
  provide(TableContextKey, props)
}

export const useInjectTable = () => {
  return inject(TableContextKey, {} as TableContextProps)
}
