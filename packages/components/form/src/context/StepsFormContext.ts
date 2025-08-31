/*
 * @Author: shen
 * @Date: 2022-06-08 20:07:35
 * @LastEditors: shen
 * @LastEditTime: 2025-08-16 11:21:46
 * @Description:
 */
import type { InjectionKey, Ref, ComputedRef } from 'vue'
import type { FormInstance } from '../base/StepForm'

import { inject, provide } from 'vue'

export interface StepsFormContextProps {
  step: Ref<number>
  loading: Ref<boolean>
  setLoading: (loading: boolean) => void
  lastStep: ComputedRef<boolean>
  next: () => void
  regForm: (form: Ref<FormInstance | undefined>, index: number) => void
  onFormFinish: (name: string, formData: any) => void
}

export const StepsFormContextKey: InjectionKey<StepsFormContextProps> =
  Symbol('StepsFormContextContext')

export const useProvideStepsForm = (props: StepsFormContextProps) => {
  provide(StepsFormContextKey, props)
}

export const useInjectStepsForm = () => {
  return inject(StepsFormContextKey, {} as StepsFormContextProps)
}
