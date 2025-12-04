/*
 * @Author: shen
 * @Date: 2025-11-27 10:42:18
 * @LastEditors: shen
 * @LastEditTime: 2025-12-04 17:40:28
 * @Description:
 */
import type { PropType } from 'vue'
import type {
  AllValidateResult,
  DataIndex,
  FinallyColumnType,
  Key,
  ValueEnumType,
} from '../interface'

import { defineComponent, ref, computed, watch, triggerRef, onMounted, onUnmounted } from 'vue'
import { set, isFunction, get, runFunction, isEqual, debounce } from '@pro-design-vue/utils'
import { useInjectTable } from '../context/TableContext'
import { Popover } from 'ant-design-vue'
import { useInjectLevel } from '../../hooks/useLevel'
import { CloseCircleFilled } from '@ant-design/icons-vue'
import { useEditInject } from '../../hooks/useEdit'
import { validate } from '../../utils/form-model'
import { useFetchData } from '@pro-design-vue/hooks'

export const parsingValueEnumToArray = (
  valueEnum: Record<string, ValueEnumType>,
): ValueEnumType[] | undefined => {
  const enumArray: ValueEnumType[] = []
  const valueKeys = Object.keys(valueEnum ?? {})
  if (!valueKeys?.length) {
    return
  }
  valueKeys.forEach((key) => {
    const value = valueEnum[key] as {
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

export default defineComponent({
  inheritAttrs: false,
  props: {
    prefixCls: String as PropType<string>,
    rowIndex: { type: Number as PropType<number>, required: true },
    flattenRowIndex: { type: Number, required: true },
    rowKey: { type: [Number, String] as PropType<Key> },
    column: { type: Object as PropType<FinallyColumnType>, default: () => ({}) },
    item: { type: Object as PropType<any>, default: () => ({}) },
    isRowEdit: Boolean as PropType<boolean>,
    editRow: { type: Object as PropType<any> },
  },
  emits: ['closeEditor', 'keydown'],
  setup(props) {
    const loading = ref(false)
    const tableContext = useInjectTable()
    const level = useInjectLevel()
    const fetchOptions = ref<any>()
    const columnKey = computed(() => props.column!.columnKey)
    const recordIndexs = computed(() => tableContext.getIndexsByKey(props.rowKey!))
    const valueEnum = computed(() =>
      parsingValueEnumToArray(runFunction(props.column?.valueEnum, props.item)),
    )
    const originValue = get(props.item, props.column!.dataIndex!)
    const errorList = ref<AllValidateResult[]>()
    const { editRowsMap, setEditingCell } = useEditInject()
    const cellValue = computed(() =>
      props.column!.dataIndex ? get(props.editRow, props.column!.dataIndex) : undefined,
    )
    const cellRender = computed(
      () => tableContext.allCellProps.value?.[props.rowKey!]?.[props.column!.columnKey] || {},
    )
    const cellProps: any = computed(() => cellRender.value.props || {})
    const cellRowSpan = computed(() => cellProps.value.rowSpan!)

    const sorterState = computed(() =>
      tableContext.sorterStates.value.find(({ key }) => key === columnKey.value),
    )
    const sorterOrder = computed(() => (sorterState.value ? sorterState.value?.sortOrder : null))

    const cellClass = computed(() => ({
      [`${props.prefixCls}-cell`]: true,
      [`${props.prefixCls}-first-cell`]: props.column!.columnIndex === 0,
      [`${props.prefixCls}-body-cell`]: true,
      [`${props.prefixCls}-cell-multi`]: cellRowSpan.value > 1,
      [`${props.prefixCls}-cell-hidden`]: cellRowSpan.value === 0,
      [`${props.prefixCls}-column-sort`]: sorterOrder.value,
    }))

    const hasFetchOptions = computed(
      () => props.column.edit?.request && props.column.edit?.dependencies?.length,
    )

    const rules = computed(() => {
      return (
        runFunction(props.column.edit?.rules, {
          column: props.column,
          record: props.editRow,
          recordIndexs: recordIndexs.value,
          newValue: cellValue.value,
        }) ?? []
      )
    })

    const validateEnabled = computed(() => rules.value.length > 0)

    const editValue = ref()

    const updateEditedCellValue = (key: DataIndex, value: any) => {
      setTimeout(() => {
        const editRow = { ...props.editRow }
        set(editRow, key, value)
        editRowsMap.value[props.rowKey!] = editRow
        triggerRef(editRowsMap)
      }, 10)
    }

    const cellParams = computed(() => ({
      column: props.column,
      record: props.editRow,
      recordIndexs: recordIndexs.value!,
      value: editValue.value,
      updateEditedCellValue,
    }))

    const editOnListeners = computed(() => {
      return props.column.edit?.on?.({ ...cellParams.value }) || {}
    })

    const editProps = computed(() => {
      const { edit = {} } = props.column
      return isFunction(edit.props) ? edit.props(cellParams.value) : { ...edit.props }
    })

    const options = computed(
      () => fetchOptions.value ?? editProps.value?.options ?? valueEnum.value,
    )

    const componentProps = computed(() => {
      const { edit } = props.column
      if (!edit) return {}
      const tmpProps = { ...editProps.value }
      delete tmpProps.onChange
      delete tmpProps.value
      delete tmpProps.options
      return tmpProps
    })

    const validateEdit = (): Promise<true | AllValidateResult[]> => {
      return new Promise((resolve) => {
        if (!validateEnabled.value) {
          resolve(true)
          return true
        }

        // 值相同且不为空时不触发变化及校验
        if (
          isEqual(originValue, editValue.value) &&
          !(originValue === undefined || originValue === null || originValue === '')
        ) {
          resolve(true)
          return true
        }
        validate(editValue.value, rules.value).then((result) => {
          const list = result?.filter((t) => !t.result)
          if (!list || !list.length) {
            errorList.value = []
            resolve(true)
          } else {
            errorList.value = list
            resolve(list)
          }
        })
      })
    }

    const updateEditRow = () => {
      const editRow = { ...props.editRow }
      set(editRow, props.column.dataIndex!, editValue.value)
      editRowsMap.value[props.rowKey!] = { ...editRow }
      triggerRef(editRowsMap)
    }

    const fetchData = useFetchData({ request: props.column.edit?.request })

    const requestOptions = debounce(async (newRow?: any) => {
      const row = { ...props.item, ...newRow }
      const params = { rowKey: props.rowKey }
      props.column.edit?.dependencies?.forEach((dataIndex) => {
        const newValue = get(row, dataIndex)
        set(params, dataIndex, newValue)
      })
      loading.value = true
      const result = await fetchData(params)
      fetchOptions.value = result
      loading.value = false
    }, 200)

    const onEditChange = (val: any, ...args: any) => {
      const valueSetter = props.column.edit?.valueSetter
      if (valueSetter) {
        valueSetter(cellParams.value)
      } else {
        editProps.value?.onChange?.(val, ...args, cellParams.value)
        editOnListeners.value?.onChange?.(cellParams.value)
        updateEditRow()
      }
      validateEdit()
    }

    const updateRecordValue = debounce(async (newValue) => {
      let record: any = {}
      let dataSource = tableContext.rawData.value || []
      recordIndexs.value.forEach((index) => {
        record = dataSource[index]
        dataSource = record[tableContext.childrenColumnName.value] || []
      })
      set(record, props.column.dataIndex!, newValue)
      triggerRef(tableContext.rawData)
    }, 200)

    watch(
      cellValue,
      (value) => {
        editValue.value = props.column.edit?.valueGetter?.(cellParams.value) ?? value
        if (!props.isRowEdit) {
          updateRecordValue(value)
        }
      },
      { immediate: true },
    )

    watch(
      () => props.editRow,
      (newRow, oldRow) => {
        if (hasFetchOptions.value) {
          const isSame = props.column.edit?.dependencies?.every((dataIndex) => {
            const newValue = get(newRow, dataIndex)
            const oldIndex = get(oldRow, dataIndex)
            return isEqual(newValue, oldIndex)
          })
          if (!isSame) {
            requestOptions(newRow)
          }
        }
      },
    )

    onMounted(() => {
      if (!props.isRowEdit && !editRowsMap.value[props.rowKey!]) {
        editRowsMap.value[props.rowKey!] = { ...props.item }
        triggerRef(editRowsMap)
      }
      if (props.column.edit?.request) {
        requestOptions()
      }
      setEditingCell(
        {
          recordIndexs: recordIndexs.value,
          column: props.column,
          rowKey: props.rowKey!,
          originRecord: props.item,
          rowIndex: props.rowIndex,
          columnKey: props.column.columnKey!,
          validateEdit,
        },
        true,
      )
    })

    onUnmounted(() => {
      setEditingCell(
        {
          recordIndexs: recordIndexs.value,
          column: props.column,
          rowKey: props.rowKey!,
          originRecord: props.item,
          rowIndex: props.rowIndex,
          columnKey: props.column.columnKey!,
          validateEdit,
        },
        false,
      )
      props.column?.edit?.onEdited?.(cellParams.value)
    })

    return () => {
      const Component = props.column.edit?.component
      const errorMessage = errorList.value?.[0]?.message
      const inlineError = props.column.edit?.inlineError
      const tmpEditOnListeners = { ...editOnListeners.value }
      delete tmpEditOnListeners.onChange
      return (
        <div
          {...cellProps.value}
          class={cellClass.value}
          tabindex="-1"
          role="cell"
          data-column-key={columnKey.value}
          data-level={level}
          aria-selected="true"
          onClick={(e: MouseEvent) => {
            e.stopPropagation()
          }}
        >
          <div class={`${props.prefixCls}-cell-content`} style="width: 100%; position:relative">
            <Component
              style="width: 100%"
              status={errorMessage ? 'error' : undefined}
              v-model:value={editValue.value}
              getPopupContainer={() => document.body}
              {...componentProps.value}
              {...tmpEditOnListeners}
              options={options.value}
              onChange={onEditChange}
            />
            {errorMessage &&
              (!inlineError ? (
                <Popover
                  arrowPointAtCenter
                  placement="topRight"
                  getPopupContainer={() => document.body}
                  v-slots={{
                    content: () => (
                      <div class={`${props.prefixCls}-cell-content-error-message`}>
                        {errorList.value?.map((error) => (
                          <div key={error.message}>{error.message}</div>
                        ))}
                      </div>
                    ),
                  }}
                >
                  <span class={`${props.prefixCls}-cell-content-error`}>
                    <CloseCircleFilled />
                  </span>
                </Popover>
              ) : (
                <div class={`${props.prefixCls}-cell-content-error-inline`}>{errorMessage}</div>
              ))}
          </div>
        </div>
      )
    }
  },
})
