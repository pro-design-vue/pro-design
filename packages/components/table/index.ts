/*
 * @Author: shen
 * @Date: 2023-07-29 15:15:45
 * @LastEditors: shen
 * @LastEditTime: 2025-10-12 15:57:23
 * @Description:
 */
import type { SFCWithInstall } from '@pro-design-vue/utils'

import { setConfig } from './src/components/config'
import type {
  ValueEnumType,
  CellRenderArgs,
  ColumnGroupType,
  ColumnsType,
  ColumnType,
  ContextmenuPopupArg,
  Position,
  Request,
  ColumnStateType,
  ProTableProps,
  TableExposeType,
  TablePaginationConfig,
  TableRowSelection,
  Key,
  DensitySize,
} from './src/components/interface'
import { SELECTION_ALL, SELECTION_INVERT, SELECTION_NONE } from './src/hooks/useRowSelection'
import { setLicenseKey } from './src/license/licenseInfo'
import { withInstall } from '@pro-design-vue/utils'
import Table from './src/components/Table'
import Column from './src/components/Column.vue'
import ColumnGroup from './src/components/ColumnGroup.vue'
import SummaryCell from './src/components/Summary/Cell.vue'
import SummaryRow from './src/components/Summary/Row.vue'
import Summary from './src/components/Summary/Summary.vue'

export type { RowHeight } from './src/components/interface'
export type {
  ProTableProps,
  TablePaginationConfig as ProTablePaginationConfig,
  ColumnGroupType as ProTableColumnGroupType,
  ColumnType as ProTableColumnType,
  ColumnType as ProTableColumnProps,
  ColumnsType as ProTableColumnsType,
  Position as ScrollPosition,
  Request as ProTableRequest,
  ValueEnumType as ProTableValueEnumType,
  CellRenderArgs,
  ContextmenuPopupArg,
  TableRowSelection as ProTableRowSelection,
  TableExposeType as ProTableExposeType,
  ColumnStateType as ProColumnStateType,
  Key as ProTableKey,
  DensitySize as ProTableDensitySize,
}
export {
  Column as ProTableColumn,
  ColumnGroup as ProTableColumnGroup,
  Summary as ProTableSummary,
  SummaryRow as ProTableSummaryRow,
  SummaryCell as ProTableSummaryCell,
  SELECTION_ALL,
  SELECTION_INVERT,
  SELECTION_NONE,
  setLicenseKey,
  setConfig,
}

export const ProTable: SFCWithInstall<typeof Table> & {
  Column: typeof Column
  ColumnGroup: typeof ColumnGroup
  Summary: typeof Summary
  SummaryRow: typeof SummaryRow
  SummaryCell: typeof SummaryCell
} = withInstall(Table, {
  Column,
  ColumnGroup,
  Summary,
  SummaryRow,
  SummaryCell,
})

ProTable.SELECTION_ALL = SELECTION_ALL
ProTable.SELECTION_INVERT = SELECTION_INVERT
ProTable.SELECTION_NONE = SELECTION_NONE

export default ProTable

export type ProTableInstance = InstanceType<typeof Table> & TableExposeType
