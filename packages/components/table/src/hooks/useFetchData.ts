/*
 * @Author: shen
 * @Date: 2023-11-12 12:24:29
 * @LastEditors: shen
 * @LastEditTime: 2025-09-29 16:45:36
 * @Description:
 */
import type { SpinProps } from 'ant-design-vue/es/spin'
import type { ComputedRef, Ref } from 'vue'
import type { RequestData, ProTableProps, SorterResult } from '../components/interface'
import type { IntlType } from '@pro-design-vue/components/config-provider'

import {
  ref,
  computed,
  watch,
  onUnmounted,
  onMounted,
  isReactive,
  toRaw,
  onDeactivated,
  onActivated,
} from 'vue'
import { useDebounceFn, usePrevious } from '@vueuse/core'
import { useMergedState } from '@pro-design-vue/hooks'
import { runFunction } from '@pro-design-vue/utils'
import { useIntl } from '@pro-design-vue/components/config-provider'
export type PageInfo = {
  pageSize: number
  total: number
  current: number
}

export type UseFetchDataAction<T = any> = {
  dataSource: Ref<T[]>
  keyword: Ref<string>
  formSearch: Ref<Record<string, any> | undefined>
  loading: ComputedRef<boolean | SpinProps | undefined>
  setParams: (key: string, value: any) => void
  reload: (resetPageIndex?: boolean) => Promise<void>
  fullScreen?: () => void
  reset: () => void
  pollingLoading: Ref<boolean>
  pagination: Ref<PageInfo>
  setFormSearch: (val: Record<string, any> | undefined) => void
  setPagination: (val: PageInfo) => void
  onTableChange: ProTableProps['onChange']
}

/**
 * 组合用户的配置和默认值
 *
 * @param param0
 */
const mergePropsAndPagination = ({ pagination }: ProTableProps, intl: IntlType) => {
  if (pagination) {
    const { current, pageSize, total, showTotal, showSizeChanger, ...rest } = pagination
    return {
      ...rest,
      current: current || 1,
      total: total || 0,
      pageSize: pageSize || 10,
      showSizeChanger: showSizeChanger ?? true,
      showTotal:
        showTotal ||
        ((total: number, range: number[]) =>
          `${intl.getMessage('pagination.total.range', '第')} ${range[0]}-${range[1]} ${intl.getMessage(
            'pagination.total.total',
            '条/总共',
          )} ${total} ${intl.getMessage('pagination.total.item', '条')}`),
    }
  }
  return {
    current: 1,
    total: 0,
    pageSize: 10,
    showSizeChanger: true,
    showTotal: (total: number, range: number[]) =>
      `${intl.getMessage('pagination.total.range', '第')} ${range[0]}-${range[1]} ${intl.getMessage(
        'pagination.total.total',
        '条/总共',
      )} ${total} ${intl.getMessage('pagination.total.item', '条')}`,
  }
}

const formatSorters = (
  sorter: SorterResult<any> | SorterResult<any>[],
): SorterResult<any>[] | undefined => {
  if (!sorter) {
    return
  }
  let result: SorterResult<any>[]
  if (!Array.isArray(sorter)) {
    result = [{ ...sorter }]
  } else {
    result = [...sorter]
  }
  result = result.filter((sort) => !!sort.order)
  if (!result.length) {
    return
  }
  if (result.length > 1) {
    result = result.sort(
      (a, b) =>
        ((b.column?.sorter as any)?.multiple || 0) - ((a.column?.sorter as any)?.multiple || 0),
    )
  }
  return result.map((item) => ({
    field: item.field,
    order: item.order?.toUpperCase(),
  })) as SorterResult<any>[]
}

export const useFetchData = (
  getData: ComputedRef<
    | ((
        params?: Record<string, any>,
        sorters?: SorterResult<any>[],
        filter?: Record<string, (string | number)[] | null>,
      ) => Promise<RequestData>)
    | undefined
  >,
  props: ProTableProps,
): UseFetchDataAction => {
  /**
   * 用于保存组件是否被卸载的状态的引用
   */
  const umountRef = ref<boolean>(false)
  /**
   * 用于保存 AbortController 实例的引用，方便需要时进行请求的取消操作
   */
  const abortRef = ref<AbortController | null>(null)
  /** 是否首次加载的指示器 */
  const manualRequestRef = ref<boolean>(!!props.manual)
  /** 轮询的setTime ID 存储 */
  const pollingSetTimeRef = ref<any>()
  const pollingLoading = ref<boolean>(false)
  const keyword = ref<string>('')
  const intl = useIntl()
  const innerParams = ref<Record<string, any>>({})
  const sorters = ref<SorterResult<any>[]>()
  const filter = ref<Record<string, any>>()
  const keywordName = computed(() => {
    if (props.options !== false && props.options!.search !== false) {
      return props.options!.search === true || !props.options!.search!.name
        ? undefined
        : props.options!.search!.name!
    }
    return undefined
  })
  const [tableLoading, setTableLoading] = useMergedState(false, {
    value: computed(() => {
      return typeof props.loading === 'object' ? props.loading.spinning : props.loading
    }),
    onChange: props.onLoadingChange,
  })

  const [tableDataList, setTableDataList] = useMergedState<any[] | undefined>(
    props.defaultData ?? [],
    {
      value: computed(() => {
        return props.request ? undefined : props.dataSource
      }),
      // onChange(value) {
      // 	if (!props.request) {
      // 		props['onUpdate:dataSource']?.(value ?? [])
      // 	}
      // }
    },
  )

  const [pagination, setPagination] = useMergedState<PageInfo>(
    () => mergePropsAndPagination(props, intl),
    {
      onChange(value) {
        if (props.pagination !== false) {
          props['onUpdate:pagination']?.(
            isReactive(props.pagination) ? Object.assign(props.pagination || {}, value) : value,
          )
          props.pagination?.onChange?.(value.current, value?.pageSize)
        }
      },
    },
  )

  const [formSearch, setFormSearch] = useMergedState<Record<string, any> | undefined>(() => {
    // 如果手动模式，或者 search 不存在的时候设置为 undefined
    // undefined 就不会触发首次加载
    if (manualRequestRef.value || props.search !== false) {
      return undefined
    }
    return {}
  })

  const prePage = usePrevious(computed(() => pagination.value?.current))
  const prePageSize = usePrevious(computed(() => pagination.value?.pageSize))

  const requestFinally = () => {
    setTableLoading(false)
    pollingLoading.value = false
  }

  const fetchList = async (isPolling: boolean) => {
    // 需要手动触发的首次请求
    if (manualRequestRef.value) {
      manualRequestRef.value = false
      return
    }

    if (!isPolling) {
      setTableLoading(true)
    } else {
      pollingLoading.value = true
    }

    const { current, pageSize } = pagination.value
    const params: Record<string, any> = { ...innerParams.value, ...formSearch.value }
    if (props?.pagination !== false) {
      params.current = current
      params.pageSize = pageSize
    }
    if (keyword.value) {
      params[keywordName.value ?? 'keyword'] = keyword.value
    }
    try {
      const {
        data = [],
        success,
        total = 0,
        ...rest
      } = (await getData.value?.(params, toRaw(sorters.value), toRaw(filter.value))) || {}
      // 如果失败了，直接返回，不走剩下的逻辑了
      if (success === false) return []
      setTableDataList(data)
      if (pagination.value?.total !== total) {
        pagination.value.total = total || data.length
        // setPagination({
        // 	...pagination.value,
        // 	total: total || data.length
        // })
      }
      props.onLoad?.(data, rest)
      return data
    } catch (e) {
      if (props.onRequestError === undefined) throw new Error(e as string)
      if (tableDataList.value === undefined) setTableDataList([])
      props.onRequestError(e as Error)
    } finally {
      requestFinally()
    }
  }

  const fetchListDebounce = useDebounceFn(async (isPolling: boolean) => {
    if (pollingSetTimeRef.value) {
      clearTimeout(pollingSetTimeRef.value)
    }
    if (!getData) {
      return
    }
    const abort = new AbortController()
    abortRef.value = abort

    try {
      const msg = (await Promise.race([
        fetchList(isPolling),
        new Promise((_, reject) => {
          abortRef.value?.signal.addEventListener('abort', () => {
            reject('aborted')
            requestFinally()
          })
        }),
      ])) as any[]

      if (abort.signal.aborted) return
      // 放到请求前面会导致数据是上一次的
      const needPolling = runFunction(props.polling, msg)

      if (needPolling && !umountRef.value) {
        pollingSetTimeRef.value = setTimeout(
          () => {
            fetchListDebounce(needPolling)
            // 这里判断最小要2000ms，不然一直loading
          },
          Math.max(needPolling, 2000),
        )
      }
    } catch (error) {
      if (error === 'aborted') {
        return
      }
      throw error
    }
  }, props.debounceTime || 30)

  const abortFetch = () => {
    abortRef.value?.abort()
    requestFinally()
  }

  watch(
    () => props.polling,
    (newPolling, prePolling) => {
      if (!newPolling) {
        clearTimeout(pollingSetTimeRef.value)
      }
      if (!prePolling && newPolling) {
        fetchListDebounce(true)
      }
    },
  )

  watch(
    () => props.manual,
    () => {
      abortFetch()
      fetchListDebounce(false)
      if (!props.manual) {
        // 如果 manual 标志未设置，则将 manualRequestRef 设置为 false。
        // 用于跟踪当前的请求是否是手动发起的。
        manualRequestRef.value = false
      }
    },
  )

  watch(
    () => pagination.value.current,
    () => {
      const { current, pageSize } = pagination.value || {}
      if (
        (!prePage || prePage.value === current) &&
        (!prePageSize || prePageSize.value === pageSize)
      ) {
        return
      }

      if (
        (props.pagination && tableDataList.value && tableDataList.value?.length > pageSize) ||
        0
      ) {
        return
      }

      if (current !== undefined && tableDataList.value && tableDataList.value.length <= pageSize) {
        abortFetch()
        fetchListDebounce(false)
      }
    },
  )

  watch(
    () => pagination.value.pageSize,
    () => {
      if (!prePageSize.value) {
        return
      }
      abortFetch()
      fetchListDebounce(false)
    },
  )

  watch(sorters, () => {
    setPagination({
      ...pagination.value,
      current: 1,
    })
    abortFetch()
    fetchListDebounce(false)
  })

  watch(filter, () => {
    setPagination({
      ...pagination.value,
      current: 1,
    })
    abortFetch()
    fetchListDebounce(false)
  })

  watch(
    () => props.params,
    () => {
      setPagination({
        ...pagination.value,
        current: 1,
      })
      abortFetch()
      fetchListDebounce(false)
    },
    {
      deep: true,
    },
  )

  watch(
    innerParams,
    () => {
      setPagination({
        ...pagination.value,
        current: 1,
      })
      abortFetch()
      fetchListDebounce(false)
    },
    {
      deep: true,
    },
  )

  watch(
    formSearch,
    () => {
      setPagination({
        ...pagination.value,
        current: 1,
      })
      abortFetch()
      fetchListDebounce(false)
    },
    {
      immediate: true,
    },
  )

  const onTableChange: ProTableProps['onChange'] = (pageInfo, filt, sort, extra) => {
    if (extra.action === 'paginate') {
      setPagination({ ...pagination.value, ...pageInfo })
    }
    if (extra.action === 'sort') {
      sorters.value = formatSorters(sort)
    }

    if (extra.action === 'filter') {
      filter.value = filt
    }
    props.onChange?.(pageInfo, filt, sort, extra)
  }

  onMounted(() => {
    umountRef.value = false
    if (props.search === false) {
      fetchListDebounce(false)
    }
  })

  onActivated(() => {
    if (props.polling) {
      fetchListDebounce(true)
    }
  })

  onUnmounted(() => {
    umountRef.value = true
    abortFetch()
    clearTimeout(pollingSetTimeRef.value)
  })
  onDeactivated(() => {
    clearTimeout(pollingSetTimeRef.value)
  })

  return {
    keyword,
    formSearch,
    dataSource: tableDataList,
    loading: computed(() =>
      typeof props?.loading === 'object'
        ? { ...props?.loading, spinning: tableLoading.value }
        : tableLoading.value,
    ),
    setParams: (key: string, value: any) => {
      innerParams.value[key] = value
    },
    reload: async (resetPageIndex?: boolean) => {
      if (resetPageIndex) {
        setPagination({
          ...pagination.value,
          current: 1,
        })
      }
      abortFetch()
      return fetchListDebounce(false)
    },
    pollingLoading,
    pagination,
    reset: async () => {
      const { pagination: optionPageInfo } = props || {}
      const { current = 1, pageSize = 10 } = optionPageInfo || {}
      const initialPageInfo = {
        current,
        total: 0,
        pageSize,
      }
      setPagination(initialPageInfo)
    },
    setPagination,
    setFormSearch,
    onTableChange,
  } as UseFetchDataAction
}
