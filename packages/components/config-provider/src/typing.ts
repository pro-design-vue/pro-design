/*
 * @Author: shen
 * @Date: 2025-05-22 09:08:45
 * @LastEditors: shen
 * @LastEditTime: 2025-11-12 13:29:42
 * @Description:
 */
import type { AliasToken } from 'ant-design-vue/es/theme/interface'
import type { ColProps, ConfigProviderProps, NotificationPlacement } from 'ant-design-vue'
import type { IntlType } from './intl'
import type { ValidateMessages, FormLabelAlign } from 'ant-design-vue/es/form/interface'
import type {
  Bordered,
  OptionConfig,
  TablePaginationConfig,
  DensitySize,
} from '@pro-design-vue/components/table/src/components/interface'

interface ProConfigProviderProps extends Omit<ConfigProviderProps, 'form'> {
  intl?: IntlType
  proPrefixCls?: string
  contentOffsetTop?: number
  dark?: boolean
  token?: Partial<AliasToken>
  accessCodes?: Set<string>
  compact?: boolean
  table?: {
    animateRows?: boolean
    bordered?: boolean
    cardBordered?: Bordered
    childrenColumnName?: string
    expandRowByClick?: boolean
    rowKey?: string
    size?: DensitySize
    rowHover?: boolean
    summaryFixed?: boolean
    columnEmptyText?: string
    highlightSelectRow?: boolean
    options?: OptionConfig | false
    pagination?: TablePaginationConfig
  }
  form?: {
    validateMessages?: ValidateMessages
    requiredMark?: boolean | 'optional'
    colon?: boolean
    resetOnSubmit?: boolean
    labelWidth?: number | 'auto'
    searchText?: string
    resetText?: string
    labelAlign?: FormLabelAlign
    labelCol?: ColProps
    wrapperCol?: ColProps
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
