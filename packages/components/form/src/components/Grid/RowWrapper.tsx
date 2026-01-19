/*
 * @Author: shen
 * @Date: 2023-08-08 14:51:29
 * @LastEditors: shen
 * @LastEditTime: 2026-01-16 11:22:27
 * @Description:
 */
import type { RowProps } from 'ant-design-vue'
import type { PropType } from 'vue'

import { computed, defineComponent } from 'vue'
import { Row } from 'ant-design-vue'
import { useInjectGrid } from '../../context/GridContext'

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
    const { grid, rowProps } = useInjectGrid()
    const mergeGrid = computed(() => props.grid ?? grid?.value)
    const mergeRowProps = computed(() => ({ gutter: 8, ...rowProps?.value, ...props.rowProps }))
    return () => {
      if (!mergeGrid?.value) {
        return slots.default?.()
      }
      return (
        <Row {...mergeRowProps.value} class={attrs.class}>
          {slots.default?.()}
        </Row>
      )
    }
  },
})
