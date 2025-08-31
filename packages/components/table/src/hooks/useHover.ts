/*
 * @Author: shen
 * @Date: 2023-11-01 10:00:14
 * @LastEditors: shen
 * @LastEditTime: 2023-11-10 15:36:35
 * @Description:
 */
import { ref, provide, inject } from 'vue'

import type { Key } from '../components/interface'
import type { ComputedRef, InjectionKey, Ref } from 'vue'
export interface HoverContextProps {
  hoverRowKey: Ref<Key>
  hoverColumnKey: Ref<Key>
  handleCellHover: (rowKey: Key, columnKey: Key, draggingRowKey: Key) => void
  handleCellBlur: () => void
}
const HoverContextKey: InjectionKey<HoverContextProps> = Symbol('HoverContextKey')
export const useProvideHover = (props: { rowHoverDelay: ComputedRef<number> }) => {
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
    hoverRowKey: ref(),
    hoverColumnKey: ref(),
    handleCellHover: () => {},
    handleCellBlur: () => {},
  })
}
