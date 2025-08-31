/*
 * @Author: shen
 * @Date: 2022-11-03 18:07:52
 * @LastEditors: shen
 * @LastEditTime: 2023-11-03 14:01:56
 * @Description:
 */
import { watchEffect, shallowRef } from 'vue'
import type { ComputedRef, WatchOptionsBase } from 'vue'
export type ComputedGetter<T> = (...args: any[]) => T
export default function eagerComputed<T>(fn: ComputedGetter<T>, options?: WatchOptionsBase) {
  const result = shallowRef<T>()
  watchEffect(
    () => {
      result.value = fn()
    },
    { flush: options?.flush ?? 'sync' },
  )

  return result as any as ComputedRef<T>
}
