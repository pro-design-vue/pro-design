<!--
 * @Author: shen
 * @Date: 2023-11-09 22:29:52
 * @LastEditors: shen
 * @LastEditTime: 2025-12-04 10:03:58
 * @Description:
-->
<script lang="ts">
import type { PropType } from 'vue'
import type { EditableTrigger, FinallyColumnType, Key, RowType } from '../interface'
import { defineComponent, computed, watch, onMounted } from 'vue'
import { get } from '@pro-design-vue/utils'
import { useInjectTable } from '../context/TableContext'
import { getCellKey } from '../../utils/util'
import BodyTextCell from './BodyTextCell'
import BodyEditCell from './BodyEditCell'
export default defineComponent({
  inheritAttrs: false,
  props: {
    prefixCls: String as PropType<string>,
    rowIndex: { type: Number as PropType<number>, required: true },
    flattenRowIndex: { type: Number, required: true },
    rowKey: { type: [Number, String] },
    column: { type: Object as PropType<FinallyColumnType>, default: () => ({}) },
    item: { type: Object as PropType<any>, default: () => ({}) },
    wrapText: { type: Boolean as PropType<boolean>, default: false },
    type: { type: String as PropType<RowType> },
    height: Number as PropType<number>,
    hasAppendNode: Boolean as PropType<boolean>,
    resizeObserver: { type: Object as PropType<ResizeObserver> },
    editRow: { type: Object as PropType<any> },
    calMaxHeight: Function,
    editCellKeys: Array as PropType<string[]>,
    editableKeys: Array as PropType<Key[]>,
    isRowEdit: Boolean as PropType<boolean>,
    tooltipOpen: Boolean as PropType<boolean>,
    getPopupContainer: Function as PropType<() => HTMLElement>,
    onOpenEditor: Function,
    onCloseEditor: Function,
    onCellLeave: Function,
    onMouseenter: Function,
  },
  emits: ['mouseenter', 'cellLeave'],
  components: { BodyTextCell, BodyEditCell },
  setup(props) {
    const tableContext = useInjectTable()
    const isKeepEditMode = computed(() => props.column.edit?.keepEditMode)
    const cellValue = computed(() =>
      props.column!.dataIndex ? get(props.item, props.column!.dataIndex) : undefined,
    )

    const key = computed(() => getCellKey(props.rowKey!, props.column.columnKey))

    const cellParams = computed(() => ({
      column: props.column,
      record: props.isRowEdit ? props.editRow : props.item,
      recordIndexs: tableContext.getIndexsByKey(props.rowKey!),
      value: cellValue.value,
    }))

    const editable = computed(() => {
      if (!props.column.edit?.component) {
        return false
      }
      if (props.isRowEdit && !props.editableKeys?.includes(props.rowKey!)) {
        return false
      }
      if (!props.column.edit?.editable) {
        return true
      }
      const cellEditable = props.column.edit?.editable(cellParams.value)
      return cellEditable
    })

    const isEditing = computed(() => {
      if (props.isRowEdit) {
        return editable.value && props.editableKeys?.includes(props.rowKey!)
      }
      if (!editable.value) {
        return false
      }
      if (isKeepEditMode.value) {
        return true
      }
      if (props.editCellKeys?.includes(key.value)) {
        return true
      }
      return false
    })

    const editableTrigger = computed(() => {
      let { editableTrigger = ['click'] } = props.column!.edit ?? {}
      editableTrigger = Array.isArray(editableTrigger) ? editableTrigger : [editableTrigger]
      return editableTrigger
    })

    const onCellEvent = (e: MouseEvent, trigger: EditableTrigger) => {
      if (editable.value && editableTrigger.value?.includes(trigger) && !props.isRowEdit) {
        openEditor()
        closeEditor()
        e.stopPropagation()
        e.preventDefault()
      }
    }

    const openEditor = () => {
      const oldValue = props.column.edit?.valueGetter?.(cellParams.value) ?? cellValue.value
      props.onOpenEditor?.(key.value, { [key.value]: oldValue })
    }

    const closeEditor = () => {
      props.onCloseEditor?.(key.value)
    }

    watch(key, () => {
      if (props.column.edit?.defaultEditable && !props.isRowEdit) {
        openEditor()
      }
    })

    onMounted(() => {
      if (props.column.edit?.defaultEditable && !props.isRowEdit) {
        openEditor()
      }
    })

    return {
      props,
      key,
      isEditing,
      editable,
      onCellEvent,
    }
  },
})
</script>

<template>
  <template v-if="isEditing">
    <BodyEditCell
      :key="key"
      :prefixCls="prefixCls"
      :rowIndex="rowIndex"
      :flattenRowIndex="flattenRowIndex"
      :rowKey="rowKey"
      :column="column"
      :item="item"
      :edit-row="editRow"
      :editable-keys="editableKeys"
      :is-row-edit="isRowEdit"
    />
  </template>
  <template v-else>
    <BodyTextCell
      v-bind="props"
      :style="{ cursor: editable ? 'poiner' : '' }"
      @click="onCellEvent($event, 'click')"
      @dblClick="onCellEvent($event, 'dblClick')"
      @contextmenu="onCellEvent($event, 'contextmenu')"
    >
      <template #appendNode>
        <slot name="appendNode" />
      </template>
    </BodyTextCell>
  </template>
</template>
