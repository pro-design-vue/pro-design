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
import { findIndex } from '@pro-design-vue/utils'

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
      const lastIndex = Math.min(startIndex.value + 2e3, endIndex.value + 1)
      const sliceData = flattenData.value?.slice(startIndex.value, lastIndex) || []
      const sliceRowPosition = rowPosition.value.slice(startIndex.value, lastIndex) || []
      const flattenIndex = getRowFlattenIndexByKey(draggingRowKey.value as Key) as number

      if (
        flattenData.value[flattenIndex] &&
        (flattenIndex < startIndex.value || flattenIndex >= lastIndex)
      ) {
        sliceData.push(flattenData.value[flattenIndex])
        sliceRowPosition.push(rowPosition.value[flattenIndex]!)
      }

      if (latestRangeStartCell.value) {
        const rowIndex = latestRangeStartCell.value.rowIndex
        if (flattenData.value[rowIndex] && (rowIndex < startIndex.value || rowIndex >= lastIndex)) {
          sliceData.push(flattenData.value[rowIndex])
          sliceRowPosition.push(rowPosition.value[rowIndex]!)
        }
      }
      sliceData.forEach((record, index) => {
        const rowKeyIndex = rowKeyIndexMap[record.rowKey]
        if (rowKeyIndex !== undefined) {
          newData[rowKeyIndex] = record
          newPos[rowKeyIndex] = sliceRowPosition[index]!
          newRowKeyIndexMap[record.rowKey] = rowKeyIndex
        } else {
          recordPositionArr.push([record, sliceRowPosition[index]!])
        }
      })

      const firstRecord = recordPositionArr[0]
      if (draggingRowKey.value !== undefined && useAnimate.value && firstRecord) {
        if (exchange) {
          recordPositionArr.shift()
          recordPositionArr.push(firstRecord)
        }
        exchange = !exchange
      }
      let formIndex = 0
      recordPositionArr.forEach(([record, rowPos]) => {
        const index = findIndex(newData, (value) => !value, formIndex)
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
      })
      rowKeyIndexMap = newRowKeyIndexMap
      data.value = newData
      pos.value = newPos
    },
    { immediate: true },
  )
  return { data, pos }
}
