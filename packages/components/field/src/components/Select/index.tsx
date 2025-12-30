/*
 * @Author: shen
 * @Date: 2025-12-05 15:58:31
 * @LastEditors: shen
 * @LastEditTime: 2025-12-30 09:41:40
 * @Description:
 */
import type { ProFieldProps, ProSchemaValueEnumObj, RequestOptionsType } from '../../type'

import {
  computed,
  defineComponent,
  ref,
  toRefs,
  unref,
  watch,
  type PropType,
  type VNode,
} from 'vue'
import { selectFieldProps } from '../../props'
import { useIntl } from '@pro-design-vue/components/config-provider'
import { Select, type SelectProps } from 'ant-design-vue'
import { usePrefixCls, useState, useVNodeJSX } from '@pro-design-vue/hooks'
import { useFetchData } from '../../hooks/useFetchData'
import { objectToMap } from '../../utils/objectToMap'
import { proFieldParsingText } from '../../utils/proFieldParsingText'
import { buildUUID, omit } from '@pro-design-vue/utils'
import type { DefaultOptionType } from 'ant-design-vue/es/select'

export default defineComponent({
  name: 'FieldSelect',
  inheritAttrs: false,
  props: {
    ...selectFieldProps,
    fieldProps: {
      type: Object as PropType<
        SelectProps & {
          preserveOriginalLabel?: boolean
          defaultSearchValue?: string
          fetchDataOnSearch?: boolean
          searchOnFocus?: boolean
          resetAfterSelect?: boolean
          onChange?: (...args: any[]) => void
        }
      >,
      default: undefined,
    },
  },
  setup(props, { slots, attrs, expose }) {
    const { mode, text, fieldProps } = toRefs(props)
    const intl = useIntl()
    const prefixCls = usePrefixCls('field-select')
    const renderContent = useVNodeJSX()
    const fieldRef = ref<HTMLInputElement>()
    const fetchDataOnSearch = computed(() => fieldProps?.value?.fetchDataOnSearch ?? true)
    const autoClearSearchValue = computed(() => fieldProps?.value?.autoClearSearchValue ?? true)
    const preserveOriginalLabel = computed(() => fieldProps?.value?.preserveOriginalLabel ?? false)
    const resetAfterSelect = computed(() => fieldProps?.value?.resetAfterSelect ?? false)
    const optionFilterProp = computed(() => fieldProps?.value?.optionFilterProp ?? 'label')
    const optionLabelProp = computed(() => fieldProps?.value?.optionLabelProp ?? 'label')
    const [searchValue, setSearchValue] = useState<string | undefined>(
      fieldProps?.value?.searchValue ?? fieldProps?.value?.defaultSearchValue,
    )
    const { loading, options, fetchData, resetData } = useFetchData(props)

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
        options: optionsPropsName = 'options',
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
          traverseOptions(cur?.[optionsPropsName])
        }
        return valuesMap
      }

      return traverseOptions(options.value)
    })

    const getMergeValue: SelectProps['onChange'] = (value, option) => {
      if (Array.isArray(value) && Array.isArray(option) && value.length > 0) {
        // 多选情况且用户有选择
        return value.map((item, index) => {
          const optionItem = (option as DefaultOptionType[])?.[index] as DefaultOptionType
          const dataItem = optionItem?.['data-item'] || {}
          return {
            ...dataItem,
            ...item,
            label: preserveOriginalLabel.value ? dataItem.label : item.label,
          }
        })
      }
      return []
    }

    const genOptions = (mapOptions: RequestOptionsType[]): DefaultOptionType[] => {
      const {
        label: labelPropsName = 'label',
        value: valuePropsName = 'value',
        options: optionsPropsName = 'options',
      } = fieldProps?.value?.fieldNames || {}

      return mapOptions.map((item, index) => {
        const { class: itemClassName, optionType, ...resetItem } = item as RequestOptionsType

        const label = item[labelPropsName]
        const value = item[valuePropsName]
        const itemOptions = item[optionsPropsName] ?? []

        if (optionType === 'optGroup' || item.options) {
          return {
            label: label,
            ...resetItem,
            data_title: label,
            title: label,
            key: value ?? `${label?.toString()}-${index}-${buildUUID()}`, // 防止因key相同导致虚拟滚动出问题
            children: genOptions(itemOptions),
          } as DefaultOptionType
        }

        return {
          title: label,
          ...resetItem,
          data_title: label,
          value: value ?? index,
          key: value ?? `${label?.toString()}-${index}-${buildUUID()}`,
          'data-item': item,
          class: `${prefixCls}-option ${itemClassName || ''}`.trim(),
          label: label,
        } as DefaultOptionType
      })
    }

    const formatOptions = computed(() => genOptions(options.value ?? []))

    const onChange: SelectProps['onChange'] = (...args) => {
      fieldProps.value?.onChange?.(...args)
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
        const dom = proFieldParsingText(
          text.value!,
          objectToMap(
            props.valueEnum || optionsValueEnum.value,
          ) as unknown as ProSchemaValueEnumObj,
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
          <Select
            ref={fieldRef}
            class={prefixCls}
            allowClear={fieldProps.value?.allowClear ?? true}
            loading={loading.value}
            searchValue={searchValue.value}
            optionFilterProp={optionFilterProp.value}
            optionLabelProp={optionLabelProp.value}
            autoClearSearchValue={autoClearSearchValue.value}
            placeholder={placeholder}
            onClear={() => {
              fieldProps?.value?.onClear?.()
              fetchData(undefined)
              if (fieldProps?.value?.showSearch) {
                setSearchValue(undefined)
              }
            }}
            style={{ minWidth: '100px' }}
            {...attrs}
            {...omit(fieldProps.value ?? {}, [
              'searchValue',
              'loading',
              'options',
              'allowClear',
              'placeholder',
              'optionFilterProp',
              'optionLabelProp',
              'filterOption',
              'fetchDataOnSearch',
              'defaultSearchValue',
              'resetAfterSelect',
              'preserveOriginalLabel',
              'autoClearSearchValue',
              'onChange',
              'onSearch',
              'onClear',
              'onFocus',
            ])}
            options={formatOptions.value}
            v-slots={slots}
            filterOption={
              fieldProps?.value?.filterOption === false
                ? false
                : (inputValue, option) => {
                    if (
                      fieldProps?.value?.filterOption &&
                      typeof fieldProps?.value?.filterOption === 'function'
                    ) {
                      return fieldProps?.value?.filterOption(inputValue, {
                        ...option,
                        label: option?.data_title,
                      })
                    }
                    return !!(
                      option?.data_title
                        ?.toString()
                        .toLowerCase()
                        .includes(inputValue.toLowerCase()) ||
                      option?.label?.toString().toLowerCase().includes(inputValue.toLowerCase()) ||
                      option?.value?.toString().toLowerCase().includes(inputValue.toLowerCase())
                    )
                  }
            }
            onSearch={
              fieldProps?.value?.showSearch
                ? (value) => {
                    if (fetchDataOnSearch.value) {
                      fetchData(value)
                    }
                    fieldProps?.value?.onSearch?.(value)
                    setSearchValue(value)
                  }
                : undefined
            }
            onFocus={(e) => {
              if (fieldProps?.value?.searchOnFocus) {
                fetchData(searchValue.value)
              }
              fieldProps?.value?.onFocus?.(e)
            }}
            onChange={(value, optionList, ...rest) => {
              // 将搜索框置空 和 antd 行为保持一致
              if (fieldProps?.value?.showSearch && autoClearSearchValue.value) {
                fetchData(undefined)
                fieldProps?.value?.onSearch?.('')
                setSearchValue(undefined)
              }

              if (!fieldProps?.value?.labelInValue) {
                onChange?.(value, optionList, ...rest)
                return
              }

              if (fieldProps?.value?.mode !== 'multiple' && !Array.isArray(optionList)) {
                // 单选情况且用户选择了选项
                const dataItem = optionList && optionList['data-item']
                // 如果value值为空则是清空时产生的回调,直接传值就可以了
                if (!value || !dataItem) {
                  const changedValue = value
                    ? {
                        ...(value as any),
                        // 这里有一种情况，如果用户使用了 request和labelInValue，保存之后，刷新页面，正常回显，但是再次添加会出现 label 丢失的情况。所以需要兼容
                        label: preserveOriginalLabel.value
                          ? dataItem?.label || (value as any)?.label
                          : (value as any)?.label,
                      }
                    : value
                  onChange?.(changedValue, optionList, ...rest)
                } else {
                  onChange?.(
                    {
                      ...(value as any),
                      ...dataItem,
                      label: preserveOriginalLabel.value ? dataItem.label : (value as any)?.label,
                    },
                    optionList,
                    ...rest,
                  )
                }
                return
              }
              // 合并值
              const mergeValue = getMergeValue(value, optionList) as any
              onChange?.(mergeValue, optionList, ...rest)

              // 将搜索结果置空，重新搜索
              if (resetAfterSelect.value) resetData()
            }}
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
