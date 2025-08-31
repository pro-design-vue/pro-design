/*
 * @Author: shen
 * @Date: 2023-11-05 13:44:32
 * @LastEditors: shen
 * @LastEditTime: 2025-08-29 14:27:07
 * @Description:
 */
import type { ComputedRef, Ref, ShallowRef } from 'vue'
import type {
  DefaultRecordType,
  FinallyColumnType,
  Key,
  Position,
  RenderedCell,
} from '../components/interface'
import type {
  CellRangesItem,
  CustomMouseEvent,
  FormatRangeCellTextParams,
  RangeCell,
} from './RangeInterface'

import { computed, shallowRef, watch, triggerRef, provide, inject } from 'vue'
import { useCellNavigation } from './useCellNavigation'
import { useInjectLevel } from './useLevel'
import { useAutoScroll } from './useAutoScroll'
import { useDragSelection, isOverFormFieldElement } from './useDragSelection'
import { getPathValue } from '../utils/util'
import KeyCode from '../utils/KeyCode'
import classNames from '../utils/classNames'

const RangeSymbolKey = Symbol('rangeSymbolKey')
export const useProvideRangeStore = (parmas: {
  allColumns: ShallowRef<FinallyColumnType<DefaultRecordType>[]>
  flattenData: ShallowRef<DefaultRecordType[]>
  prefixCls: ComputedRef<string>
  rangeSelection: ComputedRef<boolean | 'single'>
  getRowByFlattenIndex: (index: number) => DefaultRecordType
  rootRef: Ref<HTMLDivElement | undefined>
  bodyRef: Ref<HTMLDivElement>
  allCellProps: Ref<Record<string, Record<string, RenderedCell>>>
  tabGuardTopRef: Ref<HTMLDivElement>
  tabGuardBottomRef: Ref<HTMLDivElement>
  ensureCellRowVisible: (cell: RangeCell) => void
  ensureCellColumnVisible: (cell: RangeCell) => void
  latestRangeStartCell: ShallowRef<RangeCell | null>
  scrollTo: (pos?: number | Position, behavior?: 'auto' | 'smooth', skipAnimate?: boolean) => void
  scrollLeft: Ref<number>
  scrollTop: Ref<number>
  showVerticalScrollbar: Ref<boolean>
  showHorizontalScrollbar: Ref<boolean>
  getIndexsByKey: (key: Key) => number[]
  formatRangeCellText: (parmas: FormatRangeCellTextParams) => string
  editCellKeys: Ref<string[]>
  copyDelimiter: Ref<string>
}) => {
  const {
    allColumns,
    flattenData,
    prefixCls,
    rangeSelection,
    getRowByFlattenIndex,
    rootRef,
    bodyRef,
    latestRangeStartCell,
    scrollLeft,
    scrollTop,
    scrollTo,
    showVerticalScrollbar,
    showHorizontalScrollbar,
    getIndexsByKey,
    formatRangeCellText,
    copyDelimiter,
  } = parmas
  const level = useInjectLevel()

  const { check, ensureCleared } = useAutoScroll({
    scrollContainer: bodyRef,
    scrollAxis: 'xy',
    getVerticalPosition: () => scrollTop.value,
    setVerticalPosition: (pos: number) => {
      scrollTo(pos)
    },
    getHorizontalPosition: () => scrollLeft.value,
    setHorizontalPosition: (pos: number) => scrollTo({ left: pos }),
    showVerticalScrollbar: showVerticalScrollbar,
    showHorizontalScrollbar: showHorizontalScrollbar,
  })

  const enableRangeSelection = computed(() => !!rangeSelection.value)
  const singleRangeSelection = computed(() => 'single' === rangeSelection.value)
  const rangeCellClass = computed(() => `${prefixCls.value}-body-cell-range-selected`)
  const RangeSingleCellClass = computed(() => `${prefixCls.value}-body-cell-range-single-cell`)
  const RangeTopClass = computed(() => `${prefixCls.value}-body-cell-range-top`)
  const RangeRIghtClass = computed(() => `${prefixCls.value}-body-cell-range-right`)
  const RangeBottomClass = computed(() => `${prefixCls.value}-body-cell-range-bottom`)
  const RangeLeftClass = computed(() => `${prefixCls.value}-body-cell-range-left`)
  const cellRanges = shallowRef<CellRangesItem[]>([])
  const allDisplayedColumns = computed(() =>
    allColumns.value.filter((col) => !col.__Internal__Column__),
  )

  watch(allDisplayedColumns, (newValue) => {
    cellRanges.value.forEach((cellRange) => {
      cellRange.columns = cellRange.columns.filter((column) =>
        newValue.find((item) => item.columnKey === column.columnKey),
      )
    })
    cellRanges.value = cellRanges.value.filter((cellRange) => cellRange.columns.length > 0)
  })

  watch(flattenData, () => {
    const lastIndex = flattenData.value.length - 1
    cellRanges.value.forEach((cellRange) => {
      const { startRow, endRow } = cellRange
      if (startRow.rowIndex > lastIndex) {
        cellRange.startRow = null as any
      }
      if (endRow.rowIndex > lastIndex) {
        cellRange.endRow = null as any
      }
    })
    cellRanges.value = cellRanges.value.filter(
      (cellRange) => cellRange.startRow && cellRange.endRow,
    )
  })

  let cell: RangeCell | null = null
  let M = false
  let isDragging = false
  let mouseEventCache: CustomMouseEvent | null = null
  let F = false
  let lastCellRange: CellRangesItem | null = null
  let cellLevel: number | null = null
  const onDragStart = (mouseEvent: CustomMouseEvent) => {
    cellLevel = mouseEvent.cellInfo?.level
    if (!enableRangeSelection.value) return
    const { ctrlKey, metaKey, shiftKey } = mouseEvent
    const ctrlOrMetaKey = ctrlKey || metaKey
    const isMultiple = !singleRangeSelection.value && ctrlOrMetaKey
    const rangeLength = cellRanges.value.length
    const isRangeSelected = shiftKey && rangeLength > 0
    if (!(isMultiple || isRangeSelected)) {
      clearAllSelectedRange()
    }
    const cellPosition: RangeCell = mouseEvent.cellInfo.cellPosition
    if (cellPosition) {
      setCurrentCell(cellPosition)
    }
    if (!cell) return
    isDragging = true
    mouseEventCache = mouseEvent
    F = isMultiple && getCellRangeCount(cell) > 1
    if (!isRangeSelected) {
      latestRangeStartCell.value = cell
    }
    const cellRangeLength = cellRanges.value.length
    if (cellRangeLength > 0) {
      lastCellRange = cellRanges.value[cellRangeLength - 1]!
    } else {
      const row = { rowIndex: cell.rowIndex, rowPinned: cell.rowPinned }
      const lastCellRange = {
        startRow: row,
        endRow: row,
        columns: [cell.column!],
        startColumn: latestRangeStartCell.value?.column ?? ({} as FinallyColumnType),
      }
      cellRanges.value.push(lastCellRange)
      triggerRef(cellRanges)
    }
    bodyRef.value?.addEventListener('scroll', scrollHandle)
  }

  const setCurrentCell = (cellPosition: RangeCell) => {
    M = false
    if (
      cellPosition &&
      !(
        cell &&
        cell.rowIndex === cellPosition.rowIndex &&
        cell.rowPinned === cellPosition.rowPinned &&
        cell.column?.columnKey === cellPosition.column?.columnKey
      )
    ) {
      if (cell) {
        M = true
        cell = cellPosition
      }
    }
  }

  const onDragging = (mouseEvent: CustomMouseEvent) => {
    if (!isDragging || !mouseEvent) return
    if (mouseEvent.cellInfo?.level !== cellLevel) {
      mouseEvent.preventDefault()
      return
    }
    const cellPosition = mouseEvent.cellInfo.cellPosition
    cellPosition && setCurrentCell(cellPosition)
    mouseEventCache = mouseEvent
    const getDirection = (dir: string) =>
      cell && cell.rowPinned === dir && latestRangeStartCell.value!.rowPinned === dir
    const forceSkipVerticalScroll = getDirection('top') || getDirection('bottom')
    check(mouseEvent, !!forceSkipVerticalScroll)
    if (!M) return
    const i2 = J(latestRangeStartCell.value!.column, cell!.column)
    if (i2) {
      lastCellRange!.endRow = {
        rowIndex: cell!.rowIndex,
        rowPinned: cell!.rowPinned,
      }
      lastCellRange!.columns = i2
      triggerRef(cellRanges)
    }
  }

  const onDragStop = () => {
    cellLevel = null
    if (isDragging) {
      ensureCleared()
      bodyRef.value.removeEventListener('scroll', scrollHandle)
      mouseEventCache = null
      isDragging = false
      lastCellRange = null
      cell = null
      if (F) {
        F = false
        intersectLastRange()
      }
    }
  }
  const scrollHandle = () => {
    isDragging && mouseEventCache && onDragging(mouseEventCache)
  }

  const isSelectedEmpty = computed(() => 0 === cellRanges.value.length)
  const Y = computed(() => {
    const length = cellRanges.value.length
    if (0 === length) return false
    if (length > 1) return true
    const first = cellRanges.value[0]
    const n = le(first)
    const o = re2(first)
    return n.rowPinned !== o.rowPinned || n.rowIndex !== o.rowIndex || 1 !== first?.columns.length
  })

  useDragSelection({
    onDragStart,
    onDragging,
    onDragStop,
    rootElementRef: rootRef,
    bodyElementRef: bodyRef,
    level: level!,
    enableRangeSelection,
  })

  const X = (startRow: CellRangesItem['startRow'], endRow: CellRangesItem['endRow']) => {
    switch (startRow.rowPinned) {
      case 'top':
        if ('top' !== endRow.rowPinned) return true
        break
      case 'bottom':
        if ('bottom' !== endRow.rowPinned) return false
        break
      default:
        if (endRow.rowPinned) {
          return 'top' !== endRow.rowPinned
        }
    }
    return startRow.rowIndex < endRow.rowIndex
  }

  const q = (e3) => {
    let t2
    return (
      e3.forEach((e4) => {
        ;(void 0 === t2 || X(t2, e4)) && (t2 = e4)
      }),
      t2
    )
  }

  const Q = (e3) => {
    let t2
    return (
      e3.forEach((e4) => {
        ;(void 0 === t2 || X(e4, t2)) && (t2 = e4)
      }),
      t2
    )
  }
  const Z = (e3, t2) =>
    (!e3 && !t2) ||
    (!((e3 && !t2) || (!e3 && t2)) && e3.rowIndex === t2.rowIndex && e3.rowPinned == t2.rowPinned)

  const J = (e3, t2) => {
    let n, o
    const l2 = e3 === t2 || e3.columnKey === t2.columnKey,
      r2 = allDisplayedColumns.value.findIndex((t3) => t3.columnKey === e3.columnKey)
    if (r2 < 0)
      return void console.warn(
        `Table: column ${null !== (n = e3.originColumn.key) && void 0 !== n ? n : e3.originColumn.dataIndex} is not valid`,
      )
    const a2 = l2 ? r2 : allDisplayedColumns.value.findIndex((e4) => e4.columnKey === t2.columnKey)
    if (a2 < 0)
      return void console.warn(
        `Table: column ${null !== (o = t2.originColumn.key) && void 0 !== o ? o : t2.originColumn.dataIndex} is not valid`,
      )
    if (l2) return [e3]
    const i2 = Math.min(r2, a2),
      s2 = i2 === r2 ? a2 : r2,
      u2: any = []
    for (let e4 = i2; e4 <= s2; e4++) u2.push(allDisplayedColumns.value[e4])
    return u2
  }
  const setRangeToCell = (e3, t2 = false) => {
    if (!enableRangeSelection.value) return
    const n = J(e3.column, e3.column)
    if (!n) return
    if (latestRangeStartCell.value === e3) return
    ;(!singleRangeSelection.value && t2) || (cellRanges.value = [])
    const o = { rowIndex: e3.rowIndex, rowPinned: e3.rowPinned },
      l2 = { startRow: o, endRow: o, columns: n, startColumn: e3.column }
    ;(cellRanges.value.push(l2),
      (latestRangeStartCell.value = e3),
      onDragStop(),
      triggerRef(cellRanges))
  }
  const te = (e3, t2) => {
    const n = t2.column,
      o = J(e3.startColumn, n)
    o &&
      !ne(e3, t2) &&
      ((e3.columns = o),
      (e3.endRow = { rowIndex: t2.rowIndex, rowPinned: t2.rowPinned }),
      triggerRef(cellRanges))
  }
  const ne = (e3, t2) => {
    const { startRow: n, endRow: o } = e3,
      l2 = X(n, o) ? o : n,
      r2 = t2.rowIndex === l2.rowIndex && t2.rowPinned === l2.rowPinned,
      a2 = e3.columns[0],
      i2 = e3.columns[e3.columns.length - 1],
      s2 = e3.startColumn === a2 ? i2 : a2
    return t2.column === s2 && r2
  }
  const oe = (e3, t2) => {
    const n = null !== t2.columns && t2.columns.find((t3) => t3.columnKey === e3.column.columnKey),
      o = ae2(e3.rowIndex, e3.rowPinned, t2)
    return n && o
  }
  const le = (cellRange) => {
    if (cellRange.startRow && cellRange.endRow) {
      return X(cellRange.startRow, cellRange.endRow) ? cellRange.startRow : cellRange.endRow
    }
    return { rowIndex: flattenData.value[0]?.rowIndex, rowPinned: null }
  }
  const re2 = (e3) =>
    e3.startRow && e3.endRow
      ? X(e3.startRow, e3.endRow)
        ? e3.endRow
        : e3.startRow
      : {
          rowIndex: flattenData.value[flattenData.value.length - 1]?.rowIndex,
          rowPinned: null,
        }
  const ae2 = (e3, t2, n) => {
    const o = le(n),
      l2 = re2(n),
      r2 = { rowIndex: e3, rowPinned: t2 },
      a2 = r2.rowIndex === o.rowIndex && r2.rowPinned == o.rowPinned,
      i2 = r2.rowIndex === l2.rowIndex && r2.rowPinned == l2.rowPinned
    if (a2 || i2) return true
    const s2 = !X(r2, o),
      u2 = X(r2, l2)
    return s2 && u2
  }
  const getCellRangeCount = (cell: RangeCell) =>
    isSelectedEmpty.value ? 0 : cellRanges.value.filter((cellRange) => oe(cell, cellRange)).length
  const getDisplayedColBefore = (e3) => {
    const t2 = allDisplayedColumns.value,
      n = t2.findIndex((t3) => t3.columnKey === e3.columnKey)
    return n > 0 ? t2[n - 1]! : null
  }
  const getDisplayedColAfter = (e3) => {
    const t2 = allDisplayedColumns.value,
      n = t2.findIndex((t3) => t3.columnKey === e3.columnKey)
    return n < t2.length - 1 ? t2[n + 1]! : null
  }
  const ce2 = (e3) => {
    if (null == e3) return null
    const t2 = allDisplayedColumns.value.find((t3) => t3.columnKey === e3)
    return (t2 || console.warn('Table: could not find column ' + e3), t2)
  }
  const de2 = () => cellRanges.value
  const clearAllSelectedRange = () => {
    cellRanges.value = []
  }
  const appendCellToSelectedRange = (e3) => {
    if (!enableRangeSelection.value) return
    const t2 = ((e4) => {
      let t3,
        n = false
      if (e4.columnsKey) t3 = e4.columnsKey.map((e5) => ce2(e5)).filter((e5) => e5)
      else {
        const o = ce2(e4.columnStartKey),
          l2 = ce2(e4.columnEndKey)
        if (!o || !l2) return
        ;((t3 = J(o, l2)), t3 && t3.length && (n = t3[0] !== o))
      }
      if (!t3) return
      return {
        startRow:
          null != e4.rowStartIndex ? { rowIndex: e4.rowStartIndex, rowPinned: null } : void 0,
        endRow: null != e4.rowEndIndex ? { rowIndex: e4.rowEndIndex, rowPinned: null } : void 0,
        columns: t3,
        startColumn: n ? t3[t3.length - 1] : t3[0],
      }
    })(e3)
    t2 &&
      (t2.startRow &&
        (latestRangeStartCell.value = {
          rowIndex: t2.startRow.rowIndex,
          rowPinned: t2.startRow.rowPinned,
          column: t2.startColumn,
        }),
      cellRanges.value.push(t2 as any))
  }
  const fe2 = (e3) => {
    enableRangeSelection.value && (clearAllSelectedRange(), appendCellToSelectedRange(e3))
  }
  const focusCell = (e3) => {
    let t2, n
    const o =
        null === (t2 = getRowByFlattenIndex(e3.rowIndex)) || void 0 === t2 ? void 0 : t2.rowKey,
      l2 = null === (n = e3.column) || void 0 === n ? void 0 : n.columnKey
    if (void 0 !== o && void 0 !== l2 && rootRef.value) {
      const e4 = rootRef.value.querySelector(
        `[data-row-key="${o}"] [data-column-key="${l2}"][data-level="${level}"]`,
      )
      if (e4) {
        const t4 = e4.getElementsByTagName('input')[0]
        ;(e4 as any).focus()
        t4 && t4.focus()
      }
    }
  }
  const intersectLastRange = (fromMouseClick: boolean = false) => {
    if (fromMouseClick && isDragging) return
    if (singleRangeSelection.value) return
    if (isSelectedEmpty.value) return
    const lastCellRange = cellRanges.value[cellRanges.value.length - 1]
    const n = le(lastCellRange)
    const o = re2(lastCellRange)
    const l2: any = []
    ;(cellRanges.value.slice(0, -1).forEach((e4) => {
      const r2 = le(e4),
        a2 = re2(e4),
        i2 = e4.columns,
        s2 = i2.filter((e5) => -1 === lastCellRange?.columns.indexOf(e5))
      if (s2.length !== i2.length)
        if (X(o, r2) || X(a2, n)) l2.push(e4)
        else {
          if (X(r2, n)) {
            const e5 = {
              columns: [...i2],
              startColumn: lastCellRange?.startColumn,
              startRow: Object.assign({}, r2),
              endRow: navigationService.getRowAbove(n),
            }
            l2.push(e5)
          }
          if (s2.length > 0) {
            const e5 = {
              columns: s2,
              startColumn: s2.find((e6) => e6.columnKey === lastCellRange?.startColumn.columnKey)
                ? lastCellRange?.startColumn
                : s2[0],
              startRow: q([Object.assign({}, n), Object.assign({}, r2)]),
              endRow: Q([Object.assign({}, o), Object.assign({}, a2)]),
            }
            l2.push(e5)
          }
          X(o, a2) &&
            l2.push({
              columns: [...i2],
              startColumn: lastCellRange?.startColumn,
              startRow: navigationService.getRowBelow(o),
              endRow: Object.assign({}, a2),
            })
        }
      else l2.push(e4)
    }),
      (cellRanges.value = l2))
  }
  watch(latestRangeStartCell, () => {
    latestRangeStartCell.value && focusCell(latestRangeStartCell.value)
  })
  const ensureCellVisible = (cell: RangeCell) => {
    parmas.ensureCellRowVisible(cell)
    parmas.ensureCellColumnVisible(cell)
  }
  const navigationService = useCellNavigation({
    getDisplayedColBefore,
    getDisplayedColAfter,
    allDisplayedColumns,
    setRangeToCell,
    focusCell,
    ensureCellVisible,
    ...parmas,
  })

  provide(RangeSymbolKey, {
    cellRanges,
    extendLatestRangeToCell: (e3) => {
      if (isSelectedEmpty.value || !latestRangeStartCell.value) return
      const t2 = cellRanges.value[cellRanges.value.length - 1]
      te(t2, e3)
    },
    setRangeToCell,
    onDragStart: onDragStart,
    onDragging: onDragging,
    isCellInAnyRange: (cell: RangeCell) => getCellRangeCount(cell) > 0,
    getRangeCellClass: (e3) => {
      const t2 = getCellRangeCount(e3),
        n = ((e4) => {
          let t3 = false,
            n2 = false,
            o2 = false,
            l3 = false
          const r3 = e4.column
          let a3, i3
          ;((a3 = getDisplayedColBefore(r3)), (i3 = getDisplayedColAfter(r3)))
          const s2 = cellRanges.value.filter((t4) => oe(e4, t4))
          ;(a3 || (l3 = true), i3 || (n2 = true))
          for (let r4 = 0; r4 < s2.length && !(t3 && n2 && o2 && l3); r4++) {
            const u2 = s2[r4]!,
              c2 = le(u2),
              d = re2(u2)
            ;(!t3 && Z(c2, e4) && (t3 = true),
              !o2 && Z(d, e4) && (o2 = true),
              !l3 &&
                a3 &&
                u2.columns.findIndex((e5) => e5.columnKey === a3.columnKey) < 0 &&
                (l3 = true),
              !n2 &&
                i3 &&
                u2.columns.findIndex((e5) => e5.columnKey === i3.columnKey) < 0 &&
                (n2 = true))
          }
          return { top: t3, right: n2, bottom: o2, left: l3 }
        })(e3),
        o = 1 === t2 && !Y.value,
        l2 = !o && n.top,
        r2 = !o && n.right,
        a2 = !o && n.bottom,
        i2 = !o && n.left
      return classNames({
        [rangeCellClass.value]: 0 !== t2,
        [`${rangeCellClass.value}-1`]: 1 === t2,
        [`${rangeCellClass.value}-2`]: 2 === t2,
        [`${rangeCellClass.value}-3`]: 3 === t2,
        [`${rangeCellClass.value}-4`]: t2 >= 4,
        [RangeSingleCellClass.value]: o,
        [RangeTopClass.value]: l2,
        [RangeRIghtClass.value]: r2,
        [RangeBottomClass.value]: a2,
        [RangeLeftClass.value]: i2,
      })
    },
    enableRangeSelection,
    singleRangeSelection,
    getDisplayedColBefore,
    getDisplayedColAfter,
    navigationService,
    extendLatestRangeInDirection: (e3) => {
      if (isSelectedEmpty.value || !latestRangeStartCell.value) return
      const t2 = e3.keyCode,
        n = e3.ctrlKey || e3.metaKey,
        o = cellRanges.value[cellRanges.value.length - 1]!,
        l2 = latestRangeStartCell.value,
        r2 = o.columns[0],
        a2 = o.columns[o.columns.length - 1],
        i2 = o.endRow.rowIndex,
        s2 = o.endRow.rowPinned,
        u2 = {
          column: l2.column === r2 ? a2 : r2,
          rowIndex: i2,
          rowPinned: s2,
        },
        d = navigationService.getNextCellToFocus(t2, u2, n)
      return d
        ? (fe2({
            rowStartIndex: l2.rowIndex,
            rowEndIndex: d.rowIndex,
            columnStartKey: l2.column!.columnKey,
            columnEndKey: d.column.columnKey,
          }),
          d)
        : void 0
    },
    allDisplayedColumns,
    focusCell,
    ensureCellVisible,
    getCellRangeCount,
    intersectLastRange,
    level: level,
  })
  const copySelectedRange = () => {
    const e3 = de2(),
      t2: any = []
    let n = ''
    ;(e3.forEach((e4) => {
      const { startRow: n2, endRow: o, columns: r2 } = e4,
        [a2, i2] = [n2.rowIndex, o.rowIndex].sort((e5, t3) => e5 - t3)
      let s2: any = allDisplayedColumns.value.findIndex((e5) => e5.columnKey === r2[0]?.columnKey),
        u2 = allDisplayedColumns.value.findIndex(
          (e5) => e5.columnKey === r2[r2.length - 1]?.columnKey,
        )
      ;[s2, u2] = [s2, u2].sort((e5, t3) => e5 - t3)
      const c2: any = []
      for (let e5 = a2; e5! <= i2!; e5!++) {
        const t3 = flattenData.value[e5!]
        if (t3 && !t3.isExpandRow) {
          const n3 = t3.rowKey,
            o2: any = [],
            l2 = getIndexsByKey(n3)
          for (let r3 = s2; r3 <= u2; r3++) {
            const originColumn = allDisplayedColumns.value[r3]?.originColumn!
            const i3 = originColumn.dataIndex
              ? getPathValue(t3.record, originColumn.dataIndex)
              : void 0
            if (originColumn) {
              const r4: FormatRangeCellTextParams = {
                record: t3.record,
                column: originColumn,
                index: e5!,
                recordIndexs: l2,
                key: n3,
                value: i3,
              }
              o2.push(formatRangeCellText(r4))
            }
          }
          c2.push(o2.join(copyDelimiter.value))
        }
      }
      t2.push(c2)
    }),
      (n = t2.map((e4) => e4.join('prefixCls\n')).join('prefixCls\n')),
      ((e4) => {
        let t3, n2
        const o = document.activeElement,
          l2 = document.createElement('textarea')
        ;((l2.style.position = 'absolute'),
          (l2.style.opacity = '0'),
          (l2.style.width = '1px'),
          (l2.style.height = '1px'),
          (l2.value = e4 || ' '),
          document.body.appendChild(l2),
          l2.select(),
          l2.focus({ preventScroll: true }),
          document.execCommand('copy') ||
            console.warn("Table: copy failed, Browser did not allow document.execCommand('copy')"),
          document.body.removeChild(l2),
          null !== o &&
            (null === (n2 = ((t3 = o) as any).focus) ||
              void 0 === n2 ||
              n2.call(t3, { preventScroll: true })))
      })(n))
  }
  return {
    getSelectedRange: () => {
      const e3 = de2(),
        t2: any = []
      return (
        e3.forEach((e4) => {
          const { startColumn: n, startRow: o, endRow: r2, columns: a2 } = e4,
            i2 = flattenData.value[o.rowIndex]!,
            s2 = flattenData.value[r2.rowIndex]!,
            u2 = {
              startColumn: n.originColumn,
              startRow: {
                rowIndex: i2.rowIndex,
                recordIndexs: getIndexsByKey(i2.rowKey),
              },
              endRow: {
                rowIndex: s2.rowIndex,
                recordIndexs: getIndexsByKey(s2.rowKey),
              },
              columns: a2.map((e5) => e5.originColumn),
              flattenData: flattenData.value,
            }
          t2.push(u2)
        }),
        t2
      )
    },
    appendCellToSelectedRange,
    clearAllSelectedRange,
    setCellRanges: (e3) => {
      enableRangeSelection.value && (cellRanges.value = e3)
    },
    getCellRangeCount: getCellRangeCount,
    navigationService: navigationService,
    copySelectedRange,
    onBodyKeydown: (e3) => {
      if ((!e3.ctrlKey && !e3.metaKey) || !enableRangeSelection.value) return
      if (isOverFormFieldElement(e3)) return
      switch (e3.keyCode) {
        case KeyCode.C:
          copySelectedRange()
          break
        case KeyCode.A:
          ;(() => {
            if (!enableRangeSelection.value) return
            const e4 = allDisplayedColumns.value
            0 !== e4.length &&
              fe2({
                rowStartIndex: 0,
                rowEndIndex: flattenData.value.length - 1,
                columnStartKey: e4[0]!.columnKey,
                columnEndKey: e4[e4.length - 1]!.columnKey,
              })
          })()
      }
      e3.preventDefault()
    },
  }
}
export const useInjectRangeStore = () => {
  return inject(RangeSymbolKey, {} as any)
}
