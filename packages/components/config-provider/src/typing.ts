/*
 * @Author: shen
 * @Date: 2025-05-22 09:08:45
 * @LastEditors: shen
 * @LastEditTime: 2025-10-10 09:17:29
 * @Description:
 */
import type { ConfigProviderProps } from 'ant-design-vue'
import type { IntlType } from './intl'
import type { ProTablePaginationConfig } from '@pro-design-vue/components/table'

interface ProConfigProviderProps extends ConfigProviderProps {
  intl?: IntlType
  proPrefixCls?: string
  contentOffsetTop?: number
  table?: {
    pagination?: ProTablePaginationConfig
  }
  pro?: {
    table?: {
      pagination?: ProTablePaginationConfig
    }
  }
}

export type { ProConfigProviderProps }
