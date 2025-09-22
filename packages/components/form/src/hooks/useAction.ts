/*
 * @Author: shen
 * @Date: 2023-08-23 20:07:22
 * @LastEditors: shen
 * @LastEditTime: 2025-09-22 16:11:16
 * @Description:
 */

import type { Ref, ShallowRef } from 'vue'
import type { ProFormActionType, NamePath, Entity, TransformerMapType } from '../type'
import type { ProFormProps } from '../props'
import type { FormInstance } from 'ant-design-vue'
import { cloneDeep, get, isObject, merge, set, isNil, isValidElement } from '@pro-design-vue/utils'
import covertFormName from '../utils/namePath'

/**
 * 暂时还不支持 Set和 Map 结构 判断是不是一个能遍历的对象
 *
 * @param itemValue
 * @returns Boolean
 */
function isPlainObj(itemValue: any) {
  if (typeof itemValue !== 'object') return false

  /** Null 也要处理，不然omit空会失效 */
  if (itemValue === null) return true

  if (isValidElement(itemValue)) return false
  if (itemValue.constructor === RegExp) return false
  if (itemValue instanceof Map) return false
  if (itemValue instanceof Set) return false
  if (itemValue instanceof HTMLElement) return false
  if (itemValue instanceof Blob) return false
  if (itemValue instanceof File) return false
  if (Array.isArray(itemValue)) return false
  return true
}

export const transformKeySubmitValue = <T extends object = any>(
  values: T,
  transformerMap: TransformerMapType,
  paramsOmitNil?: boolean,
) => {
  if (Object.keys(values).length < 1) {
    return values
  }

  if (typeof window === 'undefined') return values
  // 如果 value 是 string | null | Array | Blob类型 其中之一，直接返回
  // 形如 {key: [File, File]} 的表单字段当进行第二次递归时会导致其直接越过 typeof value !== 'object'
  if (typeof values !== 'object' || isNil(values) || values instanceof Blob) {
    return values
  }
  let finalValues: any = Array.isArray(values) ? [] : ({} as T)

  const gen = (tempValues: T, parentsKey?: NamePath) => {
    const isArrayValues = Array.isArray(tempValues)
    let result = isArrayValues ? ([] as any) : ({} as T)
    if (tempValues == null || tempValues === undefined) {
      return result
    }

    Object.keys(tempValues).forEach((entityKey) => {
      const transformForArray = (transformList: any, subItemValue: any) => {
        if (!Array.isArray(transformList)) return entityKey
        transformList.forEach((transform: Function | Record<string, any> | any[], idx: number) => {
          // 如果不存在直接返回
          if (!transform) return

          const subTransformItem = subItemValue?.[idx]

          // 如果是个方法，把key设置为方法的返回值
          if (typeof transform === 'function') {
            subItemValue[idx] = transform(subItemValue, entityKey, tempValues)
          }
          if (typeof transform === 'object' && !Array.isArray(transform)) {
            Object.keys(transform).forEach((transformArrayItem) => {
              const subTransformItemValue = subTransformItem?.[transformArrayItem]
              if (typeof transform[transformArrayItem] === 'function' && subTransformItemValue) {
                const res = transform[transformArrayItem](
                  subTransformItem[transformArrayItem],
                  entityKey,
                  tempValues,
                )
                subTransformItem[transformArrayItem] =
                  typeof res === 'object' ? res[transformArrayItem] : res
              } else if (
                typeof transform[transformArrayItem] === 'object' &&
                Array.isArray(transform[transformArrayItem]) &&
                subTransformItemValue
              ) {
                transformForArray(transform[transformArrayItem], subTransformItemValue)
              }
            })
          }
          if (typeof transform === 'object' && Array.isArray(transform) && subTransformItem) {
            transformForArray(transform, subTransformItem)
          }
        })
        return entityKey
      }
      const key = parentsKey ? [parentsKey, entityKey].flat(1) : [entityKey].flat(1)
      const itemValue = (tempValues as any)[entityKey]
      const transformFunction = transformerMap.get(entityKey)?.transform

      const transform = () => {
        let tempKey,
          transformedResult,
          isTransformedResultPrimitive = false

        /**
         * 先判断是否是方法，是的话执行后拿到值，如果是基本类型，则认为是直接 transform 为新的值，
         * 如果返回是 Object 则认为是 transform 为新的 {newKey: newValue}
         */
        if (typeof transformFunction === 'function') {
          transformedResult = transformFunction?.(itemValue, entityKey, tempValues)
          const typeOfResult = typeof transformedResult
          if (typeOfResult !== 'object' && typeOfResult !== 'undefined') {
            tempKey = entityKey
            isTransformedResultPrimitive = true
          } else {
            tempKey = transformedResult
          }
        } else {
          tempKey = transformForArray(transformFunction, itemValue)
        }

        // { [key:string]:any } 数组也能通过编译
        if (Array.isArray(tempKey)) {
          result = set(result, tempKey, itemValue)
          return
        }
        if (typeof tempKey === 'object' && !Array.isArray(finalValues)) {
          finalValues = merge(finalValues, tempKey)
        } else if (typeof tempKey === 'object' && Array.isArray(finalValues)) {
          result = { ...result, ...tempKey }
        } else if (tempKey !== null || tempKey !== undefined) {
          result = set(
            result,
            [tempKey],
            isTransformedResultPrimitive ? transformedResult : itemValue,
          )
        }
      }

      /** 如果存在转化器提前渲染一下 */
      if (transformFunction && typeof transformFunction === 'function') {
        transform()
      }

      if (typeof window === 'undefined') return
      if (isPlainObj(itemValue)) {
        const genValues = gen(itemValue, key)
        if (Object.keys(genValues).length < 1) {
          return
        }
        result = set(result, [entityKey], genValues)
        return
      }
      transform()
    })
    return paramsOmitNil ? result : tempValues
  }

  finalValues =
    Array.isArray(values) && Array.isArray(finalValues)
      ? [...gen(values)]
      : merge({}, gen(values), finalValues)

  return finalValues as T
}

export const convertKeyInitialValue = <T extends object = any>(
  values: T,
  transformerMap: TransformerMapType,
) => {
  if (Object.keys(values).length < 1) {
    return values
  }

  const finalValues: any = {} as T
  Object.keys(values).forEach((entityKey) => {
    const itemValue = (values as any)[entityKey]
    const convertValueFunction = transformerMap.get(entityKey)?.convertValue
    if (typeof convertValueFunction === 'function') {
      const convertResult = convertValueFunction?.(itemValue, entityKey)
      finalValues[entityKey] = convertResult
    } else {
      finalValues[entityKey] = itemValue
    }
  })

  return finalValues
}

export function useAction({
  props,
  formRef,
  formData,
  initialValues,
  hasInitial,
  transformerMap,
  onFinish,
  onReset,
  onFinishFailed,
}: {
  props: ProFormProps
  formRef: Ref<FormInstance | undefined>
  formData: Ref<Entity>
  initialValues: ShallowRef<Entity>
  hasInitial: Ref<boolean>
  transformerMap: ShallowRef<TransformerMapType>
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
    const obj: any = {}
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
    return get(transformKeySubmitValue(obj, transformerMap.value, props.omitNil!), namePath)
  }

  const getFieldFormatValueObject = (name: NamePath) => {
    const namePath = covertFormName(name)
    if (!namePath) throw new Error('name is require')
    const value = get(formData.value, namePath)
    const obj = set({}, namePath, value)
    return transformKeySubmitValue(obj, transformerMap.value, props.omitNil!)
  }

  const validateFieldsReturnFormatValue = async (nameList?: NamePath[]) => {
    if (!Array.isArray(nameList) && nameList) throw new Error('nameList must be array')

    const values = await formRef.value?.validateFields(nameList)
    const transformedKey = transformKeySubmitValue(values!, transformerMap.value, props.omitNil!)
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
    formData.value = cloneDeep(convertKeyInitialValue(initialValues.value, transformerMap.value))
    Promise.resolve().then(() => {
      hasInitial.value = false
      onReset?.(transformKeySubmitValue(formData.value, transformerMap.value, props.omitNil))
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
