/*
 * @Author: shen
 * @Date: 2022-04-12 18:33:56
 * @LastEditors: shen
 * @LastEditTime: 2022-11-03 18:00:52
 * @Description:
 */
import type { FunctionalComponent } from 'vue'

export const RenderSlot: FunctionalComponent<any> = (_, { slots }) => {
  return slots.default?.()
}
RenderSlot.displayName = 'RenderSlot'
RenderSlot.inheritAttrs = false

export const RenderVNode: FunctionalComponent<any> = (props, { slots }) => {
  if (typeof props.vnode === 'function') {
    return props.vnode?.(props.props || {}) || slots.default?.()
  } else {
    return props.vnode || slots.default?.()
  }
}
RenderVNode.props = ['vnode', 'props']
RenderVNode.inheritAttrs = false

export const TempVar: FunctionalComponent<any> = (props, { slots }) => {
  return slots.default?.({ ...(props.value || {}) })
}

TempVar.props = ['value']
TempVar.displayName = 'TempVar'

export default RenderVNode
