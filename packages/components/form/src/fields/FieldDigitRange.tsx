/*
 * @Author: shen
 * @Date: 2023-08-10 14:34:03
 * @LastEditors: shen
 * @LastEditTime: 2025-07-26 23:36:51
 * @Description:
 */
import type { PropType } from 'vue'

import { computed, defineComponent } from 'vue'
import { Form, Input, InputNumber, Space } from 'ant-design-vue'
import { useInjectSlots } from '../context/FormSlotsContext'
import { commonFieldProps } from '../props'
import { useIntl } from '@pro-design-vue/components/config-provider'
import { omit, RenderVNode } from '@pro-design-vue/utils'
import getSlot from '../utils/getSlot'
import FieldReadonly from './FieldReadonly'

const SLOT_NAMES = ['addonAfter', 'addonBefore', 'prefix', 'upIcon', 'downIcon']

export default defineComponent({
  name: 'FieldDigitRange',
  inheritAttrs: false,
  props: {
    ...commonFieldProps,
    addonAfter: {
      type: String,
      default: '',
    },
    addonBefore: {
      type: String,
      default: '',
    },
    upIcon: {
      type: String,
      default: '',
    },
    downIcon: {
      type: String,
      default: '',
    },
    prefix: {
      type: String,
      default: '',
    },
    placeholder: {
      type: [String, Array] as PropType<string | string[]>,
      default: () => [],
    },
    separator: {
      type: String,
      default: '~',
    },
    separatorWidth: {
      type: Number,
      default: 30,
    },
  },
  emits: ['update:value', 'change'],
  setup(props, { attrs }) {
    const intl = useIntl()
    const formSlotsContext = useInjectSlots()
    const formItemContext = Form.useInjectFormItemContext()
    const fieldProps = computed(() => omit(attrs, ['class', 'style']))
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

    const readValue = computed(() => {
      if (props.value?.length) {
        return `${props.value?.[0]} - ${props.value?.[1]}`
      }
      return undefined
    })

    const getInputNumberPlaceholder = (index: number) => {
      return (
        (Array.isArray(props.placeholder) ? props.placeholder[index] : props.placeholder) ||
        intl.getMessage('form.inputPlaceholder', '请输入')
      )
    }

    const handleGroupBlur = (e) => {
      if (Array.isArray(props.value)) {
        const [value0, value1] = props.value
        if (typeof value0 === 'number' && typeof value1 === 'number' && value0 > value1) {
          props.onChange?.([value1, value0])
          formItemContext.onFieldChange()
        } else if (value0 === undefined && value1 === undefined) {
          props.onChange?.(undefined)
          formItemContext.onFieldChange()
        }
      }
      ;(fieldProps.value as any)?.onBlur?.(e)
    }
    const handleChange = (index: number, value: any) => {
      const newValuePair = [...(props.value || [])]
      newValuePair[index] = value === null ? undefined : value
      props.onChange?.(newValuePair)
      formItemContext.onFieldChange()
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
        <Space.Compact class={attrs.class} style={attrs.style}>
          <InputNumber
            {...fieldProps.value}
            value={props.value?.[0]}
            style={{
              width: `calc((100% - ${props.separatorWidth}px) / 2)`,
              marginInlineEnd: '0!important',
            }}
            placeholder={getInputNumberPlaceholder(0)}
            defaultValue={fieldProps.value.defaultValue?.[0]}
            v-slots={slotsGetter.value}
            onBlur={handleGroupBlur}
            onChange={(changedValue) => handleChange(0, changedValue)}
          />
          <Input
            style={{
              width: props.separatorWidth + 'px',
              textAlign: 'center',
              borderInlineStart: '0px',
              borderInlineEnd: '0px',
              pointerEvents: 'none',
            }}
            placeholder={props.separator}
            disabled
          />

          <InputNumber
            {...fieldProps.value}
            value={props.value?.[1]}
            id={`${fieldProps.value.id}-1`}
            style={{ width: `calc((100% - ${props.separatorWidth}px) / 2)` }}
            placeholder={getInputNumberPlaceholder(1)}
            defaultValue={fieldProps.value.defaultValue?.[1]}
            v-slots={slotsGetter.value}
            onChange={(changedValue) => handleChange(1, changedValue)}
            onBlur={handleGroupBlur}
          />
        </Space.Compact>
      )
    }
  },
})
