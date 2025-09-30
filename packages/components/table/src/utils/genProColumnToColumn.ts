/*
 * @Author: shen
 * @Date: 2023-11-19 11:26:08
 * @LastEditors: shen
 * @LastEditTime: 2025-09-30 16:39:14
 * @Description:
 */
import type { ContainerContextProps } from '../hooks/useContainer'
import type {
  ColumnGroupType,
  ColumnType,
  ColumnsType,
  ProTableProps,
} from '../components/interface'
import { omitUndefinedAndEmptyArr } from './omitUndefinedAndEmptyArr'
import { genColumnKey } from './util'

type ColumnToColumnReturnType = (ColumnType & {
  index?: number
})[]

type ColumnToColumnParams = {
  columns: ColumnsType
  counter: ContainerContextProps
} & Pick<ProTableProps, 'rowKey' | 'childrenColumnName'>

/**
 * 转化 columns 到 pro 的格式 主要是 render 方法的自行实现
 *
 * @param columns
 * @param map
 * @param columnEmptyText
 */
export function genProColumnToColumn(
  params: ColumnToColumnParams,
  parents?: ColumnGroupType,
): ColumnToColumnReturnType {
  const { columns, counter } = params

  return columns
    ?.map((columnProps, columnsIndex) => {
      const { key, dataIndex, disable, valueEnum, width } = columnProps as ColumnGroupType
      const columnKey = genColumnKey(
        // key || (dataIndex ? `${dataIndex.toString()}-${columnsIndex}` : ''),
        key || dataIndex?.toString(),
        [parents?.key, columnsIndex].filter(Boolean).join('-'),
      )

      const config =
        counter.columnsMap.value[columnKey] ||
        ({
          fixed: columnProps.fixed,
        } as any)
      console.log('🚀 ~ ?.map ~ config:', config)
      const tempColumns = {
        index: columnsIndex,
        key: columnKey,
        ...columnProps,
        valueEnum,
        fixed: config.fixed,
        width: config.width ?? width,
        disable: config.disable ?? disable,
        // width: columnProps.width || (columnProps.fixed ? 200 : undefined),
        children: (columnProps as ColumnGroupType).children
          ? genProColumnToColumn(
              {
                ...params,
                columns: (columnProps as ColumnGroupType)?.children ?? [],
              },
              { ...columnProps, key: columnKey } as ColumnGroupType,
            )
          : undefined,
      }
      return omitUndefinedAndEmptyArr(tempColumns)
    })
    ?.filter((item) => !item.hideInTable) as unknown as (ColumnType & {
    index?: number
  })[]
}
