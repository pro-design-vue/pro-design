/*
 * @Author: shen
 * @Date: 2025-09-22 15:06:55
 * @LastEditors: shen
 * @LastEditTime: 2025-09-22 15:22:46
 * @Description:
 */
import { runFunction } from '@pro-design-vue/utils'
import type { ProFormItemType, TransformerMapType } from '../type'

function transformer(items: ProFormItemType[]) {
  const transformerMap: TransformerMapType = new Map()
  const handler = (items: ProFormItemType[]) => {
    items.forEach((item) => {
      if (item.name && (item.transform || item.convertValue)) {
        transformerMap.set(item.name, {
          transform: item.transform,
          convertValue: item.convertValue,
        })
      } else if (item.children) {
        const children = runFunction(item.children) ?? []
        handler(children)
      }
    })
  }

  handler(items)

  return transformerMap
}

export default transformer
