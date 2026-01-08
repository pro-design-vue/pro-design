/*
 * @Author: shen
 * @Date: 2022-06-14 14:02:10
 * @LastEditors: shen
 * @LastEditTime: 2025-10-24 15:45:29
 * @Description:
 */
import type { Ref, ComputedRef } from 'vue'
import type {
  RequestOptionsType,
  ProFormItemType,
  ProFieldValueEnumType,
  ProValueEnumMap,
} from '../type'
import type { DebouncedFunc } from 'lodash-unified'

import { ref, watch, computed, onMounted } from 'vue'
import { useInjectForm } from '../context/FormContext'
import { useFetchData } from './useFetchData'
import { useInjectFormList } from '../context/FormListContext'
import { debounce, get, isObject, merge, runFunction, set } from '@pro-design-vue/utils'
import { useState } from '@pro-design-vue/hooks'

type SelectOptionType = Partial<RequestOptionsType>[]

function getType(obj: any) {
  // @ts-ignore
  const type = Object.prototype.toString
    .call(obj)
    .match(/^\[object (.*)\]$/)[1]
    .toLowerCase()
  if (type === 'string' && typeof obj === 'object') return 'object'
  if (obj === null) return 'null'
  if (obj === undefined) return 'undefined'
  return type
}

export const ObjToMap = (value: ProFieldValueEnumType | undefined): ProValueEnumMap => {
  if (getType(value) === 'map') {
    return value as ProValueEnumMap
  }
  return new Map(Object.entries(value ?? {}))
}

export const fieldParsingValueEnumToArray = (
  valueEnumParams: ProFieldValueEnumType,
): SelectOptionType => {
  const enumArray: Partial<
    RequestOptionsType & {
      text: string
      /** 是否禁用 */
      disabled?: boolean
    }
  >[] = []
  const valueEnum = ObjToMap(valueEnumParams)

  valueEnum.forEach((_, key) => {
    const value = (valueEnum.get(key) ?? valueEnum.get(`${key}`)) as {
      text: string
      disabled?: boolean
    }

    if (!value) {
      return
    }

    if (typeof value === 'object' && value?.text) {
      enumArray.push({
        text: value?.text as unknown as string,
        value: key,
        label: value?.text as unknown as string,
        disabled: value.disabled,
      })
      return
    }
    enumArray.push({
      text: value as unknown as string,
      value: key,
      label: value as unknown as string,
    })
  })
  return enumArray
}

export const formatOptions = (
  options: (string | number | RequestOptionsType)[],
  fieldNames: { label: string; value: string; children: string },
) => {
  return options?.map((opt) => {
    if (!isObject(opt)) {
      return { label: opt, value: opt } as RequestOptionsType
    }
    opt.label = opt[fieldNames.label]
    opt.value = opt[fieldNames.value]
    opt.children = opt[fieldNames.children]

    if (opt?.text) {
      opt.label = opt?.text
    }
    if (Array.isArray(opt.options) && opt.options.length) {
      opt.options = formatOptions(opt.options, fieldNames)
    }

    if (Array.isArray(opt.children) && opt.children.length) {
      opt.children = formatOptions(opt.children, fieldNames)
    }
    return opt
  }) as SelectOptionType
}

export function useFieldOptions({
  options,
  request,
  params,
  valueEnum,
  fieldNames: fieldNamesConfig,
  dependencies,
  paginationConfig,
}: {
  options?: ProFormItemType['options']
  request?: ProFormItemType['request']
  params?: ProFormItemType['params']
  valueEnum?: ProFormItemType['valueEnum']
  fieldNames?: Record<string, any>
  dependencies?: ProFormItemType['dependencies']
  paginationConfig?: ComputedRef<null | Record<string, any>>
}): {
  loading: Ref<boolean>
  total: Ref<number>
  fieldNames: ComputedRef<Record<string, any>>
  mergeOptions: Ref<SelectOptionType>
  requestOptions: DebouncedFunc<() => Promise<void>>
  innerParams: Ref<Record<string, any>>
  setInnerParams: (val: Record<string, any>) => void
} {
  const { formData } = useInjectForm()
  const { index, rowData } = useInjectFormList()
  const loading = ref(true)
  const total = ref(0)
  const runOptions = computed(() => runFunction(options, formData.value, rowData?.value))
  const mergeOptions = ref<SelectOptionType>([])
  const fieldNames = computed(() => {
    return { label: 'label', value: 'value', children: 'children', ...fieldNamesConfig }
  })
  const [innerParams, setInnerParams] = useState<Record<string, any>>(
    () => paginationConfig?.value ?? {},
  )
  const mergeParams = computed(() => {
    const query = {}
    if (params) {
      const fieldParams = runFunction(params, formData.value)
      merge(query, fieldParams)
    }
    if (Array.isArray(dependencies)) {
      dependencies.forEach((namePath) => {
        const value = get(formData.value, namePath)
        if (value) {
          if (Array.isArray(namePath)) {
            set(query, namePath.join('-'), value)
          } else {
            set(query, namePath, value)
          }
        }
      })
      if (paginationConfig?.value) {
        setInnerParams({ ...innerParams?.value, current: 1 })
      }
    }
    if (innerParams?.value) {
      merge(query, innerParams?.value)
    }
    return query
  })

  watch(
    [() => valueEnum, () => runOptions.value],
    () => {
      if (Array.isArray(runOptions.value) && runOptions.value?.length > 0) {
        mergeOptions.value = formatOptions(runOptions.value, fieldNames.value)
      } else {
        const optionsEnum = runFunction(valueEnum, formData.value)
        mergeOptions.value = fieldParsingValueEnumToArray(optionsEnum)
      }
    },
    {
      immediate: true,
    },
  )

  const fetchData = useFetchData({ request })

  const requestOptions = debounce(async () => {
    loading.value = true
    const result = await fetchData(mergeParams.value, index?.value)
    if (Array.isArray(result)) {
      mergeOptions.value = formatOptions(result, fieldNames.value)
    }
    loading.value = false
  }, 200)

  watch(
    mergeParams,
    () => {
      if (request) {
        requestOptions()
      }
    },
    {
      immediate: true,
    },
  )

  onMounted(() => {
    if (!request) {
      loading.value = false
    }
  })

  return {
    loading,
    total,
    fieldNames,
    mergeOptions,
    requestOptions,
    innerParams,
    setInnerParams,
  }
}
