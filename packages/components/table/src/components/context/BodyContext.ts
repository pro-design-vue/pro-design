/*
 * @Author: shen
 * @Date: 2022-11-06 11:34:02
 * @LastEditors: shen
 * @LastEditTime: 2023-11-08 23:14:31
 * @Description:
 */
import { inject, provide } from 'vue'

import type { CellRenderArgs, RowType } from '../interface'
import type { InjectionKey, Ref } from 'vue'

export interface BodyContextProps {
  tooltipOpen: Ref<boolean>
  leftPopupContainer: Ref<HTMLDivElement | undefined>
  centerPopupContainer: Ref<HTMLDivElement | undefined>
  rightPopupContainer: Ref<HTMLDivElement | undefined>
  dragRowPlaceholderRef: Ref<HTMLSpanElement | undefined>
  bodyRef: Ref<HTMLDivElement | undefined>
  onBodyCellContextmenu: (event: MouseEvent, args: Partial<CellRenderArgs>, type: RowType) => void
}

export const BodyContextKey: InjectionKey<BodyContextProps> = Symbol('BodyContextProps')

export const useProvideBody = (props: BodyContextProps) => {
  provide(BodyContextKey, props)
}

export const useInjectBody = () => {
  return inject(BodyContextKey, {} as BodyContextProps)
}
