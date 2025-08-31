<!--
 * @Author: shen
 * @Date: 2022-11-04 14:03:45
 * @LastEditors: shen
 * @LastEditTime: 2022-11-07 12:30:03
 * @Description: 
-->
<script lang="ts">
import { defineComponent } from 'vue'
import HeaderCell from '../Header/HeaderCell.vue'
import HeaderExtraCell from '../Header/HeaderExtraCell.vue'

import type { PropType } from 'vue'
import type { HeaderCellType } from '../interface'

export default defineComponent({
  name: 'HeaderRow',
  components: { HeaderExtraCell, HeaderCell },
  props: {
    prefixCls: String as PropType<string>,
    cells: {
      type: Array as PropType<HeaderCellType[]>,
      default: () => [],
    },
    wrapText: Boolean as PropType<boolean>,
    level: Number as PropType<number>,
  },
})
</script>

<template>
  <tr>
    <template v-for="cell in cells" :key="cell.key">
      <HeaderExtraCell
        v-if="cell?.column?.__Internal__Column__"
        component="th"
        :column="cell.column"
        :prefix-cls="prefixCls"
        :additional-props="{
          colstart: cell.colStart,
          colend: cell.colEnd,
          rowspan: cell.rowSpan,
          colspan: cell.colSpan,
        }"
      />
      <HeaderCell
        v-else
        component="th"
        :column="cell.column"
        :prefix-cls="prefixCls"
        :wrap-text="wrapText"
        :level="level"
        :additional-props="{
          colstart: cell.colStart,
          colend: cell.colEnd,
          rowspan: cell.rowSpan,
          colspan: cell.colSpan,
        }"
      />
    </template>
  </tr>
</template>
