<!--
 * @Author: shen
 * @Date: 2023-11-08 21:59:48
 * @LastEditors: shen
 * @LastEditTime: 2025-07-28 08:59:06
 * @Description:
-->
<script lang="ts">
import { defineComponent, watchEffect, computed, shallowRef } from 'vue'
import { useInjectTable } from '../context/TableContext'
import { useProvideBodyRows } from '../context/BodyRowsContext'
import eagerComputed from '../../utils/eagerComputed'
import Row from './BodyRow.vue'

import type { PropType } from 'vue'
import type { RowClassName, RowType, FinallyColumnType } from '../interface'

export default defineComponent({
  name: 'TableBodyRows',
  components: { Row },
  inheritAttrs: false,
  props: {
    prefixCls: String as PropType<string>,
    type: { type: String as PropType<RowType> },
    wrapText: { type: Boolean as PropType<boolean>, default: false },
    getRowClassName: { type: Function as PropType<RowClassName<any>> },
  },
  setup(props) {
    const tableContext = useInjectTable()
    const data = computed(() => tableContext.data.value)
    const rowPosition = computed(() => tableContext.dataRowPosition.value)
    const columns = shallowRef<FinallyColumnType[]>([])
    const columnStartIndex = shallowRef(0)

    watchEffect(() => {
      if (props.type === 'left') {
        columns.value = tableContext.leftColumns.value
        columnStartIndex.value = 0
      } else if (props.type === 'right') {
        columns.value = tableContext.rightColumns.value
        columnStartIndex.value =
          tableContext.leftColumns.value.length + tableContext.centerColumns.value.length
      } else {
        columnStartIndex.value = tableContext.leftColumns.value.length
        columns.value = tableContext.visibleCenterColumns.value
      }
    })

    useProvideBodyRows({
      columns,
      columnStartIndex,
    })

    return {
      data,
      columns,
      rowPosition,
      transitionName: computed(() => `${props.prefixCls}-row`),
      virtual: eagerComputed(() => tableContext.virtual.value),
    }
  },
})
</script>

<template>
  <template v-for="(row, index) in data" :key="index">
    <Row
      v-if="row"
      :prefix-cls="prefixCls"
      :record="row.record"
      :row-key="row.rowKey"
      :indent="row.indent"
      :pos="rowPosition[index]"
      :row-index="row.rowIndex"
      :flatten-row-index="row.flattenIndex"
      :wrap-text="wrapText"
      :get-row-class-name="getRowClassName"
      :is-expand-row="row.isExpandRow"
      :type="type"
    />
  </template>
</template>
