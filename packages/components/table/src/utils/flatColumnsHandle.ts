/*
 * @Author: shen
 * @Date: 2023-11-19 11:40:56
 * @LastEditors: shen
 * @LastEditTime: 2025-09-14 18:32:59
 * @Description:
 */

import type { ColumnsType, ColumnGroupType } from '../components/interface'

export const flatColumnsHandle = (columns: ColumnsType) => {
  const flatColumns: ColumnsType = []
  const loopColumns = (columns: ColumnsType) => {
    columns.forEach((column: ColumnGroupType) => {
      if (column?.children?.length) {
        loopColumns(column?.children)
      } else {
        flatColumns.push(column)
      }
    })
  }
  loopColumns(columns)
  return flatColumns
}
