<!--
 * @Author: shen
 * @Date: 2023-11-08 21:59:48
 * @LastEditors: shen
 * @LastEditTime: 2025-09-29 09:00:32
 * @Description:
-->
<script lang="ts">
import {
  defineComponent,
  getCurrentInstance,
  ref,
  watch,
  onBeforeUnmount,
  computed,
  nextTick,
  watchEffect,
} from 'vue'
import { useInjectTable } from '../context/TableContext'
import { useInjectBody } from '../context/BodyContext'
import { useInjectBodyRows, useProvideBodyRow } from '../context/BodyRowsContext'
import { ExpandColumnKey } from '../../hooks/useColumns'
import { RenderSlot } from '../../utils/renderVNode'
import { useEditInject } from '../../hooks/useEdit'
import { useCellSelection } from '../../hooks/useCellSelection'
import { useCellKeyboard } from '../../hooks/useCellKeyboard'
import { useInjectHover } from '../../hooks/useHover'
import { addClass, removeClass } from '../../utils/class'
import ResizeObserver from 'resize-observer-polyfill'
import eagerComputed from '../../utils/eagerComputed'
import classNames from '../../utils/classNames'
import BodyCell from './BodyCell'
import ExpandedRow from './ExpandedRow.vue'
import BodyExtraCell from './BodyExtraCell.vue'
import ExpandIcon from '../ExpandIcon.vue'

import type { CSSProperties, PropType } from 'vue'
import type { RowClassName, RowType, Key } from '../interface'

let uniIdCount = 0
export default defineComponent({
  name: 'ProTableBodyRow',
  components: {
    ExpandIcon,
    BodyCell,
    ExpandedRow,
    BodyExtraCell,
    RenderSlot,
  },
  inheritAttrs: false,
  props: {
    prefixCls: String as PropType<string>,
    isExpandRow: Boolean as PropType<boolean>,
    record: { type: Object },
    type: { type: String as PropType<RowType> },
    rowKey: { type: [Number, String] as PropType<Key>, required: true },
    supportExpand: Boolean,
    pos: Number as PropType<number>,
    rowIndex: Number as PropType<number>,
    flattenRowIndex: Number,
    indent: Number as PropType<number>,
    wrapText: { type: Boolean as PropType<boolean>, default: false },
    getRowClassName: { type: Function as PropType<RowClassName<any>> },
  },
  setup(props) {
    const rowUniId = 'row_uni_id_' + uniIdCount++
    const tableContext = useInjectTable()
    const rowInstance = getCurrentInstance()

    const { editCellKeys, closeEditor, openEditor } = useEditInject()

    let isUnmount = false
    const bodyRow = ref()

    const { onCellMousedown, onCellMousemove, onCellClick } = useCellSelection()
    const { onCellKeydown } = useCellKeyboard()

    const calMaxHeight = () => {
      if (isUnmount) return
      let rowHeight = 0
      let autoCells: HTMLDivElement[] = []
      if (bodyRow.value) {
        autoCells = bodyRow.value.querySelectorAll('div[data-cell-auto=true]')
      }
      autoCells.forEach((autoCell: HTMLDivElement) => {
        const { offsetWidth, offsetHeight } = autoCell
        let autoCellHeight = offsetWidth ? offsetHeight : 0
        const parentStyle = getComputedStyle(autoCell.parentNode as Element)
        autoCellHeight +=
          parseFloat(parentStyle.getPropertyValue('border-top-width')) +
          parseFloat(parentStyle.getPropertyValue('border-bottom-width'))
        rowHeight = rowHeight > autoCellHeight ? rowHeight : autoCellHeight
      })
      if (autoCells.length) {
        tableContext.addRowHeight(rowUniId, props.rowKey!, rowHeight)
      } else {
        tableContext.removeRowHeight(rowUniId)
      }
    }

    watch(
      () => props.rowKey,
      () => {
        calMaxHeight()
      },
      { flush: 'post' },
    )

    const resizeObserver: ResizeObserver = new ResizeObserver(() => {
      calMaxHeight()
    })

    const { columns, columnStartIndex } = useInjectBodyRows()
    const mergedColumns = computed(() =>
      (props.type === 'center'
        ? tableContext.centerRowColumnsMap.value.get(props.rowKey)
        : columns.value)!.filter((item) => !!item),
    )

    const { tooltipOpen, leftPopupContainer, centerPopupContainer, rightPopupContainer } =
      useInjectBody()
    const { handleCellBlur, handleCellHover, hoverRowKey, hoverColumnKey, rowHover } =
      useInjectHover()

    const popupContainer = computed(() =>
      props.type === 'left'
        ? leftPopupContainer.value
        : props.type === 'center'
          ? centerPopupContainer.value
          : props.type === 'right'
            ? rightPopupContainer.value
            : null,
    )

    const isDragging = eagerComputed(() => tableContext.draggingRowKey.value === props.rowKey)
    const isRowHover = eagerComputed(() => hoverRowKey.value === props.rowKey)

    watch(
      [isRowHover, bodyRow],
      () => {
        bodyRow.value &&
          rowHover.value &&
          (isRowHover.value
            ? addClass(bodyRow.value, `${props.prefixCls}-row-hover`)
            : removeClass(bodyRow.value, `${props.prefixCls}-row-hover`))
      },
      { immediate: true, flush: 'post' },
    )

    const mergedTooltipOpen = eagerComputed(() => tooltipOpen.value && isRowHover.value)

    let timer: any
    onBeforeUnmount(() => {
      isUnmount = true
      resizeObserver.disconnect()
      clearTimeout(timer)
      tableContext.removeRowHeight(rowUniId)
    })

    const hasMultiRowSpanInfo = eagerComputed(() => {
      return !tableContext.hasMultiRowSpanInfo.value[props.rowKey!]
    })

    const customRowProps = computed(() => {
      return tableContext.props.customRow?.(props.record!, props.rowIndex)
    })

    const rowSelectionType = computed(() => {
      return tableContext.props.rowSelection?.type
    })

    const isExpanded = ref(false)
    const expandedRowKeys = computed(() => tableContext.expandedRowKeys.value)
    const expanded = eagerComputed(() => expandedRowKeys.value.has?.(props.rowKey!))
    const expandIconColumnIndex = computed(() => tableContext.expandIconColumnIndex.value || 0)
    const indentSize = computed(() => tableContext.indentSize.value)

    watchEffect(() => {
      if (expanded.value) {
        isExpanded.value = true
      }
    })

    const rowExpandable = computed(
      () =>
        tableContext.expandType.value === 'row' &&
        tableContext.props.rowExpandable?.(props.record!),
    )

    const nestExpandable = computed(() => tableContext.expandType.value === 'nest')

    const hasNestChildren = computed(
      () =>
        !!(
          tableContext.childrenColumnName.value &&
          props.record?.[tableContext.childrenColumnName.value]
        ),
    )
    const mergedExpandable = computed(() => rowExpandable.value || nestExpandable.value)

    const onInternalTriggerExpand = (record: any, event: any) => {
      tableContext.onTriggerExpand(record, props.rowKey!, event)
    }

    const mergedRowHeights = computed(() => tableContext.mergedRowHeights.value)

    const height = eagerComputed(() => mergedRowHeights.value[props.rowKey!])
    const cellHeight = eagerComputed(() => tableContext.rowHeights.value[props.rowKey!])

    const isSelected = computed(
      () =>
        tableContext.props.highlightSelectRow &&
        tableContext.selection.derivedSelectedKeySet.value.has(props.rowKey!),
    )

    const rowClass = computed(() => {
      const { prefixCls, record, rowIndex, indent } = props
      const isEven = rowIndex! % 2 == 0
      return classNames(
        {
          [`${prefixCls}-row`]: true,
          [`${prefixCls}-row-level-${indent}`]: true,
          [`${prefixCls}-row-hover`]: isRowHover.value && rowHover.value,
          [`${prefixCls}-row-dragging`]: isDragging.value,
          [`${prefixCls}-row-dragging-insert-target`]:
            tableContext.insertToRowKey.value === props.rowKey,
          [`${prefixCls}-row-odd`]: !isEven,
          [`${prefixCls}-row-even`]: isEven,
          [`${prefixCls}-no-height`]: !height.value,
          [`${prefixCls}-row-selected`]: isSelected.value,
        },
        props.getRowClassName?.(record, rowIndex!, indent),
      )
    })

    const expandRowClass = computed(() => {
      const { prefixCls, record, rowIndex, indent } = props
      return classNames(
        {
          [`${prefixCls}-row`]: true,
          [`${prefixCls}-expanded-row`]: true,
          [`${prefixCls}-expanded-row-level-${indent! + 1}`]: true,
          [`${prefixCls}-no-height`]: !height.value,
        },
        props.getRowClassName?.(record, rowIndex!, indent),
      )
    })

    const expandColumnWidth = eagerComputed(() => {
      return tableContext.allCellProps.value[props.rowKey!]?.[ExpandColumnKey]?.props?.style?.width
    })

    const rowStyle = computed<CSSProperties>(() => {
      const style: CSSProperties = {
        opacity: 1,
        [`--${props.prefixCls}-row-bg`]: `var(--${props.prefixCls}-row-bg-${props.rowKey}, var(--${props.prefixCls}-bg))`,
      }
      if (hasMultiRowSpanInfo.value) {
        style.transform = `translateY(${props.pos}px)`
      } else {
        style.top = `${props.pos}px`
      }
      if (height.value !== undefined) {
        style.height = `${height.value}px`
      } else {
        style.height = `${tableContext.baseHeight.value}px`
      }
      if (props.isExpandRow && columnStartIndex.value === 0) {
        style.width = expandColumnWidth.value
        style.minWidth = '100%'
      }
      return style
    })

    watch(
      () => ({ ...rowStyle.value }),
      (newStyle, oldStyle = {}) => {
        if (tableContext.animateRows.value && !tableContext.useAnimate.value) {
          if (
            newStyle.top !== oldStyle.top ||
            newStyle.height !== oldStyle.height ||
            newStyle.transform !== oldStyle.transform
          ) {
            nextTick(() => {
              clearTimeout(timer)
              if (rowInstance?.vnode.el && rowInstance.vnode.el.style) {
                rowInstance.vnode.el.style.transition = 'none'
                timer = setTimeout(() => {
                  if (rowInstance?.vnode?.el?.style) {
                    rowInstance.vnode.el.style.transition = null
                  }
                }, 100)
              }
            })
          }
        }
      },
      { immediate: true },
    )

    useProvideBodyRow({
      top: computed(() => props.pos!),
      height: computed(() =>
        height.value !== undefined ? height.value : tableContext.baseHeight.value,
      ),
      rowKey: computed(() => props.rowKey),
    })

    const cellClass = computed(() => ({
      [`${props.prefixCls}-cell`]: true,
      [`${props.prefixCls}-position-absolute`]: true,
    }))

    return {
      rowClass,
      rowStyle,
      cellClass,
      tableContext,
      mergedRowHeights,
      handleCellBlur,
      handleCellHover,
      handleClick: (event: any) => {
        tableContext.props.expandRowByClick &&
          mergedExpandable.value &&
          onInternalTriggerExpand(props.record, event)
      },
      rowSelectionType,
      nestExpandable,
      hasNestChildren,
      mergedExpandable,
      expandIconColumnIndex,
      indentSize,
      expanded,
      onInternalTriggerExpand,
      customRowProps,
      expandColumnKey: ExpandColumnKey,
      expandRowClass,
      mergedColumns,
      height,
      cellHeight,
      columnStartIndex,
      resizeObserver,
      calMaxHeight,
      bodyRow,
      hoverRowKey,
      hoverColumnKey,
      xVirtual: eagerComputed(() => tableContext.xVirtual.value),
      getPopupContainer: () => popupContainer.value!,
      editCellKeys,
      closeEditor,
      openEditor,
      mergedTooltipOpen,
      onCellMousedown,
      onCellKeydown,
      onCellMousemove,
      onCellClick,
    }
  },
})
</script>

<template>
  <template v-if="isExpandRow">
    <div
      v-if="columnStartIndex === 0"
      ref="bodyRow"
      :data-row-key="rowKey"
      :class="expandRowClass"
      :style="rowStyle"
      role="row"
    >
      <ExpandedRow
        :prefix-cls="prefixCls"
        :item="record"
        :row-key="rowKey"
        :row-index="rowIndex"
        :resize-observer="resizeObserver"
        :cal-max-height="calMaxHeight"
      />
    </div>
  </template>
  <div
    v-else
    v-bind="customRowProps"
    ref="bodyRow"
    :class="rowClass"
    :style="rowStyle"
    :data-row-key="rowKey"
    role="row"
    @click="handleClick"
  >
    <RenderSlot>
      <template v-for="(column, index) in mergedColumns" :key="column && column.columnKey">
        <BodyExtraCell
          v-if="column && column.__Internal__Column__"
          :prefix-cls="prefixCls"
          :row-key="rowKey"
          :row-index="rowIndex!"
          :type="type"
          :column="mergedColumns?.[index]"
          :expanded="expanded"
          :support-expand="mergedExpandable"
          :record="record"
          @mouseenter="
            handleCellHover(rowKey, column.columnKey, tableContext.draggingRowKey.value!)
          "
          @mouseleave="handleCellBlur"
        />
        <BodyCell
          v-else-if="column"
          :prefix-cls="prefixCls"
          :item="record"
          :row-key="rowKey"
          :type="type"
          :row-index="rowIndex!"
          :flatten-row-index="flattenRowIndex"
          :wrap-text="wrapText"
          :column="column"
          :resize-observer="resizeObserver"
          :cal-max-height="calMaxHeight"
          :has-append-node="column.columnIndex === expandIconColumnIndex && nestExpandable"
          :height="cellHeight"
          :get-popup-container="getPopupContainer"
          :tooltip-open="mergedTooltipOpen && hoverColumnKey === column.columnKey"
          :edit-cell-keys="editCellKeys"
          @closeEditor="closeEditor"
          @openEditor="openEditor"
          @mouseenter="
            handleCellHover(rowKey, column.columnKey, tableContext.draggingRowKey.value!)
          "
          @cellLeave="handleCellBlur"
          @mousedown="onCellMousedown"
          @mousemove="onCellMousemove"
          @keydown="onCellKeydown"
          @click="onCellClick"
        >
          <template #appendNode>
            <div :class="`${prefixCls}-append-node`">
              <span
                :style="`padding-left: ${(indent || 0) * indentSize}px`"
                :class="`${prefixCls}-row-indent indent-level-${indent}`"
              ></span>
              <ExpandIcon
                :expanded="expanded"
                :prefix-cls="prefixCls"
                :expandable="hasNestChildren"
                :record="record"
                :disabled="!mergedExpandable"
                @expand="onInternalTriggerExpand"
              />
            </div>
          </template>
        </BodyCell>
      </template>
    </RenderSlot>
    <div v-if="type !== 'center'" :class="`${prefixCls}-cell-shadow-${type}`"></div>
  </div>
</template>
