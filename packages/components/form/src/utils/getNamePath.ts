/*
 * @Author: shen
 * @Date: 2026-01-07 10:20:21
 * @LastEditors: shen
 * @LastEditTime: 2026-01-08 13:23:36
 * @Description:
 */
import { isString } from '@pro-design-vue/utils'
import type { InternalNamePath, NamePath } from 'ant-design-vue/es/form/interface'

export function getNamePath(path?: NamePath | null): InternalNamePath {
  if (path === undefined || path === null) {
    return []
  }
  return Array.isArray(path) ? path : isString(path) ? path.split('.') : [path]
}
