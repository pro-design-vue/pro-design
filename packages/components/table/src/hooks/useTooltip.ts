/*
 * @Author: shen
 * @Date: 2022-11-06 11:35:02
 * @LastEditors: shen
 * @LastEditTime: 2023-11-08 22:25:15
 * @Description:
 */
import { watch, ref } from 'vue'

import type { Key } from '../components/interface'
import type { Ref } from 'vue'

export default function useTooltip({ hoverColumnKey }: { hoverColumnKey: Ref<Key | undefined> }): {
  open: Ref<boolean>
} {
  const open = ref(false)
  let timer: any
  watch(hoverColumnKey, (newKey) => {
    clearTimeout(timer)
    clearTimeout(undefined)
    if (newKey !== undefined) {
      timer = setTimeout(() => {
        open.value = true
      }, 300)
    } else {
      open.value = false
    }
  })

  return {
    open,
  }
}
