/*
 * @Author: shen
 * @Date: 2023-11-12 21:37:06
 * @LastEditors: shen
 * @LastEditTime: 2023-11-12 21:38:24
 * @Description:
 */
import { watchEffect, ref } from 'vue'

export const usePrevious = <T>(state: T): T | undefined => {
  const previous = ref<T>()

  watchEffect(() => {
    previous.value = state
  })

  return previous.value
}
