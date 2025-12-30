/*
 * @Author: shen
 * @Date: 2025-12-05 15:58:31
 * @LastEditors: shen
 * @LastEditTime: 2025-12-30 10:59:04
 * @Description:
 */
import type { ProFieldProps } from '../../type'

import { computed, defineComponent, ref, toRefs, unref, type PropType, type VNode } from 'vue'
import { baseFieldProps } from '../../props'
import { useIntl } from '@pro-design-vue/components/config-provider'
import { TimePicker, type TimePickerProps } from 'ant-design-vue'
import { useMergedState, usePrefixCls, useVNodeJSX } from '@pro-design-vue/hooks'
import { omit, parseValueToDay } from '@pro-design-vue/utils'
import dayjs from 'dayjs'

export default defineComponent({
  name: 'FieldTimePicker',
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
    fieldProps: {
      type: Object as PropType<
        TimePickerProps & {
          format?: string
          onChange?: (...args: any[]) => void
        }
      >,
      default: undefined,
    },
  },
  setup(props, { slots, attrs, expose }) {
    const intl = useIntl()
    const prefixCls = usePrefixCls('field-time-picker')
    const fieldRef = ref<HTMLInputElement>()
    const renderContent = useVNodeJSX()
    const { mode, text, fieldProps } = toRefs(props)
    const finalFormat = computed(() => fieldProps.value?.format || props.format || 'HH:mm:ss')

    const [dayValue, setDayValue] = useMergedState(
      parseValueToDay(fieldProps.value?.defaultValue as any, finalFormat.value) as dayjs.Dayjs,
      {
        value: computed(
          () => parseValueToDay(fieldProps.value?.value as any, finalFormat.value) as dayjs.Dayjs,
        ),
      },
    )

    const onChange: any = (time, timeString) => {
      setDayValue(time)
      fieldProps.value?.onChange?.(time, timeString)
    }

    expose({
      fieldRef: computed(() => {
        return unref(fieldRef)
      }),
    })
    return () => {
      if (mode.value === 'read') {
        const dom = text.value ? dayjs(text.value).format(finalFormat.value) : '-'
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
          fieldProps.value?.placeholder || intl.getMessage('tableForm.selectPlaceholder', '请选择')
        const dom = (
          <TimePicker
            ref={fieldRef}
            value={dayValue.value}
            placeholder={placeholder}
            format={finalFormat.value}
            class={prefixCls}
            {...attrs}
            {...(omit(fieldProps.value ?? {}, [
              'onChange',
              'placeholder',
              'value',
              'format',
            ]) as any)}
            v-slots={slots}
            onChange={onChange}
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
