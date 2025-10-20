/*
 * @Author: shen
 * @Date: 2025-08-29 08:55:23
 * @LastEditors: shen
 * @LastEditTime: 2025-10-20 15:42:47
 * @Description:
 */
import type { CSSProperties } from 'vue'
export interface PaginationProps {
  total?: number
  disabled?: boolean
  current?: number
  pageSize?: number
  onChange?: (page: number, pageSize?: number) => void
  hideOnSinglePage?: boolean
  showSizeChanger?: boolean
  pageSizeOptions?: string[]
  onShowSizeChange?: (current: number, size: number) => void
  showQuickJumper?:
    | boolean
    | {
        goButton?: any
      }
  showTotal?: (total: number, range: [number, number]) => any
  size?: 'default' | 'small'
  simple?: boolean
  style?: CSSProperties
  locale?: Record<string, any>
  class?: string
  prefixCls?: string
  selectPrefixCls?: string
  role?: string
  showLessItems?: boolean
}
export declare type TablePaginationPosition =
  | 'topLeft'
  | 'topCenter'
  | 'topRight'
  | 'bottomLeft'
  | 'bottomCenter'
  | 'bottomRight'
export interface TablePaginationConfig extends PaginationProps {
  position?: TablePaginationPosition[]
  fieldNames?: {
    current?: string
    pageSize?: string
  }
}
