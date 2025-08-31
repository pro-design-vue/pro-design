/*
 * @Author: shen
 * @Date: 2023-08-10 13:47:02
 * @LastEditors: shen
 * @LastEditTime: 2025-07-26 11:48:02
 * @Description:
 */
import { isString } from '@pro-design-vue/utils'
import type { ContextSlots } from '../context/FormSlotsContext'

function getSlot(name: any, context: ContextSlots): any {
  if (!name) {
    return null
  }
  if (isString(name) && name.startsWith('::')) {
    return context[name.substring(2)]
  }
  return name
}

export default getSlot
