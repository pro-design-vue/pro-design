/*
 * @Author: shen
 * @Date: 2022-11-03 17:59:42
 * @LastEditors: shen
 * @LastEditTime: 2025-09-02 14:42:48
 * @Description:
 */
import type { FinallyColumnType, DefaultRecordType } from '../components/interface'

const searchStartIndex = (columns: FinallyColumnType[], leftPos: number) => {
  let minIndex = 0
  let maxIndex = columns.length - 1
  let startIndex = columns.length
  for (; minIndex <= maxIndex; ) {
    const middleIndex = ((maxIndex - minIndex) >> 1) + minIndex
    if (columns[middleIndex]!.left! >= leftPos) {
      maxIndex = middleIndex - 1
      startIndex = middleIndex
    } else {
      minIndex = middleIndex + 1
    }
  }
  return startIndex
}

const searchColumns: (
  columns: FinallyColumnType[],
  leftPos: number,
  rightPos: number,
) => FinallyColumnType<DefaultRecordType>[] = (columns, leftPos, rightPos) => {
  const len = columns.length
  const visibleColumns: FinallyColumnType[] = []
  const startIndex = Math.max(searchStartIndex(columns, leftPos) - 1, 0)
  for (let i = startIndex; i < len; i++) {
    const column = columns[i]!
    if (!(column.left! <= rightPos)) break
    visibleColumns.push(column)
  }
  return visibleColumns
}
export default searchColumns
