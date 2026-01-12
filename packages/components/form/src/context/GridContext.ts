/*
 * @Author: shen
 * @Date: 2026-01-05 13:44:15
 * @LastEditors: shen
 * @LastEditTime: 2026-01-09 16:56:53
 * @Description:
 */
import type { ColProps, RowProps } from 'ant-design-vue'
import { inject, provide, type ComputedRef, type InjectionKey } from 'vue'

export interface GridContextProps {
  grid?: ComputedRef<boolean>
  colProps?: ComputedRef<ColProps>
  rowProps?: ComputedRef<RowProps>
}

export const GridContextKey: InjectionKey<GridContextProps> = Symbol('GridContext')

export const useProvideGrid = (props: GridContextProps) => {
  provide(GridContextKey, props)
}

export const useInjectGrid = () => {
  return inject(GridContextKey, {} as GridContextProps)
}
