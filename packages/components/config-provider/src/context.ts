/*
 * @Author: shen
 * @Date: 2025-05-22 15:51:17
 * @LastEditors: shen
 * @LastEditTime: 2025-07-26 18:35:37
 * @Description:
 */
import { inject, provide } from 'vue'
import { proConfigProviderContextKey } from './constants'
import type { ProConfigProviderContext } from './constants'

export const useProConfigProvide = (props: ProConfigProviderContext) => {
  provide(proConfigProviderContextKey, props)
}

export const useProConfigInject = () => {
  return inject(proConfigProviderContextKey, {} as ProConfigProviderContext)
}
