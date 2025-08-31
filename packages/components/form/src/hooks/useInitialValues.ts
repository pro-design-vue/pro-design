/*
 * @Author: shen
 * @Date: 2023-08-11 08:34:34
 * @LastEditors: shen
 * @LastEditTime: 2025-07-26 12:03:07
 * @Description:
 */
import type { ProFormPropsType, Entity } from '../type'

import { shallowRef, onMounted, ref } from 'vue'
import { useFetchData } from './useFetchData'
import { merge } from '@pro-design-vue/utils'

export const useInitialValues = (props: ProFormPropsType) => {
  const hasInitial = ref(true)
  const requestLoading = ref(false)
  const initialValues = shallowRef<Entity>({ ...props.initialValues })
  const fetchData = useFetchData({ request: props.request })

  onMounted(async () => {
    if (props.request && !props.requestAbort) {
      hasInitial.value = true
      requestLoading.value = true
      const initialData = await fetchData(props.params)
      initialValues.value = merge({}, initialValues.value, initialData) ?? {}
      Promise.resolve().then(() => {
        hasInitial.value = false
        requestLoading.value = false
      })
    }
  })

  return { initialValues, hasInitial, requestLoading }
}
