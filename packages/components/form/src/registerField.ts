/*
 * @Author: shen
 * @Date: 2023-08-17 11:15:59
 * @LastEditors: shen
 * @LastEditTime: 2025-07-26 11:42:22
 * @Description:
 */
import { isString, kebabCase } from '@pro-design-vue/utils'
import { fieldComponentMap } from './fieldMap'

export const registerField = (customFieldType: string, fieldComponent: any) => {
  if (!isString(customFieldType)) {
    return
  }
  const fieldType = kebabCase(customFieldType)
  const isExist = fieldComponentMap[fieldType]
  if (!isExist) {
    fieldComponentMap[fieldType] = fieldComponent
  }
}
