import type { ComputedRef, Ref, ShallowRef } from 'vue'
import type { DefaultRecordType, FinallyColumnType, RenderedCell } from '../components/interface'
import type { RangeCell } from './RangeInterface'

import { computed } from 'vue'
import KeyCode from '../utils/KeyCode'

export const useCellNavigation = (params: {
  getDisplayedColBefore: (
    col: FinallyColumnType<DefaultRecordType>,
  ) => FinallyColumnType<DefaultRecordType> | null
  getDisplayedColAfter: (
    col: FinallyColumnType<DefaultRecordType>,
  ) => FinallyColumnType<DefaultRecordType> | null
  allDisplayedColumns: ComputedRef<FinallyColumnType<DefaultRecordType>[]>
  setRangeToCell: (cell: RangeCell, appendRange?: boolean) => void
  focusCell: (cell: RangeCell) => void
  ensureCellVisible: (cell: RangeCell) => void
  allColumns: ShallowRef<FinallyColumnType<DefaultRecordType>[]>
  flattenData: ShallowRef<DefaultRecordType[]>
  prefixCls: ComputedRef<string>
  rangeSelection: ComputedRef<boolean | 'single'>
  getRowByFlattenIndex: (index: number) => DefaultRecordType
  rootRef: Ref<HTMLDivElement | undefined>
  allCellProps: Ref<Record<string, Record<string, RenderedCell>>>
  tabGuardTopRef: Ref<HTMLDivElement>
  tabGuardBottomRef: Ref<HTMLDivElement>
}) => {
  const {
    getDisplayedColBefore,
    getDisplayedColAfter,
    allDisplayedColumns,
    setRangeToCell,
    focusCell,
    flattenData,
    getRowByFlattenIndex,
    allCellProps,
    tabGuardTopRef,
    tabGuardBottomRef,
  } = params
  const endFlattenIndex = computed(
    () => flattenData.value[flattenData.value.length - 1]?.flattenIndex,
  )
  const startFlattenIndex = computed(() => flattenData.value[0]?.flattenIndex)
  const getNextCellToFocus = (
    keyCode: number,
    focusedCell: RangeCell,
    ctrlPressed: boolean = false,
  ) => (ctrlPressed ? h2(keyCode, focusedCell) : m(keyCode, focusedCell))
  const h2 = (keyCode: number, focusedCell: RangeCell) => {
    const isUp = keyCode === KeyCode.UP
    const isDown = keyCode === KeyCode.DOWN
    const isLeft = keyCode === KeyCode.LEFT
    let column: any, rowIndex: any
    if (isUp || isDown) {
      rowIndex = isUp ? startFlattenIndex.value : endFlattenIndex.value
      column = focusedCell.column
    } else {
      rowIndex = focusedCell.rowIndex
      column =
        isLeft !== false
          ? allDisplayedColumns.value[0]
          : allDisplayedColumns.value[allDisplayedColumns.value.length - 1]
    }
    return { rowIndex, rowPinned: null, column }
  }
  const m = (keyCode: number, focusedCell: RangeCell | null) => {
      let cell = focusedCell
      let o2 = false
      for (; !o2; ) {
        switch (keyCode) {
          case KeyCode.UP:
            cell = getCellAbove(cell)
            break
          case KeyCode.DOWN:
          case KeyCode.ENTER:
            cell = x(cell)
            break
          case KeyCode.RIGHT:
            cell = w(cell)
            break
          case KeyCode.LEFT:
            cell = g(cell)
            break
          default:
            cell = null
            console.warn('Table: unknown key for navigation ' + keyCode)
        }
        o2 = !cell || y(cell)
      }
      return cell
    },
    y = (e3) => {
      let t2
      switch (e3.rowPinned) {
        case 'top':
        case 'bottom':
          break
        default:
          t2 = getRowByFlattenIndex(e3.rowIndex)
      }
      return !!t2
    },
    g = (e3) => {
      if (!e3) return null
      const n2 = getDisplayedColBefore(e3.column)
      return n2 ? { rowIndex: e3.rowIndex, column: n2, rowPinned: e3.rowPinned } : null
    },
    w = (e3) => {
      if (!e3) return null
      const t2 = getDisplayedColAfter(e3.column)
      return t2 ? { rowIndex: e3.rowIndex, column: t2, rowPinned: e3.rowPinned } : null
    },
    x = (e3) => {
      if (!e3) return null
      const t2 = getRowBelow(e3)
      return t2 ? { rowIndex: t2.rowIndex, column: e3.column, rowPinned: t2.rowPinned } : null
    },
    getRowBelow = (e3) => {
      const t2 = e3.rowIndex,
        n2 = e3.rowPinned
      return C(e3) ? null : { rowIndex: t2 + 1, rowPinned: n2 }
    },
    C = (e3) => {
      const t2 = e3.rowIndex
      return endFlattenIndex.value <= t2
    },
    getRowAbove = (e3) => {
      const t2 = e3.rowIndex,
        n2 = e3.rowPinned
      return (n2 ? 0 === t2 : t2 === startFlattenIndex.value)
        ? null
        : { rowIndex: t2 - 1, rowPinned: n2 }
    },
    getCellAbove = (e3) => {
      if (!e3) return null
      const t2 = getRowAbove({
        rowIndex: e3.rowIndex,
        rowPinned: e3.rowPinned,
      })
      return t2 ? { rowIndex: t2.rowIndex, column: e3.column, rowPinned: t2.rowPinned } : null
    },
    k = (e3) => e3.rowIndex >= startFlattenIndex.value && e3.rowIndex <= endFlattenIndex.value,
    getNextTabbedCell = (e3, t2) => (t2 ? K(e3) : _(e3)),
    _ = (e3) => {
      const t2 = allDisplayedColumns.value
      let l2 = e3.rowIndex,
        r2 = e3.rowPinned,
        a2 = getDisplayedColAfter(e3.column)
      if (!a2) {
        a2 = t2[0]!
        const n2 = getRowBelow(e3)
        if (!n2) return null
        if (!n2.rowPinned && !k(n2)) return null
        ;((l2 = n2 ? n2.rowIndex : null), (r2 = n2 ? n2.rowPinned : null))
      }
      return { rowIndex: l2, column: a2, rowPinned: r2 }
    },
    K = (e3) => {
      const n2 = allDisplayedColumns.value
      let l2 = e3.rowIndex,
        r2 = e3.rowPinned,
        a2 = getDisplayedColBefore(e3.column)
      if (!a2) {
        a2 = n2[n2.length - 1]!
        const t2 = getRowAbove({
          rowIndex: e3.rowIndex,
          rowPinned: e3.rowPinned,
        })
        if (!t2) return null
        if (!t2.rowPinned && !k(t2)) return null
        ;((l2 = t2 ? t2.rowIndex : null), (r2 = t2 ? t2.rowPinned : null))
      }
      return { rowIndex: l2, column: a2, rowPinned: r2 }
    },
    O = (e3) => {
      const t2 = ((e4) => {
        let t3, n2
        const l2 =
            null === (t3 = getRowByFlattenIndex(e4.rowIndex)) || void 0 === t3 ? void 0 : t3.rowKey,
          r2 = (
            (
              (null === (n2 = allCellProps.value[l2]) || void 0 === n2
                ? void 0
                : n2[e4.column.columnKey]) || {}
            ).props || {}
          ).colSpan,
          a2: any = []
        if (r2 > 1) {
          const t4 = allDisplayedColumns.value.findIndex(
            (t5) => t5.columnKey === e4.column.columnKey,
          )
          for (let e5 = 0; e5 < r2; e5++) a2.push(allDisplayedColumns.value[t4 + e5])
        } else a2.push(e4.column)
        return a2.filter((e5) => !!e5)
      })(e3)
      return 1 === t2.length
        ? e3
        : {
            rowIndex: e3.rowIndex,
            column: t2[t2.length - 1],
            rowPinned: e3.rowPinned,
          }
    },
    P = (e3) => {
      let t2
      const n2 = getRowByFlattenIndex(e3.rowIndex),
        o2 = null == n2 ? void 0 : n2.rowKey,
        l2 = (
          (
            (null === (t2 = allCellProps.value[o2]) || void 0 === t2
              ? void 0
              : t2[e3.column.columnKey]) || {}
          ).props || {}
        ).rowSpan
      return !!n2 && 0 !== l2 && !n2.isExpandRow
    },
    tabToNextCellCommon = (e3, t2) => $(e3, t2),
    $ = (e3, t2) => {
      const n2 = T(e3, t2)
      return (n2 && focusCell(n2), !!n2)
    },
    T = (t2, n2) => {
      let o2 = t2
      for (; o2 && (o2 === t2 || !P(o2)); ) (n2 || (o2 = O(o2)), (o2 = getNextTabbedCell(o2, n2)))
      return o2
        ? o2.rowIndex < 0
          ? null
          : (params.ensureCellVisible(o2), setRangeToCell(o2), o2)
        : null
    }
  return {
    getNextCellToFocus,
    getNextTabbedCell,
    getLastBodyCell: () => ({ rowIndex: endFlattenIndex.value, rowPinned: null }),
    navigateToNextCell: (t2, n2) => {
      const o2 = t2.keyCode
      let r2 = n2,
        a2 = false
      for (; r2 && (r2 === n2 || !P(r2)); )
        (o2 === KeyCode.RIGHT && (r2 = O(r2)), (r2 = getNextCellToFocus(o2, r2)), (a2 = !r2))
      ;(a2 &&
        t2 &&
        o2 === KeyCode.UP &&
        (r2 = { rowIndex: -1, rowPinned: null, column: n2.column }),
        r2 && (r2.rowIndex < 0 || (params.ensureCellVisible(r2), setRangeToCell(r2))))
    },
    onTabKeyDown: (e3, t2) => {
      let n2, o2
      const l2 = t2.shiftKey
      ;(tabToNextCellCommon(e3, l2) ||
        (l2
          ? null === (n2 = tabGuardTopRef.value) || void 0 === n2 || n2.focus()
          : null === (o2 = tabGuardBottomRef.value) || void 0 === o2 || o2.focus()),
        t2.preventDefault())
    },
    tabToNextCellCommon: tabToNextCellCommon,
    getFirstCellToFocus: (t2) => {
      const n2 = (() => {
        const e3 = getRowByFlattenIndex(startFlattenIndex.value),
          t3 = allDisplayedColumns.value[0]
        return e3 && t3 ? { rowIndex: e3.rowIndex, rowPinned: null, column: t3 } : null
      })()
      P(n2)
        ? (params.ensureCellVisible(n2!), setRangeToCell(n2!))
        : n2 && tabToNextCellCommon(n2, t2)
    },
    getLastCellToFocus: (t2) => {
      const n2 = (() => {
        const e3 = getRowByFlattenIndex(endFlattenIndex.value),
          t3 = allDisplayedColumns.value[allDisplayedColumns.value.length - 1]
        return e3 && t3 ? { rowIndex: e3.rowIndex, rowPinned: null, column: t3 } : null
      })()
      P(n2)
        ? (params.ensureCellVisible(n2!), setRangeToCell(n2!))
        : n2 && tabToNextCellCommon(n2, t2)
    },
    getRowAbove,
    getCellAbove,
    getRowBelow,
  }
}
