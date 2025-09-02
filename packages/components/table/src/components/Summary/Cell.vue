<!--
 * @Author: shen
 * @Date: 2022-11-07 18:17:45
 * @LastEditors: shen
 * @LastEditTime: 2025-09-02 14:42:26
 * @Description:
-->
<script lang="ts">
import type { PropType } from 'vue'
import type { SummaryCellConfig } from '../context/SummaryContext'
import type { AlignType, FinallyColumnType, DefaultRecordType } from '../interface'

import { ref, defineComponent, computed, watch, watchEffect, onUnmounted } from 'vue'
import { useInjectTable } from '../context/TableContext'
import { useInjectSummaryRow, useInjectSummary } from '../context/SummaryContext'
import eagerComputed from '../../utils/eagerComputed'
import devWarning from '../../utils/devWarning'

let idCount = 1
export default defineComponent({
  name: 'ProTableSummaryCell',
  props: {
    index: { type: Number },
    colSpan: { type: Number, default: 1 },
    align: { type: String as PropType<AlignType> },
    columnKey: String,
  },
  setup(props) {
    const summaryCtx = useInjectSummary()
    const tableContext = useInjectTable()
    const summaryRowCtx = useInjectSummaryRow()
    const cellId = 'id_' + idCount++
    const columnIndex = eagerComputed(() =>
      props.columnKey ? tableContext.columnKeyIndexMap.value[props.columnKey]! : props.index!,
    )
    const isValidColumnIndex = computed(
      () => columnIndex.value >= 0 && columnIndex.value <= tableContext.allColumns.value.length,
    )

    watchEffect(() => {
      if (isValidColumnIndex.value) {
        summaryRowCtx.updateCell(cellId, columnIndex.value, props.colSpan)
      }
      setTimeout(() => {
        devWarning(
          isValidColumnIndex.value,
          'TableSummaryCell',
          `'index=${props.index}' or 'columnKey=${props.columnKey || ''}' is not valid`,
        )
      })
    })

    onUnmounted(() => {
      summaryRowCtx.removeCell(cellId)
    })

    const cellConfig = computed<SummaryCellConfig>(
      () =>
        summaryRowCtx.cells.value[columnIndex.value] ||
        ({
          width: 0,
          visible: false,
          // fixed: false,
          style: {},
        } as SummaryCellConfig),
    )

    const { allColumns } = tableContext

    const column = computed<FinallyColumnType>(() => allColumns.value[columnIndex.value]!)
    const pageData = computed<DefaultRecordType[]>(() => tableContext.pageData.value)
    const dataIndex = ref()

    watch(
      column,
      () => {
        dataIndex.value = column.value?.dataIndex
      },
      { immediate: true },
    )

    const total = computed(() => {
      let sum = 0
      const records = pageData.value
      for (let i = 0; i < records.length; i++) {
        const record = records[i]
        sum += Number(record![dataIndex.value])
        if (isNaN(sum)) {
          break
        }
      }
      return sum
    })

    const prefixCls = computed(() => tableContext.prefixCls.value)

    const cellClass = computed(() => {
      const { fixed, isLastFixedLeft, isFirstFixedRight } = cellConfig.value
      return {
        [`${prefixCls.value}-cell`]: true,
        [`${prefixCls.value}-summary-cell`]: true,
        [`${prefixCls.value}-summary-cell-fixed-${fixed}`]: !!fixed,
        [`${prefixCls.value}-summary-cell-last-fixed-left`]: isLastFixedLeft,
        [`${prefixCls.value}-summary-cell-first-fixed-right`]: isFirstFixedRight,
      }
    })
    const cellStyle = computed(() => {
      const width = `${cellConfig.value.width}px`
      return { width, minWidth: width, maxWidth: width, order: columnIndex.value }
    })

    const cellInnerClass = computed(() => ({ [`${prefixCls.value}-cell-inner`]: true }))

    return {
      prefixCls,
      column,
      summaryCtx,
      pageData,
      total,
      cellClass,
      cellConfig,
      cellStyle,
      cellInnerClass,
    }
  },
})
</script>

<template>
  <div
    v-if="cellConfig.visible"
    tabindex="-1"
    role="cell"
    :class="cellClass"
    :style="cellConfig.style"
  >
    <div :class="cellInnerClass">
      <div :class="`${prefixCls}-cell-content`">
        <slot :column="column" :total="total" :data="pageData" />
      </div>
    </div>
  </div>
</template>
