/*
 * @Author: shen
 * @Date: 2023-08-23 20:07:22
 * @LastEditors: shen
 * @LastEditTime: 2025-07-25 09:20:55
 * @Description:
 */

import type { Ref } from 'vue'
import type { ProFormActionType, NamePath, Entity } from '../type'

export function useFormExpose(formRef: Ref<any>): ProFormActionType {
  const getFieldValue = (name: NamePath) => {
    return formRef.value?.getFieldValue(name)
  }
  const getFieldsValue = (nameList?: true | NamePath[]) => {
    return formRef.value?.getFieldsValue(nameList)
  }
  const resetInitialValues = (values: Entity) => {
    return formRef.value?.resetInitialValues(values)
  }
  const getFieldFormatValue = (name: NamePath) => {
    return formRef.value?.getFieldFormatValue(name)
  }
  const getFieldFormatValueObject = (name: NamePath) => {
    return formRef.value?.getFieldFormatValueObject(name)
  }
  const validateFieldsReturnFormatValue = (nameList?: NamePath[]) => {
    return formRef.value?.validateFieldsReturnFormatValue(nameList)
  }
  const setFieldValue = (name: NamePath, value: any) => {
    return formRef.value?.setFieldValue(name, value)
  }
  const setFieldsValue = (values: Entity, isMerge: boolean = true) => {
    return formRef.value?.setFieldsValue(values, isMerge)
  }
  const resetField = (name: NamePath) => {
    return formRef.value?.resetField(name)
  }
  const clearValidate = (name?: NamePath) => {
    return formRef.value?.clearValidate(name)
  }
  const validateFields = (nameList?: NamePath[]) => {
    return formRef.value?.validateFields(nameList)
  }
  const reset = () => {
    return formRef.value?.reset()
  }
  const submit = () => {
    return formRef.value?.submit()
  }

  return {
    getFieldValue,
    getFieldsValue,
    resetInitialValues,
    getFieldFormatValue,
    getFieldFormatValueObject,
    validateFieldsReturnFormatValue,
    setFieldValue,
    setFieldsValue,
    resetField,
    clearValidate,
    validateFields,
    reset,
    submit,
  }
}
