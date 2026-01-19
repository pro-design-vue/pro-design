/*
 * @Author: shen
 * @Date: 2023-08-09 10:36:49
 * @LastEditors: shen
 * @LastEditTime: 2026-01-19 17:28:05
 * @Description:
 */

import { computed, defineComponent, watch, type PropType } from 'vue'
import { cloneElement, get, omitUndefined } from '@pro-design-vue/utils'
import { useInjectForm } from '../../context/FormContext'

export default defineComponent({
  name: 'WithValueFomField',
  inheritAttrs: false,
  props: {
    name: {
      type: [String, Array] as PropType<any>,
    },
  },
  setup(props, { slots }) {
    const { store } = useInjectForm()
    const fieldValue = computed(() => get(store.formValues.value, props.name!))
    return () => {
      // 此处添加rules规则时，会渲染3次，没发现问题，待优化
      const fieldChildren = slots.default?.()?.[0]?.children?.[0]
      const fieldProps = omitUndefined({
        ...fieldChildren?.props?.fieldProps,
      })
      return cloneElement(
        fieldChildren,
        omitUndefined({
          ...fieldChildren.props,
          fieldProps,
          value: fieldValue.value ?? fieldProps.value,
        }),
      )
    }
  },
})
