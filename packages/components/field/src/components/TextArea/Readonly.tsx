/*
 * @Author: shen
 * @Date: 2025-12-05 15:58:31
 * @LastEditors: shen
 * @LastEditTime: 2025-12-30 17:04:57
 * @Description:
 */

import { defineComponent } from 'vue'
import { usePrefixCls } from '@pro-design-vue/hooks'

export default defineComponent({
  name: 'FieldTextAreaReadonly',
  inheritAttrs: false,
  props: {
    text: {
      type: String,
      default: undefined,
    },
  },
  setup(props, { attrs }) {
    const prefixCls = usePrefixCls('field-readonly')
    return () => (
      <div
        class={{
          [prefixCls]: true,
          [`${prefixCls}-textarea`]: true,
        }}
        {...attrs}
      >
        {props.text ?? '-'}
      </div>
    )
  },
})
