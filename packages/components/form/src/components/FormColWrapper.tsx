/*
 * @Author: shen
 * @Date: 2023-08-08 14:51:29
 * @LastEditors: shen
 * @LastEditTime: 2023-08-10 11:16:43
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
  },
  setup(props, { slots }) {
    const { colProps, grid } = useInjectForm()
    const mergeColProps = computed(() => props.colProps ?? colProps?.value)

    return () => {
      if (grid?.value) {
        return <Col {...mergeColProps.value}>{slots.default?.()}</Col>
      }
      return slots.default?.()
    }
  },
})
