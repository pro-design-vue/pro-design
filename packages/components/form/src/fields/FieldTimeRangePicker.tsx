/*
 * @Author: shen
 * @Date: 2023-08-10 14:34:03
 * @LastEditors: shen
 * @LastEditTime: 2025-11-25 15:31:06
 * @Description:
 */
import type { PropType } from 'vue'

import { computed, defineComponent } from 'vue'
import { TimeRangePicker } from 'ant-design-vue'
import { useInjectSlots } from '../context/FormSlotsContext'
import { commonFieldProps } from '../props'
import { useIntl } from '@pro-design-vue/components/config-provider'
import { RenderVNode } from '@pro-design-vue/utils'
import dayjs from 'dayjs'
import getSlot from '../utils/getSlot'
import parseValueToDay from '../utils/parseValueToMoment'
import fieldDateFormatterMap from '../utils/fieldDateFormatterMap'
import FieldReadonly from './FieldReadonly'
import { useInjectForm } from '../context/FormContext'
import { useInjectFormList } from '../context/FormListContext'

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
  name: 'FieldTimeRangePicker',
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
      type: Array as PropType<any>,
      default: () => [],
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
    const { formData } = useInjectForm()
    const { rowData } = useInjectFormList()

    const formSlotsContext = useInjectSlots()
    const format = computed(() => props.format ?? fieldDateFormatterMap['time'])
    const valueFormat = computed(() => props.valueFormat ?? fieldDateFormatterMap['time'])
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
          temp[name] = (props) => (
            <RenderVNode
              vnode={slot}
              props={{ formData: formData.value, rowData: rowData?.value, ...(props ?? {}) }}
            />
          )
        }
      })
      return temp
    })

    const onChange = (value: any, dateString: [string, string]) => {
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
        <TimeRangePicker
          value={dayValue.value}
          {...attrs}
          format={format.value}
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
