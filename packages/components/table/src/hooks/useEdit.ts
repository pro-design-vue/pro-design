/*
 * @Author: shen
 * @Date: 2023-11-03 11:03:37
 * @LastEditors: shen
 * @LastEditTime: 2025-12-04 10:52:15
 * @Description:
 */
import type { Ref, ShallowRef, InjectionKey, ComputedRef } from 'vue'
import type {
  AddLineOptions,
  DefaultRecordType,
  ErrorListObjectType,
  GetRowKey,
  Key,
  ProTableProps,
  RowEditableType,
  TableEditingCell,
  TableErrorListMap,
  TableExposeType,
  TablePromiseErrorData,
} from '../components/interface'
import { shallowRef, provide, inject, ref, computed, triggerRef } from 'vue'
import { useMergedState } from '@pro-design-vue/hooks'
import { useIntl } from '@pro-design-vue/components/config-provider'
import { message } from 'ant-design-vue'
import { cloneDeep } from '@pro-design-vue/utils'
import { getCellKey } from '../utils/util'

type EditProps = {
  editCellKeys: Ref<string[]>
  openEditor: (key: string | string[], values?: Record<string, any>) => void
  closeEditor: (key: string) => void
  // oldValuesMap: ShallowRef<Record<string, any>>
  editableType: ComputedRef<RowEditableType | undefined>
  mergedEditableKeys: Ref<Key[] | undefined>
  isRowEdit: ComputedRef<boolean>
  editRowsMap: ShallowRef<Record<string, Record<string, any>>>
  setEditingCell: (params: TableEditingCell, isEdit: boolean) => void
}

const EditKey: InjectionKey<EditProps> = Symbol('edit')

export const useEditProvider = (
  props: ProTableProps,
  {
    rawData,
    getRowKey,
    getIndexsByKey,
    getRecordByKey,
  }: {
    rawData: ShallowRef<DefaultRecordType[]>
    getRowKey: ComputedRef<GetRowKey>
    getIndexsByKey: (key: Key) => number[]
    getRecordByKey: (key: Key) => DefaultRecordType
  },
) => {
  const editCellKeys = shallowRef<string[]>([])
  // const oldValuesMap = shallowRef({})
  const editRowsMap = shallowRef({})
  const intl = useIntl()
  const editableType = computed<RowEditableType | undefined>(() => props.rowEditable?.type)
  const [mergedEditableKeys, setMergedEditableKeys] = useMergedState<Key[] | undefined>([], {
    value: computed(() => props.editableKeys || props.rowEditable?.editableKeys),
    onChange: props.rowEditable?.onChange
      ? (keys) => {
          props.rowEditable?.onChange?.(
            // 计算编辑的key
            keys ?? [],
            keys?.map((key) => editRowsMap.value[key]) ?? [],
          )
        }
      : undefined,
  })

  // 当前编辑的单元格
  const editingCells = ref<{ [cellKey: string]: TableEditingCell }>({})
  const newLineRecordCache = shallowRef<{
    [key: Key]: { defaultValue: any; options: AddLineOptions }
  }>({})
  /** 一个用来标志的set 提供了方便的 api 来去重什么的 */
  const editableKeysSet = computed(() => {
    const keys =
      editableType.value === 'single'
        ? mergedEditableKeys.value?.slice(0, 1)
        : mergedEditableKeys.value
    return new Set(keys)
  })

  const isEditable = (recordKey: Key) => {
    if (mergedEditableKeys.value?.includes(recordKey)) return true
    return false
  }
  const isRowEdit = computed(() => !!editableType.value)

  const openEditor = (key: string | string[]) => {
    if (key) {
      const newKeys = [...editCellKeys.value]
      if (Array.isArray(key)) {
        editCellKeys.value = key
      } else {
        newKeys.includes(key) || newKeys.push(key)
      }
      editCellKeys.value = newKeys
      // Object.assign(oldValuesMap.value, values || {})
    }
  }
  const closeEditor = (key: string) => {
    const closeKeys = editCellKeys.value.filter((cellKey) => cellKey !== key)
    const closeCells = closeKeys
      .map((key) => editingCells.value[key]!)
      .filter((cell) => {
        return cell && !cell.column?.edit?.keepEditMode
      })
    const list = closeCells.map(
      (cell) =>
        new Promise((resolve) => {
          cell?.validateEdit().then((r) => {
            if (r === true) {
              const cellKey = getCellKey(cell.rowKey, cell.columnKey)
              resolve(cellKey)
            } else {
              resolve(null)
            }
          })
        }),
    )

    Promise.all(list).then((keys) => {
      const closeKeys = keys.filter((key) => !!key)
      editCellKeys.value = editCellKeys.value.filter((key) => !closeKeys.includes(key))
    })
  }

  const setEditingCell = (params: TableEditingCell, isEdit: boolean) => {
    const cellKey = getCellKey(params.rowKey, params.columnKey)

    if (isEdit) {
      // @ts-ignore
      editingCells.value[cellKey] = params
    } else {
      delete editingCells.value[cellKey]
    }
  }

  const getErrorListMapByErrors = (errors: ErrorListObjectType[]): TableErrorListMap => {
    const errorMap: TableErrorListMap = {}
    errors.forEach(({ rowKey, columnKey, errorList }) => {
      const key = [rowKey, columnKey].join('__')
      if (errorList?.length) {
        errorMap[key] = errorList
      } else {
        delete errorMap[key]
      }
    })
    return errorMap
  }

  // 校验一行的数据
  const validateOneRowData = (recordKey: Key) => {
    const cellKeys = Object.keys(editingCells.value)
    const rowCellKeys = cellKeys.filter((cellKey) => cellKey.startsWith(`${recordKey}_`))
    const list = rowCellKeys.map(
      (cellKey) =>
        new Promise<ErrorListObjectType>((resolve) => {
          const cell = editingCells.value[cellKey]
          cell?.validateEdit().then((r) => {
            if (r === true) {
              resolve({ ...cell, errorList: [] })
            } else {
              resolve({ ...cell, errorList: r })
            }
          })
        }),
    )
    return new Promise<TablePromiseErrorData>((resolve, reject) => {
      Promise.all(list).then((errors) => {
        resolve({
          errors: errors.filter((t) => t.errorList?.length),
          errorMap: getErrorListMapByErrors(errors),
        })
      }, reject)
    })
  }

  /**
   * 校验表格单行数据（对外开放方法，修改时需慎重）
   * @param recordKey 行唯一标识
   */
  const validateRowData: TableExposeType['validateRowData'] = (recordKey: Key) =>
    new Promise((resolve, reject) => {
      validateOneRowData(recordKey).then(({ errors, errorMap }) => {
        props.onRowValidate?.({ errors, errorMap })
        resolve({ errors, errorMap })
      }, reject)
    })

  // 校验可编辑单元格
  const validateTableCellData = () => {
    const cellKeys = Object.keys(editingCells.value)
    const list = cellKeys.map(
      (cellKey) =>
        new Promise<ErrorListObjectType>((resolve) => {
          const cell = editingCells.value[cellKey]
          cell?.validateEdit().then((r) => {
            if (r === true) {
              resolve({ ...cell, errorList: [] })
            } else {
              resolve({ ...cell, errorList: r })
            }
          })
        }),
    )
    return new Promise<TablePromiseErrorData>((resolve, reject) => {
      Promise.all(list).then((errors) => {
        resolve({
          errors: errors.filter((t) => t.errorList?.length),
          errorMap: getErrorListMapByErrors(errors),
        })
      }, reject)
    })
  }
  /**
   * 校验整个表格数据（对外开放方法，修改时需慎重）
   */
  const validateTableData: TableExposeType['validateTableData'] = () =>
    new Promise((resolve, reject) => {
      validateTableCellData().then(({ errors, errorMap }) => {
        props.onValidate?.({ errors, errorMap })
        resolve({ errors, errorMap, data: errors?.length ? undefined : rawData.value })
      }, reject)
    })

  /**
   * 添加编辑行数据
   *
   * @param recordKey
   */
  const addEditRecord = (recordValue: any, options: AddLineOptions) => {
    // 暂时不支持多行新增
    if (
      isRowEdit.value &&
      Object.keys(newLineRecordCache.value)?.length &&
      props.rowEditable?.onlyAddOneLineAlertMessage !== false
    ) {
      message.warning(
        props.rowEditable?.onlyAddOneLineAlertMessage ||
          intl.getMessage('editableTable.onlyAddOneLine', '只能新增一行'),
      )
      return false
    }
    // 如果是单行的话，不允许多行编辑
    if (isRowEdit.value && editableKeysSet.value.size > 0 && editableType.value === 'single') {
      message.warning(
        props.rowEditable?.onlyOneLineEditorAlertMessage ||
          intl.getMessage('editableTable.onlyOneLineEditor', '只能同时编辑一行'),
      )
      return false
    }

    const recordKey = getRowKey.value(recordValue, -1)
    if (!recordKey) {
      throw new Error('请设置 recordCreatorProps.record 并返回一个唯一的key')
    }
    if (isRowEdit.value) {
      editableKeysSet.value.add(recordKey)
      editRowsMap.value[recordKey] = cloneDeep(recordValue)
      setMergedEditableKeys(Array.from(editableKeysSet.value))
      triggerRef(editRowsMap)
    }
    if (options?.position === 'top') {
      rawData.value.unshift(recordValue)
    } else {
      rawData.value.push(recordValue)
    }
    newLineRecordCache.value[recordKey] = {
      defaultValue: recordValue,
      options,
    }
    triggerRef(rawData)
    return true
  }

  /**
   * 进入编辑状态
   *
   * @param recordKey
   */
  const startEditable = (recordKey: Key, recordValue?: any) => {
    if (!isRowEdit.value) {
      return false
    }
    // 如果是单行的话，不允许多行编辑
    if (editableKeysSet.value.size > 0 && editableType.value === 'single') {
      message.warning(
        props.rowEditable?.onlyOneLineEditorAlertMessage ||
          intl.getMessage('editableTable.onlyOneLineEditor', '只能同时编辑一行'),
      )
      return false
    }
    editableKeysSet.value.add(recordKey)

    editRowsMap.value[recordKey] = cloneDeep(recordValue ?? getRecordByKey(recordKey))
    setMergedEditableKeys(Array.from(editableKeysSet.value))
    triggerRef(editRowsMap)
    return true
  }

  /**
   * 退出编辑状态
   *
   * @param recordKey
   */
  const cancelEditable = (recordKey: Key) => {
    if (!isRowEdit.value) {
      return false
    }
    const newLineRecord = newLineRecordCache.value[recordKey]
    if (newLineRecord) {
      delete newLineRecordCache.value[recordKey]
      const rowIndex = rawData.value.findIndex((item) => getRowKey.value(item, -1) === recordKey)
      rawData.value.splice(rowIndex, 1)
      triggerRef(rawData)
    }
    editableKeysSet.value.delete(recordKey)
    delete editRowsMap.value[recordKey]
    setMergedEditableKeys(Array.from(editableKeysSet.value))

    return true
  }

  /**
   * 保存编辑
   *
   * @param recordKey
   */
  const saveEditable = async (recordKey: Key) => {
    if (!isRowEdit.value) {
      return false
    }
    const { errors } = await validateRowData(recordKey)
    if (!!errors.length) {
      return false
    }
    const editRow = editRowsMap.value[recordKey]
    const originRow = getRecordByKey(recordKey)
    const success = await props.rowEditable?.onSave?.(recordKey, editRow, originRow)
    if (success === false) {
      return false
    }
    upadteRowData(recordKey, editRow)
    const newLineRecord = newLineRecordCache.value[recordKey]
    if (newLineRecord) {
      delete newLineRecordCache.value[recordKey]
    }
    await cancelEditable(recordKey)
    return true
  }

  const upadteRowData = (recordKey: Key, editRow: any) => {
    const recordIndexs = getIndexsByKey(recordKey)
    const indexsLen = recordIndexs.length
    if (indexsLen === 1) {
      rawData.value.splice(recordIndexs[0]!, 1, editRow)
    }

    if (indexsLen > 1) {
      let copyData: DefaultRecordType[] = rawData.value
      let item: DefaultRecordType
      const childrenColumnName = props.childrenColumnName || 'children'
      for (let i = 0; i < indexsLen; i++) {
        item = copyData[recordIndexs[i]!]!
        if (i === indexsLen - 2) {
          const currentData = item?.[childrenColumnName] || []
          currentData.splice(recordIndexs[indexsLen - 1]!, 1, editRow)
          break
        }
        copyData = item?.[childrenColumnName] || []
      }
    }
    triggerRef(rawData)
  }

  provide(EditKey, {
    editCellKeys,
    openEditor,
    closeEditor,
    // oldValuesMap,
    editableType,
    mergedEditableKeys,
    isRowEdit,
    editRowsMap,
    setEditingCell,
  })
  return {
    editCellKeys,
    openEditor,
    closeEditor,
    cancelEditable,
    startEditable,
    saveEditable,
    isEditable,
    validateTableData,
    validateRowData,
    addEditRecord,
  }
}
export const useEditInject = () => {
  return inject(EditKey, {
    editCellKeys: ref([]),
    openEditor: () => {},
    closeEditor: () => {},
    // oldValuesMap: shallowRef({}),
    editRowsMap: shallowRef({}),
    editableType: computed(() => undefined),
    isRowEdit: computed(() => false),
    mergedEditableKeys: computed(() => []),
    setEditingCell: () => {},
  })
}
