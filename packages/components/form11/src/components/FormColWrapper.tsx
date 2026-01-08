/*
 * @Author: shen
 * @Date: 2023-08-08 14:51:29
 * @LastEditors: shen
 * @LastEditTime: 2025-09-22 13:41:48
 * @Description:
 */
import { defineComponent, computed } from 'vue'
import { Col } from 'ant-design-vue'
import { useInjectForm } from '../context/FormContext'

import type { ColProps } from 'ant-design-vue'
import type { PropType } from 'vue'

export default defineComponent({
  name: 'FormColWrapper',
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
    const { colProps, grid } = useInjectForm()
    const mergeColProps = computed(() => props.colProps ?? colProps?.value)
    const mergeGrid = computed(() => props.grid ?? grid?.value)
    return () => {
      if (mergeGrid.value) {
        return <Col {...mergeColProps.value}>{slots.default?.()}</Col>
      }
      return slots.default?.()
    }
  },
})
