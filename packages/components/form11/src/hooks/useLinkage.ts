/*
 * @Author: shen
 * @Date: 2023-08-14 09:25:30
 * @LastEditors: shen
 * @LastEditTime: 2025-08-29 13:46:42
 * @Description:
 */
import type { ShallowRef, ComputedRef } from 'vue'

import { computed, shallowRef } from 'vue'

export type Linkage = {
  hiddenKeys: ShallowRef<string[]>
  allHiddenKeys: ComputedRef<(string | undefined)[]>
  disabledKeys: ShallowRef<string[]>
  allDisabledKeys: ComputedRef<(string | undefined)[]>
  updateHiddenKeys: (fieldKey: string, keys: string | string[]) => void
  updateDisabledKeys: (fieldKey: string, keys: string | string[]) => void
}

export const useLinkage = (): Linkage => {
  const hiddenKeys = shallowRef<string[]>([])
  const disabledKeys = shallowRef<string[]>([])
  const excludeKeys = computed(() => hiddenKeys.value.map((key) => key.split(':')[1]))

  const genNewKeys = (originKeys: string[], fieldKey: string, keys: string | string[]) => {
    if (!Array.isArray(keys)) {
      keys = [keys]
    }
    const filterKeys = originKeys.filter((key) => !key.startsWith(fieldKey + ':'))
    filterKeys.push(...keys.map((key) => `${fieldKey}:${key}`))
    return Array.from(new Set(filterKeys))
  }

  const updateHiddenKeys = (fieldKey: string, keys: string | string[]) => {
    hiddenKeys.value = genNewKeys(hiddenKeys.value, fieldKey, keys)
  }

  const updateDisabledKeys = (fieldKey: string, keys: string | string[]) => {
    disabledKeys.value = genNewKeys(disabledKeys.value, fieldKey, keys)
  }

  const allHiddenKeys = computed(() => {
    return hiddenKeys.value
      .filter((key) => !excludeKeys.value.includes(key.split(':')[0]))
      .map((key) => key.split(':')[1])
  })

  const allDisabledKeys = computed(() => {
    return disabledKeys.value
      .filter((key) => !excludeKeys.value.includes(key.split(':')[0]))
      .map((key) => key.split(':')[1])
  })
  return {
    allHiddenKeys,
    hiddenKeys,
    allDisabledKeys,
    disabledKeys,
    updateHiddenKeys,
    updateDisabledKeys,
  }
}
