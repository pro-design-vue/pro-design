/*
 * @Author: shen
 * @Date: 2026-10-16 11:00:00
 * @LastEditors: shen
 * @LastEditTime: 2026-10-16 11:00:00
 * @Description: Deep clone using native structuredClone with lodash fallback
 */
import { cloneDeep as _cloneDeep } from 'lodash-unified'

/**
 * Deep clone an object.
 *
 * Uses native `structuredClone` (~2x faster than lodash) for plain data.
 * Falls back to lodash's `cloneDeep` for values containing functions,
 * DOM nodes, or other types that `structuredClone` cannot handle.
 */
export function cloneDeep<T>(value: T): T {
  try {
    return structuredClone(value)
  } catch {
    return _cloneDeep(value)
  }
}
