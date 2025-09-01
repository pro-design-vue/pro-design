/*
 * @Author: shen
 * @Date: 2023-08-10 14:34:03
 * @LastEditors: shen
 * @LastEditTime: 2025-09-01 13:34:28
 * @Description:
 */
import { computed, defineComponent } from 'vue'
import { TimePicker } from 'ant-design-vue'
import { useInjectSlots } from '../context/FormSlotsContext'
import { commonFieldProps } from '../props'
import { useIntl } from '@pro-design-vue/components/config-provider'
import { RenderVNode } from '@pro-design-vue/utils'
import dayjs from 'dayjs'
import getSlot from '../utils/getSlot'
import parseValueToDay from '../utils/parseValueToMoment'
import fieldDateFormatterMap from '../utils/fieldDateFormatterMap'
import FieldReadonly from './FieldReadonly'

const SLOT_NAMES = ['clearIcon', 'renderExtraFooter', 'suffixIcon']

export default defineComponent({
  name: 'FieldTimePicker',
  props: {
    ...commonFieldProps(),
    clearIcon: {
      type: String,
      default: '',
    },
    renderExtraFooter: {
      type: String,
      default: '',
    },
    suffixIcon: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
    },
    format: {
      type: String,
      default: undefined,
    },
    valueFormat: {
      type: String,
      default: undefined,
    },
  },
  setup(props, { attrs }) {
    const intl = useIntl()
    const formSlotsContext = useInjectSlots()
    const format = computed(() => props.format ?? fieldDateFormatterMap['time'])
    const valueFormat = computed(() => props.valueFormat ?? fieldDateFormatterMap['time'])
    const dayValue = computed(() => parseValueToDay(props.value, format.value) as dayjs.Dayjs)
    const readValue = computed(() => {
      if (dayValue.value) {
        return dayjs(dayValue.value).format(valueFormat.value)
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

    const onChange = (value: any, dateString: string) => {
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
        <TimePicker
          value={dayValue.value}
          {...attrs}
          format={format.value}
          valueFormat={valueFormat.value}
          placeholder={props.placeholder || intl.getMessage('form.selectPlaceholder', '请选择')}
          v-slots={slotsGetter.value}
          onChange={onChange}
        />
      )
    }
  },
})
