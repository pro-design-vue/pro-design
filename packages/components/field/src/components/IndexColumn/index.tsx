/*
 * @Author: shen
 * @Date: 2025-12-05 15:58:31
 * @LastEditors: shen
 * @LastEditTime: 2025-12-30 17:00:43
 * @Description:
 */
import { defineComponent } from 'vue'
import { usePrefixCls } from '@pro-design-vue/hooks'

export default defineComponent({
  name: 'FieldIndexColumn',
  inheritAttrs: false,
  props: {
    text: {
      type: Number,
      default: undefined,
    },
    border: {
      type: Boolean,
      default: undefined,
    },
  },
  setup(props, { attrs }) {
    const prefixCls = usePrefixCls('field-index-column')
    return () => (
      <div
        class={{
          [prefixCls]: true,
          [`${prefixCls}-border`]: props.border,
          'top-three': (props.text as number) > 3,
        }}
        {...attrs}
      >
        {props.text}
      </div>
    )
  },
})
