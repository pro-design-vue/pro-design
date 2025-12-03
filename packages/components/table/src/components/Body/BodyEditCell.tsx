/*
 * @Author: shen
 * @Date: 2025-11-27 10:42:18
 * @LastEditors: shen
 * @LastEditTime: 2025-12-03 09:23:19
 * @Description:
 */
import type { PropType } from 'vue'
import type { AllValidateResult, FinallyColumnType, Key, ValueEnumType } from '../interface'

import { defineComponent, ref, computed, watch, triggerRef, onMounted, onUnmounted } from 'vue'
import { set, isFunction, get, runFunction } from '@pro-design-vue/utils'
import { useInjectTable } from '../context/TableContext'
import { Popover } from 'ant-design-vue'
import { useInjectLevel } from '../../hooks/useLevel'
import { CloseCircleFilled } from '@ant-design/icons-vue'
import { useEditInject } from '../../hooks/useEdit'
import { validate } from '../../utils/form-model'

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
    const tableContext = useInjectTable()
    const level = useInjectLevel()
    const columnKey = computed(() => props.column!.columnKey)
    const recordIndexs = computed(() => tableContext.getIndexsByKey(props.rowKey!))
    const childrenColumnName = computed(() => tableContext.props.childrenColumnName || 'children')
    const valueEnum = computed(() =>
      parsingValueEnumToArray(runFunction(props.column?.valueEnum, props.item)),
    )
    const errorList = ref<AllValidateResult[]>()
    const { editRowsMap, setEditingCell } = useEditInject()
    const cellValue = computed(() =>
      props.column!.dataIndex
        ? get(!props.isRowEdit ? props.item : props.editRow, props.column!.dataIndex)
        : undefined,
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

    const rules = computed(() => {
      return (
        runFunction(props.column.edit?.rules, {
          column: props.column,
          record: props.isRowEdit ? props.editRow : props.item,
          recordIndexs: recordIndexs.value,
          newValue: cellValue.value,
        }) ?? []
      )
    })

    const validateEnabled = computed(() => rules.value.length > 0)

    const editValue = ref()
    const cellParams = computed(() => ({
      column: props.column,
      record: !props.isRowEdit ? props.item : props.editRow,
      recordIndexs: recordIndexs.value!,
      value: editValue.value,
    }))

    const editOnListeners = computed(() => {
      return props.column.edit?.on?.({ ...cellParams.value }) || {}
    })

    const editProps = computed(() => {
      const { edit = {} } = props.column
      return isFunction(edit.props) ? edit.props(cellParams.value) : { ...edit.props }
    })

    const options = computed(() => editProps.value?.options ?? valueEnum.value)

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

    const onEditChange = (val: any, ...args: any) => {
      const params: any = {
        column: props.column,
        record: props.isRowEdit ? props.editRow : props.item,
        recordIndexs: recordIndexs.value,
        newValue: cellValue.value,
      }
      const value = props.column.edit?.valueParser?.(params) ?? editValue.value
      const valueSetter = props.column.edit?.valueSetter
      if (valueSetter) {
        valueSetter(params)
      } else {
        editProps.value?.onChange?.(val, ...args)
        editOnListeners.value?.onChange?.(params)
        if (props.isRowEdit) {
          const record = { ...props.editRow }
          set(record, props.column.dataIndex!, value)
          editRowsMap.value[props.rowKey!] = record
          triggerRef(editRowsMap)
        } else {
          let record: any = {}
          let dataSource = tableContext.rawData.value || []
          recordIndexs.value.forEach((index) => {
            record = dataSource[index]
            dataSource = record[childrenColumnName.value] || []
          })
          set(record, props.column.dataIndex!, value)
          triggerRef(tableContext.rawData)
        }
      }
      validateEdit()
    }

    watch(
      cellValue,
      (value) => {
        editValue.value = props.column.edit?.valueGetter?.(cellParams.value) ?? value
      },
      { immediate: true },
    )

    onMounted(() => {
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
