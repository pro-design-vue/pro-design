/*
 * @Author: shen
 * @Date: 2025-12-05 15:58:31
 * @LastEditors: shen
 * @LastEditTime: 2026-01-19 15:47:36
 * @Description:
 */
import type { ProFieldProps } from '../../type'

import { computed, defineComponent, ref, toRefs, unref, type PropType, type VNode } from 'vue'
import { baseFieldProps } from '../../props'
import { useIntl } from '@pro-design-vue/components/config-provider'
import { Input, Image, type InputProps, type ImageProps } from 'ant-design-vue'
import { usePrefixCls, useVNodeJSX } from '@pro-design-vue/hooks'
import { omit } from '@pro-design-vue/utils'

export default defineComponent({
  name: 'FieldImage',
  inheritAttrs: false,
  props: {
    ...baseFieldProps,
    text: {
      type: String,
      default: undefined,
    },
    fieldProps: {
      type: Object as PropType<
        InputProps &
          ImageProps & {
            width?: number
          }
      >,
      default: undefined,
    },
  },
  setup(props, { slots, attrs, expose }) {
    const intl = useIntl()
    const prefixCls = usePrefixCls('field-image')
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
        const dom = (
          <Image
            width={fieldProps.value?.width || 32}
            src={text.value}
            {...omit(fieldProps?.value ?? {}, ['src', 'width'])}
          />
        )
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
        const placeholder =
          fieldProps.value?.placeholder || intl.getMessage('tableForm.inputPlaceholder', '请输入')
        const dom = (
          <Input
            {...attrs}
            v-slots={slots}
            ref={fieldRef}
            placeholder={placeholder}
            class={prefixCls}
            {...omit(fieldProps.value ?? {}, ['placeholder'])}
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
