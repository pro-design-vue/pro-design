/*
 * @Author: shen
 * @Date: 2023-08-11 11:10:03
 * @LastEditors: shen
 * @LastEditTime: 2025-12-31 10:39:50
 * @Description:
 */
import type { ProFieldProps, ProFieldValueEnumType, SelectOptionType } from '../type'

import { computed, toRefs, watch, type ComputedRef, type Ref } from 'vue'
import { refDebounced } from '@vueuse/core'
import { useMergedState, useState } from '@pro-design-vue/hooks'
import { buildUUID, omitUndefined } from '@pro-design-vue/utils'
import { proFieldParsingValueEnumToArray } from '../utils/proFieldParsingValueEnumToArray'
import { objectToMap } from '../utils/objectToMap'
import useSWRV from 'swrv'

/**
 * 递归筛选 item
 *
 * @param item
 * @param keyWords
 * @returns
 */
function filerByItem(
  item: {
    label: string
    value: string
    optionType: string
    children: any[]
    options: any[]
  },
  keyWords?: string,
) {
  if (!keyWords) return true
  if (
    item?.label?.toString().toLowerCase().includes(keyWords.toLowerCase()) ||
    item?.value?.toString().toLowerCase().includes(keyWords.toLowerCase())
  ) {
    return true
  }
  if (item.children || item.options) {
    const findItem = [...(item.children || []), item.options || []].find((mapItem) => {
      return filerByItem(mapItem, keyWords)
    })
    if (findItem) return true
  }
  return false
}

export function useFetchData(props: ProFieldProps) {
  const { fieldProps } = toRefs(props)

  const [keyWords, setKeyWords] = useState<string | undefined>(props.defaultKeyWords)

  /** Key 是用来缓存请求的，如果不在是有问题 */
  const [cacheKey] = useState(() => {
    if (props.proFieldKey) {
      return props.proFieldKey.toString()
    }
    if (props.request) {
      return buildUUID()
    }
    return 'no-fetch'
  })

  const getOptionsFormValueEnum = (coverValueEnum: ProFieldValueEnumType) => {
    return proFieldParsingValueEnumToArray(objectToMap(coverValueEnum)).map(
      ({ value, text, ...rest }) => ({
        label: text,
        value,
        key: value,
        ...rest,
      }),
    )
  }

  const defaultOptions = computed(() => {
    if (!fieldProps?.value) return undefined
    const data = fieldProps?.value.options || fieldProps?.value.treeData
    if (!data) return undefined
    const { children, label, value } = fieldProps.value.fieldNames || {}
    const traverseFieldKey = (_options: SelectOptionType, type: 'children' | 'label' | 'value') => {
      if (!_options?.length) return
      const length = _options.length
      let i = 0
      while (i < length) {
        const cur = _options[i++]
        if (cur?.[children] || cur?.[label] || cur?.[value]) {
          cur[type] = cur[type === 'children' ? children : type === 'label' ? label : value]
          traverseFieldKey(cur[children], type)
        }
      }
    }

    if (children) traverseFieldKey(data, 'children')
    if (label) traverseFieldKey(data, 'label')
    if (value) traverseFieldKey(data, 'value')
    return data
  })

  const [options, setOptions] = useMergedState<SelectOptionType>(
    () => {
      if (props.valueEnum) {
        return getOptionsFormValueEnum(props.valueEnum)
      }
      return []
    },
    {
      value: defaultOptions,
    },
  )

  watch(
    () => props.valueEnum,
    () => {
      // 优先使用 fieldProps?.options
      if (!props.valueEnum || props.fieldProps?.options || props.fieldProps?.treeData) return
      setOptions(getOptionsFormValueEnum(props.valueEnum))
    },
    {
      immediate: true,
    },
  )

  const mergeParams = computed(() => [cacheKey.value, props.params, keyWords.value])

  const swrKey = refDebounced(
    mergeParams,
    props.debounceTime ?? fieldProps?.value?.debounceTime ?? 0,
  )

  const {
    data,
    mutate: setLocaleData,
    isValidating,
  } = useSWRV(
    () => {
      if (!props.request) {
        return null
      }
      return swrKey.value
    },
    (_, params, kw) => {
      return props.request!(
        {
          ...params,
          keyWords: kw,
        },
        { ...omitUndefined(props) },
      )
    },
    {
      shouldRetryOnError: false,
      revalidateOnFocus: false,
    },
  )

  const resOptions = computed(() => {
    const opt = options.value?.map((item) => {
      if (typeof item === 'string') {
        return {
          label: item,
          value: item,
        }
      }
      if (item.children || item.options) {
        const childrenOptions = [...(item.children || []), ...(item.options || [])].filter(
          (mapItem) => {
            return filerByItem(mapItem, keyWords.value)
          },
        )
        return {
          ...item,
          children: childrenOptions,
          options: childrenOptions,
        }
      }
      return item
    })

    // filterOption 为 true 时 filter数据, filterOption 默认为true
    if (props.fieldProps?.filterOption === true || props.fieldProps?.filterOption === undefined) {
      return opt?.filter((item) => {
        if (!item) return false
        if (!keyWords.value) return true
        return filerByItem(item as any, keyWords.value)
      })
    }

    return opt
  })

  return {
    loading: isValidating,
    options: props.request
      ? (data as Ref<SelectOptionType>)
      : (resOptions as ComputedRef<SelectOptionType>),
    fetchData: (fetchKeyWords?: string) => {
      setKeyWords(fetchKeyWords)
    },
    resetData: () => {
      setKeyWords(undefined)
      setLocaleData(() => [])
    },
  }
}
