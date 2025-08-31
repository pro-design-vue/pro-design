/*
 * @Author: shen
 * @Date: 2022-11-05 13:48:57
 * @LastEditors: shen
 * @LastEditTime: 2025-08-29 14:27:22
 * @Description:
 */
import type { Ref } from 'vue'
import type {
  TableRowSelection,
  Key,
  GetRowKey,
  TableLocale,
  SelectionItem,
  CheckboxProps,
  ProTableProps,
  FlatRecord,
  DefaultRecordType,
} from '../components/interface'
import type { GetCheckDisabled } from '../utils/conductUtil'
import type { DataEntity } from '../utils/conductUtil'
import type { KeyEntities } from './useFlattenRecords'
import { computed, shallowRef, ref, watch, watchEffect } from 'vue'
import { conductCheck } from '../utils/conductUtil'
import devWarning from '../utils/devWarning'
import { useMergedState, useState } from '@pro-design-vue/hooks'

export const SELECTION_ALL = 'SELECT_ALL'
export const SELECTION_INVERT = 'SELECT_INVERT'
export const SELECTION_NONE = 'SELECT_NONE'
interface UseSelectionConfig<RecordType> {
  prefixCls: Ref<string>
  pageData: Ref<RecordType[]>
  getRowKey: Ref<GetRowKey<RecordType>>
  getRecordByKey: (key: Key) => RecordType
  childrenColumnName: Ref<string>
  flattenData: Ref<RecordType[]>
  keyEntities: Ref<KeyEntities>
  locale: Ref<TableLocale>
  checkboxPropsMap: Ref<Map<Key, Partial<CheckboxProps>>>
  allDataRowKeys: Ref<Key[]>
  allDataRootRowKeys: Ref<Key[]>
  pageDataRowKeys: Ref<Key[]>
  pageDataEnableRowKeys: Ref<Key[]>
}
export type SelectionsRes = {
  derivedSelectedKeySet: Ref<Set<Key>>
  derivedHalfSelectedKeySet: Ref<Set<Key>>
  derivedSelectedKeys: Ref<Key[]>
  setSelectedKeys: (keys: Key[]) => void
  triggerSingleSelection: (key: Key, selected: boolean, keys: Key[], event: Event) => void
  mergedSelections: Ref<SelectionItem[] | null>
  lastSelectedKey: Ref<Key>
  setLastSelectedKey: (key: Key) => void
  mergedRowSelection: Ref<TableRowSelection>
  isCheckboxDisabled: (r: FlatRecord) => void
  levelEntities: Ref<Map<number, Set<DataEntity>>>
  maxLevel: Ref<number>
  allDisabled: Ref<boolean>
  allDisabledSomeChecked: Ref<boolean>
  allDisabledAndChecked: Ref<boolean>
  checkedCurrentAll: Ref<boolean>
  checkedCurrentSome: Ref<boolean>
}
export type INTERNAL_SELECTION_ITEM =
  | SelectionItem
  | typeof SELECTION_ALL
  | typeof SELECTION_INVERT
  | typeof SELECTION_NONE
export default function useSelection<RecordType = DefaultRecordType>(
  props: ProTableProps,
  mergedRowSelection: Ref<TableRowSelection>,
  allData: Ref<any[]>,
  configRef: UseSelectionConfig<RecordType>,
): SelectionsRes {
  const preserveRecordsRef = shallowRef<Map<Key, RecordType>>(new Map())

  const [mergedSelectedKeys, setMergedSelectedKeys] = useMergedState(
    props.selectedRowKeys ||
      mergedRowSelection.value?.selectedRowKeys ||
      mergedRowSelection.value?.defaultSelectedRowKeys ||
      [],
    {
      value: computed(() => props.selectedRowKeys || mergedRowSelection.value?.selectedRowKeys),
    },
  )

  const isCheckboxDisabled: GetCheckDisabled<FlatRecord> = (record) =>
    !!configRef.checkboxPropsMap.value.get(record.rowKey)?.disabled

  const allDisabled = ref(true)
  const allDisabledSomeChecked = ref(false)
  const allDisabledAndChecked = ref(true)
  const checkedCurrentAll = ref(true)
  const checkedCurrentSome = ref(false)
  const levelEntities = shallowRef<Map<number, Set<DataEntity>>>(new Map())
  const maxLevel = ref(0)
  const derivedSelectedKeys = shallowRef<Key[]>([])
  const derivedHalfSelectedKeys = shallowRef<Key[]>([])
  const derivedSelectedKeySet = computed<Set<Key>>(() => {
    const keys: Key[] =
      mergedRowSelection.value?.type === 'radio'
        ? derivedSelectedKeys.value.slice(0, 1)
        : derivedSelectedKeys.value
    return new Set(keys)
  })
  const derivedHalfSelectedKeySet = computed<Set<Key>>(() =>
    mergedRowSelection.value?.type === 'radio' ? new Set() : new Set(derivedHalfSelectedKeys.value),
  )

  watch(allData, () => {
    levelEntities.value = new Map()
  })

  watchEffect(() => {
    const keyEntities = configRef.keyEntities.value
    const derivedSelectedKeySetValue = derivedSelectedKeySet.value
    let newAllDisabled = true
    let newAllDisabledSomeChecked = false
    let newAllDisabledAndChecked = true
    let newCheckedCurrentAll = true
    let newCheckedCurrentSome = false
    configRef.pageDataRowKeys.value.forEach((rowKey) => {
      const flatRecord = keyEntities[rowKey]!
      const { level } = flatRecord
      if (isCheckboxDisabled(flatRecord)) {
        if (derivedSelectedKeySetValue.has(rowKey)) {
          newAllDisabledSomeChecked = true
        } else {
          newAllDisabledAndChecked = false
        }
      } else {
        newAllDisabled = false
        if (derivedSelectedKeySetValue.has(rowKey)) {
          newCheckedCurrentSome = true
        } else {
          newCheckedCurrentAll = false
        }
      }
      let dataEntitySet = levelEntities.value.get(level)
      if (!dataEntitySet) {
        dataEntitySet = new Set()
      }
      levelEntities.value.set(level, dataEntitySet)
      dataEntitySet.add(flatRecord)
      allDisabled.value = newAllDisabled
      allDisabledAndChecked.value = newAllDisabledAndChecked
      allDisabledSomeChecked.value = newAllDisabledSomeChecked
      checkedCurrentAll.value = newCheckedCurrentAll
      checkedCurrentSome.value = newCheckedCurrentSome
      maxLevel.value = Math.max(maxLevel.value, level)
    })
  })

  watchEffect(() => {
    if (mergedRowSelection.value?.checkStrictly) {
      derivedSelectedKeys.value = mergedSelectedKeys.value || []
      derivedHalfSelectedKeys.value = []
    } else {
      const { checkedKeys, halfCheckedKeys } = conductCheck(
        mergedSelectedKeys.value!,
        true,
        configRef.keyEntities.value,
        levelEntities.value,
        maxLevel.value,
        isCheckboxDisabled,
      )
      derivedSelectedKeys.value = checkedKeys || []
      derivedHalfSelectedKeys.value = halfCheckedKeys
    }
  })

  const [lastSelectedKey, setLastSelectedKey] = useState<Key>('')

  watch(
    () => props.rowSelection,
    () => {
      if (!props.rowSelection) {
        setMergedSelectedKeys([])
      }
    },
    { immediate: true },
  )

  const setSelectedKeys = (keys: Key[]) => {
    let availableKeys: Key[]
    let records: RecordType[]
    const { preserveSelectedRowKeys, onChange } = mergedRowSelection.value!
    const { getRecordByKey } = configRef
    if (preserveSelectedRowKeys) {
      const preserveRecords: Map<Key, RecordType> = new Map()
      availableKeys = keys
      records = keys.map((key) => {
        let record = getRecordByKey(key)
        if (!record && preserveRecordsRef.value.has(key)) {
          record = preserveRecordsRef.value.get(key)!
        }
        preserveRecords.set(key, record)
        return record
      })
      preserveRecordsRef.value = preserveRecords
    } else {
      availableKeys = []
      records = []
      keys.forEach((key) => {
        const record = getRecordByKey(key)
        if (record !== undefined) {
          availableKeys.push(key)
          records.push(record)
        }
      })
    }
    setMergedSelectedKeys(availableKeys)
    props['onUpdate:selectedRowKeys']?.(availableKeys, records as any)
    onChange?.(availableKeys, records as any)
  }

  const mergedSelections = computed(() => {
    const { onSelectInvert, onSelectNone, selections, hideSelectAll } = mergedRowSelection.value!
    const { pageData, getRowKey, locale } = configRef
    if (!selections || hideSelectAll) {
      return null
    }
    const selectionList: INTERNAL_SELECTION_ITEM[] =
      selections === true ? [SELECTION_ALL, SELECTION_INVERT, SELECTION_NONE] : selections
    return selectionList.map((selection: INTERNAL_SELECTION_ITEM) => {
      if (selection === SELECTION_ALL) {
        return {
          key: 'all',
          text: locale.value.selectionAll,
          onSelect() {
            setSelectedKeys(configRef.allDataRootRowKeys.value)
          },
        }
      }
      if (selection === SELECTION_INVERT) {
        return {
          key: 'invert',
          text: locale.value.selectInvert,
          onSelect() {
            const keySet = new Set(derivedSelectedKeySet.value)
            pageData.value.forEach((record, index) => {
              const key = getRowKey.value(record, index)
              keySet.has(key) ? keySet.delete(key) : keySet.add(key)
            })
            const keys = Array.from(keySet)
            if (onSelectInvert) {
              devWarning(
                false,
                'Table',
                '`onSelectInvert` will be removed in future. Please use `onChange` instead.',
              )
              onSelectInvert(keys)
            }
            setSelectedKeys(keys)
          },
        }
      }
      if (selection === SELECTION_NONE) {
        return {
          key: 'none',
          text: locale.value.selectNone,
          onSelect() {
            onSelectNone?.()
            setSelectedKeys([])
          },
        }
      }
      return selection as SelectionItem
    })
  })

  const triggerSingleSelection = (key: Key, selected: boolean, keys: Key[], event: Event) => {
    const { onSelect } = mergedRowSelection.value!
    const { getRecordByKey } = configRef || {}
    if (onSelect) {
      const rows = keys.map((k) => getRecordByKey(k))
      onSelect(getRecordByKey(key) as any, selected, rows as any, event)
    }
    setSelectedKeys(keys)
  }

  return {
    derivedSelectedKeySet,
    derivedSelectedKeys,
    derivedHalfSelectedKeySet,
    setSelectedKeys,
    triggerSingleSelection,
    mergedSelections: mergedSelections,
    lastSelectedKey: lastSelectedKey,
    setLastSelectedKey,
    mergedRowSelection,
    isCheckboxDisabled,
    maxLevel,
    levelEntities,
    allDisabled,
    allDisabledAndChecked,
    allDisabledSomeChecked,
    checkedCurrentAll,
    checkedCurrentSome,
  }
}
