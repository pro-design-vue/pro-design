/*
 * @Author: shen
 * @Date: 2023-11-05 14:17:40
 * @LastEditors: shen
 * @LastEditTime: 2025-07-28 09:23:08
 * @Description:
 */
import { computed } from 'vue'
import type { AutoScrollParams } from './RangeInterface'
export const useAutoScroll = (params: AutoScrollParams) => {
  const {
    scrollContainer,
    scrollAxis,
    onScrollCallback = () => {},
    showVerticalScrollbar,
    showHorizontalScrollbar,
  } = params
  let timer: any = null
  let i = 0
  let hasLeft = false
  let hasRight = false
  let hasTop = false
  let hasBottom = false

  const isXAxis = -1 !== scrollAxis.indexOf('x')
  const isYAxis = -1 !== scrollAxis.indexOf('y')
  const scrollByTick = computed(() => {
    return params.scrollByTick?.value ?? 20
  })
  const exec = () => {
    if (null === timer) {
      timer = window.setInterval(handle, 100)
      i = 0
    }
  }
  const handle = () => {
    i++
    const boundary = i > 20 ? 200 : i > 10 ? 80 : 40
    if (isYAxis) {
      const position = params.getVerticalPosition()
      hasTop && params.setVerticalPosition(position - boundary),
        hasBottom && params.setVerticalPosition(position + boundary)
    }
    if (isXAxis) {
      const position = params.getHorizontalPosition()
      hasLeft && params.setHorizontalPosition(position - boundary),
        hasRight && params.setHorizontalPosition(position + boundary)
    }
    onScrollCallback()
  }
  const clear = () => {
    if (timer) {
      window.clearInterval(timer)
      timer = null
    }
  }
  return {
    check: (mouseEvent: MouseEvent | Touch, forceSkipVerticalScroll: boolean = false) => {
      const hasVerticalScroll = forceSkipVerticalScroll || !showVerticalScrollbar.value
      if (hasVerticalScroll && !showHorizontalScrollbar.value) return
      const clientRect = scrollContainer.value!.getBoundingClientRect()
      const tick = scrollByTick.value
      hasLeft = mouseEvent.clientX < clientRect.left + tick
      hasRight = mouseEvent.clientX > clientRect.right - tick
      hasTop = mouseEvent.clientY < clientRect.top + tick && !hasVerticalScroll
      hasBottom = mouseEvent.clientY > clientRect.bottom - tick && !hasVerticalScroll
      return hasLeft || hasRight || hasTop || hasBottom ? exec() : clear()
    },
    ensureCleared: clear,
  }
}
