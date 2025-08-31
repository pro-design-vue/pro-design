<!--
 * @Author: shen
 * @Date: 2023-11-08 16:52:42
 * @LastEditors: shen
 * @LastEditTime: 2025-08-29 14:03:20
 * @Description:
-->
<script lang="ts">
import type { PropType } from 'vue'
import type { FinallyColumnType, RowType, DefaultRecordType } from '../interface'

import { defineComponent, computed, ref } from 'vue'
import { useInjectTable } from '../context/TableContext'
import HeaderGroupCell from './HeaderGroupCell.vue'
import HeaderCell from './HeaderCell.vue'
import HeaderExtraCell from './HeaderExtraCell.vue'

export default defineComponent({
  name: 'TableHeaderRows',
  components: { HeaderGroupCell, HeaderCell, HeaderExtraCell },
  props: {
    type: { type: String as PropType<RowType> },
    leftGap: { type: Number as PropType<number>, required: true },
    isRoot: Boolean,
    prefixCls: String as PropType<string>,
    columns: {
      type: Array as PropType<FinallyColumnType<DefaultRecordType>[]>,
      default: () => [],
    },
    wrapText: { type: Boolean as PropType<boolean>, default: false },
    level: { type: Number as PropType<number>, default: 1 },
  },
  setup(props) {
    const tableContext = useInjectTable()
    const draggingColumnKey = computed(() => tableContext.draggingColumnKey.value)

    return {
      cellClass: computed(() => ({
        [`${props.prefixCls}-cell`]: true,
        [`${props.prefixCls}-position-absolute`]: true,
      })),
      cellStyles: ref({}),
      getLastColumn: (column: FinallyColumnType): FinallyColumnType => {
        let _column = column
        for (; _column && _column.children; ) {
          _column = _column.children[_column.children.length - 1]!
        }
        return _column
      },
      cellProps: (column: FinallyColumnType) =>
        (column.customHeaderCell || tableContext.props.customHeaderCell || (() => ({})))(column),
      draggingColumnKey,
    }
  },
})
</script>

<template>
  <template v-for="column in columns" :key="column.columnKey">
    <HeaderExtraCell
      v-if="column.__Internal__Column__"
      :column="column"
      :prefix-cls="prefixCls"
      :style="`width: ${column.finallyWidth}px;left: ${(column.left || 0) - leftGap}px`"
    />
    <div
      v-else-if="column.children"
      tabindex="-1"
      role="group-cell"
      :class="{
        [`${prefixCls}-cell`]: true,
        [`${prefixCls}-header-cell`]: true,
        [`${prefixCls}-cell-group`]: true,
        [column.class! || '']: true,
        [column.className! || '']: true,
        [`${prefixCls}--drag-column-dragging`]: draggingColumnKey === column.columnKey,
      }"
      :data-left="column.left"
      :data-left-gap="leftGap"
      :style="{
        width: `${column.finallyWidth}px`,
        left: `${column.left! - leftGap}px`,
      }"
      v-bind="cellProps"
    >
      <HeaderGroupCell :prefix-cls="prefixCls" :column="column" :wrap-text="wrapText" />
      <div :class="`${prefixCls}-cell-group-children`">
        <TableHeaderRows
          :prefix-cls="prefixCls"
          :columns="column.children"
          :wrap-text="wrapText"
          :type="type"
          :left-gap="column.left!"
          :level="level + 1"
        />
      </div>
    </div>
    <HeaderCell
      v-else
      :style="`left: ${column.left! - leftGap}px`"
      :column="column"
      :prefix-cls="prefixCls"
      :wrap-text="wrapText"
      :level="level"
    />
  </template>
</template>
