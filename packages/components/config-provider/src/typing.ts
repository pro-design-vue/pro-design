/*
 * @Author: shen
 * @Date: 2025-05-22 09:08:45
 * @LastEditors: shen
 * @LastEditTime: 2025-10-12 21:48:47
 * @Description:
 */
import type { AliasToken } from 'ant-design-vue/es/theme/interface'
import type { ConfigProviderProps, NotificationPlacement } from 'ant-design-vue'
import type { IntlType } from './intl'
import type { ProTablePaginationConfig } from '@pro-design-vue/components/table'
import type { ValidateMessages } from 'ant-design-vue/es/form/interface'

interface ProConfigProviderProps extends Omit<ConfigProviderProps, 'form'> {
  intl?: IntlType
  proPrefixCls?: string
  contentOffsetTop?: number
  dark?: boolean
  token?: Partial<AliasToken>
  compact?: boolean
  table?: {
    animateRows?: boolean
    bordered?: boolean
    childrenColumnName?: string
    expandRowByClick?: boolean
    rowKey?: string
    rowHover?: boolean
    summaryFixed?: boolean
    columnEmptyText?: string
    highlightSelectRow?: boolean
    pagination?: ProTablePaginationConfig
  }
  form?: {
    validateMessages?: ValidateMessages
    requiredMark?: boolean | 'optional'
    colon?: boolean
    resetOnSubmit?: boolean
    labelWidth?: number | 'auto'
    searchText?: string
    resetText?: string
  }
  modal?: {
    draggable?: boolean
    showFullscreen?: boolean
  }
  drawer?: {
    showFullscreen?: boolean
  }
  app?: {
    message?: {
      top?: number | string
      duration?: number
      prefixCls?: string
      getContainer?: () => HTMLElement
      transitionName?: string
      maxCount?: number
      rtl?: boolean
    }
    notification?: {
      top?: number | string
      bottom?: number | string
      prefixCls?: string
      getContainer?: () => HTMLElement
      placement?: NotificationPlacement
      maxCount?: number
      rtl?: boolean
    }
  }
}

export type { ProConfigProviderProps }
