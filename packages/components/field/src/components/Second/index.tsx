/*
 * @Author: shen
 * @Date: 2025-12-05 15:58:31
 * @LastEditors: shen
 * @LastEditTime: 2026-01-19 15:50:09
 * @Description:
 */
import type { ProFieldProps } from '../../type'

import { computed, defineComponent, ref, toRefs, unref, type PropType, type VNode } from 'vue'
import { baseFieldProps } from '../../props'
import { useIntl } from '@pro-design-vue/components/config-provider'
import { InputNumber, type InputNumberProps } from 'ant-design-vue'
import { usePrefixCls, useVNodeJSX } from '@pro-design-vue/hooks'
import { omit } from '@pro-design-vue/utils'

/**
 * 格式化秒
 *
 * @param result
 * @returns {string}
 */
export function formatSecond(result: number) {
  let newResult = result
  let formatText = ''
  let past = false
  if (newResult < 0) {
    newResult = -newResult
    past = true
  }
  const d = Math.floor(newResult / (3600 * 24))
  const h = Math.floor((newResult / 3600) % 24)
  const m = Math.floor((newResult / 60) % 60)
  const s = Math.floor(newResult % 60)
  formatText = `${s}秒`
  if (m > 0) {
    formatText = `${m}分钟${formatText}`
  }
  if (h > 0) {
    formatText = `${h}小时${formatText}`
  }
  if (d > 0) {
    formatText = `${d}天${formatText}`
  }
  if (past) {
    formatText += '前'
  }
  return formatText
}

export default defineComponent({
  name: 'FieldSecond',
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

    expose({
      fieldRef: computed(() => {
        return unref(fieldRef)
      }),
    })
    return () => {
      if (mode.value === 'read') {
        const secondText = formatSecond(Number(text.value) as number)
        const dom = <span ref={ref}>{secondText}</span>

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
        const placeholder =
          fieldProps.value?.placeholder || intl.getMessage('tableForm.inputPlaceholder', '请输入')
        const dom = (
          <InputNumber
            ref={fieldRef}
            placeholder={placeholder}
            class={prefixCls}
            min={fieldProps.value?.min ?? 0}
            style={{ width: '100%' }}
            {...attrs}
            {...omit(fieldProps.value ?? {}, ['placeholder', 'min'])}
            v-slots={slots}
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
