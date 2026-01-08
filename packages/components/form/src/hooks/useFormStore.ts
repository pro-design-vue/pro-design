/*
 * @Author: shen
 * @Date: 2023-08-23 20:07:22
 * @LastEditors: shen
 * @LastEditTime: 2026-01-08 15:32:01
 * @Description:
 */
import type { InternalNamePath, NamePath } from 'ant-design-vue/es/form/interface'
import { get, isEqual, merge, set, type Entity } from '@pro-design-vue/utils'
import { ref, shallowRef, toRaw, watch, type Ref, type ShallowRef } from 'vue'
import { getNamePath } from '../utils/getNamePath'
import { cloneByNamePathList } from '../utils/cloneByNamePathList'

export type FormStore = {
  formValues: Ref<Entity | undefined>
  getFieldValue: (name: NamePath) => any
  updateValue: (name: NamePath, value: any) => void
  getInitialValue: (namePath: InternalNamePath) => any
  initEntityValue: (namePath: InternalNamePath, initialValue: any) => void
}

export function useFormStore({
  initialData,
  initialValues: userInitialValues,
  onValuesChange,
}: {
  initialData: Ref<Entity | undefined>
  initialValues?: Entity
  onValuesChange: (changedValues: Partial<Entity>, values: Entity) => void
}): FormStore {
  const formValues = ref<Entity>(merge(userInitialValues) ?? {})
  const initialValues = shallowRef<Entity>(merge(userInitialValues) ?? {})

  const getFieldValue = (name: NamePath) => {
    const namePath: InternalNamePath = getNamePath(name)
    return get(formValues.value, namePath)
  }

  const getInitialValue = (namePath: InternalNamePath) => {
    const initValue = get(initialValues.value, namePath)

    // Not cloneDeep when without `namePath`
    return namePath.length ? merge(initValue) : initValue
  }

  const initEntityValue = (namePath: InternalNamePath, initialValue: any) => {
    if (initialValue !== undefined) {
      const prevValue = get(formValues.value, namePath)
      if (prevValue === undefined) {
        set(initialValues.value, namePath, initialValue)
        updateValues(initialValues.value)
      }
    }
  }

  const updateValues = (nextValues: Entity) => {
    formValues.value = merge(nextValues)
  }

  const updateValue = (name: NamePath, value: any) => {
    const namePath = getNamePath(name)
    const prevValue = getFieldValue(namePath)
    if (!isEqual(prevValue, value)) {
      const nextValues = set(formValues.value, namePath, value)
      updateValues(nextValues)
      if (onValuesChange) {
        const changedValues = cloneByNamePathList(nextValues, [namePath])
        onValuesChange(changedValues, toRaw(formValues.value))
      }
    }
  }

  // request 请求的初始化数据优先级更高
  watch(initialData, () => {
    initialValues.value = merge({}, initialValues.value, initialData.value)
    updateValues(initialValues.value)
  })

  return {
    formValues,
    getFieldValue,
    updateValue,
    getInitialValue,
    initEntityValue,
  }
}
