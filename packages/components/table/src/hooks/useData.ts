/*
 * @Author: shen
 * @Date: 2022-11-05 14:00:27
 * @LastEditors: shen
 * @LastEditTime: 2025-09-01 10:54:47
 * @Description:
 */
import type { FlatRecord, Key, ProTableProps } from '../components/interface'
import type { Ref, ShallowRef } from 'vue'
import type { RangeCell } from './RangeInterface'

import { shallowRef, watch } from 'vue'

export default function useData(
  _props: ProTableProps,
  rowPosition: Ref<number[]>,
  flattenData: Ref<FlatRecord[]>,
  startIndex: Ref<number>,
  endIndex: Ref<number>,
  draggingRowKey: Ref<Key | null>,
  useAnimate: Ref<boolean>,
  getRowFlattenIndexByKey: (key: Key) => number | undefined,
  latestRangeStartCell: ShallowRef<RangeCell | null>,
): {
  data: Ref<any[]>
  pos: Ref<number[]>
} {
  const data = shallowRef<any[]>([])
  const pos = shallowRef<number[]>([])
  let rowKeyIndexMap: Record<Key, number> = {}
  let exchange = true

  watch(
    [rowPosition, startIndex, endIndex],
    () => {
      if (flattenData.value.length !== rowPosition.value.length) {
        return
      }
      const newData: any[] = []
      const newPos: number[] = []
      const recordPositionArr: [FlatRecord, number][] = []
      const newRowKeyIndexMap: Record<Key, number> = {}
      const start = startIndex.value
      const lastIndex = Math.min(start + 2e3, endIndex.value + 1)
      const allFlattenData = flattenData.value
      const allRowPosition = rowPosition.value

      const addExtraRow = (idx: number) => {
        if (allFlattenData[idx] && (idx < start || idx >= lastIndex)) {
          const record = allFlattenData[idx]!
          const rowKeyIndex = rowKeyIndexMap[record.rowKey]
          if (rowKeyIndex !== undefined) {
            newData[rowKeyIndex] = record
            newPos[rowKeyIndex] = allRowPosition[idx]!
            newRowKeyIndexMap[record.rowKey] = rowKeyIndex
          } else {
            recordPositionArr.push([record, allRowPosition[idx]!])
          }
        }
      }

      for (let i = start; i < lastIndex; i++) {
        const record = allFlattenData[i]
        if (!record) continue
        const rowKeyIndex = rowKeyIndexMap[record.rowKey]
        if (rowKeyIndex !== undefined) {
          newData[rowKeyIndex] = record
          newPos[rowKeyIndex] = allRowPosition[i]!
          newRowKeyIndexMap[record.rowKey] = rowKeyIndex
        } else {
          recordPositionArr.push([record, allRowPosition[i]!])
        }
      }

      const flattenIndex = getRowFlattenIndexByKey(draggingRowKey.value as Key) as number
      addExtraRow(flattenIndex)

      if (latestRangeStartCell.value) {
        addExtraRow(latestRangeStartCell.value.rowIndex)
      }

      const firstRecord = recordPositionArr[0]
      if (draggingRowKey.value !== undefined && useAnimate.value && firstRecord) {
        if (exchange) {
          recordPositionArr.shift()
          recordPositionArr.push(firstRecord)
        }
        exchange = !exchange
      }
      let formIndex = 0
      for (let j = 0; j < recordPositionArr.length; j++) {
        const [record, rowPos] = recordPositionArr[j]!
        let index = -1
        for (let k = formIndex; k < newData.length; k++) {
          if (!newData[k]) {
            index = k
            break
          }
        }
        if (index !== -1) {
          formIndex = index
          newData[index] = record
          newPos[index] = rowPos
          newRowKeyIndexMap[record.rowKey] = index
        } else {
          newRowKeyIndexMap[record.rowKey] = newData.length
          newData.push(record)
          newPos.push(rowPos)
        }
      }
      rowKeyIndexMap = newRowKeyIndexMap

      // Compact sparse arrays into dense arrays for V8 optimization
      const compactData: any[] = []
      const compactPos: number[] = []
      const compactRowKeyIndexMap: Record<Key, number> = {}
      for (let i = 0; i < newData.length; i++) {
        if (newData[i]) {
          compactRowKeyIndexMap[newData[i].rowKey] = compactData.length
          compactData.push(newData[i])
          compactPos.push(newPos[i]!)
        }
      }
      rowKeyIndexMap = compactRowKeyIndexMap
      data.value = compactData
      pos.value = compactPos
    },
    { immediate: true },
  )
  return { data, pos }
}
