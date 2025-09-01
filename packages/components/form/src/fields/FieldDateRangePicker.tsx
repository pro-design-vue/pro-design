/*
 * @Author: shen
 * @Date: 2023-08-10 14:34:03
 * @LastEditors: shen
 * @LastEditTime: 2025-09-01 13:34:03
 * @Description:
 */
import type { PropType } from 'vue'

import { computed, defineComponent } from 'vue'
import { RangePicker } from 'ant-design-vue'
import { useInjectSlots } from '../context/FormSlotsContext'
import { commonFieldProps } from '../props'
import { useIntl } from '@pro-design-vue/components/config-provider'
import { isObject, RenderVNode, runFunction } from '@pro-design-vue/utils'
import dayjs from 'dayjs'
import getSlot from '../utils/getSlot'
import parseValueToDay from '../utils/parseValueToMoment'
import fieldDateFormatterMap from '../utils/fieldDateFormatterMap'
import FieldReadonly from './FieldReadonly'

const SLOT_NAMES = [
  'dateRender',
  'nextIcon',
  'prevIcon',
  'suffixIcon',
  'superNextIcon',
  'superPrevIcon',
  'renderExtraFooter',
  'separator',
]

export default defineComponent({
  name: 'FieldDateRangePicker',
  props: {
    ...commonFieldProps(),
    dateRender: {
      type: String,
      default: '',
    },
    nextIcon: {
      type: String,
      default: '',
    },
    prevIcon: {
      type: String,
      default: '',
    },
    suffixIcon: {
      type: String,
      default: '',
    },
    superNextIcon: {
      type: String,
      default: '',
    },
    superPrevIcon: {
      type: String,
      default: '',
    },
    renderExtraFooter: {
      type: String,
      default: '',
    },
    separator: {
      type: String,
      default: '',
    },
    placeholder: {
      type: Array as PropType<string[]>,
      default: () => [],
    },
    format: {
      type: [String, Function],
      default: undefined,
    },
    picker: {
      type: String as PropType<'date' | 'week' | 'month' | 'quarter' | 'year'>,
      default: 'date',
    },
    valueFormat: {
      type: String,
      default: undefined,
    },
    showTime: {
      type: [Boolean, Object],
      default: undefined,
    },
  },
  setup(props, { attrs }) {
    const intl = useIntl()
    const formSlotsContext = useInjectSlots()

    const defaultFormat = computed(() => {
      const dataFormat = fieldDateFormatterMap[props.picker]
      if (props.showTime === true) {
        return dataFormat + ' ' + fieldDateFormatterMap['time']
      } else if (isObject(props.showTime)) {
        return dataFormat + ' ' + (props.showTime.format ?? fieldDateFormatterMap['time'])
      }
      return dataFormat
    })
    const format = computed(() => runFunction(props.format) ?? defaultFormat.value)
    const valueFormat = computed(() => props.valueFormat ?? defaultFormat.value)
    const dayValue = computed(
      () => parseValueToDay(props.value, format.value) as [dayjs.Dayjs, dayjs.Dayjs],
    )

    const readValue = computed(() => {
      if (dayValue.value?.length) {
        return `${dayjs(dayValue.value[0]).format(valueFormat.value)} - ${dayjs(dayValue.value[1]).format(valueFormat.value)}`
      }
      return undefined
    })

    const slotsGetter = computed(() => {
      const temp = {}
      SLOT_NAMES.forEach((name) => {
        const slot = getSlot(props[name], formSlotsContext)
        if (slot) {
          temp[name] = () => <RenderVNode vnode={slot} />
        }
      })
      return temp
    })

    const onChange = (value: any[], dateString: [string, string]) => {
      props.onChange?.(value, dateString)
    }

    return () => {
      if (props.readonly) {
        return (
          <FieldReadonly
            text={readValue.value}
            class={attrs.class}
            style={attrs.style}
            {...props.readonlyProps}
          />
        )
      }
      return (
        <RangePicker
          value={dayValue.value}
          {...attrs}
          format={format.value}
          picker={props.picker}
          showTime={props.showTime}
          valueFormat={valueFormat.value}
          placeholder={
            props.placeholder?.length === 2
              ? props.placeholder
              : [
                  intl.getMessage('form.selectPlaceholder', '请选择'),
                  intl.getMessage('form.selectPlaceholder', '请选择'),
                ]
          }
          v-slots={slotsGetter.value}
          onChange={onChange}
        />
      )
    }
  },
})
