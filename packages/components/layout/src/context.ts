/*
 * @Author: shen
 * @Date: 2022-06-08 20:07:35
 * @LastEditors: shen
 * @LastEditTime: 2025-08-12 09:03:26
 * @Description:
 */

import type { InjectionKey, ComputedRef } from 'vue'

import { inject, provide } from 'vue'

export interface LayoutContextProps {
  contentOffsetTop: ComputedRef<number>
}
export const LayoutContextKey: InjectionKey<LayoutContextProps> = Symbol('LayoutContext')

export const useProLayoutProvide = (props: LayoutContextProps) => {
  provide(LayoutContextKey, props)
}

export const useProLayoutInject = () => {
  return inject(LayoutContextKey, {} as LayoutContextProps)
}
