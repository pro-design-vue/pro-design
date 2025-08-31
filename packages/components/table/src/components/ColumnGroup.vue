<!--
 * @Author: shen
 * @Date: 2022-04-24 15:54:51
 * @LastEditors: shen
 * @LastEditTime: 2025-07-28 08:50:28
 * @Description:
-->
<script lang="ts">
import type { ColumnType } from './interface'
import { defineComponent } from 'vue'
export type ColumnGroupProps<RecordType> = ColumnType<RecordType>

export default defineComponent<ColumnGroupProps<any>>({
  name: 'ProTableColumnGroup',
  slots: ['title'],
  __S_TABLE_COLUMN_GROUP: true,
})
</script>
