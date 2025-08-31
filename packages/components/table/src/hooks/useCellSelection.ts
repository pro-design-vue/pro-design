/*
 * @Author: shen
 * @Date: 2023-11-09 13:07:07
 * @LastEditors: shen
 * @LastEditTime: 2023-11-09 13:19:49
 * @Description:
 */
import { useInjectRangeStore } from './useRangeStore'
import type { CustomMouseEvent, RangeCell } from './RangeInterface'

export const useCellSelection = () => {
  const {
    isCellInAnyRange,
    cellRanges,
    extendLatestRangeToCell,
    setRangeToCell,
    enableRangeSelection,
    getCellRangeCount,
    intersectLastRange,
    level,
  } = useInjectRangeStore()
  return {
    onCellMousedown: (mouseEvent: CustomMouseEvent, cellPosition: RangeCell) => {
      const { ctrlKey, metaKey, shiftKey } = mouseEvent
      if (!(!isCellInAnyRange(cellPosition) || 2 !== mouseEvent.button)) return
      const isRanges = !cellRanges.value.length
      if (shiftKey && isRanges) {
        mouseEvent.preventDefault()
      }
      if (shiftKey) {
        extendLatestRangeToCell(cellPosition)
      } else {
        setRangeToCell(cellPosition, ctrlKey || metaKey)
      }
      mouseEvent.cellInfo = {
        cellPosition: cellPosition,
        cellTarget: mouseEvent.currentTarget!,
        level,
      }
    },
    onCellMousemove: (mouseEvent: CustomMouseEvent, cellPosition: RangeCell) => {
      mouseEvent.cellInfo = {
        cellPosition: cellPosition,
        cellTarget: mouseEvent.currentTarget!,
        level,
      }
    },
    onCellClick: (mouseEvent: MouseEvent, cellPosition: RangeCell) => {
      const mouseKey = mouseEvent.ctrlKey || mouseEvent.metaKey
      enableRangeSelection.value &&
        mouseKey &&
        getCellRangeCount(cellPosition) > 1 &&
        intersectLastRange(true)
    },
  }
}
