/*
 * @Author: shen
 * @Date: 2022-04-08 16:18:07
 * @LastEditors: shen
 * @LastEditTime: 2025-07-26 11:41:18
 * @Description:
 */

import { objectToEmpty } from '@pro-design-vue/utils'
import { provide, reactive, watch, defineComponent, inject } from 'vue'

import type { InjectionKey, PropType } from 'vue'

export type ContextSlots = {
  [key: string]: ((...args: any[]) => any) | undefined
}

export const ContextKey: InjectionKey<ContextSlots> = Symbol('FormSlotsContext')

export const useInjectSlots = () => {
  return inject(ContextKey, {} as ContextSlots)
}

export default defineComponent({
  name: 'FormSlotsContextProvider',
  inheritAttrs: false,
  props: {
    value: {
      type: Object as PropType<ContextSlots>,
      default: () => ({}),
    },
  },
  setup(props: { value?: ContextSlots }, { slots }) {
    const currentValue = reactive<ContextSlots>({})

    watch(
      () => props.value,
      () => {
        objectToEmpty(currentValue)
        Object.assign(currentValue, props.value)
      },
      { immediate: true },
    )

    provide(ContextKey, currentValue)

    return () => slots.default?.()
  },
})
