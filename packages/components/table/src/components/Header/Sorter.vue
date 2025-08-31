<!--
 * @Author: shen
 * @Date: 2023-11-07 21:51:35
 * @LastEditors: shen
 * @LastEditTime: 2025-07-30 10:52:47
 * @Description:
-->
<script lang="ts">
import { defineComponent, computed } from 'vue'
import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons-vue'
import { useInjectTable } from '../context/TableContext'
import { ASCEND, DESCEND } from '../../hooks/useSorter'
import HeaderCellTitle from './HeaderCellTitle.vue'

import type { PropType } from 'vue'
import type { FinallyColumnType, SortOrder } from '../interface'
import type { SortState } from '../../hooks/useSorter'

export default defineComponent({
  name: 'TableHeaderSorter',
  components: {
    CaretDownOutlined,
    CaretUpOutlined,
    HeaderCellTitle,
  },
  inheritAttrs: false,
  props: {
    column: { type: Object as PropType<FinallyColumnType>, default: () => ({}) },
    columnKey: { type: [Number, String] },
    sorterState: Object as PropType<SortState<any>>,
    sorterOrder: [String, Boolean] as PropType<SortOrder>,
    sortDirections: Array as PropType<SortOrder[]>,
    nextSortOrder: String as PropType<SortOrder>,
    wrapText: Boolean as PropType<boolean>,
    showFilter: Boolean as PropType<boolean>,
  },
  setup(props) {
    const tableContext = useInjectTable()

    const showUpNode = computed(() => props.sortDirections?.includes(ASCEND))
    const showDownNode = computed(() => props.sortDirections?.includes(DESCEND))
    const prefixCls = computed(() => tableContext.props.prefixCls)

    const className = computed(() => ({
      [`${prefixCls.value}-column-sorter`]: true,
      [`${prefixCls.value}-column-sorter-full`]: showUpNode.value && showDownNode.value,
    }))
    const upClass = computed(() => ({
      [`${prefixCls.value}-column-sorter-up`]: true,
      active: props.sorterOrder === ASCEND,
    }))
    const downClass = computed(() => ({
      [`${prefixCls.value}-column-sorter-down`]: true,
      active: props.sorterOrder === DESCEND,
    }))

    return {
      showUpNode,
      showDownNode,
      className,
      prefixCls,
      upClass,
      downClass,
      tableContext,
    }
  },
})
</script>

<template>
  <div
    :class="{
      [`${prefixCls}-header-cell-title`]: true,
      [`${prefixCls}-header-cell-filter-title`]: showFilter,
    }"
  >
    <HeaderCellTitle :column="column" :wrap-text="wrapText" :prefix-cls="prefixCls" />
    <span v-if="column.sorter" :class="className">
      <span :class="`${prefixCls}-column-sorter-inner`">
        <CaretUpOutlined v-if="showUpNode" :class="upClass" />
        <CaretDownOutlined v-if="showDownNode" :class="downClass" />
      </span>
    </span>
  </div>
</template>
