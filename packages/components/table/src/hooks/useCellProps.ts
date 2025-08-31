/*
 * @Author: shen
 * @Date: 2022-11-05 14:16:25
 * @LastEditors: shen
 * @LastEditTime: 2025-08-29 14:12:40
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

import { shallowRef, watchEffect, isVNode } from 'vue'
import { ExpandColumnKey } from './useColumns'
import { getPathValue, parseStyleText } from '../utils/util'
import { isArray, isObject } from '@pro-design-vue/utils'

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
  customCell: contextCustomCell,
}: UseCellProps): UseCellPropsRes => {
  const allCellProps = shallowRef<Record<string, Record<string, RenderedCell>>>({})
  const hasMultiRowSpanInfo = shallowRef<Record<string, boolean>>({})
  const centerRowColumnsMap = shallowRef<Map<Key, FinallyColumnType[]>>(new Map())

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
    const copyCustomCellProps = Object.assign({}, customCellProps)

    if (customRender) {
      const value = getPathValue(record, dataIndex!)
      const customCellRender: any = customRender({
        text: value,
        value,
        record,
        index: rowIndex,
        column: originColumn as FinallyColumnType,
      })
      if (
        customCellRender &&
        isObject(customCellRender) &&
        !isArray(customCellRender) &&
        !isVNode(customCellRender)
      ) {
        Object.assign(copyCustomCellProps, (customCellRender as any).props || {})
        cellProps.children = (customCellRender as any).children
      } else {
        cellProps.children = customCellRender
      }
    }

    copyCustomCellProps.colSpan = copyCustomCellProps.colSpan ?? 1
    copyCustomCellProps.rowSpan = copyCustomCellProps.rowSpan ?? 1
    const { width } = getColumnPosition(columnIndex, copyCustomCellProps.colSpan)
    Object.assign(mergeCellStyles, { width: `${width}px`, left: left! - offsetLeft + 'px' })
    if (width === 0) {
      mergeCellStyles.display = 'none'
    }
    if (copyCustomCellProps.colSpan > 1) {
      mergeCellStyles.zIndex = 1
    }

    if (copyCustomCellProps.rowSpan > 1) {
      mergeCellStyles.height = `${getRowHeight(rowIndex, copyCustomCellProps.rowSpan) - 1}px`
    }
    cellProps.props = Object.assign({}, copyCustomCellProps, { style: mergeCellStyles })
    return cellProps
  }

  watchEffect(() => {
    const rawAllCellProps: Record<string, Record<string, RenderedCell>> = {}
    const rawRowSpanInfo: Record<string, boolean> = {}
    const genAllCellProps = (
      index: number,
      offsetLeft: number,
      finallyColumns: FinallyColumnType[],
      rowKey: Key,
      rowIndex: number,
      record: any,
      overflow: string,
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
        rawAllCellProps[rowKey]![columnKey] = cellProps
        if (cellProps.props?.rowSpan || 0 > 1) {
          rawRowSpanInfo[rowKey] = true
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
            rawAllCellProps[rowKey]![column.columnKey] = cellProps
            if (cellProps.props?.rowSpan || 0 > 1) {
              rawRowSpanInfo[rowKey] = true
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
    const rowColumnsMap = new Map()
    const len = data.value.length
    for (let i = 0; i < len; i++) {
      if (!data.value[i]) continue
      const { record, isExpandRow, rowKey, rowIndex } = data.value[i]!
      rawAllCellProps[rowKey] = {}
      const overflow: string = mergedRowHeights.value[rowKey] ? 'hidden' : 'initial'
      if (isExpandRow) {
        rawAllCellProps[rowKey][ExpandColumnKey] = {
          props: {
            style: { left: '0px', width: `${bodyWidth.value}px`, zIndex: 1 },
          },
        }
      } else {
        genAllCellProps(0, 0, leftColumns.value, rowKey, rowIndex, record, overflow)
        genAllCellProps(
          0,
          leftWidth.value,
          visibleCenterColumns.value,
          rowKey,
          rowIndex,
          record,
          overflow,
          rowColumnsMap,
        )
        genAllCellProps(
          0,
          leftWidth.value + centerWidth.value,
          rightColumns.value,
          rowKey,
          rowIndex,
          record,
          overflow,
        )
      }
    }
    allCellProps.value = rawAllCellProps
    hasMultiRowSpanInfo.value = rawRowSpanInfo
    centerRowColumnsMap.value = rowColumnsMap
  })

  return { allCellProps, hasMultiRowSpanInfo, centerRowColumnsMap }
}
export default useCellProps
