/*
 * @Author: shen
 * @Date: 2025-12-05 15:58:31
 * @LastEditors: shen
 * @LastEditTime: 2025-12-31 14:18:52
 * @Description:
 */
import type { ProFieldProps } from '../../type'

import { computed, defineComponent, ref, toRefs, unref, type PropType, type VNode } from 'vue'
import { baseFieldProps } from '../../props'
import { Rate, type RateProps } from 'ant-design-vue'
import { useMergedState, usePrefixCls, useVNodeJSX } from '@pro-design-vue/hooks'
import { omit } from '@pro-design-vue/utils'

export default defineComponent({
  name: 'FieldRate',
  inheritAttrs: false,
  props: {
    ...baseFieldProps,
    text: {
      type: Number,
      default: undefined,
    },
    fieldProps: {
      type: Object as PropType<
        RateProps & {
          onChange?: (...args: any[]) => void
        }
      >,
      default: undefined,
    },
  },
  setup(props, { slots, attrs, expose }) {
    const fieldRef = ref<HTMLInputElement>()
    const prefixCls = usePrefixCls('field-rate')
    const renderContent = useVNodeJSX()
    const { mode, text, fieldProps } = toRefs(props)
    const [innerValue, setInnerValue] = useMergedState(undefined, {
      value: computed(() => fieldProps.value?.value),
      onChange: (value) => {
        fieldProps.value?.onChange?.(value)
      },
    })

    expose({
      fieldRef: computed(() => {
        return unref(fieldRef)
      }),
    })
    return () => {
      if (mode.value === 'read') {
        const dom = (
          <Rate
            disabled
            allowHalf
            style={{
              lineHeight: 1,
            }}
            {...attrs}
            {...omit(fieldProps.value ?? {}, ['onChange', 'allowHalf', 'disabled', 'value'])}
            value={text.value}
          />
        )

        const render = renderContent('render', {
          params: { text: text.value, mode: mode.value, ...fieldProps.value, dom },
          slotFirst: true,
        })
        if (render) {
          return render
        }
        return dom
      }

      if (mode.value === 'edit' || mode.value === 'update') {
        const dom = (
          <Rate
            ref={fieldRef}
            class={prefixCls}
            value={innerValue.value}
            allowHalf={fieldProps.value?.allowHalf ?? true}
            style={{
              lineHeight: 1,
            }}
            {...attrs}
            {...omit(fieldProps.value ?? {}, ['onChange', 'allowHalf', 'value'])}
            v-slots={slots}
            onChange={setInnerValue}
          />
        )

        const renderFormItem = renderContent('renderFormItem', {
          params: { text: text.value, mode: mode.value, ...fieldProps.value, dom },
          slotFirst: true,
        })
        if (renderFormItem) {
          return renderFormItem
        }
        return dom
      }

      return null
    }
  },
})
