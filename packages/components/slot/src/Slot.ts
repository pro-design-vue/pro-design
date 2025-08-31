/*
 * @Author: shen
 * @Date: 2025-06-11 11:14:17
 * @LastEditors: shen
 * @LastEditTime: 2025-08-29 13:55:09
 * @Description:
 */
import { cloneVNode, Comment, defineComponent, mergeProps } from 'vue'
import { renderSlotFragments } from '@pro-design-vue/utils'

export default defineComponent({
  name: 'ProSlot',
  inheritAttrs: false,
  setup(_, { attrs, slots }) {
    return () => {
      if (!slots.default) return null

      const childrens = renderSlotFragments(slots.default())
      const firstNonCommentChildrenIndex = childrens.findIndex((child) => child.type !== Comment)
      if (firstNonCommentChildrenIndex === -1) return childrens

      const firstNonCommentChildren = childrens[firstNonCommentChildrenIndex]!

      // Remove props ref from being inferred
      delete firstNonCommentChildren?.props?.ref

      // Manually merge props to ensure `firstNonCommentChildren.props`
      // has higher priority than `attrs` and can override `attrs`.
      // Otherwise `cloneVNode(firstNonCommentChildren, attrs)` will
      // prioritize `attrs` and override `firstNonCommentChildren.props`.
      const mergedProps = firstNonCommentChildren?.props
        ? mergeProps(attrs, firstNonCommentChildren?.props)
        : attrs
      const cloned = cloneVNode({ ...firstNonCommentChildren, props: {} }, mergedProps)

      if (childrens.length === 1) return cloned

      childrens[firstNonCommentChildrenIndex] = cloned
      return childrens
    }
  },
})
