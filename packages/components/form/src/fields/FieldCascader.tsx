/*
 * @Author: shen
 * @Date: 2023-08-10 15:53:17
 * @LastEditors: shen
 * @LastEditTime: 2025-08-31 16:41:44
 * @Description:
 */
import { defineComponent, computed } from 'vue'
import { Cascader } from 'ant-design-vue'
import { useInjectSlots } from '../context/FormSlotsContext'
import { useFieldOptions } from '../hooks/useFieldOptions'
import { commonFieldProps } from '../props'
import { useIntl } from '@pro-design-vue/components/config-provider'
import { RenderVNode } from '@pro-design-vue/utils'
import getSlot from '../utils/getSlot'
import FieldReadonly from './FieldReadonly'

import type { Option } from '../type'
const SLOT_NAMES = [
  'expandIcon',
  'clearIcon',
  'displayRender',
  'maxTagPlaceholder',
  'notFoundContent',
  'removeIcon',
  'tagRender',
  'suffixIcon',
]

export default defineComponent({
  name: 'FieldCascader',
  props: {
    ...commonFieldProps,
    expandIcon: {
      type: String,
      default: '',
    },
    clearIcon: {
      type: String,
      default: '',
    },
    displayRender: {
      type: String,
      default: '',
    },
    maxTagPlaceholder: {
      type: String,
      default: '',
    },
    notFoundContent: {
      type: String,
      default: '',
    },
    removeIcon: {
      type: String,
      default: '',
    },
    suffixIcon: {
      type: String,
      default: '',
    },
    tagRender: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
    },
    multiple: {
      type: Boolean,
      default: undefined,
    },
  },
  setup(props, { attrs }) {
    const intl = useIntl()
    const formSlotsContext = useInjectSlots()
    const { mergeOptions, loading, fieldNames } = useFieldOptions({
      request: props.request,
      options: props.options,
      valueEnum: props.valueEnum,
      dependencies: props.dependencies,
      fieldNames: (attrs as any).fieldNames,
      params: props.params,
    })

    const value = computed(() => {
      if (props.request && loading.value) {
        return undefined
      }
      return props.value
    })

    const readValue = computed(() => {
      if (!value.value) {
        return undefined
      }
      if (Array.isArray(value.value)) {
        return mergeOptions.value
          .filter((op) => value.value.includes(op.value))
          .map((op) => op.label ?? op.text)
          .join('，')
      }
      const option = mergeOptions.value.find((op) => op.value === value.value)
      return option?.label ?? option?.text
    })

    const slotsGetter = computed(() => {
      const temp = {}
      SLOT_NAMES.forEach((name) => {
        const slot = getSlot(props[name], formSlotsContext)
        if (slot) {
          temp[name] = (props) => <RenderVNode vnode={slot} props={props} />
        }
      })
      return temp
    })

    const formatValue = (value: any) => {
      if (typeof value === 'undefined') {
        if (props.multiple) {
          return []
        }
        return null
      }
      return value
    }

    const onChange: any = (value: any, option: Option | Option[]) => {
      props.onChange?.(formatValue(value), option)
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
        <Cascader
          value={value.value}
          {...attrs}
          style={{
            minWidth: '100px',
          }}
          multiple={props.multiple}
          fieldNames={fieldNames.value}
          loading={loading.value}
          placeholder={props.placeholder || intl.getMessage('form.selectPlaceholder', '请选择')}
          options={mergeOptions.value as any}
          v-slots={slotsGetter.value}
          onChange={onChange}
        />
      )
    }
  },
})
