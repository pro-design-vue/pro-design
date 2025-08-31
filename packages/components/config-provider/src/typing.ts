/*
 * @Author: shen
 * @Date: 2025-05-22 09:08:45
 * @LastEditors: shen
 * @LastEditTime: 2025-08-26 17:24:41
 * @Description:
 */
import type { ConfigProviderProps } from 'ant-design-vue'
import type { IntlType } from './intl'

interface ProConfigProviderProps extends ConfigProviderProps {
  intl?: IntlType
  proPrefixCls?: string
  contentOffsetTop?: number
}

export type { ProConfigProviderProps }
