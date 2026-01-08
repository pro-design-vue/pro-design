/*
 * @Author: shen
 * @Date: 2025-12-23 10:48:04
 * @LastEditors: shen
 * @LastEditTime: 2026-01-06 14:48:50
 * @Description:
 */

import type { ProFieldValueEnumType, ProSchemaValueEnumMap } from '@pro-design-vue/utils'

/**
 * 获取类型的 type
 *
 * @param obj
 */
export function getType(obj: any) {
  // @ts-ignore
  const type = Object.prototype.toString
    .call(obj)
    .match(/^\[object (.*)\]$/)[1]
    .toLowerCase()
  if (type === 'string' && typeof obj === 'object') return 'object' // Let "new String('')" return 'object'
  if (obj === null) return 'null' // PhantomJS has type "DOMWindow" for null
  if (obj === undefined) return 'undefined' // PhantomJS has type "DOMWindow" for undefined
  return type
}

export const objectToMap = (value: ProFieldValueEnumType | undefined): ProSchemaValueEnumMap => {
  if (getType(value) === 'map') {
    return value as ProSchemaValueEnumMap
  }
  return new Map(Object.entries(value || {}))
}
