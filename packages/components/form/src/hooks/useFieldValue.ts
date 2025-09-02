/*
 * @Author: shen
 * @Date: 2022-06-10 15:44:38
 * @LastEditors: shen
 * @LastEditTime: 2025-09-02 15:14:56
 * @Description:
 */
import type { ComputedRef, Ref } from 'vue'
import type { NamePath, SearchConvertKeyFn, SearchTransformKeyFn } from '../type'

import { computed, shallowRef, watch } from 'vue'
import { useInjectForm } from '../context/FormContext'
import { cloneDeep, set, get } from '@pro-design-vue/utils'

export function useFieldValue<T>({
  namePath,
  initialValue,
  convertValue,
  transform,
}: {
  isList?: boolean
  namePath: ComputedRef<NamePath>
  initialValue?: any
  convertValue?: SearchConvertKeyFn
  transform?: SearchTransformKeyFn
}): {
  fieldValue: Ref<T | undefined>
  onValueChange: (value: T) => void
} {
  const fieldValue = shallowRef<T | undefined>()

  const { formData, initialValues, mountedRef } = useInjectForm()

  const modelValue = computed(() => get(formData.value, namePath.value) as T)

  const onValueChange = (value: T) => {
    set(
      formData.value,
      namePath.value,
      transform ? transform(value, namePath.value, formData.value) : value,
    )
  }

  watch(
    modelValue,
    (newValue) => {
      fieldValue.value = cloneDeep(
        convertValue ? (convertValue(newValue, namePath.value) as T) : newValue,
      )
    },
    {
      immediate: true,
      deep: true,
    },
  )

  const initFieldInitialValue = () => {
    if (
      !mountedRef.value &&
      typeof modelValue.value === 'undefined' &&
      typeof initialValue !== 'undefined'
    ) {
      const value = transform
        ? transform(initialValue, namePath.value, formData.value)
        : initialValue
      set(formData.value, namePath.value, cloneDeep(value))
      set(initialValues?.value ?? {}, namePath.value, cloneDeep(value))
      fieldValue.value = convertValue
        ? (convertValue(initialValue, namePath.value) as T)
        : initialValue
    }
  }
  initFieldInitialValue()

  return {
    fieldValue,
    onValueChange,
  }
}
