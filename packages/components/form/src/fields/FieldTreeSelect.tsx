/*
 * @Author: shen
 * @Date: 2023-08-10 15:53:17
 * @LastEditors: shen
 * @LastEditTime: 2025-07-26 23:46:11
 * @Description:
 */
import { defineComponent, computed } from 'vue'
import { TreeSelect } from 'ant-design-vue'
import { useInjectSlots } from '../context/FormSlotsContext'
import { useFieldOptions } from '../hooks/useFieldOptions'
import { commonFieldProps } from '../props'
import { useIntl } from '@pro-design-vue/components/config-provider'
import { RenderVNode } from '@pro-design-vue/utils'
import getSlot from '../utils/getSlot'
import FieldReadonly from './FieldReadonly'

import type { Option } from '../type'
const SLOT_NAMES = [
  'maxTagPlaceholder',
  'notFoundContent',
  'searchPlaceholder',
  'suffixIcon',
  'tagRender',
  'title',
]

export default defineComponent({
  name: 'FieldTreeSelect',
  props: {
    ...commonFieldProps(),
    maxTagPlaceholder: {
      type: String,
      default: '',
    },
    notFoundContent: {
      type: String,
      default: '',
    },
    searchPlaceholder: {
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
    title: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
    },
    treeCheckable: {
      type: Boolean,
      default: undefined,
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
        if (!value.value.length) {
          return undefined
        }
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
        if (props.multiple || props.treeCheckable) {
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
        <TreeSelect
          value={value.value}
          {...attrs}
          style={{
            minWidth: '160px',
          }}
          treeCheckable={props.treeCheckable}
          multiple={props.multiple}
          fieldNames={fieldNames.value}
          loading={loading.value}
          placeholder={props.placeholder || intl.getMessage('form.selectPlaceholder', '请选择')}
          treeData={mergeOptions.value as any}
          v-slots={slotsGetter.value}
          onChange={onChange}
        />
      )
    }
  },
})
