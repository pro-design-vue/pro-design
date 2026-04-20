/*
 * @Author: shen
 * @Date: 2022-11-05 14:16:25
 * @LastEditors: shen
 * @LastEditTime: 2025-12-01 14:33:05
 * @Description:
 */
import type { Ref, CSSProperties } from 'vue'
import type {
  FinallyColumnType,
  FlatRecord,
  Key,
  RenderedCell,
  ProTableProps,
} from '../components/interface'

import { shallowRef, watch, isVNode, onBeforeUnmount } from 'vue'
import { ExpandColumnKey } from './useColumns'
import { getPathValue, parseStyleText } from '../utils/util'
import { isArray, isObject } from '@pro-design-vue/utils'
import raf from '../utils/raf'

interface UseCellProps {
  leftColumns: Ref<FinallyColumnType[]>
  rightColumns: Ref<FinallyColumnType[]>
  visibleCenterColumns: Ref<FinallyColumnType[]>
  allColumns: Ref<FinallyColumnType[]>
  data: Ref<FlatRecord[]>
  mergedRowHeights: Ref<Record<Key, number>>
  startIndex: Ref<number>
  bodyWidth: Ref<number>
  leftWidth: Ref<number>
  centerWidth: Ref<number>
  cancelEditable: (recordKey: Key) => boolean
  startEditable: (recordKey: Key, recordValue?: any) => boolean
  saveEditable: (recordKey: Key) => Promise<boolean>
  isEditable: (recordKey: Key) => boolean
  getColumnPosition: (
    index: number,
    colSpan?: number,
  ) => {
    width: number
    left: number
    minWidth: number
    maxWidth: number
  }
  getRowHeight: (fromIndex: number, rowSpan?: number) => number
  customCell: Ref<ProTableProps['customCell']>
}
export type UseCellPropsRes = {
  allCellProps: Ref<Record<string, Record<string, RenderedCell>>>
  hasMultiRowSpanInfo: Ref<Record<string, boolean>>
  centerRowColumnsMap: Ref<Map<Key, FinallyColumnType[]>>
}
const useCellProps = ({
  leftColumns,
  rightColumns,
  visibleCenterColumns,
  allColumns,
  data,
  mergedRowHeights,
  getColumnPosition,
  bodyWidth,
  leftWidth,
  centerWidth,
  getRowHeight,
  cancelEditable,
  startEditable,
  saveEditable,
  isEditable,
  customCell: contextCustomCell,
}: UseCellProps): UseCellPropsRes => {
  const allCellProps = shallowRef<Record<string, Record<string, RenderedCell>>>({})
  const hasMultiRowSpanInfo = shallowRef<Record<string, boolean>>({})
  const centerRowColumnsMap = shallowRef<Map<Key, FinallyColumnType[]>>(new Map())

  let cellPropsCache = new Map<Key, Record<string, RenderedCell>>()
  let rowSpanCache = new Map<Key, boolean>()
  let centerColsCache = new Map<Key, FinallyColumnType[]>()
  let forceFullRecalc = true

  const computedCellProps = (
    offsetLeft: number,
    column: FinallyColumnType,
    rowIndex: number,
    record: any,
    overflow: string,
  ) => {
    const { customRender, originColumn, dataIndex, columnIndex, left, customCell } = column
    const cellProps: RenderedCell = {}
    const customCellProps: Record<string, any> =
      (customCell || contextCustomCell.value)?.({ record, rowIndex, column }) ?? {}
    const mergeCellStyles: CSSProperties = Object.assign(
      { overflow },
      parseStyleText(customCellProps.style || {}),
    )

    if (customRender) {
      const value = getPathValue(record, dataIndex!)
      const customCellRender: any = customRender({
        text: value,
        value,
        record,
        index: rowIndex,
        cancelEditable,
        startEditable,
        saveEditable,
        isEditable,
        column: originColumn as FinallyColumnType,
      })
      if (
        customCellRender &&
        isObject(customCellRender) &&
        !isArray(customCellRender) &&
        !isVNode(customCellRender)
      ) {
        Object.assign(customCellProps, (customCellRender as any).props || {})
        cellProps.children = (customCellRender as any).children
      } else {
        cellProps.children = customCellRender
      }
    }

    const colSpan = customCellProps.colSpan ?? 1
    const rowSpan = customCellProps.rowSpan ?? 1
    customCellProps.colSpan = colSpan
    customCellProps.rowSpan = rowSpan
    const { width } = getColumnPosition(columnIndex, colSpan)
    mergeCellStyles.width = `${width}px`
    mergeCellStyles.left = left! - offsetLeft + 'px'
    if (width === 0) {
      mergeCellStyles.display = 'none'
    }
    if (colSpan > 1) {
      mergeCellStyles.zIndex = 1
    }

    if (rowSpan > 1) {
      mergeCellStyles.height = `${getRowHeight(rowIndex, rowSpan) - 1}px`
    }
    customCellProps.style = Object.assign(mergeCellStyles, customCellProps.style)
    cellProps.props = customCellProps
    return cellProps
  }

  const genColumnsCellProps = (
    offsetLeft: number,
    finallyColumns: FinallyColumnType[],
    rowKey: Key,
    rowIndex: number,
    record: any,
    overflow: string,
    cellPropsOut: Record<string, Record<string, RenderedCell>>,
    rowSpanOut: Record<string, boolean>,
    rowColumnsMap?: Map<Key, FinallyColumnType[]>,
  ) => {
    const collen = finallyColumns.length
    let currentColumn: FinallyColumnType | null = null
    let currentColumnIndex = 0
    for (let i = 0; i < collen; i++) {
      const { columnIndex, columnKey } = finallyColumns[i]!
      const cellProps = computedCellProps(
        offsetLeft,
        finallyColumns[i]!,
        rowIndex,
        record,
        overflow,
      )
      cellPropsOut[rowKey]![columnKey] = cellProps
      if (cellProps.props?.rowSpan || 0 > 1) {
        rowSpanOut[rowKey] = true
      }
      if (i === 0 && cellProps.props?.colSpan === 0) {
        currentColumnIndex = columnIndex
      }
    }

    if (currentColumnIndex !== 0) {
      for (let i = currentColumnIndex - 1; i > 0; i--) {
        const column = allColumns.value[i]!
        if (column.fixed) break
        const cellProps = computedCellProps(offsetLeft, column, rowIndex, record, overflow)
        if (cellProps.props?.colSpan !== 0) {
          currentColumn = column
          cellPropsOut[rowKey]![column.columnKey] = cellProps
          if (cellProps.props?.rowSpan || 0 > 1) {
            rowSpanOut[rowKey] = true
          }
          break
        }
      }
    }

    if (currentColumn) {
      const columns = finallyColumns.slice()
      columns.push(currentColumn)
      rowColumnsMap?.set(rowKey, columns)
    } else {
      rowColumnsMap?.set(rowKey, finallyColumns)
    }
  }

  const computeRowCellProps = (
    curLeft: FinallyColumnType[],
    curCenter: FinallyColumnType[],
    curRight: FinallyColumnType[],
    curLeftW: number,
    curCenterW: number,
    curBodyW: number,
    curMergedH: Record<Key, number>,
    rowKey: Key,
    rowIndex: number,
    record: any,
    isExpandRow: boolean | undefined,
    out: Record<string, Record<string, RenderedCell>>,
    spanOut: Record<string, boolean>,
    colMap: Map<Key, FinallyColumnType[]>,
  ) => {
    out[rowKey] = {}
    const overflow: string = curMergedH[rowKey] ? 'hidden' : 'initial'
    if (isExpandRow) {
      out[rowKey][ExpandColumnKey] = {
        props: {
          style: { left: '0px', width: `${curBodyW}px`, zIndex: 1 },
        },
      }
    } else {
      genColumnsCellProps(0, curLeft, rowKey, rowIndex, record, overflow, out, spanOut)
      genColumnsCellProps(curLeftW, curCenter, rowKey, rowIndex, record, overflow, out, spanOut, colMap)
      genColumnsCellProps(curLeftW + curCenterW, curRight, rowKey, rowIndex, record, overflow, out, spanOut)
    }
  }

  const recomputeAllCellProps = () => {
    const rawAllCellProps: Record<string, Record<string, RenderedCell>> = {}
    const rawRowSpanInfo: Record<string, boolean> = {}
    const currentData = data.value
    const curLeft = leftColumns.value
    const curRight = rightColumns.value
    const curCenter = visibleCenterColumns.value
    const curMergedH = mergedRowHeights.value
    const curBodyW = bodyWidth.value
    const curLeftW = leftWidth.value
    const curCenterW = centerWidth.value
    const colMap = new Map<Key, FinallyColumnType[]>()
    const len = currentData.length
    const incremental = !forceFullRecalc

    for (let i = 0; i < len; i++) {
      if (!currentData[i]) continue
      const { record, isExpandRow, rowKey, rowIndex } = currentData[i]!
      if (incremental) {
        const cached = cellPropsCache.get(rowKey)
        if (cached) {
          rawAllCellProps[rowKey] = cached
          if (rowSpanCache.get(rowKey)) rawRowSpanInfo[rowKey] = true
          const cachedCols = centerColsCache.get(rowKey)
          if (cachedCols) colMap.set(rowKey, cachedCols)
          continue
        }
      }
      computeRowCellProps(
        curLeft, curCenter, curRight,
        curLeftW, curCenterW, curBodyW,
        curMergedH, rowKey, rowIndex, record, isExpandRow,
        rawAllCellProps, rawRowSpanInfo, colMap,
      )
    }

    cellPropsCache = new Map()
    rowSpanCache = new Map()
    centerColsCache = new Map()
    for (const key of Object.keys(rawAllCellProps)) {
      cellPropsCache.set(key, rawAllCellProps[key]!)
      if (rawRowSpanInfo[key]) rowSpanCache.set(key, true)
    }
    colMap.forEach((v, k) => centerColsCache.set(k, v))

    forceFullRecalc = false
    allCellProps.value = rawAllCellProps
    hasMultiRowSpanInfo.value = rawRowSpanInfo
    centerRowColumnsMap.value = colMap
  }

  let rafHandle: any

  watch(
    [leftColumns, rightColumns, visibleCenterColumns, mergedRowHeights, bodyWidth, leftWidth, centerWidth, contextCustomCell],
    () => {
      forceFullRecalc = true
      raf.cancel(rafHandle)
      rafHandle = raf(recomputeAllCellProps)
    },
  )

  watch(
    data,
    () => {
      raf.cancel(rafHandle)
      rafHandle = raf(recomputeAllCellProps)
    },
    { immediate: true },
  )

  onBeforeUnmount(() => {
    raf.cancel(rafHandle)
  })

  return { allCellProps, hasMultiRowSpanInfo, centerRowColumnsMap }
}
export default useCellProps
