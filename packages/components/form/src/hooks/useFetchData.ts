/*
 * @Author: shen
 * @Date: 2023-08-11 11:10:03
 * @LastEditors: shen
 * @LastEditTime: 2026-01-05 13:37:42
 * @Description:
 */
import type { Key } from '@pro-design-vue/utils'

import { useState } from '@pro-design-vue/hooks'
import { onUnmounted, ref, type ComputedRef, type Ref } from 'vue'
import useSWRV from 'swrv'

let testId = 0

export type ProRequestData<T, U = Record<string, any>> = (params: U) => Promise<T>

export function useFetchData<T, U = Record<string, any>>({
  proFieldKey,
  params,
  request,
}: {
  proFieldKey?: ComputedRef<Key>
  params?: ComputedRef<U>
  request?: ComputedRef<ProRequestData<T, U>>
}): [Ref<T | undefined>] {
  const abortRef = ref<AbortController | null>(null)
  /** Key 是用来缓存请求的，如果不在是有问题 */
  const [cacheKey] = useState(() => {
    if (proFieldKey?.value) {
      return proFieldKey.value.toString()
    }
    testId += 1
    return testId.toString()
  })

  const fetchData = async () => {
    abortRef.value?.abort()
    const abort = new AbortController()
    abortRef.value = abort
    const loadData = await Promise.race([
      request?.value?.(params?.value as U),
      new Promise((_, reject) => {
        abortRef.value?.signal?.addEventListener('abort', () => {
          reject(new Error('aborted'))
        })
      }),
    ])
    return loadData as T
  }

  onUnmounted(() => {
    testId += 1
  })

  const { data, error } = useSWRV([cacheKey.value, params?.value], fetchData, {
    shouldRetryOnError: false,
    revalidateOnFocus: false,
  })

  return [data || error]
}
