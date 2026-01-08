/*
 * @Author: shen
 * @Date: 2023-08-09 10:36:49
 * @LastEditors: shen
 * @LastEditTime: 2026-01-06 09:01:35
 * @Description:
 */
import type { PropType } from 'vue'

import { defineComponent } from 'vue'
import BaseForm from '../../BaseForm'
import { omit } from '@pro-design-vue/utils'
import { proFormProps } from '../../props'

export default defineComponent({
  name: 'ProForm',
  inheritAttrs: false,
  props: proFormProps,
  setup(props, { slots, attrs }) {
    return () => (
      <BaseForm
        {...attrs}
        layout={props.layout ?? 'vertical'}
        {...omit(props, ['layout'])}
        v-slots={slots}
      />
    )
  },
})
