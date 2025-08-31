<!--
 * @Author: shen
 * @Date: 2023-11-08 21:59:48
 * @LastEditors: shen
 * @LastEditTime: 2023-12-22 10:31:47
 * @Description: 
-->
<script lang="ts">
import { defineComponent, ref, computed, watchEffect } from 'vue'
import { MenuOutlined } from '@ant-design/icons-vue'
import { useInjectTable } from '../context/TableContext'
import { useInjectBody } from '../context/BodyContext'
import { conductCheck } from '../../utils/conductUtil'
import { arrDel, arrAdd } from '../../utils/util'
import { useInjectLevel } from '../../hooks/useLevel'
import devWarning from '../../utils/devWarning'
import Radio from '../Radio'
import Checkbox from '../Checkbox'
import ExpandIcon from '../ExpandIcon.vue'

import type { PropType } from 'vue'
import type {
  FinallyColumnType,
  RowType,
  Key,
  DefaultRecordType,
  RowSelectionType,
  CheckboxProps,
  CellType,
} from '../interface'

export default defineComponent({
  name: 'BodyExtraCell',
  components: { Checkbox, Radio, ExpandIcon, MenuOutlined },
  props: {
    prefixCls: String as PropType<string>,
    rowIndex: { type: Number, required: true },
    type: { type: String as PropType<RowType> },
    column: { type: Object as PropType<FinallyColumnType<DefaultRecordType>>, default: () => ({}) },
    record: { type: Object as PropType<DefaultRecordType> },
    rowKey: { type: [Number, String] },
    expanded: Boolean as PropType<boolean>,
    supportExpand: Boolean,
  },
  setup(props) {
    const tableContext = useInjectTable()
    const level = useInjectLevel()
    const rowSelectionType = computed<RowSelectionType>(
      () => tableContext.mergedRowSelection.value.type as RowSelectionType,
    )
    const keySet = computed<Set<Key>>(() => tableContext.selection.derivedSelectedKeySet.value)
    const checked = ref(false)
    const mergedIndeterminate = ref(false)
    const checkboxProps = computed<CheckboxProps>(
      () => tableContext.checkboxPropsMap.value.get(props.rowKey!) as CheckboxProps,
    )
    const { onBodyCellContextmenu } = useInjectBody()
    const renderedCell = computed(
      () => tableContext.allCellProps.value[props.rowKey!]?.[props.column.columnKey] ?? {},
    )

    watchEffect(() => {
      const {
        selection: { derivedHalfSelectedKeySet },
        expandType,
      } = tableContext
      checked.value = keySet.value.has(props.rowKey!)
      const hasSelectKey = derivedHalfSelectedKeySet.value.has(props.rowKey!)
      if (expandType.value === 'nest') {
        mergedIndeterminate.value = hasSelectKey
        devWarning(
          typeof checkboxProps.value?.indeterminate !== 'boolean',
          'Table',
          'set `indeterminate` using `rowSelection.getCheckboxProps` is not allowed with tree structured dataSource.',
        )
      } else {
        mergedIndeterminate.value = checkboxProps.value?.indeterminate ?? hasSelectKey
      }
    })

    const mergedCellProps = computed<CellType>(() => {
      const { column } = props
      return {
        ...renderedCell.value.props,
        style: {
          ...(renderedCell.value?.props?.style || {}),
          width: `${column.finallyWidth || 0}px`,
        },
      }
    })

    const contextmenuProps = computed(() => ({
      record: props.record,
      column: props.column.originColumn,
      index: props.rowIndex,
      recordIndexs: tableContext.getIndexsByKey(props.rowKey!),
      key: props.rowKey,
    }))

    return {
      handleRadioChange: (e: Event) => {
        if (!(checked.value && !tableContext.mergedRowSelection.value.allowCancelRadio)) {
          tableContext.selection.triggerSingleSelection(
            props.rowKey!,
            !checked.value,
            checked.value ? [] : [props.rowKey!],
            e,
          )
        }
      },
      handleCheckboxChange: (event: Event) => {
        const { shiftKey } = event as MouseEvent
        const {
          selection: {
            lastSelectedKey,
            setLastSelectedKey,
            setSelectedKeys,
            triggerSingleSelection,
            mergedRowSelection,
            derivedSelectedKeys,
            isCheckboxDisabled,
            levelEntities,
            maxLevel,
          },
          getRecordByKey,
          pageDataEnableRowKeys,
          keyEntities,
        } = tableContext
        const { checkStrictly, onSelectMultiple } = mergedRowSelection.value!
        const currentRowKey = props.rowKey
        let shiftStartIndex = -1
        let shiftEndIndex = -1
        const enableRowKeys = pageDataEnableRowKeys.value
        if (shiftKey && checkStrictly) {
          const rowKeySet = new Set([lastSelectedKey.value, currentRowKey])
          enableRowKeys.some((rowkey, index) => {
            if (rowKeySet.has(rowkey)) {
              if (shiftStartIndex !== -1) {
                shiftEndIndex = index
                return true
              }
              shiftStartIndex = index
            }
            return false
          })
        }
        if (shiftEndIndex !== -1 && shiftStartIndex !== shiftEndIndex && checkStrictly) {
          const shiftSelctedRowKeys = enableRowKeys.slice(shiftStartIndex, shiftEndIndex + 1)
          const changeRowKeys: Key[] = []
          if (checked.value) {
            shiftSelctedRowKeys.forEach((rowKey) => {
              if (keySet.value.has(rowKey)) {
                changeRowKeys.push(rowKey)
                keySet.value.delete(rowKey)
              }
            })
          } else {
            shiftSelctedRowKeys.forEach((rowKey) => {
              if (!keySet.value.has(rowKey)) {
                changeRowKeys.push(rowKey)
                keySet.value.add(rowKey)
              }
            })
          }
          const selectedKeys = Array.from(keySet.value)
          onSelectMultiple?.(
            !checked.value,
            selectedKeys.map((rowKey) => getRecordByKey(rowKey)),
            changeRowKeys.map((rowKey) => getRecordByKey(rowKey)),
          )
          setSelectedKeys(selectedKeys)
        } else {
          const selectedRowKeys = derivedSelectedKeys.value!
          if (checkStrictly) {
            let keys: Key[] = []
            if (checked.value) {
              keys = arrDel(selectedRowKeys, currentRowKey!)
            } else {
              keys = arrAdd(selectedRowKeys, currentRowKey!)
            }
            triggerSingleSelection(currentRowKey!, !checked.value, keys, event)
          } else {
            const { checkedKeys, halfCheckedKeys } = conductCheck(
              [...selectedRowKeys, currentRowKey!],
              true,
              keyEntities.value,
              levelEntities.value,
              maxLevel.value,
              isCheckboxDisabled as any,
            )
            let allCheckedKeys = checkedKeys
            if (checked.value) {
              const checkedKeysSet = new Set(checkedKeys)
              checkedKeysSet.delete(currentRowKey!)
              allCheckedKeys = conductCheck(
                Array.from(checkedKeysSet),
                { checked: false, halfCheckedKeys },
                keyEntities.value,
                levelEntities.value,
                maxLevel.value,
                isCheckboxDisabled as any,
              ).checkedKeys
            }
            triggerSingleSelection(currentRowKey!, !checked.value, allCheckedKeys, event)
          }
        }
        setLastSelectedKey(currentRowKey!)
      },
      onInternalTriggerExpand: (record: DefaultRecordType, e: MouseEvent) => {
        tableContext.onTriggerExpand(record, props.rowKey!, e)
      },
      rowSelectionType,
      keySet,
      checked,
      mergedIndeterminate,
      checkboxProps,
      mergedCellProps,
      onBodyCellContextmenu,
      contextmenuProps,
      level: level,
    }
  },
})
</script>

<template>
  <div
    v-bind="mergedCellProps"
    :key="`${rowKey} ${column.columnKey}`"
    tabindex="-1"
    role="cell"
    :data-level="level"
    :class="{
      [`${prefixCls}-cell`]: true,
      [`${prefixCls}-body-cell`]: true,
      [`${prefixCls}-extra-cell`]: true,
      [`${prefixCls}-row-expand-icon-cell`]: true,
    }"
    @contextmenu="onBodyCellContextmenu($event, contextmenuProps, type!)"
    @click.stop
  >
    <template v-if="column.type === 'checkbox'">
      <Radio
        v-if="rowSelectionType === 'radio'"
        :prefix-cls="prefixCls"
        v-bind="checkboxProps"
        :checked="checked"
        @click.stop
        @change="handleRadioChange"
      />
      <Checkbox
        v-else
        :prefix-cls="prefixCls"
        v-bind="checkboxProps"
        :indeterminate="mergedIndeterminate"
        :checked="checked"
        @click.stop
        @change="handleCheckboxChange"
      />
    </template>
    <ExpandIcon
      v-else-if="column.type === 'expand'"
      :prefix-cls="prefixCls"
      expandable
      :expanded="expanded"
      :record="record"
      :disabled="!supportExpand"
      @expand="onInternalTriggerExpand"
    />
    <div v-else-if="column.type === 'draggable'" :draggable="true">
      <slot name="draggable-handle">
        <MenuOutlined />
      </slot>
    </div>
  </div>
</template>
