/*
 * @Author: shen
 * @Date: 2023-08-10 15:53:17
 * @LastEditors: shen
 * @LastEditTime: 2025-07-26 23:39:49
 * @Description:
 */
import type { PropType } from 'vue'
import { defineComponent, computed } from 'vue'
import { Select } from 'ant-design-vue'
import { useInjectSlots } from '../context/FormSlotsContext'
import { useFieldOptions } from '../hooks/useFieldOptions'
import { commonFieldProps } from '../props'
import { useIntl } from '@pro-design-vue/components/config-provider'
import { RenderVNode } from '@pro-design-vue/utils'
import getSlot from '../utils/getSlot'
import FieldReadonly from './FieldReadonly'

import type { Option } from '../type'
const SLOT_NAMES = [
  'menuItemSelectedIcon',
  'clearIcon',
  'dropdownRender',
  'maxTagPlaceholder',
  'notFoundContent',
  'option',
  'removeIcon',
  'tagRender',
  'suffixIcon',
]

export default defineComponent({
  name: 'FieldSelect',
  inheritAttrs: false,
  props: {
    ...commonFieldProps(),
    menuItemSelectedIcon: {
      type: String,
      default: '',
    },
    clearIcon: {
      type: String,
      default: '',
    },
    dropdownRender: {
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
    option: {
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
    pagination: {
      type: [Boolean, Object],
      default: false,
    },
    showSearch: {
      type: Boolean,
      default: false,
    },
    filterOption: Function,
    mode: {
      type: String as PropType<any>,
      default: undefined,
    },
  },
  setup(props, { attrs, expose }) {
    const intl = useIntl()
    const formSlotsContext = useInjectSlots()
    const mergePaginationConfig = computed(() => {
      if (!props.pagination) {
        return null
      }
      if (props.pagination === true) {
        return { current: 1, pageSize: 10 }
      }
      return { current: props.pagination.current || 1, pageSize: props.pagination.pageSize || 10 }
    })

    const {
      mergeOptions,
      loading,
      fieldNames,
      requestOptions,
      total,
      innerParams,
      setInnerParams,
    } = useFieldOptions({
      request: props.request,
      options: props.options,
      valueEnum: props.valueEnum,
      dependencies: props.dependencies,
      fieldNames: (attrs as any).fieldNames,
      params: props.params,
      paginationConfig: mergePaginationConfig,
    })

    const mergeFilterOption = computed<any>(() => {
      if (props.request && mergePaginationConfig.value) {
        return () => true
      }
      if (props.filterOption) {
        return props.filterOption
      }
      return (input: string, option: any) => {
        return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
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
          .filter((op) => {
            if (attrs.labelInValue) {
              return value.value.find((val) => val.value === op.value)
            }
            return value.value.includes(op.value)
          })
          .map((op) => op.label ?? op.text)
          .join('，')
      }
      const option = mergeOptions.value.find((op) => {
        if (attrs.labelInValue) {
          return op.value === value.value.value
        }
        return op.value === value.value
      })
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

    const formatValue = (value?: any) => {
      if (typeof value === 'undefined') {
        if (props.mode === 'multiple' || props.mode === 'tags') {
          return []
        }
        return null
      }
      return value
    }

    const onChange: any = (value: any, option: Option | Option[]) => {
      props.onChange?.(formatValue(value), option)
    }

    const onSearch = (searchValue: any) => {
      if (mergePaginationConfig.value) {
        setInnerParams({
          keyword: searchValue,
          current: 1,
          pageSize: mergePaginationConfig.value.pageSize,
        })
        const isExist = Array.isArray(value.value) ? value.value?.length : !!value.value
        if (isExist) {
          props.onChange?.(formatValue())
        }
      }
    }

    const onPopupScroll = (e) => {
      if (!mergePaginationConfig.value) {
        return
      }
      const { target } = e
      // 滚动 触底 看接口是否还有剩余的值没传过来
      if (target.scrollTop + target.offsetHeight === target.scrollHeight) {
        if (mergeOptions.value.length < total.value) {
          setInnerParams({ ...innerParams.value, current: innerParams.value.current + 1 })
        }
      }
    }

    expose({
      refresh: () => {
        if (props.request) {
          requestOptions()
        }
      },
    })
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
        <Select
          value={value.value}
          {...attrs}
          style={{
            minWidth: '120px',
          }}
          mode={props.mode}
          fieldNames={fieldNames.value}
          loading={loading.value}
          filterOption={mergeFilterOption.value}
          placeholder={props.placeholder || intl.getMessage('form.selectPlaceholder', '请选择')}
          options={mergeOptions.value as any}
          showSearch={props.showSearch}
          v-slots={slotsGetter.value}
          onChange={onChange}
          onPopupScroll={onPopupScroll}
          onSearch={props.showSearch ? onSearch : undefined}
        />
      )
    }
  },
})
