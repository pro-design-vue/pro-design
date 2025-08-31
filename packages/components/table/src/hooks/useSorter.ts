/*
 * @Author: shen
 * @Date: 2022-11-05 08:20:29
 * @LastEditors: shen
 * @LastEditTime: 2025-08-29 14:27:38
 * @Description:
 */
import { isEqual } from '@pro-design-vue/utils'
import type {
  ColumnsType,
  ColumnType,
  Key,
  SortOrder,
  ProTableProps,
  SorterResult,
  DefaultRecordType,
  FinallyColumnType,
  CompareFn,
} from '../components/interface'
import type { ComputedRef, Ref } from 'vue'
import { shallowRef, watchEffect, computed } from 'vue'

export interface SortState<RecordType = DefaultRecordType> {
  column: FinallyColumnType<RecordType>
  key: Key
  sortOrder: SortOrder | null
  multiplePriority: number | false
}
export const ASCEND = 'asc'
export const DESCEND = 'desc'
export function getMultiplePriority<RecordType>(column: ColumnType<RecordType>): number | false {
  if (typeof column.sorter === 'object' && typeof column.sorter.multiple === 'number') {
    return column.sorter.multiple
  }
  return false
}
export function nextSortDirection(
  sortDirections: SortOrder[],
  current: SortOrder | null,
): SortOrder {
  if (!current) {
    return sortDirections[0]!
  }

  return sortDirections[sortDirections.indexOf(current) + 1]!
}

export declare function getNewColumnsBySorter<RecordType>(
  columns: ColumnsType<RecordType>,
  sorterStates: SortState<RecordType>[],
  pos?: string,
): ColumnsType<RecordType>

function collectSortStates<RecordType = DefaultRecordType>(
  columns: FinallyColumnType<RecordType>[],
  init: boolean,
): SortState<RecordType>[] {
  let sortStates: SortState<RecordType>[] = []

  function pushState(column: FinallyColumnType<RecordType>) {
    sortStates.push({
      column,
      key: column.columnKey,
      multiplePriority: getMultiplePriority(column),
      sortOrder: column.sortOrder!,
    })
  }

  columns.forEach((column) => {
    if (column.children) {
      if ('sortOrder' in column) {
        pushState(column)
      }
      sortStates = [...sortStates, ...collectSortStates(column.children || [], init)]
    } else if (column.sorter) {
      if ('sortOrder' in column) {
        pushState(column)
      } else if (init && column.defaultSortOrder) {
        sortStates.push({
          column,
          key: column.columnKey,
          multiplePriority: getMultiplePriority(column),
          sortOrder: column.defaultSortOrder!,
        })
      }
    }
  })

  return sortStates
}

function getSortFunction<RecordType>(
  sorter: ColumnType<RecordType>['sorter'],
): CompareFn<RecordType> | false {
  if (typeof sorter === 'function') {
    return sorter
  }
  if (sorter && typeof sorter === 'object' && sorter.compare) {
    return sorter.compare
  }
  return false
}

function getSortData<RecordType>(
  data: readonly RecordType[],
  sortStates: SortState<RecordType>[],
  childrenColumnName: string,
): RecordType[] {
  const innerSorterStates = sortStates
    .slice()
    .sort((a, b) => (b.multiplePriority as number) - (a.multiplePriority as number))

  const cloneData = data.slice()

  const runningSorters = innerSorterStates.filter(
    ({ column: { sorter }, sortOrder }) => getSortFunction(sorter) && sortOrder,
  )

  if (!runningSorters.length) {
    return cloneData
  }
  return cloneData
    .sort((record1, record2) => {
      for (let i = 0; i < runningSorters.length; i += 1) {
        const sorterState = runningSorters[i]
        const {
          column: { sorter },
          sortOrder,
        } = sorterState!

        const compareFn = getSortFunction(sorter)

        if (compareFn && sortOrder) {
          const compareResult = compareFn(record1, record2, sortOrder)

          if (compareResult !== 0) {
            return sortOrder === ASCEND ? compareResult : -compareResult
          }
        }
      }

      return 0
    })
    .map<RecordType>((record) => {
      const subRecords = (record as any)[childrenColumnName]
      if (subRecords) {
        return {
          ...record,
          [childrenColumnName]: getSortData(subRecords, sortStates, childrenColumnName),
        }
      }
      return record
    })
}

function stateToInfo<RecordType>(sorterStates: SortState<RecordType>) {
  const { column, sortOrder } = sorterStates
  return {
    column: column.originColumn,
    order: sortOrder,
    field: column.dataIndex,
    columnKey: column.columnKey,
  }
}

function generateSorterInfo<RecordType>(
  sorterStates: SortState<RecordType>[],
): SorterResult<RecordType> | SorterResult<RecordType>[] {
  const list = sorterStates.filter(({ sortOrder }) => sortOrder).map(stateToInfo)
  if (list.length === 0 && sorterStates.length) {
    return {
      ...stateToInfo(sorterStates[sorterStates.length - 1]!),
      column: undefined,
    }
  }

  if (list.length <= 1) {
    return (list[0] || {}) as SorterResult<RecordType>
  }

  return list as SorterResult<RecordType>[]
}

export default function useSorter<RecordType = DefaultRecordType>(
  _props: ProTableProps,
  allData: Ref<any[]>,
  allColumns: Ref<FinallyColumnType[]>,
  onSorterChange: (
    sorterResult: SorterResult<RecordType> | SorterResult<RecordType>[],
    sortStates: SortState<RecordType>[],
  ) => void,
): {
  sortedData: ComputedRef<any[]>
  sorterStates: Ref<SortState<RecordType>[]>
  sorter: ComputedRef<SorterResult<RecordType> | SorterResult<RecordType>[]>
  getSorters: (
    newSorterStates: SortState<RecordType>[],
  ) => SorterResult<RecordType> | SorterResult<RecordType>[]
  changeSorter: (sortState: SortState<RecordType>) => void
} {
  const sortStates = shallowRef<SortState<RecordType>[]>(
    collectSortStates<RecordType>(
      (allColumns.value || []) as FinallyColumnType<RecordType>[],
      true,
    ),
  )
  const sorterStates = shallowRef<SortState<RecordType>[]>([])

  watchEffect(() => {
    let validate = true
    const collectedStates = collectSortStates(allColumns.value, false) as SortState<RecordType>[]
    let validateStates: SortState<RecordType>[] = []
    const patchStates = (state: SortState<RecordType>) => {
      if (validate) {
        validateStates.push(state)
      } else {
        validateStates.push({
          ...state,
          sortOrder: null,
        })
      }
    }
    if (collectedStates.length) {
      let multipleMode: boolean | null = null
      collectedStates.forEach((state: SortState<RecordType>) => {
        if (multipleMode === null) {
          patchStates(state)
          if (state.sortOrder) {
            if (state.multiplePriority === false) {
              validate = false
            } else {
              multipleMode = true
            }
          }
        } else if (multipleMode && state.multiplePriority !== false) {
          patchStates(state)
        } else {
          validate = false
          patchStates(state)
        }
      })
    } else {
      validateStates = sortStates.value
    }
    if (!(sorterStates.value === validateStates || isEqual(sorterStates.value, validateStates))) {
      sorterStates.value = validateStates
    }
  })

  const sortedData = computed(() => getSortData(allData.value, sorterStates.value, 'children'))
  const sorter = computed<SorterResult<RecordType> | SorterResult<RecordType>[]>(() =>
    generateSorterInfo(sorterStates.value),
  )

  return {
    sortedData,
    sorterStates,
    sorter,
    getSorters: (newSorterStates: SortState<RecordType>[]) => generateSorterInfo(newSorterStates),
    changeSorter: function (sortState: SortState<RecordType>) {
      let newSorterStates: SortState<RecordType>[]
      if (
        sortState.multiplePriority !== false &&
        sorterStates.value.length &&
        sorterStates.value[0]?.multiplePriority !== false
      ) {
        newSorterStates = [
          ...sorterStates.value.filter(({ key }) => key !== sortState.key),
          sortState,
        ]
      } else {
        newSorterStates = [sortState]
      }
      sortStates.value = newSorterStates!
      onSorterChange(generateSorterInfo(newSorterStates), newSorterStates)
    },
  }
}
