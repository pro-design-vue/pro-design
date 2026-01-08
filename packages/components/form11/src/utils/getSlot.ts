/*
 * @Author: shen
 * @Date: 2023-08-10 13:47:02
 * @LastEditors: shen
 * @LastEditTime: 2025-10-13 15:27:16
 * @Description:
 */
import { isString } from '@pro-design-vue/utils'
import type { ContextSlots } from '../context/FormSlotsContext'

function getSlot(name: any, context: ContextSlots): any {
  if (!name) {
    return null
  }
  if (isString(name)) {
    if (name.startsWith('::')) {
      return context[name.substring(2)]
    }
    if (context[name]) {
      return context[name]
    }
  }
  return name
}

export default getSlot
