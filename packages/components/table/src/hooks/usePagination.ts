/*
 * @Author: shen
 * @Date: 2022-11-05 09:53:58
 * @LastEditors: shen
 * @LastEditTime: 2025-07-28 09:29:18
 * @Description:
 */
import type { ProTableProps } from '../components/interface'
import type { ComputedRef } from 'vue'
import type { TablePaginationConfig } from '../components/PaginationConfig'
import { reactive, computed, onBeforeUnmount } from 'vue'
import devWarning from '../utils/devWarning'

export const DEFAULT_PAGE_SIZE = 10
export function getPaginationParam(
  pagination: TablePaginationConfig | boolean | undefined,
  mergedPagination: TablePaginationConfig,
) {
  const param: any = {
    current: mergedPagination.current,
    pageSize: mergedPagination.pageSize,
  }
  const paginationObj = pagination && typeof pagination === 'object' ? pagination : {}

  Object.keys(paginationObj).forEach((pageProp) => {
    const value = (mergedPagination as any)[pageProp]

    if (typeof value !== 'function') {
      param[pageProp] = value
    }
  })

  return param
}

function extendsObject<T extends object>(...list: T[]) {
  const result: T = {} as T

  list.forEach((obj) => {
    if (obj) {
      Object.keys(obj).forEach((key) => {
        const val = (obj as any)[key]
        if (val !== undefined) {
          ;(result as any)[key] = val
        }
      })
    }
  })

  return result
}

type PaginationPos = {
  bottom?: 'left' | 'right'
  top?: 'left' | 'right'
}
interface PaginationRes {
  mergedPagination: ComputedRef<TablePaginationConfig>
  onChange: (page: number, pageSize?: number) => void
  onShowSizeChange: (current: number, size: number) => void
  pos: ComputedRef<PaginationPos>
  refreshPagination: () => void
  pageData: ComputedRef<any[]>
}
export default function usePagination(
  total: ComputedRef<number>,
  props: ProTableProps,
  mergedData: ComputedRef<any[]>,
  onChange?: (current: number, pageSize: number) => void,
): PaginationRes {
  const innerPagination = reactive({ current: 1, pageSize: DEFAULT_PAGE_SIZE })
  const size = computed(() => props.size)

  const mergedPagination = computed(() => {
    const { pagination } = props
    if (props.pagination === false) return {}
    const { total: paginationTotal = 0, ...restPagination } =
      pagination && typeof pagination == 'object' ? pagination : {}
    const mP = extendsObject<Partial<TablePaginationConfig>>(innerPagination, restPagination, {
      total: paginationTotal > 0 ? paginationTotal : total.value,
    })

    const maxPage = Math.ceil((paginationTotal || total.value) / mP.pageSize!)
    if (mP.current! > maxPage) {
      mP.current = maxPage || 1
    }
    const parseSize = size.value === 'small' || size.value === 'middle' ? 'small' : undefined
    mP.size = mP.size || parseSize
    // delete mP.onChange
    return mP
  })

  const refreshPagination = (current = 1, pageSize?: number) => {
    innerPagination.current = current
    innerPagination.pageSize = pageSize || mergedPagination.value.pageSize || DEFAULT_PAGE_SIZE
  }

  let timer: any

  const onPageChange = (current: number, size?: number) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      if (
        !(
          current === mergedPagination.value.current &&
          (size || mergedPagination.value?.pageSize) === mergedPagination.value?.pageSize
        )
      ) {
        props.pagination && props.pagination.onChange?.(current, size)
        refreshPagination(current, size)
        onChange?.(current, size || mergedPagination.value?.pageSize || DEFAULT_PAGE_SIZE)
      }
    }, 0)
  }

  onBeforeUnmount(() => {
    clearTimeout(timer)
  })

  const pos = computed(() => {
    const direction = props.direction === 'rtl' ? 'left' : 'right'
    const { position } = mergedPagination.value
    const mergePos: PaginationPos = {}
    if (props.pagination === false) return {}

    if (position !== null && Array.isArray(position)) {
      const top = position.find((pos) => pos.indexOf('top') !== -1)
      const bottom = position.find((pos) => pos.indexOf('bottom') !== -1)
      const none = position.every((pos) => `${pos}` == 'none')
      if (!(top || bottom || none)) {
        mergePos.bottom = direction
      }
      if (top) {
        mergePos.top = top.toLowerCase().replace('top', '') as PaginationPos['top']
      }
      if (bottom) {
        mergePos.bottom = bottom.toLowerCase().replace('bottom', '') as PaginationPos['bottom']
      }
    } else {
      mergePos.bottom = direction
    }
    return mergePos
  })

  const pageData = computed(() => {
    const data = mergedData.value
    if (props.pagination === false || !mergedPagination.value.pageSize) return data
    const { current = 1, total = 0, pageSize = DEFAULT_PAGE_SIZE } = mergedPagination.value
    return data.length < total
      ? data.length > pageSize
        ? (devWarning(
            false,
            'Table',
            '`dataSource` length is less than `pagination.total` but large than `pagination.pageSize`. Please make sure your config correct data with async mode.',
          ),
          data.slice((current - 1) * pageSize, current * pageSize))
        : data
      : data.slice((current - 1) * pageSize, current * pageSize)
  })

  return {
    mergedPagination,
    onChange: onPageChange,
    onShowSizeChange: (current: number, size: number) => {
      onPageChange(current, size)
      if (props.pagination !== false) {
        props.pagination?.onShowSizeChange?.(current, size)
      }
    },
    pos,
    refreshPagination,
    pageData,
  }
}
