import { shallowRef, watchEffect, watch } from 'vue'

import type { Ref, UnwrapRef } from 'vue'
import type {
  Key,
  GetRowKey,
  DefaultRecordType,
  ExpandType,
  FlatRecord,
  CheckboxProps,
  TableRowSelection,
} from '../components/interface'
export type KeyEntities = Record<
  Key,
  FlatRecord & {
    children: FlatRecord[]
    parent: any
  }
>
export type FlattenRecordsType<T = DefaultRecordType> = {
  flattenData: Ref<FlatRecord<T>[]>
  keyEntities: Ref<KeyEntities>
  pageDataRowKeys: Ref<Key[]>
  pageDataEnableRowKeys: Ref<Key[]>
  checkboxPropsMap: Ref<Map<Key, Partial<CheckboxProps>>>
  getRowFlattenIndexByKey: (key: Key) => number | undefined
  isMyChildren: (parentKey: Key, childrenKey: Key) => boolean
  getRowByFlattenIndex: (index: number) => FlatRecord<T>
}
export function getPosition(level: string | number, index: number): string {
  return `${level}-${index}`
}

const noop = () => ({})

export default function useFlattenRecords<RecordType = DefaultRecordType>(
  pageDataRef: Ref<readonly RecordType[]>,
  childrenColumnNameRef: Ref<string>,
  expandedKeysRef: Ref<Set<Key>>,
  getRowKeyRef: Ref<GetRowKey<RecordType>>,
  expandType: Ref<ExpandType>,
  mergedRowSelection: Ref<TableRowSelection<RecordType> | undefined>,
): FlattenRecordsType<RecordType | UnwrapRef<RecordType>> {
  const flattenData = shallowRef<FlatRecord<RecordType>[]>([])
  const keyEntities = shallowRef<KeyEntities>({})
  const pageDataRowKeys = shallowRef<Key[]>([])
  const pageDataEnableRowKeys = shallowRef<Key[]>([])
  const checkboxPropsMap = shallowRef<Map<Key, Partial<CheckboxProps>>>(new Map())
  const getCheckboxProps = shallowRef<TableRowSelection<RecordType>['getCheckboxProps']>(noop)

  watchEffect(() => {
    getCheckboxProps.value = mergedRowSelection.value?.getCheckboxProps || noop
  })

  watch(
    [pageDataRef, childrenColumnNameRef, getRowKeyRef, expandedKeysRef],
    () => {
      const getRowKey = getRowKeyRef.value
      const expandedKeys = expandedKeysRef.value
      const childrenColumnName = childrenColumnNameRef.value
      const expandTypeValue = expandType.value
      const newKeyEntities: KeyEntities = {}
      const newPageDataRowKeys: Key[] = []
      const newPageDataEnableRowKeys: Key[] = []
      const newCheckboxPropsMap: Map<Key, Partial<CheckboxProps>> = new Map()
      let flattenIndex = 0
      const flattenRecords = (
        records: readonly RecordType[],
        indent: number,
        root: boolean,
        level = 0,
        keyEntitie: KeyEntities[Key] | null = null,
      ): FlatRecord<RecordType>[] => {
        const newRecords: FlatRecord<RecordType>[] = []
        const getCheckboxPropsFn = getCheckboxProps.value
        records.forEach((record, index) => {
          const rowKey = getRowKey(record, index)
          const checkboxProps = getCheckboxPropsFn?.(record)
          const pos = getPosition(keyEntitie ? keyEntitie.pos : '0', index)
          const isRoot = root && expandedKeys?.has(rowKey)
          const newRecord: FlatRecord<RecordType> = {
            record,
            indent,
            rowKey,
            rowIndex: index,
            pos,
            level,
            flattenIndex,
          }
          const newKeyEntitie = Object.assign({ parent: keyEntitie }, newRecord)
          newKeyEntities[rowKey] = newKeyEntitie as KeyEntities[Key]
          newPageDataRowKeys.push(rowKey)
          newCheckboxPropsMap.set(rowKey, checkboxProps!)
          if (!checkboxProps?.disabled) {
            newPageDataEnableRowKeys.push(rowKey)
          }
          if (newKeyEntitie.parent) {
            newKeyEntitie.parent.children = newKeyEntitie.parent.children || []
            newKeyEntitie.parent.children.push(newKeyEntitie as any)
          }
          if (root) {
            newRecords.push(newRecord)
            flattenIndex += 1
          }
          if (root && indent === 0 && expandTypeValue === 'row') {
            const expandKey = `__Internal__Expand__Key_${rowKey}`
            if (isRoot) {
              newRecords.push({
                record,
                indent,
                rowKey: expandKey,
                isExpandRow: true,
                rowIndex: index,
                pos,
                level,
                flattenIndex,
              })
              flattenIndex += 1
            }
          }
          if (record && typeof record == 'object' && childrenColumnName in record) {
            newRecords.push(
              ...flattenRecords(
                record[childrenColumnName] || [],
                indent + 1,
                isRoot,
                level + 1,
                newKeyEntitie as KeyEntities[Key],
              ),
            )
          }
        })

        return newRecords
      }

      flattenData.value = flattenRecords(pageDataRef.value, 0, true)
      keyEntities.value = newKeyEntities
      pageDataRowKeys.value = newPageDataRowKeys
      pageDataEnableRowKeys.value = newPageDataEnableRowKeys
      checkboxPropsMap.value = newCheckboxPropsMap
    },
    { immediate: true },
  )

  return {
    flattenData,
    keyEntities,
    pageDataRowKeys,
    pageDataEnableRowKeys,
    checkboxPropsMap,
    getRowFlattenIndexByKey: (key: Key) => {
      return keyEntities.value[key]?.flattenIndex
    },
    isMyChildren: (parentKey: Key, childrenKey: Key) => {
      if (parentKey === childrenKey || childrenKey === undefined) {
        return false
      }

      let record = keyEntities.value[childrenKey]
      let isOwnChildren = false
      for (; record && !isOwnChildren; ) {
        if (record.parent?.rowKey === parentKey) {
          isOwnChildren = true
          break
        }
        record = keyEntities.value[record.parent?.rowKey]
      }
      return isOwnChildren
    },
    getRowByFlattenIndex: (index: number) => flattenData.value[index]!,
  }
}
