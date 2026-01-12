/*
 * @Author: shen
 * @Date: 2023-08-09 10:36:49
 * @LastEditors: shen
 * @LastEditTime: 2026-01-12 09:52:45
 * @Description:
 */
import type { PropType } from 'vue'

import { defineComponent } from 'vue'
import { omit } from '@pro-design-vue/utils'
import { proFormProps } from './props'
import BaseForm from './BaseForm'

export default defineComponent({
  name: 'ProForm',
  inheritAttrs: false,
  props: proFormProps,
  setup(props, { slots, attrs }) {
    return () => (
      <BaseForm
        {...attrs}
        {...omit(props, ['layout', 'formRef', 'onInit'])}
        v-slots={slots}
        layout={props.layout ?? 'vertical'}
        contentRender={(items, submitter) => {
          return (
            <>
              {items}
              {submitter}
            </>
          )
        }}
        onInit={(values, form) => {
          props.formRef?.(form)
          props.onInit?.(values, form)
        }}
      />
    )
  },
})
