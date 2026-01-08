/*
 * @Author: shen
 * @Date: 2023-08-22 16:36:27
 * @LastEditors: shen
 * @LastEditTime: 2025-07-26 11:46:24
 * @Description:
 */
import { isString } from '@pro-design-vue/utils'
import type { NamePath } from '../type'

const covertFormName = (namePath?: NamePath) => {
  if (!namePath) {
    return undefined
  }
  return isString(namePath)
    ? namePath.indexOf('.') > -1
      ? namePath.split('.')
      : [namePath]
    : namePath
}

export default covertFormName
