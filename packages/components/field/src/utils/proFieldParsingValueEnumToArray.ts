/*
 * @Author: shen
 * @Date: 2025-12-23 10:46:09
 * @LastEditors: shen
 * @LastEditTime: 2026-01-06 14:49:27
 * @Description:
 */
import type { ProFieldValueEnumType, RequestOptionsType } from '@pro-design-vue/utils'
import type { SelectOptionType } from '../type'
import { objectToMap } from './objectToMap'

/**
 * 把 value 的枚举转化为数组
 *
 * @param valueEnum
 */
export const proFieldParsingValueEnumToArray = (
  valueEnumParams: ProFieldValueEnumType,
): SelectOptionType => {
  const enumArray: Partial<
    RequestOptionsType & {
      text: string
      /** 是否禁用 */
      disabled?: boolean
    }
  >[] = []
  const valueEnum = objectToMap(valueEnumParams)

  valueEnum.forEach((_, key) => {
    const value = (valueEnum.get(key) || valueEnum.get(`${key}`)) as {
      text: string
      disabled?: boolean
    }

    if (!value) {
      return
    }

    if (typeof value === 'object' && value?.text) {
      enumArray.push({
        text: value?.text as unknown as string,
        value: key,
        label: value?.text as unknown as string,
        disabled: value.disabled,
      })
      return
    }
    enumArray.push({
      text: value as unknown as string,
      value: key,
    })
  })
  return enumArray
}
