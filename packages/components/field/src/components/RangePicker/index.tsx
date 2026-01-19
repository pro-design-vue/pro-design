/*
 * @Author: shen
 * @Date: 2025-12-05 15:58:31
 * @LastEditors: shen
 * @LastEditTime: 2025-12-30 13:05:34
 * @Description:
 */
import type { ProFieldProps } from '../../type'

import { computed, defineComponent, ref, toRefs, unref, type PropType, type VNode } from 'vue'
import { baseFieldProps } from '../../props'
import { useIntl } from '@pro-design-vue/components/config-provider'
import { DatePicker, type DatePickerProps } from 'ant-design-vue'
import { useMergedState, usePrefixCls, useVNodeJSX } from '@pro-design-vue/hooks'
import { omit, parseValueToDay } from '@pro-design-vue/utils'
import dayjs from 'dayjs'

export default defineComponent({
  name: 'FieldRangePicker',
  inheritAttrs: false,
  props: {
    ...baseFieldProps,
    text: {
      type: Array as PropType<(string | number | dayjs.Dayjs)[]>,
      default: undefined,
    },
    format: {
      type: String,
      default: undefined,
    },
    showTime: {
      type: Boolean,
      default: undefined,
    },
    picker: {
      type: String as PropType<'date' | 'week' | 'month' | 'quarter' | 'year'>,
      default: undefined,
    },
    fieldProps: {
      type: Object as PropType<
        DatePickerProps & {
          separator?: string
          onChange?: (...args: any[]) => void
        }
      >,
      default: undefined,
    },
  },
  setup(props, { slots, attrs, expose }) {
    const intl = useIntl()
    const prefixCls = usePrefixCls('field-range-picker')
    const fieldRef = ref<HTMLInputElement>()
    const renderContent = useVNodeJSX()
    const { mode, text, fieldProps } = toRefs(props)
    const genFormatText = (formatValue: dayjs.Dayjs) => {
      if (typeof fieldProps.value?.format === 'function') {
        return fieldProps.value?.format?.(formatValue)
      }
      return fieldProps.value?.format || props.format || 'YYYY-MM-DD'
    }

    const parsedText = computed(() => {
      const [startText, endText] = Array.isArray(text.value) ? text.value : []
      return [
        startText
          ? dayjs(startText as string).format(genFormatText(dayjs(startText as string)) as string)
          : '',
        endText
          ? dayjs(endText as string).format(genFormatText(dayjs(endText as string)) as string)
          : '',
      ]
    })

    const [dayValue, setDayValue] = useMergedState(
      parseValueToDay(fieldProps.value?.defaultPickerValue as any) as dayjs.Dayjs[],
      {
        value: computed(() => parseValueToDay(fieldProps.value?.value as any) as dayjs.Dayjs[]),
      },
    )

    const separatorNode = computed<VNode>(() => {
      const separator = renderContent('separator', {
        slotFirst: true,
        props: fieldProps.value,
      })
      if (separator) return separator
      return null
    })

    const onChange: any = (date, dateString) => {
      setDayValue(date)
      fieldProps.value?.onChange?.(date, dateString)
    }

    expose({
      fieldRef: computed(() => {
        return unref(fieldRef)
      }),
    })
    return () => {
      if (mode.value === 'read') {
        const dom = (
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px',
              alignItems: 'center',
            }}
          >
            <div>{parsedText.value?.[0] || '-'}</div>
            {separatorNode.value && <span>{separatorNode.value}</span>}
            <div>{parsedText.value?.[1] || '-'}</div>
          </div>
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
          <DatePicker.RangePicker
            ref={fieldRef}
            value={dayValue.value}
            placeholder={[
              intl.getMessage('tableForm.selectPlaceholder', '请选择'),
              intl.getMessage('tableForm.selectPlaceholder', '请选择'),
            ]}
            showTime={props.showTime ?? fieldProps.value?.showTime}
            format={fieldProps.value?.format || props.format}
            picker={props.picker || fieldProps.value?.picker}
            class={prefixCls}
            {...attrs}
            {...(omit(fieldProps.value ?? {}, [
              'onChange',
              'placeholder',
              'value',
              'showTime',
              'format',
              'picker',
              'separator',
            ]) as any)}
            v-slots={{
              ...slots,
              // separator: separatorNode.value ? () => separatorNode.value : undefined,
            }}
            onChange={onChange}
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
