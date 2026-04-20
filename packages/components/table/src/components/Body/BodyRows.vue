<!--
 * @Author: shen
 * @Date: 2023-11-08 21:59:48
 * @LastEditors: shen
 * @LastEditTime: 2025-07-28 08:59:06
 * @Description:
-->
<script lang="ts">
import { defineComponent, watchEffect, computed, shallowRef, onBeforeUnmount } from 'vue'
import { useInjectTable } from '../context/TableContext'
import { useInjectBody } from '../context/BodyContext'
import { useInjectSlots } from '../context/TableSlotsContext'
import { useInjectLevel } from '../../hooks/useLevel'
import { useProvideBodyRows } from '../context/BodyRowsContext'
import ResizeObserver from 'resize-observer-polyfill'
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
    const bodyContext = useInjectBody()
    const tableSlotsContext = useInjectSlots()
    const level = useInjectLevel()
    const { leftPopupContainer, centerPopupContainer, rightPopupContainer } = bodyContext

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

    const nestExpandable = computed(() => tableContext.expandType.value === 'nest')
    const expandIconColumnIndex = computed(() => tableContext.expandIconColumnIndex.value || 0)
    const indentSize = computed(() => tableContext.indentSize.value)
    const expandIconType = computed(() => tableContext.expandIconType.value)
    const xVirtual = computed(() => tableContext.xVirtual.value)
    const cellClass = {
      [`${props.prefixCls}-cell`]: true,
      [`${props.prefixCls}-position-absolute`]: true,
    }
    const popupContainer = computed((): HTMLDivElement | null =>
      props.type === 'left'
        ? (leftPopupContainer.value ?? null)
        : props.type === 'center'
          ? (centerPopupContainer.value ?? null)
          : props.type === 'right'
            ? (rightPopupContainer.value ?? null)
            : null,
    )

    const rowSelectionType = computed(() => tableContext.props.rowSelection?.type)

    const sharedResizeObserver = shallowRef<ResizeObserver | undefined>(undefined)
    let pendingEntries: ResizeObserverEntry[] = []
    let resizeRafId: number | null = null

    const flushResizeEntries = () => {
      resizeRafId = null
      const entries = pendingEntries
      pendingEntries = []
      const rowHeightMap = new Map<string, number>()
      for (let i = 0; i < entries.length; i++) {
        const target = entries[i]!.target as HTMLElement
        const rowKey =
          target.dataset.rowKeyRef ||
          (target.closest(`[data-row-key]`) as HTMLElement | null)?.getAttribute('data-row-key')
        if (!rowKey) continue
        if (rowHeightMap.has(rowKey)) continue
        const row = target.closest(`[data-row-key]`) as HTMLElement | null
        if (!row) continue
        const autoCells = row.querySelectorAll(
          'div[data-cell-auto=true]',
        ) as NodeListOf<HTMLDivElement>
        if (!autoCells.length) continue
        let rowHeight = 0
        autoCells.forEach((autoCell: HTMLDivElement) => {
          const { offsetWidth, offsetHeight } = autoCell
          let autoCellHeight = offsetWidth ? offsetHeight : 0
          const parentStyle = getComputedStyle(autoCell.parentNode as Element)
          autoCellHeight +=
            parseFloat(parentStyle.getPropertyValue('border-top-width')) +
            parseFloat(parentStyle.getPropertyValue('border-bottom-width'))
          rowHeight = rowHeight > autoCellHeight ? rowHeight : autoCellHeight
        })
        rowHeightMap.set(rowKey, rowHeight)
      }
      rowHeightMap.forEach((height, rowKey) => {
        tableContext.addRowHeight(`shared_${props.type}_${rowKey}`, rowKey as any, height)
      })
    }

    sharedResizeObserver.value = new ResizeObserver((entries) => {
      pendingEntries = pendingEntries.concat(entries)
      if (resizeRafId === null) {
        resizeRafId = requestAnimationFrame(flushResizeEntries)
      }
    })

    onBeforeUnmount(() => {
      sharedResizeObserver.value?.disconnect()
      sharedResizeObserver.value = undefined
      if (resizeRafId !== null) {
        cancelAnimationFrame(resizeRafId)
        resizeRafId = null
      }
    })

    useProvideBodyRows({
      columns,
      columnStartIndex,
      nestExpandable,
      expandIconColumnIndex,
      indentSize,
      expandIconType,
      xVirtual,
      cellClass,
      popupContainer,
      rowSelectionType,
      sharedResizeObserver,
      tableContext,
      tableSlotsContext,
      bodyContext,
      level,
    })

    return {
      data: tableContext.data,
      rowPosition: tableContext.dataRowPosition,
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
