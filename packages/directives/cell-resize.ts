/*
 * @Author: shen
 * @Date: 2022-04-13 14:27:54
 * @LastEditors: shen
 * @LastEditTime: 2025-08-27 13:41:51
 * @Description:
 */
import type { Directive } from 'vue'
import { nextTick } from 'vue'

export const cellResize: Directive = {
  created(el, binding) {
    const { value = {} } = binding
    const { resizeObserver } = value
    resizeObserver?.observe(el)
  },
  unmounted(el, binding) {
    const { value = {} } = binding
    const { resizeObserver, calMaxHeight } = value
    resizeObserver?.unobserve(el)
    nextTick(() => {
      calMaxHeight?.()
    })
  },
}
