/*
 * @Author: shen
 * @Date: 2025-12-05 15:58:31
 * @LastEditors: shen
 * @LastEditTime: 2026-01-19 15:47:04
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

const formatDate = (text: any, format: any) => {
  if (!text) return '-'
  if (typeof format === 'function') {
    return format(dayjs(text))
  } else {
    return dayjs(text).format((Array.isArray(format) ? format[0] : format) || 'YYYY-MM-DD')
  }
}

export default defineComponent({
  name: 'FieldDatePicker',
  inheritAttrs: false,
  props: {
    ...baseFieldProps,
    text: {
      type: [Number, String, Object] as PropType<string | number | dayjs.Dayjs>,
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
          format?: string
          onChange?: (...args: any[]) => void
        }
      >,
      default: undefined,
    },
  },
  setup(props, { slots, attrs, expose }) {
    const intl = useIntl()
    const prefixCls = usePrefixCls('field-date-picker')
    const fieldRef = ref<HTMLInputElement>()
    const renderContent = useVNodeJSX()
    const { mode, text, fieldProps } = toRefs(props)

    const [dayValue, setDayValue] = useMergedState(
      parseValueToDay(fieldProps.value?.defaultPickerValue as any) as dayjs.Dayjs,
      {
        value: computed(() => parseValueToDay(fieldProps.value?.value as any) as dayjs.Dayjs),
      },
    )

    const onChange: any = (date, dateString) => {
      // 修正onChange 第一个参数为value
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
        const dom = formatDate(text.value, fieldProps.value?.format || props.format)
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
          fieldProps.value?.placeholder || intl.getMessage('tableForm.selectPlaceholder', '请选择')
        const dom = (
          <DatePicker
            ref={fieldRef}
            value={dayValue.value}
            placeholder={placeholder}
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
            ]) as any)}
            v-slots={slots}
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
