/*
 * @Author: shen
 * @Date: 2022-04-21 10:52:07
 * @LastEditors: shen
 * @LastEditTime: 2022-11-07 21:26:11
 * @Description:
 */
import { defineComponent, inject, provide, reactive, watch } from 'vue'
import { objectToEmpty } from '../../utils/util'

import type { InjectionKey, Ref, CSSProperties, PropType } from 'vue'
import type { FinallyColumnType } from '../interface'

export interface SummaryCtxType {
  columns: FinallyColumnType[]
  type: 'left' | 'center' | 'right'
}

export const SummaryCtx: InjectionKey<SummaryCtxType> = Symbol('SummaryCtx')

export interface SummaryCellConfig {
  index?: number
  width: number
  visible: boolean
  style: CSSProperties
  fixed?: 'right' | 'left'
  isLastFixedLeft?: boolean
  isFirstFixedRight?: boolean
}

interface SummaryRowCtxType {
  updateCell: (id: string, index: number, colSpan: number) => void
  removeCell: (id: string) => void
  cells: Ref<SummaryCellConfig[]>
}

export const SummaryRowCtxKey: InjectionKey<SummaryRowCtxType> = Symbol('SummaryRowCtx')
export const useProvideSummaryRow = (props: SummaryRowCtxType) => {
  provide(SummaryRowCtxKey, props)
}
export const useInjectSummaryRow = () => {
  return inject(SummaryRowCtxKey, {} as SummaryRowCtxType)
}

export const useProvideSummary = (props: SummaryCtxType) => {
  provide(SummaryCtx, props)
}
export const useInjectSummary = () => {
  return inject(SummaryCtx, {} as SummaryCtxType)
}

export const SummaryContextProvider = defineComponent({
  props: { value: { type: Object as PropType<SummaryCtxType> } },
  setup(props, { slots }) {
    const ctx = reactive<SummaryCtxType>({} as SummaryCtxType)
    watch(
      () => props.value,
      () => {
        objectToEmpty(ctx)
        Object.assign(ctx, props.value)
      },
      { immediate: true },
    )
    useProvideSummary(ctx)

    return () => slots.default?.()
  },
})
