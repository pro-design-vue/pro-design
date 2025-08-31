<!--
 * @Author: shen
 * @Date: 2022-11-07 18:17:18
 * @LastEditors: shen
 * @LastEditTime: 2025-07-28 09:16:11
 * @Description:
-->
<script lang="ts">
import { defineComponent } from 'vue'
import devWarning from '../../utils/devWarning'

export default defineComponent({
  name: 'ProTableSummary',
  props: { fixed: Boolean },
  setup() {
    devWarning(
      false,
      's-table-summary',
      'you do not need s-table-summary, you can use summaryFixed prop at s-table',
    )
  },
})
</script>

<template>
  <slot />
</template>
