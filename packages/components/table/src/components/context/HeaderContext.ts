/*
 * @Author: shen
 * @Date: 2022-11-05 21:22:46
 * @LastEditors: shen
 * @LastEditTime: 2023-11-07 14:56:45
 * @Description:
 */
import { inject, provide } from 'vue'
import type { InjectionKey, Ref } from 'vue'
export interface HeaderContextProps {
  dragColumnPlaceholderRef: Ref<HTMLSpanElement | undefined>
  headerRef: Ref<HTMLDivElement | undefined>
  maxHeaderHeight: Ref<number>
}

export const HeaderContextKey: InjectionKey<HeaderContextProps> = Symbol('HeaderContextProps')
export const useProvideHeader = (props: HeaderContextProps) => {
  provide(HeaderContextKey, props)
}
export const useInjectHeader = () => {
  return inject(HeaderContextKey, {} as HeaderContextProps)
}
