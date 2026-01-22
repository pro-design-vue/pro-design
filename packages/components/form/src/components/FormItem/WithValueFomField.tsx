/*
 * @Author: shen
 * @Date: 2023-08-09 10:36:49
 * @LastEditors: shen
 * @LastEditTime: 2026-01-21 09:29:42
 * @Description:
 */

import { computed, defineComponent, watch, type PropType } from 'vue'
import { cloneElement, get, omitUndefined } from '@pro-design-vue/utils'
import { useInjectForm } from '../../context/FormContext'
import { useContent } from '@pro-design-vue/hooks'

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
    const renderContent = useContent()
    const fieldValue = computed(() => get(store.formValues.value, props.name!))
    return () => {
      const fieldChildren = renderContent('default', 'content')?.[0]
      // 此处添加rules规则时，会渲染3次，没发现问题，待优化
      const fieldProps = omitUndefined({
        ...fieldChildren?.props?.fieldProps,
      })
      return cloneElement(
        fieldChildren,
        omitUndefined({
          ...fieldChildren?.props,
          fieldProps,
          value: fieldValue.value ?? fieldProps.value,
        }),
      )
    }
  },
})
