<!--
 * @Author: shen
 * @Date: 2023-12-17 11:35:56
 * @LastEditors: shen
 * @LastEditTime: 2025-11-25 08:54:58
 * @Description:
-->
<script lang="ts">
import type { FinallyColumnType } from '../interface'
import type { PropType } from 'vue'

import { defineComponent, computed, h, renderSlot, Fragment, inject } from 'vue'
import { Popover, Tooltip } from 'ant-design-vue'
import { ExclamationCircleOutlined, InfoCircleOutlined } from '@ant-design/icons-vue'
import { useInjectSlots } from '../context/TableSlotsContext'
import { useInjectTable } from '../context/TableContext'
import { AUTO_HEADER_HEIGHT } from '../../utils/constant'
import { ensureValidVNode } from '../../utils/util'
import { RenderVNode } from '@pro-design-vue/utils'

export default defineComponent({
  name: 'HeaderCellTitle',
  components: { ExclamationCircleOutlined, InfoCircleOutlined, Popover, Tooltip, RenderVNode },
  props: {
    column: { type: Object as PropType<FinallyColumnType>, default: () => ({}) },
    prefixCls: String as PropType<string>,
    wrapText: Boolean as PropType<boolean>,
  },
  setup(props) {
    const tableSlotsContext = useInjectSlots()
    const tableContext = useInjectTable()
    const autoHeight = inject<boolean>(AUTO_HEADER_HEIGHT, false)

    const sortColumns = computed(() =>
      tableContext.sorterStates.value.map(({ column, sortOrder }) => ({
        column,
        order: sortOrder,
      })),
    )

    const title = computed(() =>
      h(Fragment, [
        renderSlot(
          tableSlotsContext,
          'headerCell',
          {
            title: props.column.title,
            column: props.column.originColumn,
          },
          () => {
            return [
              typeof props.column.title == 'function'
                ? props.column.title({
                    column: props.column.originColumn!,
                    sortColumns: sortColumns.value,
                    sortColumn: sortColumns.value[0]?.column,
                    sortOrder: sortColumns.value[0]?.order,
                  })
                : props.column.title,
            ]
          },
        ),
      ]),
    )

    const isShowPopover = computed(
      () =>
        !!ensureValidVNode(
          tableSlotsContext.headerCellPopover?.({
            title: props.column.title,
            column: props.column.originColumn!,
          }) ?? [],
        ),
    )

    const showCellPopover = computed(() => {
      return undefined === props.column.showCellPopover
        ? isShowPopover.value
        : props.column.showCellPopover
    })

    const popoverProps = computed(() =>
      'boolean' == typeof showCellPopover.value ? {} : showCellPopover.value,
    )

    const getPopupContainer = () => {
      return document.body
    }

    return {
      getPopupContainer,
      isShowPopover,
      tableSlotsContext,
      title,
      autoHeight,
      popoverProps,
      showCellPopover,
      altTitle: computed(() =>
        props.column.showTitle && typeof props.column.title == 'string' ? props.column.title : '',
      ),
    }
  },
})
</script>

<template>
  <span
    :key="String('headerCell' in tableSlotsContext)"
    :class="{
      [`${prefixCls}-header-cell-title-inner`]: true,
    }"
    :title="altTitle"
    :style="`justify-content: ${column.align}`"
  >
    <span
      :class="{
        [`${prefixCls}-cell-wrap-text`]: wrapText,
        [`${prefixCls}-cell-text-ellipsis`]: column.ellipsis !== false && !autoHeight,
      }"
    >
      <component :is="title"></component>
    </span>
    <template v-if="showCellPopover">
      <Popover v-bind="popoverProps" :getPopupContainer>
        <template #title v-if="!popoverProps?.title">
          <component :is="title"></component>
        </template>
        <template #content>
          <RenderVNode
            v-if="tableSlotsContext.headerCellPopover"
            :vnode="
              tableSlotsContext.headerCellPopover({
                title: column.title,
                column: column.originColumn!,
              })
            "
          />
        </template>
        <ExclamationCircleOutlined style="margin-inline-start: 3px; font-size: 12px" />
      </Popover>
    </template>
    <template v-if="column.headerTooltip">
      <Tooltip :getPopupContainer>
        <InfoCircleOutlined style="margin-inline-start: 3px; font-size: 12px" />
        <template #title>
          <component :is="title" v-if="column.headerTooltip === true"></component>
          <template v-else>{{ column.headerTooltip }}</template>
        </template>
      </Tooltip>
    </template>
  </span>
</template>
