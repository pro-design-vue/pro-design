/*
 * @Author: shen
 * @Date: 2025-12-05 15:58:31
 * @LastEditors: shen
 * @LastEditTime: 2025-12-30 17:28:53
 * @Description:
 */
import type { ProFieldProps } from '../../type'

import { computed, defineComponent, ref, toRefs, unref, type PropType, type VNode } from 'vue'
import { baseFieldProps } from '../../props'
import { useIntl } from '@pro-design-vue/components/config-provider'
import { InputNumber, type InputNumberProps } from 'ant-design-vue'
import { usePrefixCls, useVNodeJSX } from '@pro-design-vue/hooks'
import { isNil, omit } from '@pro-design-vue/utils'

export default defineComponent({
  name: 'FieldDigit',
  inheritAttrs: false,
  props: {
    ...baseFieldProps,
    text: {
      type: [Number, String],
      default: undefined,
    },
    fieldProps: {
      type: Object as PropType<
        InputNumberProps & {
          placeholder?: string
          intlProps?: Record<string, any>
          onChange?: (...args: any[]) => void
        }
      >,
      default: undefined,
    },
  },
  setup(props, { slots, attrs, expose }) {
    const intl = useIntl()
    const prefixCls = usePrefixCls('field-digit')
    const fieldRef = ref<HTMLInputElement>()
    const renderContent = useVNodeJSX()
    const { mode, text, fieldProps } = toRefs(props)

    const proxyChange = (value: number | string | null) => {
      let val = value ?? undefined

      if (!fieldProps.value?.stringMode && typeof val === 'string') {
        val = Number(val)
      }
      if (typeof val === 'number' && !isNil(val) && !isNil(fieldProps.value?.precision)) {
        val = Number(val.toFixed(fieldProps.value?.precision))
      }
      return val
    }

    expose({
      fieldRef: computed(() => {
        return unref(fieldRef)
      }),
    })
    return () => {
      if (mode.value === 'read') {
        let fractionDigits = {} as Record<string, any> as any
        if (fieldProps.value?.precision) {
          fractionDigits = {
            minimumFractionDigits: Number(fieldProps.value.precision),
            maximumFractionDigits: Number(fieldProps.value.precision),
          }
        }
        const digit = new Intl.NumberFormat(undefined, {
          ...fractionDigits,
          ...(fieldProps.value?.intlProps || {}),
        }).format(Number(text.value) as number)
        // 如果是 string 模式，什么都不要处理了
        const dom = !fieldProps.value?.stringMode ? (
          <span>
            {fieldProps.value?.formatter?.(digit, { userTyping: false, input: '' }) || digit}
          </span>
        ) : (
          <span>{text.value}</span>
        )

        const render = renderContent('render', {
          params: { text, mode, ...fieldProps.value, dom },
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
          <InputNumber
            ref={fieldRef}
            placeholder={placeholder}
            class={prefixCls}
            {...attrs}
            {...omit(fieldProps.value ?? {}, ['placeholder', 'intlProps', 'onChange'])}
            v-slots={slots}
            onChange={(val) => fieldProps.value?.onChange?.(proxyChange(val))}
          />
        )

        const renderFormItem = renderContent('renderFormItem', {
          params: { text, props: { mode, ...fieldProps.value }, dom },
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
