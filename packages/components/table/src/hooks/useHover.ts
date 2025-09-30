/*
 * @Author: shen
 * @Date: 2023-11-01 10:00:14
 * @LastEditors: shen
 * @LastEditTime: 2025-09-28 11:16:25
 * @Description:
 */
import { ref, provide, inject, computed } from 'vue'

import type { Key } from '../components/interface'
import type { ComputedRef, InjectionKey, Ref } from 'vue'
export interface HoverContextProps {
  rowHover: ComputedRef<boolean | undefined>
  hoverRowKey: Ref<Key>
  hoverColumnKey: Ref<Key>
  handleCellHover: (rowKey: Key, columnKey: Key, draggingRowKey: Key) => void
  handleCellBlur: () => void
}
const HoverContextKey: InjectionKey<HoverContextProps> = Symbol('HoverContextKey')
export const useProvideHover = (props: {
  rowHoverDelay: ComputedRef<number>
  rowHover: ComputedRef<boolean | undefined>
}) => {
  const hoverColumnKey = ref<any>()
  const hoverRowKey = ref<any>()
  let hoverColumnTimeout: any, hoverRowTimeout: any
  const handleCellHover = (rowKey: Key, columnKey: Key, draggingRowKey: Key) => {
    clearTimeout(hoverColumnTimeout)
    clearTimeout(hoverRowTimeout)
    if (!draggingRowKey) {
      hoverRowTimeout = setTimeout(() => {
        hoverRowKey.value = rowKey
        hoverColumnKey.value = columnKey
      }, props.rowHoverDelay.value)
    }
  }
  const handleCellBlur = () => {
    hoverColumnTimeout = setTimeout(() => {
      hoverRowKey.value = undefined
      hoverColumnKey.value = undefined
    }, props.rowHoverDelay.value + 50)
  }
  const hoverContext = {
    rowHover: props.rowHover,
    hoverColumnKey,
    hoverRowKey,
    handleCellHover,
    handleCellBlur,
  }

  provide(HoverContextKey, hoverContext)

  return hoverContext
}
export const useInjectHover = () => {
  return inject(HoverContextKey, {
    rowHover: computed(() => undefined),
    hoverRowKey: ref(),
    hoverColumnKey: ref(),
    handleCellHover: () => {},
    handleCellBlur: () => {},
  })
}
