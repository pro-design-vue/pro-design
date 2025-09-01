/*
 * @Author: shen
 * @Date: 2022-11-04 16:42:09
 * @LastEditors: shen
 * @LastEditTime: 2025-09-01 11:00:18
 * @Description:
 */
import type {
  ColumnsType,
  ProTableProps,
  ExpandType,
  FinallyColumnType,
  Key,
  HeaderCellType,
  StickyOffsets,
  ColumnType,
  FixedType,
} from '../components/interface'
import type { RangeCell } from './RangeInterface'
import type { ComputedRef, Ref, ShallowRef } from 'vue'

import { shallowRef, watchEffect, computed, watch, ref } from 'vue'
import { getColumnPos } from '../utils/util'
import { X_BUFF } from '../utils/constant'
import useColumnWidthByString from './useColumnWidthByString'
import eagerComputed from '../utils/eagerComputed'
import supportSticky from '../utils/supportSticky'
import searchColumns from '../utils/searchColumns'
import devWarning from '../utils/devWarning'

export const CheckboxColumnKey = '__Internal__Checkbox__Columnkey'
export const ExpandColumnKey = '__Internal__Expand__Columnkey'
export interface UseColumnsType {
  leftColumns: ShallowRef<FinallyColumnType[]>
  rightColumns: ShallowRef<FinallyColumnType[]>
  centerColumns: ShallowRef<FinallyColumnType[]>
  allColumns: ShallowRef<FinallyColumnType[]>
  visibleCenterColumns: ShallowRef<FinallyColumnType[]>
  visibleCenterHeaderColumns: ShallowRef<FinallyColumnType[]>
  leftWidth: Ref<number>
  rightWidth: Ref<number>
  centerWidth: Ref<number>
  bodyMaxWidth: ComputedRef<number>
  leftHeaderColumns: ShallowRef<FinallyColumnType[]>
  rightHeaderColumns: ShallowRef<FinallyColumnType[]>
  centerHeaderColumns: ShallowRef<FinallyColumnType[]>
  maxRowSpan: Ref<number>
  headerHeight: ShallowRef<number[]>
  maxHeaderHeight: Ref<number>
  getColumnPosition: (
    _index: number,
    _colSpan?: number,
  ) => {
    width: number
    left: number
    minWidth: number
    maxWidth: number
  }
  getColumnPositionByKey: (_key: Key) =>
    | {
        width: number
        left: number
        minWidth: number
        maxWidth: number
      }
    | undefined
  columnKeyIndexMap: ShallowRef<Record<string, number>>
  expandIconColumnIndex: Ref<number>
  columnRowsForAutoHeaderHeight: ShallowRef<HeaderCellType[][]>
  stickyOffsets: ShallowRef<StickyOffsets>
}
export const defaultMinWidth = 50

function parseColumnFixed(column: ColumnType) {
  return column?.fixed === true ? 'left' : column?.fixed
}

const getAutoHeaderHeight = (allHeaderColumns: FinallyColumnType[]) => {
  const autoHeaderHeight: HeaderCellType[][] = []
  const parseColumns = (columns: FinallyColumnType[], colStart: number, autoHeightIndex = 0) => {
    autoHeaderHeight[autoHeightIndex] = autoHeaderHeight[autoHeightIndex] || []
    let innerColStart = colStart
    return columns.filter(Boolean).map((column: FinallyColumnType) => {
      const cell: HeaderCellType = { key: column.columnKey, column, colStart: innerColStart }
      let colSpan = 1
      const children = column.children
      if (children && children.length > 0) {
        colSpan = parseColumns(children, innerColStart, autoHeightIndex + 1).reduce(
          (pre, cur) => pre + cur,
          0,
        )
        cell.hasSubColumns = true
      }
      if ('rowSpan' in column) {
        cell.rowSpan = column.rowSpan
      }
      cell.colSpan = colSpan
      cell.colEnd = cell.colStart! + colSpan - 1
      autoHeaderHeight[autoHeightIndex]?.push(cell)
      innerColStart += colSpan
      return colSpan
    })
  }
  parseColumns(allHeaderColumns, 0)
  const len = autoHeaderHeight.length
  for (let i = 0; i < len; i += 1) {
    autoHeaderHeight[i]?.forEach((cell: HeaderCellType) => {
      if (!('rowSpan' in cell || cell.hasSubColumns)) {
        cell.rowSpan = len - i
      }
    })
  }
  return autoHeaderHeight
}

export default function useColumns({
  props,
  rawColumns,
  bodyScrollWidth,
  baseHeight,
  measureWidthRef,
  expandType,
  expandable,
  scrollLeft,
  bodyWidth,
  xVirtual,
  draggingColumnKey,
  latestRangeStartCell,
}: {
  props: ProTableProps
  rawColumns: Ref<ColumnsType>
  bodyScrollWidth: Ref<number>
  baseHeight: Ref<number>
  measureWidthRef: Ref<any>
  expandable: Ref<boolean>
  rowExpandable?: Ref<(_record: any) => boolean>
  direction?: Ref<'ltr' | 'rtl'>
  expandType: Ref<ExpandType>
  scrollLeft: Ref<number>
  bodyWidth: Ref<number>
  xVirtual: Ref<boolean>
  draggingColumnKey: Ref<Key>
  latestRangeStartCell: ShallowRef<RangeCell | null>
}): UseColumnsType {
  const leftColumns = shallowRef<FinallyColumnType[]>([])
  const rightColumns = shallowRef<FinallyColumnType[]>([])
  const centerColumns = shallowRef<FinallyColumnType[]>([])

  const autoHeightColumns = shallowRef<FinallyColumnType[]>([])

  const leftHeaderColumns = shallowRef<FinallyColumnType[]>([])
  const rightHeaderColumns = shallowRef<FinallyColumnType[]>([])
  const centerHeaderColumns = shallowRef<FinallyColumnType[]>([])

  const maxRowSpan = shallowRef<number>(1)
  const headerHeight = shallowRef<number[]>([])
  const keyColumnMap = shallowRef<Map<Key, FinallyColumnType>>(new Map())
  const maxHeaderHeight = shallowRef<number>(0)

  watchEffect(() => {
    maxHeaderHeight.value = headerHeight.value.reduce((pre, current) => pre + current, 0)
  })

  const columnWidthByString = useColumnWidthByString()

  const mergeColumns = shallowRef<ColumnsType>([])
  const mergeRowSelection = computed(() => {
    const rowSelection = props.rowSelection || {}
    const { checkStrictly = true, fixed } = rowSelection
    return { ...rowSelection, checkStrictly, fixed: fixed === true ? 'left' : fixed }
  })

  const expandIconColumnIndex = eagerComputed<number>(() => {
    if (expandType.value === 'nest' && props.expandIconColumnIndex === undefined) {
      return props.rowSelection ? 1 : 0
    } else if (props.expandIconColumnIndex! > 0 && props.rowSelection) {
      return props.expandIconColumnIndex! - 1
    }
    return props.expandIconColumnIndex!
  })

  watchEffect(() => {
    let newColumns = rawColumns.value.slice()
    if (expandable.value) {
      const expandColumnIndex = expandIconColumnIndex.value || 0
      const expandColumn = rawColumns.value[expandColumnIndex]
      const expandColumnWidth = props.expandColumnWidth || 48
      const expandFixed = props.expandFixed === true ? 'left' : props.expandFixed
      let parsedExpandFixed: any
      if (expandFixed !== 'left' || expandIconColumnIndex.value) {
        if (expandFixed === 'right' && expandIconColumnIndex.value === rawColumns.value.length) {
          parsedExpandFixed = 'right'
        } else {
          parsedExpandFixed = parseColumnFixed(expandColumn!)
        }
      } else {
        parsedExpandFixed = 'left'
      }
      const newExpandColumn = {
        title: '',
        fixed: parsedExpandFixed,
        width: expandColumnWidth,
        minWidth: expandColumnWidth,
        maxWidth: expandColumnWidth,
        columnKey: ExpandColumnKey,
        type: 'expand',
        finallyWidth: expandColumnWidth,
        __Internal__Column__: true,
      }
      if (expandColumnIndex >= 0) {
        newColumns.splice(expandColumnIndex, 0, newExpandColumn)
      }
    }
    if (props.rowSelection) {
      const { columnWidth = 48, fixed, columnTitle } = mergeRowSelection.value
      const rowSelectionColumn = {
        width: columnWidth,
        minWidth: columnWidth,
        maxWidth: columnWidth,
        finallyWidth: columnWidth,
        title: columnTitle,
        type: 'checkbox',
        columnKey: CheckboxColumnKey,
        __Internal__Column__: true,
      }
      if (expandType.value === 'row' && newColumns.length && !expandIconColumnIndex.value) {
        const [firstColumn, ...rest] = newColumns
        const fixedValue = fixed || parseColumnFixed(rest[0]!)
        if (fixedValue) {
          firstColumn!.fixed = fixedValue as FixedType
        }
        newColumns = [
          firstColumn!,
          { ...(rowSelectionColumn as ColumnType), fixed: fixedValue as FixedType },
          ...rest,
        ]
      } else {
        newColumns = [
          {
            ...(rowSelectionColumn as ColumnType),
            fixed: (fixed || parseColumnFixed(newColumns[0]!)) as FixedType,
          },
          ...newColumns,
        ]
      }
    }
    if (!newColumns.length) {
      newColumns = [{ customRender: () => null }]
    }
    mergeColumns.value = newColumns
  })

  watch(
    [mergeColumns, baseHeight, bodyScrollWidth, measureWidthRef],
    () => {
      const originMergeColumns = mergeColumns.value
      let newMaxRowSpan = 1
      const newLeftColumns: FinallyColumnType[] = []
      const newRightColumns: FinallyColumnType[] = []
      const newCenterColumns: FinallyColumnType[] = []
      const newAutoHeightColumns: FinallyColumnType[] = []
      const newLeftHeaderColumns: FinallyColumnType[] = []
      const newRightHeaderColumns: FinallyColumnType[] = []
      const newCenterHeaderColumns: FinallyColumnType[] = []
      keyColumnMap.value = new Map()
      if (!measureWidthRef.value) {
        return
      }
      const autoWidthColumns: FinallyColumnType[] = []
      let finallyWidthTotal = 0
      const genColumns = (
        allCols: ColumnsType,
        leftHeaderCols: FinallyColumnType[],
        centerHeaderCols: FinallyColumnType[],
        rightHeaderCols: FinallyColumnType[],
        rowSpan: number,
        pos: string,
        fix?: FixedType,
      ) => {
        for (let i = 0, len = allCols.length; i < len; i++) {
          const originColumn = allCols[i] as FinallyColumnType
          if (!originColumn) {
            continue
          }
          const {
            width,
            fixed = fix,
            children,
            ellipsis = false,
            tooltip,
            minWidth,
            maxWidth,
          } = originColumn
          const columnWidth = columnWidthByString(
            measureWidthRef.value,
            bodyScrollWidth.value,
            width,
          )
          const columnMinWidth = columnWidthByString(
            measureWidthRef.value,
            bodyScrollWidth.value,
            minWidth,
          )
          const columnMaxWidth = maxWidth
            ? columnWidthByString(measureWidthRef.value, bodyScrollWidth.value, maxWidth)
            : 1 / 0
          const finallyWidth = Math.min(Math.max(columnWidth, columnMinWidth), columnMaxWidth)
          const columnPos = getColumnPos(i, pos)
          const columnKey = originColumn.columnKey || originColumn.key || columnPos
          const parseFiexed = fixed === true ? 'left' : fixed
          const finallyColumn = Object.assign({}, originColumn, {
            finallyWidth,
            columnKey,
            originColumn,
            showTitle:
              !tooltip &&
              (ellipsis === true ||
                (typeof ellipsis === 'object' && ellipsis?.showTitle !== false)),
            fixed: parseFiexed,
            hidden: true === originColumn.hidden,
          })
          keyColumnMap.value.set(columnKey, finallyColumn)
          if (finallyColumn.hidden) {
            break
          }
          if (children && children.length) {
            finallyColumn.children = []
            if (parseFiexed === 'left') {
              leftHeaderCols.push(finallyColumn)
            } else if (parseFiexed === 'right') {
              rightHeaderCols.push(finallyColumn)
            } else {
              centerHeaderCols.push(finallyColumn)
            }
            newMaxRowSpan = Math.max(newMaxRowSpan, rowSpan + 1)
            genColumns(
              children,
              finallyColumn.children,
              finallyColumn.children,
              finallyColumn.children,
              rowSpan + 1,
              columnPos,
              parseFiexed,
            )
          } else {
            if (finallyColumn.width === undefined) {
              autoWidthColumns.push(finallyColumn)
            }
            finallyWidthTotal += finallyColumn.finallyWidth
            if (parseFiexed === 'left') {
              newLeftColumns.push(finallyColumn)
              leftHeaderCols.push(finallyColumn)
            } else if (parseFiexed === 'right') {
              newRightColumns.push(finallyColumn)
              rightHeaderCols.push(finallyColumn)
            } else {
              newCenterColumns.push(finallyColumn)
              if (finallyColumn.autoHeight) {
                newAutoHeightColumns.push(finallyColumn)
              }
              centerHeaderCols.push(finallyColumn)
            }
          }
        }
      }

      genColumns(
        originMergeColumns,
        newLeftHeaderColumns,
        newCenterHeaderColumns,
        newRightHeaderColumns,
        1,
        '__S_TABLE_COLUMN_Key__',
      )
      let differenceWidth = bodyScrollWidth.value - finallyWidthTotal
      const nonResizableColumns = autoWidthColumns.length
        ? autoWidthColumns
        : newLeftColumns
            .concat(newCenterColumns, newRightColumns)
            .filter((column) => !column.resizable || !column.__Internal__Column__)
      const widthDiffAverage = Math.floor(differenceWidth / nonResizableColumns.length)
      if (differenceWidth > 0) {
        for (let i = 0, len = nonResizableColumns.length; i < len; i++) {
          const column = nonResizableColumns[i]!
          let finallyWidth = 0
          if (i == len - 1 && differenceWidth > widthDiffAverage) {
            finallyWidth = column.finallyWidth! + differenceWidth
          } else {
            finallyWidth = Math.max(
              Math.min(column.finallyWidth! + widthDiffAverage, column.maxWidth ?? 1 / 0),
              column.minWidth ?? 50,
            )
          }
          differenceWidth -= finallyWidth - column.finallyWidth!
          column.finallyWidth = finallyWidth
        }
      } else {
        for (let i = 0, len = autoWidthColumns.length; i < len; i++) {
          const column = autoWidthColumns[i]!
          column.finallyWidth = Math.min(column.minWidth ?? 50, column.maxWidth ?? 1 / 0)
        }
      }
      if (props.headerHeight !== undefined) {
        if (Array.isArray(props.headerHeight)) {
          headerHeight.value = props.headerHeight
            .concat(new Array(newMaxRowSpan).fill(baseHeight.value))
            .slice(0, newMaxRowSpan)
        } else {
          headerHeight.value = new Array(newMaxRowSpan).fill(props.headerHeight)
        }
      } else {
        headerHeight.value = new Array(newMaxRowSpan).fill(baseHeight.value)
      }

      const genHeaderColumns = (
        headerColumns: FinallyColumnType[],
        left: number,
        top: number,
        rowSpan: number,
      ) => {
        let totalFinallyWidth = 0
        let totalLeft = left
        headerColumns.forEach((column) => {
          column.left = totalLeft
          column.top = top
          if (column.children) {
            column.rowSpan = 1
            column.height = headerHeight.value[newMaxRowSpan - rowSpan]
            column.finallyWidth = genHeaderColumns(
              column.children,
              totalLeft,
              column.height!,
              rowSpan - 1,
            )
          } else {
            column.rowSpan = rowSpan
            column.height = headerHeight.value
              .slice(newMaxRowSpan - rowSpan)
              .reduce((pre, cur) => pre + cur, 0)
          }
          totalLeft += column.finallyWidth!
          totalFinallyWidth += column.finallyWidth!
        })
        return totalFinallyWidth
      }

      genHeaderColumns(
        newLeftHeaderColumns.concat(newCenterHeaderColumns, newRightHeaderColumns),
        0,
        0,
        newMaxRowSpan,
      )

      leftColumns.value = newLeftColumns
      rightColumns.value = newRightColumns
      centerColumns.value = newCenterColumns
      autoHeightColumns.value = newAutoHeightColumns
      leftHeaderColumns.value = newLeftHeaderColumns
      rightHeaderColumns.value = newRightHeaderColumns
      centerHeaderColumns.value = newCenterHeaderColumns
      maxRowSpan.value = newMaxRowSpan
    },
    { immediate: true },
  )

  const allColumns = shallowRef<FinallyColumnType[]>([])
  let cacheColumnKeyPositonMap = {}
  const columnKeyIndexMap = shallowRef<Record<Key, number>>({})
  watchEffect(() => {
    cacheColumnKeyPositonMap = {}
    const newColumnKeyIndexMap: Record<Key, number> = {}
    allColumns.value = ([] as FinallyColumnType[])
      .concat(leftColumns.value, centerColumns.value, rightColumns.value)
      .map((column: FinallyColumnType, index) => {
        column.columnIndex = index
        newColumnKeyIndexMap[column.columnKey] = index
        return column
      })
    columnKeyIndexMap.value = newColumnKeyIndexMap
  })

  const columnRowsForAutoHeaderHeight = shallowRef<HeaderCellType[][]>([])
  const stickyOffsets = shallowRef<StickyOffsets>({} as StickyOffsets)
  watchEffect(() => {
    if (props.autoHeaderHeight) {
      columnRowsForAutoHeaderHeight.value = getAutoHeaderHeight(
        ([] as FinallyColumnType[]).concat(
          leftHeaderColumns.value,
          centerHeaderColumns.value,
          rightHeaderColumns.value,
        ),
      )
      const leftOffsets: number[] = []
      const rightOffsets: number[] = []
      let leftOffset = 0
      let rightOffset = 0
      const columns = allColumns.value
      const len = columns.length
      const dir = props.direction
      for (let i = 0; i < len; i += 1) {
        if (dir === 'rtl') {
          rightOffsets[i] = rightOffset
          rightOffset += columns[i]?.finallyWidth || 0
          const index = len - i - 1
          leftOffsets[index] = leftOffset
          leftOffset += columns[index]?.finallyWidth || 0
        } else {
          leftOffsets[i] = leftOffset
          leftOffset += columns[i]?.finallyWidth || 0
          const index = len - i - 1
          rightOffsets[index] = rightOffset
          rightOffset += columns[index]?.finallyWidth || 0
        }
      }

      stickyOffsets.value = { left: leftOffsets, right: rightOffsets }
    } else {
      columnRowsForAutoHeaderHeight.value = []
    }
  })

  const leftWidth = ref(0)
  const centerWidth = ref(0)
  const rightWidth = ref(0)
  const bodyMaxWidth = eagerComputed(() => leftWidth.value + centerWidth.value + rightWidth.value)
  watchEffect(() => {
    leftWidth.value = leftColumns.value.reduce(
      (preWidth: number, column: FinallyColumnType) => preWidth + (column.finallyWidth || 0),
      0,
    )
    centerWidth.value = centerColumns.value.reduce(
      (preWidth: number, column: FinallyColumnType) => preWidth + (column.finallyWidth || 0),
      0,
    )
    rightWidth.value = rightColumns.value.reduce(
      (preWidth: number, column: FinallyColumnType) => preWidth + (column.finallyWidth || 0),
      0,
    )
  })

  const getColumnPosition = (index: number, colSpan = 1) => {
    if (`${index}-${colSpan}` in cacheColumnKeyPositonMap) {
      return cacheColumnKeyPositonMap[`${index}-${colSpan}`]
    }
    const columns = allColumns.value
    let width = 0,
      minWidth = 0,
      maxWidth = 0
    if (columns[index]) {
      const left = columns[index].left
      for (let i = index, len = index + colSpan; i < len; i++) {
        const column = columns[i]!
        width += column.finallyWidth || 0
        minWidth += column.minWidth!
        maxWidth += column.maxWidth!
      }
      cacheColumnKeyPositonMap[`${index}-${colSpan}`] = {
        width,
        left,
        minWidth,
        maxWidth,
      }
    }

    return cacheColumnKeyPositonMap[`${index}-${colSpan}`] || { width, left: 0, minWidth, maxWidth }
  }

  const visibleCenterColumns = shallowRef<FinallyColumnType[]>([])
  const visibleCenterHeaderColumns = shallowRef<FinallyColumnType[]>([])
  const visibleColumnsRefresh = ref(false)
  const leftCenterWidth = eagerComputed(
    () => bodyWidth.value - (supportSticky ? rightWidth.value : 0),
  )
  const getValidColumns = (columns: FinallyColumnType[]) =>
    columns.length > 2e3 ? columns.slice(0, 2e3) : columns

  watch(
    [scrollLeft, leftCenterWidth, centerColumns, xVirtual],
    ([newScrollLeft, newLeftCenterWidth, newCenterColumns]) => {
      if (!xVirtual.value) {
        visibleCenterColumns.value = getValidColumns(newCenterColumns)
        visibleColumnsRefresh.value = !visibleColumnsRefresh.value
        return
      }
      const visibleColumns: FinallyColumnType[] = searchColumns(
        newCenterColumns,
        newScrollLeft - X_BUFF,
        newLeftCenterWidth + newScrollLeft + X_BUFF,
      )
      const autoHeightVisibleColumns: FinallyColumnType[] = autoHeightColumns.value.filter(
        (autoCol) => !visibleColumns.find((visibleCol) => autoCol === visibleCol),
      )

      visibleCenterColumns.value = getValidColumns(
        ([] as FinallyColumnType[]).concat(autoHeightVisibleColumns, visibleColumns),
      )

      if (latestRangeStartCell.value?.column) {
        const column = keyColumnMap.value.get(latestRangeStartCell.value?.column.columnKey)
        if (
          column &&
          !column.fixed &&
          !visibleCenterColumns.value.find((col) => col.columnKey === column.columnKey)
        ) {
          visibleCenterColumns.value.splice(0, 0, column)
        }
      }
      visibleColumnsRefresh.value = !visibleColumnsRefresh.value
    },
  )

  const deepSearchVisibleColumns = (
    childColumns: FinallyColumnType[],
    leftPos: number,
    rightPos: number,
  ): FinallyColumnType[] => {
    return searchColumns(childColumns, leftPos, rightPos).map((column) =>
      Object.assign(
        {},
        column,
        column.children
          ? { children: deepSearchVisibleColumns(column.children, leftPos, rightPos) }
          : {},
      ),
    )
  }

  watch(visibleColumnsRefresh, () => {
    if (!xVirtual.value) {
      visibleCenterHeaderColumns.value = getValidColumns(centerHeaderColumns.value)
      return
    }
    const leftPos = scrollLeft.value - X_BUFF
    const rightPos = leftCenterWidth.value + scrollLeft.value + X_BUFF
    const visibleColumns = searchColumns(centerHeaderColumns.value, leftPos, rightPos)
    const firstColumn = visibleColumns[0]
    const lastIndex = visibleColumns.length - 1
    const lastColumn = visibleColumns[lastIndex]

    if (firstColumn?.children) {
      visibleColumns[0] = Object.assign({}, visibleColumns[0], {
        children: deepSearchVisibleColumns(firstColumn.children, leftPos, rightPos),
      })
    }
    if (lastColumn && lastColumn !== firstColumn && lastColumn.children) {
      visibleColumns[lastIndex] = Object.assign({}, visibleColumns[lastIndex], {
        children: deepSearchVisibleColumns(lastColumn.children, leftPos, rightPos),
      })
    }
    visibleCenterHeaderColumns.value = getValidColumns(visibleColumns)
    if (
      draggingColumnKey.value &&
      !visibleCenterHeaderColumns.value.find(
        (column) => column.columnKey === draggingColumnKey.value,
      )
    ) {
      const column = keyColumnMap.value.get(draggingColumnKey.value)!
      visibleCenterHeaderColumns.value.push(
        column.children ? Object.assign({}, column, { children: [] }) : column,
      )
    }
  })

  return {
    leftColumns,
    rightColumns,
    centerColumns,
    leftHeaderColumns,
    rightHeaderColumns,
    centerHeaderColumns,
    leftWidth,
    rightWidth,
    centerWidth,
    bodyMaxWidth,
    maxRowSpan,
    headerHeight,
    maxHeaderHeight,
    allColumns,
    getColumnPosition,
    getColumnPositionByKey: (key: Key) => {
      const index = columnKeyIndexMap.value[key]
      if (!index) {
        devWarning(false, 'scrollTo', `\`columnKey = ${key}\` is Invalid`)
        return
      }
      return getColumnPosition(index)
    },
    columnKeyIndexMap,
    expandIconColumnIndex,
    visibleCenterColumns,
    visibleCenterHeaderColumns,
    columnRowsForAutoHeaderHeight,
    stickyOffsets,
  }
}
