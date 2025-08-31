<!--
 * @Author: shen
 * @Date: 2023-11-08 21:59:48
 * @LastEditors: shen
 * @LastEditTime: 2025-08-27 13:44:01
 * @Description:
-->
<script lang="ts">
import { defineComponent, computed, ref } from 'vue'
import { useInjectSlots } from '../context/TableSlotsContext'
import { useInjectTable } from '../context/TableContext'
import { useInjectBody } from '../context/BodyContext'
import { ExpandColumnKey } from '../../hooks/useColumns'
import { cellResize } from '@pro-design-vue/directives'
import { RenderVNode } from '../../utils/renderVNode'
import eagerComputed from '../../utils/eagerComputed'

import type { PropType } from 'vue'
export default defineComponent({
  name: 'TableExpandedRow',
  directives: { cellResize },
  components: { RenderVNode },
  props: {
    prefixCls: String,
    rowKey: { type: [Number, String] },
    item: { type: Object, default: () => ({}) },
    rowIndex: Number,
    resizeObserver: { type: Object as PropType<ResizeObserver> },
    calMaxHeight: Function,
  },
  setup(props) {
    const cellInnerRef = ref<HTMLDivElement>()
    const tableSlotsContext = useInjectSlots()
    const tableContext = useInjectTable()

    const autoHeight = computed(() => tableContext.rowHeights.value[props.rowKey!] === undefined)
    const renderedCell = eagerComputed(
      () => tableContext.allCellProps.value[props.rowKey!]?.[ExpandColumnKey] || {},
    )

    const { onBodyCellContextmenu } = useInjectBody()

    const cellClass = computed(() => {
      const { prefixCls } = props
      return { [`${prefixCls}-cell`]: true }
    })

    const cellInnerClass = computed(() => {
      const { prefixCls } = props
      return { [`${prefixCls}-cell-inner`]: true }
    })

    const mergedCellProps = computed(() => ({
      ...renderedCell.value.props,
      style: {
        ...(renderedCell.value?.props?.style || {}),
        minWidth: '100%',
      },
    }))

    const expandContent = computed(() =>
      tableContext.props?.expandedRowRender?.({
        record: props.item,
        index: props.rowIndex!,
        indent: 1,
        expanded: true,
      }),
    )

    const cellResizeBind = computed(() =>
      autoHeight.value
        ? { resizeObserver: props.resizeObserver, calMaxHeight: props.calMaxHeight }
        : {},
    )

    const contextmenuProps = computed(() => ({
      record: props.item,
      index: props.rowIndex,
      recordIndexs: tableContext.getIndexsByKey(props.rowKey!),
      key: props.rowKey,
      isExpand: true,
    }))

    return {
      cellClass,
      tableSlotsContext,
      mergedCellProps,
      cellInnerClass,
      cellInnerRef,
      expandContent,
      autoHeight,
      cellResizeBind,
      onBodyCellContextmenu,
      contextmenuProps,
    }
  },
})
</script>

<template>
  <div
    v-bind="mergedCellProps"
    tabindex="-1"
    role="cell"
    :class="cellClass"
    @contextmenu="onBodyCellContextmenu($event, contextmenuProps, 'left')"
  >
    <div
      v-cell-resize="cellResizeBind"
      ref="cellInnerRef"
      :data-cell-auto="autoHeight"
      :class="cellInnerClass"
    >
      <div :class="`${prefixCls}-cell-content`">
        <RenderVNode :key="rowKey" :vnode="expandContent" />
      </div>
    </div>
  </div>
</template>
