/*
 * @Author: shen
 * @Date: 2025-05-22 09:01:44
 * @LastEditors: shen
 * @LastEditTime: 2025-08-17 09:46:15
 * @Description:
 */
import type { ProConfigProviderProps } from './typing'
import type { ComputedRef, InjectionKey } from 'vue'

export type ProConfigProviderContext = {
  [K in keyof ProConfigProviderProps]?: ComputedRef<ProConfigProviderProps[K]>
} & {
  setContentOffsetTop: (offsetTop: number) => void
}

export const proConfigProviderContextKey: InjectionKey<ProConfigProviderContext> = Symbol()
