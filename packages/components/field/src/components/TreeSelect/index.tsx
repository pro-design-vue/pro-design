/*
 * @Author: shen
 * @Date: 2025-12-05 15:58:31
 * @LastEditors: shen
 * @LastEditTime: 2026-01-19 15:52:38
 * @Description:
 */
import type { ProFieldProps } from '../../type'

import { computed, defineComponent, ref, toRefs, unref, watch, type PropType } from 'vue'
import { selectFieldProps } from '../../props'
import { useIntl } from '@pro-design-vue/components/config-provider'
import { Spin, TreeSelect, type TreeSelectProps } from 'ant-design-vue'
import { useMergedState, usePrefixCls, useVNodeJSX } from '@pro-design-vue/hooks'
import { useFieldFetchData } from '../../hooks/useFieldFetchData'
import { objectToMap } from '../../utils/objectToMap'
import { proFieldParsingText } from '../../utils/proFieldParsingText'
import { omit, type ProSchemaValueEnumObj } from '@pro-design-vue/utils'
import type { DefaultOptionType } from 'ant-design-vue/es/select'

export default defineComponent({
  name: 'FieldTreeSelect',
  inheritAttrs: false,
  props: {
    ...selectFieldProps,
    fieldProps: {
      type: Object as PropType<
        TreeSelectProps & {
          defaultSearchValue?: string
          fetchDataOnSearch?: boolean
          searchOnFocus?: boolean
          onChange?: (...args: any[]) => void
        }
      >,
      default: undefined,
    },
  },
  setup(props, { slots, attrs, expose }) {
    const { mode, text, fieldProps } = toRefs(props)
    const intl = useIntl()
    const prefixCls = usePrefixCls('field-tree-select')
    const renderContent = useVNodeJSX()
    const fieldRef = ref<HTMLInputElement>()
    const fetchDataOnSearch = computed(() => fieldProps?.value?.fetchDataOnSearch ?? true)
    const autoClearSearchValue = computed(() => fieldProps?.value?.autoClearSearchValue ?? true)
    const [searchValue, setSearchValue] = useMergedState<string | undefined>(undefined, {
      onChange: fieldProps.value?.onSearch as any,
      value: computed(() => fieldProps.value?.searchValue),
    })
    const { loading, options, fetchData, resetData } = useFieldFetchData(props)

    watch(
      () => fieldProps?.value?.searchValue,
      (newSearchValue) => {
        setSearchValue(newSearchValue)
      },
    )

    const optionsValueEnum = computed(() => {
      if (mode.value !== 'read') return

      const {
        label: labelPropsName = 'label',
        value: valuePropsName = 'value',
        children: childrenPropsName = 'children',
      } = fieldProps?.value?.fieldNames || {}

      const valuesMap = new Map()

      const traverseOptions = (_options: typeof options.value) => {
        if (!_options?.length) {
          return valuesMap
        }
        const length = _options.length
        let i = 0
        while (i < length) {
          const cur = _options[i++]
          valuesMap.set(cur?.[valuePropsName], cur?.[labelPropsName])
          traverseOptions(cur?.[childrenPropsName])
        }
        return valuesMap
      }

      return traverseOptions(options.value)
    })

    const onChange: TreeSelectProps['onChange'] = (value, optionList, extra) => {
      // 将搜索框置空 和 antd 行为保持一致
      if (fieldProps.value?.showSearch && fieldProps.value?.autoClearSearchValue) {
        fetchData(undefined)
        setSearchValue(undefined)
      }
      fieldProps.value?.onChange?.(value, optionList, extra)
    }

    expose({
      fieldRef: computed(() => {
        return unref(fieldRef)
      }),
      fetchData,
      resetData,
    })
    return () => {
      if (mode.value === 'read') {
        if (loading.value) {
          return <Spin size="small" />
        }
        const dom = proFieldParsingText(
          text.value!,
          objectToMap(
            props.valueEnum || optionsValueEnum.value,
          ) as unknown as ProSchemaValueEnumObj,
        )

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
          <TreeSelect
            ref={fieldRef}
            class={prefixCls}
            allowClear={fieldProps.value?.allowClear ?? true}
            loading={loading.value}
            searchValue={searchValue.value}
            autoClearSearchValue={autoClearSearchValue.value}
            placeholder={placeholder}
            onClear={() => {
              fieldProps?.value?.onClear?.()
              fetchData(undefined)
              if (fieldProps?.value?.showSearch) {
                setSearchValue(undefined)
              }
            }}
            treeData={options.value as TreeSelectProps['treeData']}
            style={{ minWidth: '60px' }}
            {...attrs}
            {...omit(fieldProps.value ?? {}, [
              'searchValue',
              'loading',
              'allowClear',
              'placeholder',
              'fetchDataOnSearch',
              'defaultSearchValue',
              'autoClearSearchValue',
              'onChange',
              'onSearch',
              'onClear',
              'onBlur',
            ])}
            v-slots={slots}
            onSearch={(value) => {
              if (fetchDataOnSearch.value) {
                fetchData(value)
              }
              setSearchValue(value)
            }}
            onBlur={(e) => {
              setSearchValue(undefined)
              fetchData(undefined)
              fieldProps?.value?.onBlur?.(e)
            }}
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
