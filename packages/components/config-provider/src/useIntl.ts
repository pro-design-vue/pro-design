/*
 * @Author: shen
 * @Date: 2025-05-21 11:18:18
 * @LastEditors: shen
 * @LastEditTime: 2025-07-26 20:56:05
 * @Description:
 */
import type { IntlType } from './intl'

import { useProConfigInject } from './context'
import { findIntlKeyByAntdLocaleKey, intlMap, zhCNIntl } from './intl'
/**
 * It returns the intl object from the context if it exists, otherwise it returns the intl object for
 * 获取国际化的方法
 * @param locale
 * @param localeMap
 * the current locale
 * @returns The return value of the function is the intl object.
 */
export function useIntl(): IntlType {
  const { intl, locale } = useProConfigInject()

  if (intl && intl.value?.locale !== 'default') {
    return intl.value || zhCNIntl
  }

  if (locale?.value?.locale) {
    return intlMap[findIntlKeyByAntdLocaleKey(locale.value.locale) as 'zh-CN'] || zhCNIntl
  }

  return zhCNIntl
}
