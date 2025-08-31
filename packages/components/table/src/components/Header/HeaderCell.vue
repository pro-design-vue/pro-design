<!--
 * @Author: shen
 * @Date: 2023-11-06 16:03:18
 * @LastEditors: shen
 * @LastEditTime: 2025-08-29 14:02:19
 * @Description:
-->
<script lang="ts">
import type { PropType, CSSProperties } from 'vue'
import type { FilterKey, FinallyColumnType, SortOrder } from '../interface'

import { defineComponent, computed, inject, ref, watch, h } from 'vue'
import { Tooltip } from 'ant-design-vue'
import { MenuOutlined } from '@ant-design/icons-vue'
import { useInjectTable } from '../context/TableContext'
import { RenderVNode, RenderSlot } from '../../utils/renderVNode'
import { AUTO_HEADER_HEIGHT } from '../../utils/constant'
import { ASCEND, DESCEND, getMultiplePriority } from '../../hooks/useSorter'
import { getCellFixedInfo } from '../../utils/fixUtil'
import { useInjectHeader } from '../context/HeaderContext'
import { useInjectSlots } from '../context/TableSlotsContext'
import { useInjectPopup } from '../context/PopupContext'
import { isEqual } from '@pro-design-vue/utils'
import useColumnDragHandler from '../Drag/useColumnDragHandler'
import supportSticky from '../../utils/supportSticky'
import eagerComputed from '../../utils/eagerComputed'
import Sorter from './Sorter.vue'
import DragHandle from './DragHandle.vue'
import FilterDropdown from '../Filter/FilterDropdown.vue'
import FilterItems from '../Filter/FilterItems.vue'

export default defineComponent({
  name: 'TableHeaderCell',
  components: {
    Sorter,
    Tooltip,
    DragHandle,
    FilterDropdown,
    MenuOutlined,
    RenderVNode,
    FilterItems,
  },
  props: {
    component: { type: String, default: 'div' },
    prefixCls: String as PropType<string>,
    column: { type: Object as PropType<FinallyColumnType>, default: () => ({}) },
    wrapText: { type: Boolean as PropType<boolean>, default: false },
    level: { type: Number as PropType<number>, default: 1 },
    additionalProps: Object,
  },
  setup(props) {
    const tableContext = useInjectTable()
    const headerContext = useInjectHeader()
    const tableSlotsContext = useInjectSlots()
    const { showPopupContent } = useInjectPopup()

    const columnDragging = computed(
      () => tableContext.draggingColumnKey.value === props.column.columnKey,
    )
    const autoHeight = inject<boolean>(AUTO_HEADER_HEIGHT, false)
    const domRef = ref<HTMLDivElement>()

    if (props.level === 1) {
      useColumnDragHandler({
        column: computed(() => props.column),
        columnKey: computed(() => props.column.columnKey),
        disabled: computed(() => false),
        domRef,
      })
    }

    const showSorterTooltip = computed(() => {
      return undefined === props.column.showSorterTooltip
        ? tableContext.props.showSorterTooltip
        : props.column.showSorterTooltip
    })

    const tooltipProps = computed(() =>
      'boolean' == typeof showSorterTooltip.value ? {} : showSorterTooltip.value,
    )

    const sorterInfo = computed(() => {
      const column = props.column
      const columnKey = column.columnKey
      const sorterState = tableContext.sorterStates.value.find(({ key }) => key === columnKey)
      const sorterOrder = sorterState ? sorterState.sortOrder : null
      const sortDirections = column.sortDirections || ['asc', 'desc']
      const nextSortOrder = sorterOrder
        ? sortDirections[sortDirections.indexOf(sorterOrder) + 1]
        : sortDirections[0]

      const { cancelSort, triggerAsc, triggerDesc } = tableContext.locale.value || {}
      let tip = cancelSort
      if (nextSortOrder === DESCEND) {
        tip = triggerDesc
      } else if (nextSortOrder === ASCEND) {
        tip = triggerAsc
      }
      return {
        columnKey,
        sorterState,
        sorterOrder,
        sortDirections,
        nextSortOrder,
        tip,
        showFilter:
          !!(
            column.filters ||
            column.filterDropdown ||
            (column.slots && column.slots.filterDropdown) ||
            column.customFilterDropdown
          ) && false !== column.showFilter,
        wrapText: props.column.wrapText === undefined ? props.wrapText : props.column.wrapText,
      }
    })
    const hasIcon = computed(() => sorterInfo.value.showFilter || !!tableSlotsContext.menuPopup)
    const cellBoxClass = computed(() => ({
      [`${props.prefixCls}-has-icon-column`]: hasIcon.value,
      [`${props.prefixCls}-cell-box`]: true,
    }))
    const titleClass = computed(() => {
      const { prefixCls } = props
      return {
        [`${prefixCls}-column-title`]: true,
        [`${prefixCls}-cell-box`]: !hasIcon.value,
      }
    })

    const widths = computed(() => {
      const {
        columnIndex = tableContext.columnKeyIndexMap.value[props.column.columnKey],
        colSpan = 1,
      } = props.column
      return tableContext.getColumnPosition(columnIndex || 0, colSpan)
    })

    const customColProps = computed(() =>
      (props.column.customHeaderCell || tableContext.props.customHeaderCell || (() => ({})))(
        props.column,
      ),
    )

    const colProps = computed(() => {
      const { columnIndex, colSpan = 1 } = props.column
      return Object.assign({}, customColProps.value, {
        colspan: colSpan,
        colstart: columnIndex,
        colend: colSpan + columnIndex - 1,
        ...props.additionalProps,
      })
    })

    const cellFixedInfo = computed(() => {
      if (autoHeight) {
        return getCellFixedInfo(
          colProps.value!.colstart,
          colProps.value!.colend,
          tableContext.allColumns.value as any,
          tableContext.stickyOffsets.value,
          tableContext.props.direction,
        )
      }
      return undefined
    })

    const cellClass = computed(() => {
      const { prefixCls, column } = props
      let cellFixedCls = {}
      if (cellFixedInfo.value && supportSticky) {
        const autoCellPrefixCls = `${prefixCls}-cell`,
          { fixLeft, fixRight, firstFixLeft, lastFixLeft, firstFixRight, lastFixRight } =
            cellFixedInfo.value
        cellFixedCls = {
          [`${autoCellPrefixCls}-fix-left`]: typeof fixLeft === 'number',
          [`${autoCellPrefixCls}-fix-left-first`]: firstFixLeft,
          [`${autoCellPrefixCls}-fix-left-last`]: lastFixLeft,
          [`${autoCellPrefixCls}-fix-right`]: typeof fixRight == 'number',
          [`${autoCellPrefixCls}-fix-right-first`]: firstFixRight,
          [`${autoCellPrefixCls}-fix-right-last`]: lastFixRight,
        }
      }
      return Object.assign(
        {
          [`${prefixCls}-cell`]: true,
          [`${prefixCls}-header-cell`]: true,
          [column.class || '']: true,
          [column.className || '']: true,
          [`${prefixCls}-column-sort`]: sorterInfo.value.sorterOrder,
          [`${prefixCls}-column-has-sorters`]: column.sorter,
          [`${prefixCls}-drag-column-dragging`]: columnDragging.value,
        },
        cellFixedCls,
      )
    })

    const componentStyle = computed(() => {
      const styles: CSSProperties = {}
      if (cellFixedInfo.value && supportSticky) {
        const { fixLeft, fixRight } = cellFixedInfo.value
        if (typeof fixLeft == 'number') {
          styles.position = 'sticky'
          styles.left = `${fixLeft}px`
        }
        if (typeof fixRight == 'number') {
          styles.position = 'sticky'
          styles.right = `${fixRight}px`
        }
      }
      return autoHeight
        ? styles
        : { width: `${widths.value.width}px`, height: `${props.column.height}px` }
    })

    const selectedKeysRef = ref<FilterKey>([])
    const filterStates = computed(() => tableContext.filterStates.value)
    const columnKey = computed(() => props.column.columnKey)
    const filterState = computed(() =>
      filterStates.value.find(({ key }) => columnKey.value === key),
    )

    const changeFilter = (keys: FilterKey) => {
      const filteredKeys = keys?.length ? keys : null
      if (!(null !== filteredKeys || (filterState.value && filterState.value.filteredKeys)))
        return null
      if (
        isEqual(
          filteredKeys,
          null == filterState.value ? undefined : filterState.value.filteredKeys,
        )
      )
        return null
      const state = { column: props.column, key: columnKey.value, filteredKeys }
      tableContext?.changeFilter(state)
    }

    watch(
      filterState,
      () => {
        selectedKeysRef.value = filterState.value?.filteredKeys || []
      },
      { immediate: true },
    )

    const clearFilters = () => {
      selectedKeysRef.value = []
      changeFilter([])
    }
    const confirm = () => {
      changeFilter(selectedKeysRef.value)
    }

    const filtered = eagerComputed(() => {
      return !!selectedKeysRef.value?.length
    })

    const menuFilterProps = computed(() => ({
      prefixCls: props.prefixCls,
      setSelectedKeys: (keys: FilterKey) => {
        selectedKeysRef.value = keys || []
      },
      selectedKeysRef,
      confirm,
      clearFilters,
      filters: props.column.filters,
    }))

    return {
      tableContext,
      sorterInfo,
      handleSortClick: (column: FinallyColumnType<any>, nextSortOrder: SortOrder) => {
        if (!column.sorter) return
        const sortState = {
          column,
          key: column.columnKey,
          sortOrder: nextSortOrder,
          multiplePriority: getMultiplePriority(column),
        }
        tableContext.changeSorter(sortState)
      },
      cellClass,
      widths,
      colProps,
      RenderSlot,
      titleClass,
      domRef,
      autoHeight,
      componentStyle,
      headerContext,
      tableSlotsContext,
      cellBoxClass,
      showPopupContent,
      FilterItems,
      h,

      hasIcon,
      menuFilterProps,
      filtered,
      tooltipProps,
      showSorterTooltip,
    }
  },
})
</script>

<template>
  <component
    v-if="colProps.colspan"
    ref="domRef"
    :is="component"
    tabindex="-1"
    role="cell"
    :class="cellClass"
    :style="componentStyle"
    v-bind="colProps"
    @click="handleSortClick(column, sorterInfo.nextSortOrder!)"
  >
    <component :is="hasIcon ? 'div' : RenderSlot" :class="cellBoxClass">
      <span :class="titleClass">
        <Tooltip v-if="column.sorter && showSorterTooltip" v-bind="tooltipProps">
          <template #title>
            {{ sorterInfo.tip }}
          </template>
          <div :class="`${prefixCls}-column-sorters`" :data-tip="sorterInfo.tip">
            <Sorter :column="column" v-bind="sorterInfo" />
          </div>
        </Tooltip>
        <Sorter v-else :column="column" v-bind="sorterInfo" />
      </span>
      <FilterDropdown
        v-if="sorterInfo.showFilter"
        :prefix-cls="`${prefixCls}-filter`"
        :column="column"
      />
      <span
        v-if="column.showMenu && tableSlotsContext.menuPopup"
        :class="[
          `${prefixCls}-menu-popup-trigger`,
          'hover' === column.showMenu && `${prefixCls}-menu-popup-trigger-hover`,
        ]"
        @click.stop="
          showPopupContent(tableSlotsContext.menuPopup, $event, {
            column: column.originColumn,
            filter: menuFilterProps,
          })
        "
      >
        <RenderVNode
          v-if="tableSlotsContext.menuIcon"
          :vnode="
            tableSlotsContext.menuIcon({
              column: column.originColumn!,
              filtered: filtered,
            })
          "
        />
        <MenuOutlined v-else />
      </span>
    </component>
    <DragHandle
      v-if="column.resizable && !(column.children && column.children.length)"
      :prefix-cls="prefixCls"
      :width="widths.width"
      :min-width="widths.minWidth"
      :max-width="widths.maxWidth"
      :column="column"
    />
  </component>
</template>
