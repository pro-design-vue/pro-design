/*
 * @Author: shen
 * @Date: 2025-12-05 15:58:31
 * @LastEditors: shen
 * @LastEditTime: 2025-12-29 15:59:48
 * @Description:
 */
import type { ProFieldProps } from '../../type'

import { computed, defineComponent, ref, toRefs, unref, type PropType, type VNode } from 'vue'
import { baseFieldProps } from '../../props'
import { useIntl } from '@pro-design-vue/components/config-provider'
import { InputNumber, Compact, Input, theme, type InputNumberProps } from 'ant-design-vue'
import { useMergedState, usePrefixCls, useVNodeJSX } from '@pro-design-vue/hooks'
import { isNil, omit } from '@pro-design-vue/utils'

export type Value = string | number | undefined | null

export type ValuePair = Value[]

export default defineComponent({
  name: 'FieldDigitRange',
  inheritAttrs: false,
  props: {
    ...baseFieldProps,
    text: {
      type: Array as PropType<ValuePair>,
      default: undefined,
    },
    fieldProps: {
      type: Object as PropType<
        InputNumberProps & {
          placeholder?: string | string[]
          defaultValue?: ValuePair
          value?: ValuePair
          separator?: string
          separatorWidth?: number
          intlProps?: Record<string, any>
          onChange?: (...args: any[]) => void
        }
      >,
      default: undefined,
    },
  },
  setup(props, { slots, attrs, expose }) {
    const intl = useIntl()
    const { token } = theme.useToken()
    const prefixCls = usePrefixCls('field-digit-range')
    const fieldRef = ref<HTMLInputElement>()
    const renderContent = useVNodeJSX()
    const { mode, text, fieldProps } = toRefs(props)

    const [valuePair, setValuePair] = useMergedState(() => fieldProps.value?.defaultValue, {
      value: computed(() => fieldProps.value?.value as ValuePair),
      onChange: (value) => {
        fieldProps.value?.onChange?.(value)
        props.onChange?.(value)
      },
    })

    const getContent = (number: Value) => {
      const digit = new Intl.NumberFormat(undefined, {
        minimumSignificantDigits: 2,
        ...(fieldProps?.value?.intlProps || {}),
      }).format(Number(number) as number)

      return fieldProps.value?.formatter?.(digit, { userTyping: false, input: '' }) || digit
    }

    const getInputNumberPlaceholder = (index: number) => {
      const placeholderValue = fieldProps.value?.placeholder || [
        intl.getMessage('tableForm.inputPlaceholder', '请输入'),
        intl.getMessage('tableForm.inputPlaceholder', '请输入'),
      ]
      return Array.isArray(placeholderValue) ? placeholderValue[index] : placeholderValue
    }

    const handleGroupBlur = () => {
      if (Array.isArray(valuePair.value)) {
        //   仅在两个值均为数字时才做比较并转换
        const [value0, value1] = valuePair.value
        if (typeof value0 === 'number' && typeof value1 === 'number' && value0 > value1) {
          setValuePair([value1, value0])
        } else if (value0 === undefined && value1 === undefined) {
          // 当两个值均为undefined时将值变为undefined，方便required处理
          setValuePair(undefined)
        }
      }
    }

    const handleChange = (index: number, changedValue: Value) => {
      const newValuePair = [...(valuePair.value || [])]
      newValuePair[index] = changedValue === null ? undefined : changedValue
      setValuePair(newValuePair)
    }

    expose({
      fieldRef: computed(() => {
        return unref(fieldRef)
      }),
    })
    return () => {
      const separator = fieldProps?.value?.separator ?? '~'
      if (mode.value === 'read') {
        const dom = (
          <span ref={ref}>
            {getContent(text.value?.[0])}
            {` ${separator} `}
            {getContent(text.value?.[1])}
          </span>
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
        const separatorWidth = fieldProps?.value?.separatorWidth || 30
        const dom = (
          <Compact block>
            <InputNumber
              placeholder={getInputNumberPlaceholder(0)}
              id={fieldProps?.value?.id ?? `${fieldProps?.value?.id}-0`}
              class={prefixCls}
              style={{ width: `calc((100% - ${separatorWidth}px) / 2)` }}
              value={valuePair.value?.[0] as any}
              defaultValue={fieldProps?.value?.defaultValue?.[0] as any}
              {...attrs}
              {...omit(fieldProps.value ?? {}, [
                'onChange',
                'placeholder',
                'id',
                'defaultValue',
                'value',
                'onBlur',
              ])}
              v-slots={slots}
              onBlur={handleGroupBlur}
              onChange={(changedValue) => handleChange(0, changedValue)}
            />
            <Input
              style={{
                width: separatorWidth + 'px',
                textAlign: 'center',
                borderInlineStart: 0,
                borderInlineEnd: 0,
                pointerEvents: 'none',
                backgroundColor: fieldProps?.value?.disabled
                  ? undefined
                  : token.value.colorBgContainer,
              }}
              placeholder={separator}
              disabled
            />
            <InputNumber
              placeholder={getInputNumberPlaceholder(0)}
              id={fieldProps?.value?.id ?? `${fieldProps?.value?.id}-1`}
              class={prefixCls}
              style={{ width: `calc((100% - ${separatorWidth}px) / 2)`, borderInlineStart: 0 }}
              value={valuePair.value?.[1] as any}
              defaultValue={fieldProps?.value?.defaultValue?.[1] as any}
              {...attrs}
              {...omit(fieldProps.value ?? {}, [
                'onChange',
                'placeholder',
                'id',
                'defaultValue',
                'value',
                'onBlur',
              ])}
              v-slots={slots}
              onBlur={handleGroupBlur}
              onChange={(changedValue) => handleChange(1, changedValue)}
            />
          </Compact>
        )

        const renderFormItem = renderContent('renderFormItem', {
          params: { text, props: { mode, ...fieldProps.value, onChange: setValuePair }, dom },
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
