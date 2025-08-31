<!--
 * @Author: shen
 * @Date: 2023-11-08 21:11:33
 * @LastEditors: shen
 * @LastEditTime: 2025-07-28 09:05:50
 * @Description:
-->
<script lang="ts">
import type { PropType } from 'vue'
import type { FinallyColumnType, DefaultRecordType } from '../interface'

import { defineComponent, ref, computed } from 'vue'
import HeaderCellTitle from './HeaderCellTitle.vue'
import useColumnDragHandler from '../Drag/useColumnDragHandler'

export default defineComponent({
  name: 'TableHeaderCellGroup',
  components: { HeaderCellTitle },
  props: {
    prefixCls: String as PropType<string>,
    column: {
      type: Object as PropType<FinallyColumnType<DefaultRecordType>>,
      default: () => ({}),
    },
    wrapText: { type: Boolean as PropType<boolean>, default: false },
  },
  setup(props) {
    const domRef = ref<HTMLDivElement>()

    useColumnDragHandler({
      column: computed(() => props.column),
      columnKey: computed(() => props.column.columnKey),
      disabled: computed(() => false),
      domRef,
    })
    return {
      domRef,
    }
  },
})
</script>

<template>
  <div
    ref="domRef"
    :class="{
      [`${prefixCls}-header-cell-title`]: true,
      [`${prefixCls}-cell-group-title`]: true,
      [`${prefixCls}-cell-box`]: true,
    }"
    :style="`height: ${column.height}px`"
  >
    <HeaderCellTitle
      :column="column"
      :wrap-text="column.wrapText === undefined ? wrapText : column.wrapText"
      :prefix-cls="prefixCls"
    />
  </div>
</template>
