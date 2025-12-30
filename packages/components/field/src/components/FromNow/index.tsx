/*
 * @Author: shen
 * @Date: 2025-12-05 15:58:31
 * @LastEditors: shen
 * @LastEditTime: 2025-12-30 11:04:58
 * @Description:
 */
import type { ProFieldProps } from '../../type'

import { computed, defineComponent, ref, toRefs, unref, type PropType, type VNode } from 'vue'
import { baseFieldProps } from '../../props'
import { useIntl } from '@pro-design-vue/components/config-provider'
import { DatePicker, Tooltip, type DatePickerProps } from 'ant-design-vue'
import { usePrefixCls, useVNodeJSX } from '@pro-design-vue/hooks'
import { omit, parseValueToDay } from '@pro-design-vue/utils'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime.js'

dayjs.extend(relativeTime)

export default defineComponent({
  name: 'FieldFromNow',
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
    const prefixCls = usePrefixCls('field-from-now')
    const fieldRef = ref<HTMLInputElement>()
    const renderContent = useVNodeJSX()
    const { mode, text, fieldProps } = toRefs(props)
    const dayValue = computed(() => parseValueToDay(fieldProps.value?.value as any) as dayjs.Dayjs)
    const onChange: any = (date, dateString) => {
      // 修正onChange 第一个参数为value
      fieldProps.value?.onChange?.(dateString, date)
    }

    expose({
      fieldRef: computed(() => {
        return unref(fieldRef)
      }),
    })
    return () => {
      if (mode.value === 'read') {
        const dom = (
          <Tooltip
            title={dayjs(text.value).format(
              fieldProps.value?.format || props.format || 'YYYY-MM-DD HH:mm:ss',
            )}
          >
            {dayjs(text.value).fromNow()}
          </Tooltip>
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
          fieldProps.value?.placeholder || intl.getMessage('tableForm.selectPlaceholder', '请选择')
        const dom = (
          <DatePicker
            ref={fieldRef}
            value={dayValue.value}
            placeholder={placeholder}
            class={prefixCls}
            showTime={fieldProps.value?.showTime ?? true}
            {...attrs}
            {...(omit(fieldProps.value ?? {}, [
              'onChange',
              'placeholder',
              'value',
              'showTime',
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
