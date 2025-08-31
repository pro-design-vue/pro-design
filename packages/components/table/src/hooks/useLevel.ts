/*
 * @Author: shen
 * @Date: 2023-11-01 10:25:43
 * @LastEditors: shen
 * @LastEditTime: 2023-11-01 10:30:05
 * @Description:
 */
import { inject, provide } from 'vue'
import type { InjectionKey } from 'vue'

export const LevelKey: InjectionKey<number> = Symbol('Level')

export const useInjectLevel = () => {
  return inject(LevelKey, undefined)
}
export const useProvideLevel = () => {
  const level = useInjectLevel()
  provide(LevelKey, level === undefined ? 0 : level + 1)
}
