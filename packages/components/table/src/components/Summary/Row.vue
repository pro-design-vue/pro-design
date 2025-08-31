<!--
 * @Author: shen
 * @Date: 2022-11-07 18:17:35
 * @LastEditors: shen
 * @LastEditTime: 2025-08-29 14:09:38
 * @Description:
-->
<script lang="ts">
import type { CSSProperties } from 'vue'
import type { SummaryCellConfig } from '../context/SummaryContext'

import { defineComponent, ref, reactive, computed, watch } from 'vue'
import { useInjectTable } from '../context/TableContext'
import { useProvideSummaryRow } from '../context/SummaryContext'
import { setPromise } from '../../utils/util'
import eagerComputed from '../../utils/eagerComputed'

type CellsConfig = Partial<SummaryCellConfig> & {
  colSpan?: number
  isPlaceholder?: boolean
}

export default defineComponent({
  name: 'ProTableSummaryRow',
  setup() {
    const tableContext = useInjectTable()
    const cellPropsMap = reactive<Record<string, { index: number; colSpan: number }>>({})
    const cells = ref<SummaryCellConfig[]>([])
    const placeholderCell = ref<SummaryCellConfig[]>([])
    const cellPropsList = computed(() =>
      Object.values(cellPropsMap).sort((a, b) => a.index - b.index),
    )

    useProvideSummaryRow({
      cells,
      updateCell: (id: string, index: number, colSpan: number) => {
        cellPropsMap[id] = { index, colSpan }
      },
      removeCell: (id: string) => {
        delete cellPropsMap[id]
      },
    })

    const leftColumnsLastIndex = eagerComputed(() => tableContext.leftColumns.value.length - 1)
    const centerColumnsLastIndex = eagerComputed(
      () => tableContext.leftColumns.value.length + tableContext.centerColumns.value.length - 1,
    )
    const rightColumnsLastIndex = eagerComputed(() => tableContext.allColumns.value.length - 1)

    const createCells = () => {
      const allCellsConfig: CellsConfig[] = []
      let startIndex = 0
      const leftLastIndex = leftColumnsLastIndex.value
      const centerLastIndex = centerColumnsLastIndex.value
      const rightLastIndex = rightColumnsLastIndex.value
      let rightWidth = tableContext.rightWidth.value
      for (let i = 0, len = cellPropsList.value.length; i < len; i++) {
        const cellProps = cellPropsList.value[i]
        const { index, colSpan = 1 } = cellProps!
        if (index <= leftLastIndex) {
          if (index - startIndex > 0) {
            allCellsConfig.push({
              index: startIndex,
              colSpan: index - startIndex,
              isPlaceholder: true,
              fixed: 'left',
            })
          }
          const mergeCellProps: CellsConfig = {
            ...cellProps,
            colSpan: Math.min(leftLastIndex - index + 1, colSpan),
            fixed: 'left',
          }
          allCellsConfig.push(mergeCellProps)
          startIndex = index + mergeCellProps.colSpan!
        } else if (index <= centerLastIndex) {
          if (startIndex <= leftLastIndex) {
            allCellsConfig.push({
              index: startIndex,
              colSpan: leftLastIndex - startIndex + 1,
              isPlaceholder: true,
              fixed: 'left',
            })
            startIndex = leftLastIndex + 1
          }

          if (index - startIndex > 0) {
            allCellsConfig.push({
              index: startIndex,
              colSpan: index - startIndex,
              isPlaceholder: true,
            })
          }
          const mergeCellProps: CellsConfig = {
            ...cellProps,
            colSpan: Math.min(centerLastIndex - index + 1, colSpan),
          }
          allCellsConfig.push(mergeCellProps)
          startIndex = index + mergeCellProps.colSpan!
        } else {
          if (startIndex <= leftLastIndex) {
            allCellsConfig.push({
              index: startIndex,
              colSpan: leftLastIndex - startIndex + 1,
              isPlaceholder: true,
              fixed: 'left',
            })
            startIndex = leftLastIndex + 1
          }

          if (startIndex <= centerLastIndex) {
            allCellsConfig.push({
              index: startIndex,
              colSpan: centerLastIndex - startIndex + 1,
              isPlaceholder: true,
            })
            startIndex = centerLastIndex + 1
          }

          if (index - startIndex > 0) {
            allCellsConfig.push({
              index: startIndex,
              colSpan: index - startIndex,
              isPlaceholder: true,
              fixed: 'right',
            })
          }
          const mergeCellProps: CellsConfig = {
            ...cellProps,
            colSpan: Math.min(rightLastIndex - index + 1, colSpan),
            fixed: 'right',
          }
          allCellsConfig.push(mergeCellProps)
          startIndex = index + mergeCellProps.colSpan!
        }
      }
      if (startIndex <= leftLastIndex) {
        allCellsConfig.push({
          index: startIndex,
          colSpan: leftLastIndex - startIndex + 1,
          isPlaceholder: true,
          fixed: 'left',
        })
        startIndex = leftLastIndex + 1
      }
      if (startIndex <= centerLastIndex) {
        allCellsConfig.push({
          index: startIndex,
          colSpan: centerLastIndex - startIndex + 1,
          isPlaceholder: true,
        })
        startIndex = centerLastIndex + 1
      }
      if (startIndex <= rightLastIndex) {
        allCellsConfig.push({
          index: startIndex,
          colSpan: rightLastIndex - startIndex + 1,
          isPlaceholder: true,
          fixed: 'right',
        })
      }

      const newCells: SummaryCellConfig[] = []
      const newPlaceholderCell: SummaryCellConfig[] = []
      // const allCellsConfigLength = allCellsConfig.length
      allCellsConfig.forEach((cellConfig: CellsConfig, idx: number) => {
        const { index, colSpan, isPlaceholder, fixed } = cellConfig
        const columnPosition = tableContext.getColumnPosition(index!, colSpan)
        const { width, left } = columnPosition
        if (fixed === 'right') {
          rightWidth -= width
        }
        // if (tableContext.showVerticalScrollbar.value && tableContext.props.summaryFixed && idx + 1 === allCellsConfigLength) {
        // 	width += tableContext.scrollBarSize.value
        // }
        const summaryCellConfig: SummaryCellConfig = {
          index: index!,
          width: width,
          style: Object.assign(
            {
              width: `${width}px`,
              minWidth: `${width}px`,
              maxWidth: `${width}px`,
              order: index!,
              borderRight: isPlaceholder && index! === 0 ? 'none' : undefined,
            },
            fixed
              ? {
                  position: 'sticky',
                  [fixed]: fixed === 'left' ? `${left}px` : `${rightWidth}px`,
                }
              : {},
          ) as CSSProperties,
          fixed: (fixed || false) as any,
          visible: true,
        }
        if (
          fixed !== 'left' ||
          (allCellsConfig[idx + 1] && allCellsConfig[idx + 1]!.fixed === 'left')
        ) {
          if (
            !(
              fixed !== 'right' ||
              (allCellsConfig[idx - 1] && allCellsConfig[idx - 1]!.fixed === 'right')
            )
          ) {
            summaryCellConfig.isFirstFixedRight = true
          }
        } else {
          summaryCellConfig.isLastFixedLeft = true
          delete summaryCellConfig.style.borderRight
        }
        if (isPlaceholder) {
          newPlaceholderCell.push(summaryCellConfig)
        } else {
          newCells[summaryCellConfig.index!] = summaryCellConfig
        }
      })
      cells.value = newCells
      placeholderCell.value = newPlaceholderCell
    }
    let cancelCreate: () => void

    watch(
      [tableContext.allColumns, cellPropsList],
      () => {
        cancelCreate && cancelCreate()
        cancelCreate = setPromise(createCells).cancel
      },
      { immediate: true },
    )

    const rowClass = computed(() => {
      const { prefixCls } = tableContext.props
      return { [`${prefixCls}-row`]: true, [`${prefixCls}-summary-row`]: true }
    })
    const cellClass = computed(() => {
      const { prefixCls } = tableContext.props
      return { [`${prefixCls}-cell`]: true, [`${prefixCls}-summary-cell`]: true }
    })
    const rowStyle = computed<CSSProperties>(() => ({
      width: `${tableContext.bodyMaxWidth.value}px`,
    }))

    return {
      prefixCls: computed(() => tableContext.props.prefixCls),
      rowClass,
      placeholderCell,
      cellClass,
      rowStyle,
    }
  },
})
</script>

<template>
  <div role="row" :class="rowClass" :style="rowStyle">
    <slot />
    <template v-for="cell in placeholderCell" :key="cell.index">
      <div
        tabindex="-1"
        role="cell"
        :class="[
          cellClass,
          {
            [`${prefixCls}-summary-cell-fixed-${cell.fixed}`]: !!cell.fixed,
            [`${prefixCls}-summary-cell-last-fixed-left`]: cell.isLastFixedLeft,
            [`${prefixCls}-summary-cell-first-fixed-right`]: cell.isFirstFixedRight,
          },
        ]"
        :style="cell.style"
      >
        &nbsp;
      </div>
    </template>
  </div>
</template>
