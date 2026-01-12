/*
 * @Author: shen
 * @Date: 2026-01-07 09:16:56
 * @LastEditors: shen
 * @LastEditTime: 2026-01-12 16:42:09
 * @Description:
 */

import { get, set, type Entity, type ProFormInstance } from '@pro-design-vue/utils'
import { shallowRef, type Ref, type ShallowRef } from 'vue'
import type { BaseFormProps } from '../type'
import type { FormInstance } from 'ant-design-vue'
import type { NamePath } from 'ant-design-vue/es/form/interface'
import type { FormStore } from './useFormStore'
import { getNamePath } from '../utils/getNamePath'

export function useFormInstance({
  props,
  formRef,
  transformKey,
  store,
  onFinish,
}: {
  props: BaseFormProps
  store: FormStore
  formRef: Ref<FormInstance | undefined>
  onFinish: BaseFormProps['onFinish']
  transformKey: (values: any, paramsOmitNil?: boolean, parentKey?: NamePath) => any
}) {
  /**
   * 获取被 ProForm 格式化后的所有数据
   * @param allData boolean
   * @returns T
   *
   * @example  getFieldsFormatValue(true) ->返回所有数据，即使没有被 form 托管的
   */
  const getFieldsFormatValue = (allData?: true) => {
    return transformKey(store.getFieldsValue(allData!), props.omitNil!)
  }
  /**
   * 获取被 ProForm 格式化后的单个数据
   * @param name (string|number)[]
   * @returns T
   *
   * @example {a:{b:value}} -> getFieldFormatValue(['a', 'b']) -> value
   */
  /** 获取格式化之后的单个数据 */
  const getFieldFormatValue = (name: NamePath = []) => {
    const nameList = getNamePath(name)
    if (!nameList) throw new Error('nameList is require')
    const value = store.getFieldValue(nameList!)
    const obj = nameList ? set({}, nameList as string[], value) : value
    //transformKey会将keys重新和nameList拼接，所以这里要将nameList的首个元素弹出
    const newNameList = [...nameList]
    newNameList.shift()
    return get(transformKey(obj, props.omitNil, newNameList), nameList as string[])
  }
  /**
   * 获取被 ProForm 格式化后的单个数据, 包含他的 name
   * @param name (string|number)[]
   * @returns T
   *
   * @example  {a:{b:value}} -> getFieldFormatValueObject(['a', 'b']) -> {a:{b:value}}
   */
  /** 获取格式化之后的单个数据 */
  const getFieldFormatValueObject = (name?: NamePath) => {
    const nameList = getNamePath(name)
    const value = store.getFieldValue(nameList!)
    const obj = nameList ? set({}, nameList as string[], value) : value
    return transformKey(obj, props.omitNil, nameList)
  }
  /**
   *验字段后返回格式化之后的所有数据
   * @param nameList (string|number)[]
   * @returns T
   *
   * @example validateFieldsReturnFormatValue -> {a:{b:value}}
   */
  const validateFieldsReturnFormatValue = async (nameList?: NamePath[]) => {
    if (!Array.isArray(nameList) && nameList) throw new Error('nameList must be array')

    const values = await formRef.value?.validateFields(nameList)
    const transformedKey = transformKey(values, props.omitNil)
    return transformedKey ? transformedKey : {}
  }

  const getFieldValue = (name: NamePath) => {
    return store.getFieldValue(name)
  }

  const getFieldsValue = (name: NamePath[] | true) => {
    return store.getFieldsValue(name)
  }

  const validateFields = (nameList?: NamePath[]) => {
    return formRef.value?.validateFields(nameList)
  }

  const resetFields = (name?: NamePath) => {
    store.resetFields(name)
    formRef.value?.clearValidate(name)
  }

  const submit = () => {
    validateFields()
      ?.then((values) => {
        if (onFinish) {
          try {
            onFinish(values)
          } catch (err) {
            console.error(err)
          }
        }
      })
      .catch((e) => {
        if (props.onFinishFailed) {
          props.onFinishFailed(e)
        }
      })
  }

  return {
    getFieldsFormatValue,
    getFieldFormatValue,
    getFieldFormatValueObject,
    validateFieldsReturnFormatValue,
    getFieldValue,
    getFieldsValue,
    validateFields,
    resetFields,
    submit,
  } as ProFormInstance
}
