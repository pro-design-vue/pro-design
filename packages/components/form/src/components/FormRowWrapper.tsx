/*
 * @Author: shen
 * @Date: 2023-08-08 14:51:29
 * @LastEditors: shen
 * @LastEditTime: 2025-07-24 10:00:21
 * @Description:
 */
import type { RowProps } from 'ant-design-vue'
import type { PropType } from 'vue'

import { computed, defineComponent } from 'vue'
import { Row } from 'ant-design-vue'
import { useInjectForm } from '../context/FormContext'

export default defineComponent({
  name: 'FormRowWrapper',
  inheritAttrs: false,
  props: {
    rowProps: {
      type: Object as PropType<RowProps>,
      default: undefined,
    },
    grid: {
      type: Boolean,
      default: undefined,
    },
  },
  setup(props, { slots, attrs }) {
    const { rowProps, grid } = useInjectForm()
    const mergeGrid = computed(() => props.grid ?? grid?.value)
    const mergeRowProps = computed(() => props.rowProps ?? rowProps?.value)
    return () => {
      if (mergeGrid?.value) {
        return (
          <Row {...mergeRowProps.value} class={attrs.class}>
            {slots.default?.()}
          </Row>
        )
      }
      return slots.default?.()
    }
  },
})
