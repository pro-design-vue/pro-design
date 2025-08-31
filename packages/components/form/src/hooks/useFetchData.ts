/*
 * @Author: shen
 * @Date: 2023-08-11 11:10:03
 * @LastEditors: shen
 * @LastEditTime: 2025-07-18 13:22:46
 * @Description:
 */
import type { ProRequestData } from '../type'

import { ref } from 'vue'

export function useFetchData(props: {
  request?: ProRequestData
}): (params?: Record<string, any>, index?: number) => Promise<any> {
  const abortRef = ref<AbortController | null>(null)
  const fetchData = async (params?: Record<string, any>, index?: number): Promise<any> => {
    abortRef.value?.abort()
    const abort = new AbortController()
    abortRef.value = abort
    const loadData = await Promise.race([
      props.request?.(params!, index),
      new Promise((_, reject) => {
        abortRef.value?.signal?.addEventListener('abort', () => {
          reject(new Error('aborted'))
        })
      }),
    ])
    return loadData
  }

  return fetchData
}
