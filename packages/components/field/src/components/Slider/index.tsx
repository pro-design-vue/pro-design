/*
 * @Author: shen
 * @Date: 2025-12-05 15:58:31
 * @LastEditors: shen
 * @LastEditTime: 2025-12-30 09:42:08
 * @Description:
 */
import type { ProFieldProps } from '../../type'

import { computed, defineComponent, ref, toRefs, unref, type PropType, type VNode } from 'vue'
import { baseFieldProps } from '../../props'
import { Slider, type SliderProps } from 'ant-design-vue'
import { usePrefixCls, useVNodeJSX } from '@pro-design-vue/hooks'
import { omit } from '@pro-design-vue/utils'

export default defineComponent({
  name: 'FieldSlider',
  inheritAttrs: false,
  props: {
    ...baseFieldProps,
    text: {
      type: [Number, String],
      default: undefined,
    },
    fieldProps: {
      type: Object as PropType<
        SliderProps & {
          onChange?: (...args: any[]) => void
        }
      >,
      default: undefined,
    },
  },
  setup(props, { slots, attrs, expose }) {
    const prefixCls = usePrefixCls('field-slider')
    const fieldRef = ref<HTMLInputElement>()
    const renderVNodeJSX = useVNodeJSX()
    const { mode, text, fieldProps } = toRefs(props)

    expose({
      fieldRef: computed(() => {
        return unref(fieldRef)
      }),
    })
    return () => {
      if (mode.value === 'read') {
        const dom = text.value
        const render = renderVNodeJSX('render', {
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
          <Slider
            ref={fieldRef}
            class={prefixCls}
            style={{
              minWidth: '120px',
            }}
            {...attrs}
            {...(fieldProps.value ?? {})}
            v-slots={slots}
          />
        )

        const renderFormItem = renderVNodeJSX('renderFormItem', {
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
