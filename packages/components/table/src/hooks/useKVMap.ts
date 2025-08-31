/*
 * @Author: shen
 * @Date: 2022-11-04 16:02:38
 * @LastEditors: shen
 * @LastEditTime: 2025-07-28 09:28:49
 * @Description:
 */
import type { Ref, UnwrapRef } from 'vue'
import type { Key, GetRowKey, DefaultRecordType } from '../components/interface'

import { watch, shallowRef, toRaw } from 'vue'
import devWarning from '../utils/devWarning'

export type FlattenAllRecordsType<T = DefaultRecordType> = {
  getRecordByKey: (key: Key) => T
  getIndexsByKey: (key: Key) => number[]
  getKeyByIndexs: (indexsString: string) => Key
  allDataRowKeys: Ref<Key[]>
  allDataRootRowKeys: Ref<Key[]>
}

export default function useKVMap<RecordType = DefaultRecordType>(
  allDataRef: Ref<readonly RecordType[]>,
  childrenColumnNameRef: Ref<string>,
  getRowKeyRef: Ref<GetRowKey<RecordType>>,
): FlattenAllRecordsType<RecordType | UnwrapRef<RecordType>> {
  const kvKIndexRef = shallowRef<{
    kvMap?: Map<Key, RecordType>
    kIndexMap?: Map<Key, number[]>
    indexsKeyMap?: Map<string, Key>
  }>({})
  const allDataRowKeysRef = shallowRef<Key[]>([])
  const allDataRootRowKeysRef = shallowRef<Key[]>([])
  watch(
    [allDataRef, childrenColumnNameRef, getRowKeyRef],
    () => {
      const kvMap: Map<Key, RecordType> = new Map()
      const kIndexMap: Map<Key, number[]> = new Map()
      const indexsKeyMap: Map<string, Key> = new Map()
      const allDataRowKeys: Key[] = []
      const allDataRootRowKeys: Key[] = []
      const getRowKey = getRowKeyRef.value
      const childrenColumnName = childrenColumnNameRef.value

      function deepKvMap(data: readonly RecordType[], originIndexs: number[] = [], isRoot = 0) {
        data.forEach((record: RecordType, index: number) => {
          const rowKey = getRowKey(record, index)
          devWarning(
            !kvMap.get(rowKey),
            'Table',
            `You set slots duplicate key ${rowKey}, it will cause rendering errors. Please check carefully.`,
          )
          kvMap.set(rowKey, record)
          const indexs = originIndexs.concat([index] as never[]) as number[]
          kIndexMap.set(rowKey, indexs)
          indexsKeyMap.set(indexs.join('-'), rowKey)
          allDataRowKeys.push(rowKey)
          isRoot === 0 && allDataRootRowKeys.push(rowKey)
          if (record && typeof record === 'object' && childrenColumnName in record) {
            deepKvMap(record[childrenColumnName] || [], indexs, isRoot + 1)
          }
        })
      }

      deepKvMap(allDataRef.value)

      allDataRowKeysRef.value = allDataRowKeys
      allDataRootRowKeysRef.value = allDataRootRowKeys
      kvKIndexRef.value = { kvMap, kIndexMap, indexsKeyMap }
    },
    { immediate: true },
  )

  return {
    getRecordByKey: (rowKey: Key) => toRaw(kvKIndexRef.value?.kvMap?.get(rowKey)) as RecordType,
    getIndexsByKey: (rowKey: Key) => kvKIndexRef.value?.kIndexMap?.get(rowKey) as number[],
    allDataRowKeys: allDataRowKeysRef,
    allDataRootRowKeys: allDataRootRowKeysRef,
    getKeyByIndexs: (indexsString: string) => kvKIndexRef.value.indexsKeyMap!.get(indexsString)!,
  }
}
