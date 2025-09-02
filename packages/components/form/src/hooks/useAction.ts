/*
 * @Author: shen
 * @Date: 2023-08-23 20:07:22
 * @LastEditors: shen
 * @LastEditTime: 2025-07-26 12:01:35
 * @Description:
 */

import type { Ref, ShallowRef } from 'vue'
import type { ProFormActionType, NamePath, Entity } from '../type'
import type { ProFormProps } from '../props'
import type { FormInstance } from 'ant-design-vue'
import { cloneDeep, get, isObject, merge, set } from '@pro-design-vue/utils'
import covertFormName from '../utils/namePath'

const transformKey = (values: any, paramsOmitNil: boolean, parentKey?: NamePath) => {
  console.log('🚀 ~ transformKey ~ parentKey:', parentKey)
  console.log('🚀 ~ transformKey ~ paramsOmitNil:', paramsOmitNil)
  return values
}

export function useAction({
  props,
  formRef,
  formData,
  initialValues,
  hasInitial,
  onFinish,
  onReset,
  onFinishFailed,
}: {
  props: ProFormProps
  formRef: Ref<FormInstance | undefined>
  formData: Ref<Entity>
  initialValues: ShallowRef<Entity>
  hasInitial: Ref<boolean>
  onFinish: ProFormProps['onFinish']
  onReset: ProFormProps['onReset']
  onFinishFailed: ProFormProps['onFinishFailed']
}): ProFormActionType {
  const getFieldValue = (name: NamePath) => {
    const namePath = covertFormName(name)
    if (!namePath) throw new Error('name is require')
    return get(formData.value, namePath)
  }
  const getFieldsValue = (nameList?: true | NamePath[]) => {
    if (nameList === true || nameList === undefined) {
      return cloneDeep(formData.value)
    }
    const obj = {}
    nameList.forEach((name) => {
      const namePath = covertFormName(name)
      const value = get(formData.value, namePath!)
      if (value !== undefined) {
        set(obj, namePath!, value)
      }
    })
    return obj
  }
  const getFieldFormatValue = (name: NamePath) => {
    const namePath = covertFormName(name)
    if (!namePath) throw new Error('name is require')
    const value = get(formData.value, namePath)
    const obj = set({}, namePath, value)
    return get(transformKey(obj, props.omitNil!, namePath), namePath)
  }

  const getFieldFormatValueObject = (name: NamePath) => {
    const namePath = covertFormName(name)
    if (!namePath) throw new Error('name is require')
    const value = get(formData.value, namePath)
    const obj = set({}, namePath, value)
    return transformKey(obj, props.omitNil!, namePath)
  }

  const validateFieldsReturnFormatValue = async (nameList?: NamePath[]) => {
    if (!Array.isArray(nameList) && nameList) throw new Error('nameList must be array')

    const values = await formRef.value?.validateFields(nameList)
    const transformedKey = transformKey(values, props.omitNil!)
    return transformedKey ?? {}
  }

  const setFieldValue = (name: NamePath, value: any) => {
    const namePath = covertFormName(name)
    if (!namePath) throw new Error('name is require')
    set(formData.value, namePath, value)
  }

  const setFieldsValue = (values: Entity, isMerge: boolean = true) => {
    if (!values) throw new Error('values is require')
    if (isMerge) {
      formData.value = merge({}, formData.value, values)
    } else {
      formData.value = cloneDeep(values)
    }
  }
  const resetInitialValues = (values: Entity) => {
    if (!values) throw new Error('values is require')
    if (!isObject(values)) throw new Error('values must be object')
    hasInitial.value = true
    initialValues.value = cloneDeep(values)
  }

  const reset = () => {
    hasInitial.value = true
    formRef.value?.clearValidate()
    formData.value = cloneDeep(initialValues.value)
    Promise.resolve().then(() => {
      hasInitial.value = false
      onReset?.(formData.value)
    })
  }

  const resetField = (name: NamePath) => {
    const namePath = covertFormName(name)
    if (!namePath) throw new Error('name is require')
    formRef.value?.clearValidate(name)
    set(formData.value, name, cloneDeep(get(initialValues.value, name)))
  }

  const clearValidate = (name?: NamePath) => {
    formRef.value?.clearValidate(name)
  }

  const validateFields = (nameList?: NamePath[]) => {
    return new Promise((resolve, reject) => {
      formRef.value
        ?.validateFields(nameList)
        .then((values) => {
          resolve({ ...formData.value, ...values })
        })
        .catch((e) => {
          reject(e)
        })
    }) as Promise<Entity>
  }

  const submit = () => {
    validateFields()
      .then((values) => {
        if (onFinish) {
          try {
            onFinish(values)
          } catch (err) {
            console.error(err)
          }
        }
      })
      .catch((e) => {
        if (onFinishFailed) {
          onFinishFailed(e)
        }
      })
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
