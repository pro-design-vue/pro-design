/*
 * @Author: shen
 * @Date: 2023-11-02 09:24:16
 * @LastEditors: shen
 * @LastEditTime: 2023-11-16 15:27:47
 * @Description:
 */
import type { Ref } from 'vue'
import type {
  ColumnGroupType,
  ColumnType,
  DefaultRecordType,
  FinallyColumnType,
  Key,
} from '../components/interface'
export type RowPinned = 'top' | 'bottom' | null
export interface CellRangesItem {
  startRow: {
    rowIndex: number
    rowPinned: RowPinned
  }
  endRow: {
    rowIndex: number
    rowPinned: RowPinned
  }
  columns: FinallyColumnType[]
  startColumn: FinallyColumnType
}
export interface SelectedRangeItem {
  startColumn: ColumnType<DefaultRecordType> | ColumnGroupType<DefaultRecordType>
  startRow: {
    rowIndex: number
    recordIndexs: number[]
  }
  endRow: {
    rowIndex: number
    recordIndexs: number[]
  }
  columns: (ColumnType<DefaultRecordType> | ColumnGroupType<DefaultRecordType>)[]
  flattenData: DefaultRecordType[]
}
export type Row = {
  rowIndex: number
  rowPinned: RowPinned
}
export type RangeCell = {
  rowIndex: number
  rowPinned: RowPinned
  column?: FinallyColumnType
}
export interface AppendCellRange {
  columnsKey?: Key[]
  columnStartKey?: Key
  columnEndKey?: Key
  rowStartIndex?: number
  rowEndIndex?: number
}
export interface CustomMouseEvent extends MouseEvent {
  cellInfo: {
    cellPosition: RangeCell
    cellTarget: EventTarget
    level: number
  }
}
export interface InnerKeydownPayload {
  cellPosition: RangeCell
  isEditing: boolean
}
export interface KeydownPayload {
  cellPosition: {
    rowIndex: number
    column: ColumnType
  }
  isEditing: boolean
}
export interface AutoScrollParams {
  scrollContainer: Ref<HTMLDivElement | undefined>
  scrollAxis: string | string[]
  scrollByTick?: Ref<number>
  onScrollCallback?: () => void
  getVerticalPosition: () => number
  setVerticalPosition: (pos: number) => void
  getHorizontalPosition: () => number
  setHorizontalPosition: (pos: number) => void
  showVerticalScrollbar: Ref<boolean>
  showHorizontalScrollbar: Ref<boolean>
}
export interface FormatRangeCellTextParams {
  record: DefaultRecordType
  column: ColumnType<DefaultRecordType> | ColumnGroupType<DefaultRecordType>
  index: number
  recordIndexs: number[]
  key: Key
  value: any
}
