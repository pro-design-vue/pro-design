/*
 * @Author: shen
 * @Date: 2022-11-05 12:49:15
 * @LastEditors: shen
 * @LastEditTime: 2025-09-02 17:20:46
 * @Description:
 */
import type { FlatRecord, Key, ProTableProps } from '../components/interface'
import type { Ref } from 'vue'
import type { KeyEntities } from './useFlattenRecords'

import { ref, shallowRef, computed, watch, watchEffect, onBeforeUnmount } from 'vue'
import { findLastIndex, findIndex, isNumber } from 'lodash-es'
import { Y_BUFF } from '../utils/constant'
import raf from '../utils/raf'
import devWarning from '../utils/devWarning'
import binSearchStartIndex from '../utils/binSearchStartIndex'

export interface CalType {
  rowPosition: Ref<number[]>
  rowHeights: Ref<Record<Key, number>>
  mergedRowHeights: Ref<Record<Key, number>>
  viewportHeight: Ref<number>
  addHeight: (rowKey: Key, subKey: Key, colUniKey: string, height: number) => void
  addRowHeight: (rowUniKey: string, rowKey: Key, height: number) => void
  removeRowHeight: (rowUniKey: string) => void
  startIndex: Ref<number>
  endIndex: Ref<number>
  getRowHeight: (fromIndex: number, rowSpan?: number) => number
  getRowPositionByKey: (key: Key) => number | undefined
}
export default function useCal(
  props: ProTableProps,
  flattenData: Ref<FlatRecord[]>,
  scrollHeight: Ref<number>,
  scrollTop: Ref<number>,
  virtual: Ref<boolean>,
  keyEntities: Ref<KeyEntities>,
): CalType {
  const rowPosition = shallowRef<number[]>([])
  const rowHeights = shallowRef<Record<Key, number>>({})
  const cacheRowHeights: Record<Key, number> = {}
  const mergedRowHeights = shallowRef<Record<Key, number>>({})
  const viewportHeight = ref(0)

  const currentSizeHeight = computed(() =>
    props.size === 'small' ? 39 : props.size === 'middle' ? 47 : 55,
  )
  const mergeRowHeight = computed(() =>
    props.size === 'small'
      ? props.rowHeight || 39
      : props.size === 'middle'
        ? props.rowHeight || 47
        : props.rowHeight || 55,
  )

  let x2: any

  const startIndex = ref(0)
  const endIndex = ref(-1)
  const maxStartIndex = ref(0)

  watchEffect(() => {
    const maxIndex = findLastIndex(
      rowPosition.value,
      (pos) => pos < viewportHeight.value - scrollHeight.value - Y_BUFF,
    )
    maxStartIndex.value = maxIndex < 0 ? 0 : maxIndex
  })

  const newScrollTop = ref(0)
  watch(
    scrollTop,
    () => {
      newScrollTop.value = scrollTop.value
    },
    { immediate: true },
  )

  watchEffect(() => {
    if (flattenData.value.length === rowPosition.value.length) {
      if (virtual.value) {
        if (scrollHeight.value) {
          let newStartIndex =
            binSearchStartIndex<number>(
              rowPosition.value,
              (value) => value >= newScrollTop.value - Y_BUFF,
            ) - 1
          newStartIndex = newStartIndex < 0 ? 0 : newStartIndex
          startIndex.value =
            newStartIndex > maxStartIndex.value ? maxStartIndex.value : newStartIndex
          let newEndIndex = findIndex(
            rowPosition.value,
            (value) => value >= newScrollTop.value + scrollHeight.value + Y_BUFF,
            startIndex.value,
          )
          newEndIndex = newEndIndex >= 0 ? newEndIndex : rowPosition.value.length - 1
          endIndex.value =
            newEndIndex > rowPosition.value.length - 1 ? rowPosition.value.length - 1 : newEndIndex
        } else {
          startIndex.value = 0
          endIndex.value = -1
        }
      } else {
        startIndex.value = 0
        endIndex.value = flattenData.value.length - 1
      }
    }
  })

  const currentRowHeights = shallowRef<Record<Key, number>>({})
  const isUpdate = ref(false)
  setTimeout(() => {
    isUpdate.value = true
  })

  const isRaf = ref(true)
  const rowHeightsStatus = ref(false)
  const autoRowHeightsMap = shallowRef<Record<string, { rowKey: Key; height: number }>>({})
  let rowHeightRaf: any

  const updateRowHeight = () => {
    raf.cancel(rowHeightRaf)
    rowHeightRaf = raf(() => {
      const rowHeights = currentRowHeights.value
      const autoRowHeights: Record<Key, number> = {}
      let isUpdateRowHeights = false
      Object.values(autoRowHeightsMap.value).forEach(({ rowKey, height }) => {
        autoRowHeights[rowKey] = autoRowHeights[rowKey] || 0
        if (height > autoRowHeights[rowKey]) {
          autoRowHeights[rowKey] = height
        }
      })
      for (const [rowKey, height] of Object.entries(autoRowHeights)) {
        if (rowHeights[rowKey] !== height) {
          rowHeights[rowKey] = height
          isUpdateRowHeights = true
        }
      }
      if (isUpdateRowHeights) {
        currentRowHeights.value = rowHeights
        rowHeightsStatus.value = !rowHeightsStatus.value
      }
    })
  }

  let refreshRaf: any
  watch(
    [startIndex, endIndex, isUpdate],
    ([newStartIndex, newEndIndex], [oldStartIndex, oldEndIndex]) => {
      if (!isUpdate.value) {
        isRaf.value = true
      } else {
        isRaf.value = newStartIndex === oldStartIndex && newEndIndex === oldEndIndex
      }
    },
  )

  watch([rowHeightsStatus, rowHeights], () => {
    raf.cancel(refreshRaf)
    refreshRaf = raf(
      () => {
        const defaultHeight = currentSizeHeight.value
        const crhs = currentRowHeights.value
        const rhs = rowHeights.value
        const mrhs = mergedRowHeights.value
        const data = flattenData.value
        const len = data.length
        const newMergedRowHeights = {}
        let newViewportHeight = 0
        const newRowPosition: number[] = []
        for (let i = 0; i < len; i++) {
          const { rowKey } = data[i]!
          const rowHeight =
            rhs[rowKey] !== undefined
              ? rhs[rowKey]
              : crhs[rowKey] === undefined
                ? mrhs[rowKey]
                : crhs[rowKey]

          newMergedRowHeights[rowKey] = rowHeight
          newRowPosition.push(newViewportHeight)
          newViewportHeight += rowHeight === undefined ? defaultHeight : rowHeight
        }
        mergedRowHeights.value = newMergedRowHeights
        viewportHeight.value = newViewportHeight
        rowPosition.value = newRowPosition
      },
      isRaf.value ? 0 : 1,
    )
  })

  onBeforeUnmount(() => {
    raf.cancel(rowHeightRaf)
    raf.cancel(refreshRaf)
  })

  const calculationRowHeights = (data: FlatRecord[]) => {
    const newRowHeights: Record<Key, number> = {}
    const defaultHeight = currentSizeHeight.value
    const newCacheRowHeights = {}
    const newCurrentRowHeights: Record<Key, number> = {}
    const crhs = currentRowHeights.value
    const len = data.length
    if (typeof props.rowHeight == 'function') {
      for (let i = 0; i < len; i++) {
        const { record, rowKey, isExpandRow = false } = data[i]!
        let rowHeight = props.rowHeight(record, isExpandRow, defaultHeight)
        rowHeight = isNumber(rowHeight) ? rowHeight : undefined
        newRowHeights[rowKey] = rowHeight!
        newCacheRowHeights[rowKey] = rowKey in cacheRowHeights ? cacheRowHeights[rowKey] : undefined
        newCurrentRowHeights[rowKey] = rowHeight ?? crhs[rowKey] ?? 0
      }
    } else {
      let rowHeight = props.rowHeight
      if (isNumber(rowHeight)) {
        for (let i = 0; i < len; i++) {
          const { rowKey, isExpandRow = false } = data[i]!
          isExpandRow && (rowHeight = undefined)
          newRowHeights[rowKey] = rowHeight!
          newCacheRowHeights[rowKey] =
            rowKey in cacheRowHeights ? cacheRowHeights[rowKey] : undefined
          newCurrentRowHeights[rowKey] = rowHeight ?? crhs[rowKey] ?? 0
        }
      } else {
        for (let i = 0; i < len; i++) {
          const { rowKey } = data[i]!
          newRowHeights[rowKey] = undefined as any
          newCacheRowHeights[rowKey] =
            rowKey in cacheRowHeights ? cacheRowHeights[rowKey] : undefined
          newCurrentRowHeights[rowKey] = crhs[rowKey]!
        }
      }
    }
    rowHeights.value = newRowHeights
    // cacheRowHeights.value = newCacheRowHeights
    currentRowHeights.value = newCurrentRowHeights
  }

  watch(
    [flattenData, mergeRowHeight],
    ([newFlattenData]) => {
      calculationRowHeights(newFlattenData || [])
      isUpdate.value = false
      setTimeout(() => {
        isUpdate.value = true
      })
    },
    { immediate: true },
  )

  return {
    rowPosition,
    rowHeights,
    viewportHeight,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    addHeight: (rowKey: Key, subKey: Key, colUniKey: string, height: number) => {
      raf.cancel(x2)
    },
    mergedRowHeights,
    startIndex,
    endIndex,
    getRowHeight: (fromIndex, rowSpan = 1) => {
      const data = flattenData.value
      const maxIndex = Math.min(data.length - 1, fromIndex + rowSpan - 1)
      let rowHeight = 0
      const mrhs = mergedRowHeights.value
      for (let i = fromIndex; i <= maxIndex; i++) {
        const { rowKey } = data[i]!
        rowHeight += mrhs[rowKey] === undefined ? currentSizeHeight.value : mrhs[rowKey]
      }
      return rowHeight
    },
    addRowHeight: (rowUniKey, rowKey, height) => {
      const rowHeight: Record<string, any> = autoRowHeightsMap.value[rowUniKey] || {}
      if (rowHeight.rowKey !== rowKey || rowHeight.height !== height) {
        autoRowHeightsMap.value[rowUniKey] = { rowKey, height }
        updateRowHeight()
      }
    },
    removeRowHeight: (rowUniKey) => {
      if (autoRowHeightsMap.value[rowUniKey]) {
        delete autoRowHeightsMap.value[rowUniKey]
        updateRowHeight()
      }
    },
    getRowPositionByKey: (key: Key) => {
      const index = keyEntities.value[key]?.flattenIndex
      if (index === undefined) {
        devWarning(false, 'scrollTo', `\`rowKey = ${key}\` is Invalid`)
        return
      }
      return rowPosition.value[index]
    },
  }
}
