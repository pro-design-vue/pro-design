/*
 * @Author: shen
 * @Date: 2026-04-13 17:12:46
 * @LastEditors: shen
 * @LastEditTime: 2026-04-14 09:12:38
 * @Description:
 */
import { computed, type ComputedRef } from 'vue'

/**
 * 创建一个优化的computed，只有在依赖值真正变化时才重新计算
 */
export function createMemoizedComputed<T>(getter: () => T, deps: () => any[]): ComputedRef<T> {
  let lastDeps: any[] | null = null
  let lastValue: T | null = null

  return computed(() => {
    const currentDeps = deps()

    // 检查依赖是否有变化
    if (lastDeps) {
      let hasChanged = false
      for (let i = 0; i < currentDeps.length; i++) {
        if (currentDeps[i] !== lastDeps[i]) {
          hasChanged = true
          break
        }
      }

      if (!hasChanged) {
        return lastValue as T
      }
    }

    lastDeps = currentDeps
    lastValue = getter()

    return lastValue as T
  })
}

/**
 * 比较两个值是否相等，用于更精确的依赖变化检测
 */
export function isEqual(a: any, b: any): boolean {
  if (a === b) return true
  if (a == null || b == null) return a === b
  if (typeof a !== typeof b) return false

  if (typeof a === 'object') {
    if (Array.isArray(a)) {
      if (!Array.isArray(b) || a.length !== b.length) return false
      for (let i = 0; i < a.length; i++) {
        if (!isEqual(a[i], b[i])) return false
      }
      return true
    } else {
      const keysA = Object.keys(a)
      const keysB = Object.keys(b)
      if (keysA.length !== keysB.length) return false
      for (const key of keysA) {
        if (!keysB.includes(key) || !isEqual(a[key], b[key])) return false
      }
      return true
    }
  }

  return a === b
}

/**
 * 创建带深度比较的memoized computed
 */
export function createDeepMemoizedComputed<T>(getter: () => T, deps: () => any[]): ComputedRef<T> {
  let lastDeps: any[] | null = null
  let lastValue: T | null = null

  return computed(() => {
    const currentDeps = deps()

    // 检查依赖是否有变化（使用深度比较）
    if (lastDeps) {
      let hasChanged = false
      for (let i = 0; i < currentDeps.length; i++) {
        if (!isEqual(currentDeps[i], lastDeps[i])) {
          hasChanged = true
          break
        }
      }

      if (!hasChanged) {
        return lastValue as T
      }
    }

    lastDeps = currentDeps
    lastValue = getter()

    return lastValue as T
  })
}
