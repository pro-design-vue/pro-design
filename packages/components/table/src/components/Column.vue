<!--
 * @Author: shen
 * @Date: 2022-04-24 15:54:28
 * @LastEditors: shen
 * @LastEditTime: 2025-07-28 08:50:22
 * @Description:
-->
<script lang="ts">
import type { ColumnType } from './interface'
import { defineComponent } from 'vue'

type ColumnProps<RecordType = unknown> = ColumnType<RecordType>
export default defineComponent<ColumnProps>({
  name: 'ProTableColumn',
  slots: ['title', 'filterIcon'],
})
</script>
