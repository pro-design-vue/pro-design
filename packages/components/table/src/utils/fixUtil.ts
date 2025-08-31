/*
 * @Author: shen
 * @Date: 2022-06-29 13:14:25
 * @LastEditors: shen
 * @LastEditTime: 2022-12-10 23:37:51
 * @Description:
 */
import type { StickyOffsets } from '../components/interface'

export interface FixedInfo {
  fixLeft?: number | false
  fixRight?: number | false
  lastFixLeft: boolean
  firstFixRight: boolean
  lastFixRight: boolean
  firstFixLeft: boolean
  isSticky: boolean
}

export function getCellFixedInfo(
  colStart: number,
  colEnd: number,
  columns: readonly {
    fixed?: 'left' | 'right'
  }[],
  stickyOffsets: StickyOffsets,
  direction: 'ltr' | 'rtl' = 'ltr',
): FixedInfo {
  const startColumn = columns[colStart] || {}
  const endColumn = columns[colEnd] || {}
  let fixLeft: number | false | undefined
  let fixRight: number | false | undefined
  startColumn.fixed === 'left'
    ? (fixLeft = stickyOffsets.left[colStart])
    : endColumn.fixed === 'right' && (fixRight = stickyOffsets.right[colEnd])
  let lastFixLeft = false
  let firstFixRight = false
  let lastFixRight = false
  let firstFixLeft = false
  const lastColumn = columns[colEnd + 1],
    firstColumn = columns[colStart - 1]
  if (direction === 'rtl') {
    if (fixLeft !== undefined) {
      firstFixLeft = !(firstColumn && firstColumn.fixed === 'left')
    } else if (fixRight !== undefined) {
      lastFixRight = !(lastColumn && lastColumn.fixed === 'right')
    }
  } else if (fixLeft !== undefined) {
    lastFixLeft = !(lastColumn && lastColumn.fixed === 'left')
  } else if (fixRight !== undefined) {
    firstFixRight = !(firstColumn && firstColumn.fixed === 'right')
  }

  return {
    fixLeft,
    fixRight,
    lastFixLeft,
    firstFixRight,
    lastFixRight,
    firstFixLeft,
    isSticky: stickyOffsets.isSticky!,
  }
}
