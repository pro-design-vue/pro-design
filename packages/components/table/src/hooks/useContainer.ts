/*
 * @Author: shen
 * @Date: 2023-11-15 10:14:14
 * @LastEditors: shen
 * @LastEditTime: 2025-10-12 19:31:12
 * @Description:
 */
import type { ColumnsState, DensitySize, Key, ProTableProps } from '../components/interface'
import type { Ref, InjectionKey, ComputedRef } from 'vue'

import { computed, provide, inject, watch, ref } from 'vue'
import { genColumnKey } from '../utils/util'
import { useMergedState } from '@pro-design-vue/hooks'
import { useProConfigInject } from '@pro-design-vue/components/config-provider'

export type ContainerContextProps = {
  props: ProTableProps
  tableSize: Ref<DensitySize>
  setTableSize: (val: DensitySize) => void
  sortKeyColumns: Ref<string[]>
  setSortKeyColumns: (keys: string[]) => void
  columnsMap: Ref<Record<string, ColumnsState>>
  setColumnsMap: (val: Record<string, ColumnsState>) => void
  clearPersistenceStorage: () => void
  defaultColumnKeyMap: ComputedRef<{}>
  rootDomRef: Ref<HTMLDivElement | undefined>
}

const ContainerContextKey: InjectionKey<ContainerContextProps> = Symbol('ContainerContextKey')
export const useContainer = (props: ProTableProps): ContainerContextProps => {
  const rootDomRef = ref<HTMLDivElement>()
  const { componentSize } = useProConfigInject()
  const sortKeyColumns = ref<string[]>([])

  const [tableSize, setTableSize] = useMergedState<DensitySize>(
    () => props.size ?? componentSize?.value ?? 'middle',
    {
      value: computed(() => props.size),
      onChange: props.onSizeChange,
    },
  )

  /** 默认全选中 */
  const defaultColumnKeyMap = computed(() => {
    if (props?.columnsState?.defaultValue) {
      const columnKeyMap = {}
      props.columns?.forEach(({ key, dataIndex, fixed, disable }, index) => {
        const columnKey = genColumnKey(key ?? (dataIndex as Key), index)
        if (columnKey) {
          if (fixed || disable) {
            columnKeyMap[columnKey] = {
              fixed,
              disable,
              show: true,
            }
          }
        }
      })
      return { ...columnKeyMap, ...props.columnsState.defaultValue }
    }
    const columnKeyMap = {}
    props.columns?.forEach(({ key, dataIndex, fixed, disable }, index) => {
      const columnKey = genColumnKey(key ?? (dataIndex as Key), index)
      if (columnKey) {
        columnKeyMap[columnKey] = {
          show: true,
          fixed,
          disable,
        }
      }
    })
    return columnKeyMap
  })

  const [columnsMap, setColumnsMap] = useMergedState<Record<string, ColumnsState>>(
    () => {
      const { persistenceType, persistenceKey } = props.columnsState || {}
      if (persistenceKey && persistenceType && typeof window !== 'undefined') {
        /** 从持久化中读取数据 */
        const storage = window[persistenceType]
        try {
          const storageValue = storage?.getItem(persistenceKey)
          if (storageValue) {
            return JSON.parse(storageValue)
          }
        } catch (error) {
          console.warn(error)
        }
      }
      return (
        props.columnsState?.value || props.columnsState?.defaultValue || defaultColumnKeyMap.value
      )
    },
    {
      value: computed(() => props.columnsState?.value as any),
      onChange: props.columnsState?.onChange,
    },
  )

  watch(
    [
      () => props.columnsState?.persistenceKey,
      defaultColumnKeyMap,
      () => props.columnsState?.persistenceType,
    ],
    () => {
      const { persistenceType, persistenceKey } = props.columnsState || {}
      if (persistenceKey && persistenceType && typeof window !== 'undefined') {
        /** 从持久化中读取数据 */
        const storage = window[persistenceType]
        try {
          const storageValue = storage?.getItem(persistenceKey)
          if (storageValue) {
            setColumnsMap(JSON.parse(storageValue))
          } else {
            setColumnsMap(defaultColumnKeyMap.value)
          }
        } catch (error) {
          console.warn(error)
        }
      }
    },
    {
      immediate: true,
    },
  )

  const clearPersistenceStorage = () => {
    const { persistenceType, persistenceKey } = props.columnsState || {}

    if (!persistenceKey || !persistenceType || typeof window === 'undefined') return

    /** 给持久化中设置数据 */
    const storage = window[persistenceType]
    try {
      storage?.removeItem(persistenceKey)
    } catch (error) {
      console.warn(error)
    }
  }

  watch(
    [
      () => props.columnsState?.persistenceKey,
      () => columnsMap.value,
      () => props.columnsState?.persistenceType,
    ],
    () => {
      if (!props.columnsState?.persistenceKey || !props.columnsState?.persistenceType) {
        return
      }
      if (typeof window === 'undefined') return
      /** 给持久化中设置数据 */
      const { persistenceType, persistenceKey } = props.columnsState
      const storage = window[persistenceType]
      try {
        storage?.setItem(persistenceKey, JSON.stringify(columnsMap.value))
      } catch (error) {
        console.warn(error)
        clearPersistenceStorage()
      }
    },
  )

  const context = {
    props,
    rootDomRef,
    tableSize,
    setTableSize,
    sortKeyColumns,
    setSortKeyColumns: (keys: string[]) => {
      sortKeyColumns.value = keys
    },
    columnsMap,
    setColumnsMap,
    clearPersistenceStorage,
    defaultColumnKeyMap,
  }

  provide(ContainerContextKey, context)

  return context
}

export const useInjectContainer = () => {
  return inject(ContainerContextKey, {} as ContainerContextProps)
}
