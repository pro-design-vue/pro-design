/*
 * @Author: shen
 * @Date: 2023-08-08 14:51:29
 * @LastEditors: shen
 * @LastEditTime: 2026-01-09 16:38:05
 * @Description:
 */
import { defineComponent, computed } from 'vue'
import { Col } from 'ant-design-vue'

import type { ColProps } from 'ant-design-vue'
import type { PropType } from 'vue'
import { useInjectGrid } from '../../context/GridContext'

export default defineComponent({
  name: 'ColWrapper',
  inheritAttrs: false,
  props: {
    colProps: {
      type: Object as PropType<ColProps>,
      default: undefined,
    },
    grid: {
      type: Boolean,
      default: undefined,
    },
  },
  setup(props, { slots }) {
    const { grid, colProps } = useInjectGrid()
    const mergeGrid = computed(() => props.grid ?? grid?.value)

    const mergeProps = computed(() => {
      const originProps = { ...colProps?.value, ...props.colProps }

      if (typeof originProps.span === 'undefined' && typeof originProps.xs === 'undefined') {
        originProps.xs = 24
      }

      return originProps
    })

    return () => {
      if (mergeGrid.value) {
        return <Col {...mergeProps.value}>{slots.default?.()}</Col>
      }
      return slots.default?.()
    }
  },
})
