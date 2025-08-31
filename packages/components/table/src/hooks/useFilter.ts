/*
 * @Author: shen
 * @Date: 2022-11-05 09:11:51
 * @LastEditors: shen
 * @LastEditTime: 2025-08-29 14:19:13
 * @Description:
 */

import type { ComputedRef, Ref } from 'vue'
import type {
  ColumnType,
  ColumnsType,
  ProTableProps,
  Key,
  FilterKey,
  FilterValue,
  FinallyColumnType,
  DefaultRecordType,
  ColumnFilterItem,
} from '../components/interface'

import { computed, watchEffect, ref } from 'vue'
import { isEqual } from '@pro-design-vue/utils'
import devWarning from '../utils/devWarning'

export interface FilterState<RecordType> {
  column: ColumnType<RecordType>
  key: Key
  filteredKeys?: FilterKey
  forceFiltered?: boolean
}

export function flattenKeys(filters?: ColumnFilterItem[]) {
  let keys: FilterValue = []
  ;(filters || []).forEach(({ value, children }) => {
    keys.push(value)
    if (children) {
      keys = [...keys, ...flattenKeys(children)]
    }
  })
  return keys
}

export function generateFilterInfo<RecordType>(
  filterStates: FilterState<RecordType>[],
): Record<string, FilterValue | null> {
  const currentFilters: Record<string, FilterValue | null> = {}

  filterStates.forEach(({ key, filteredKeys, column }) => {
    const hasFilterDropdown =
      column.filterDropdown || column?.slots?.filterDropdown || column.customFilterDropdown
    const { filters } = column
    if (hasFilterDropdown) {
      currentFilters[key] = filteredKeys || null
    } else if (Array.isArray(filteredKeys)) {
      const keys = flattenKeys(filters)
      currentFilters[key] = keys.filter((originKey) => filteredKeys.includes(String(originKey)))
    } else {
      currentFilters[key] = null
    }
  })

  return currentFilters
}
export function getFilterData<RecordType>(
  data: RecordType[],
  filterStates: FilterState<RecordType>[],
): RecordType[] {
  return filterStates.reduce((currentData, filterState) => {
    const {
      column: { onFilter, filters },
      filteredKeys,
    } = filterState
    if (onFilter && filteredKeys && filteredKeys.length) {
      return currentData.filter((record) =>
        filteredKeys.some((key) => {
          const keys = flattenKeys(filters)
          const keyIndex = keys.findIndex((k) => String(k) === String(key))
          const realKey = keyIndex !== -1 ? keys[keyIndex] : key
          return onFilter(realKey!, record)
        }),
      )
    }
    return currentData
  }, data)
}

export declare function getNewColumnsByFilters<RecordType>(
  columns: ColumnsType<RecordType>,
  filterStates: FilterState<RecordType>[],
  pos?: string,
): ColumnsType<RecordType>

function collectFilterStates<RecordType = DefaultRecordType>(
  columns: FinallyColumnType<RecordType>[],
  init: boolean,
): FilterState<RecordType>[] {
  let filterStates: FilterState<RecordType>[] = []

  ;(columns || []).forEach((column) => {
    const hasFilterDropdown =
      column.filterDropdown || column?.slots?.filterDropdown || column.customFilterDropdown
    // if (column.filters || hasFilterDropdown || 'onFilter' in column) {
    if (column.filters || hasFilterDropdown || 'onFilter' in column) {
      if ('filteredValue' in column) {
        let filteredValues = column.filteredValue
        if (!hasFilterDropdown) {
          filteredValues = filteredValues?.map(String) ?? filteredValues
        }
        filterStates.push({
          column,
          key: column.columnKey,
          filteredKeys: filteredValues as FilterKey,
          forceFiltered: column.filtered,
        })
      } else {
        filterStates.push({
          column,
          key: column.columnKey,
          filteredKeys: (init && column.defaultFilteredValue
            ? column.defaultFilteredValue!
            : undefined) as FilterKey,
          forceFiltered: column.filtered,
        })
      }
    }
    if ('children' in column) {
      filterStates = [...filterStates, ...collectFilterStates(column.children || [], init)]
    }
  })

  return filterStates
}

export default function useFilter<RecordType = DefaultRecordType>(
  _props: ProTableProps,
  sortedData: ComputedRef<RecordType[]>,
  allColumns: Ref<FinallyColumnType[]>,
  onFilterChange: (
    filters: Record<string, FilterValue | null>,
    filterStates: FilterState<RecordType>[],
  ) => void,
): {
  filterStates: Ref<FilterState<RecordType>[]>
  filters: ComputedRef<Record<string, FilterValue | null>>
  filterData: ComputedRef<RecordType[]>
  getFilters: (newFilterStates: FilterState<RecordType>[]) => RecordType[]
  changeFilter: (filterState: FilterState<RecordType>) => void
} {
  const filtStates = ref<FilterState<RecordType>[]>(
    collectFilterStates<RecordType>(allColumns.value as FinallyColumnType<RecordType>[], true),
  )
  const filterStates = ref<FilterState<RecordType>[]>([])

  watchEffect(() => {
    const collectedStates = collectFilterStates(allColumns.value, false)
    let newFilterStates: FilterState<RecordType>[] = []
    const filteredKeysIsNotControlled = collectedStates.every(
      ({ filteredKeys }) => filteredKeys === undefined,
    )
    if (filteredKeysIsNotControlled) {
      newFilterStates = filtStates.value
    } else {
      const filteredKeysIsAllControlled = collectedStates.every(
        ({ filteredKeys }) => filteredKeys !== undefined,
      )
      devWarning(
        filteredKeysIsNotControlled || filteredKeysIsAllControlled,
        'Table',
        '`FilteredKeys` should all be controlled or not controlled.',
      )
    }
    if (!(filterStates.value === newFilterStates || isEqual(filterStates.value, newFilterStates))) {
      filterStates.value = newFilterStates
    }
  })

  const filters = computed(() => generateFilterInfo(filterStates.value))
  const filterData = computed(() => getFilterData(sortedData.value, filterStates.value))

  return {
    filterStates,
    filters,
    filterData,
    getFilters: (newFilterStates: FilterState<RecordType>[]) =>
      getFilterData(sortedData.value, newFilterStates),
    changeFilter: (filterState: FilterState<RecordType>) => {
      const newFilterStates = filterStates.value.filter(({ key }) => key !== filterState.key)
      newFilterStates.push(filterState)
      filtStates.value = newFilterStates
      onFilterChange(generateFilterInfo(newFilterStates), newFilterStates)
    },
  }
}
