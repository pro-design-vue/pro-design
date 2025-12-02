/*
 * @Author: shen
 * @Date: 2025-12-02 09:58:56
 * @LastEditors: shen
 * @LastEditTime: 2025-12-02 10:24:20
 * @Description:
 */
import { isEmpty, isObject, isNumber, isBoolean } from '@pro-design-vue/utils'

/**
 * 计算字符串字符的长度并可以截取字符串。
 * @param str 传入字符串
 * @param maxCharacter 规定最大字符串长度
 * @returns 当没有传入maxCharacter时返回字符串字符长度，当传入maxCharacter时返回截取之后的字符串和长度。
 */
function getCharacterLength(str: string): number
function getCharacterLength(
  str: string,
  maxCharacter?: number,
): { length: number; characters: string }
function getCharacterLength(str: string, maxCharacter?: number) {
  const hasMaxCharacter = isNumber(maxCharacter)
  if (!str || str.length === 0) {
    if (hasMaxCharacter) {
      return {
        length: 0,
        characters: str,
      }
    }
    return 0
  }
  let len = 0
  for (let i = 0; i < str.length; i++) {
    let currentStringLength = 0
    if (str.charCodeAt(i) > 127) {
      currentStringLength = 2
    } else {
      currentStringLength = 1
    }
    if (hasMaxCharacter && len + currentStringLength > maxCharacter) {
      return {
        length: len,
        characters: str.slice(0, i),
      }
    }
    len += currentStringLength
  }
  if (hasMaxCharacter) {
    return {
      length: len,
      characters: str,
    }
  }
  return len
}

// `{} / [] / '' / undefined / null` 等内容被认为是空； 0 和 false 被认为是正常数据，部分数据的值就是 0 或者 false
export function isValueEmpty(val: any): boolean {
  const type: string = Object.prototype.toString.call(val)
  const typeMap: Record<string, any> = {
    Date: '[object Date]',
  }
  if (type === typeMap.Date) {
    return false
  }
  return isObject(val) ? isEmpty(val) : ['', undefined, null].includes(val)
}

const VALIDATE_MAP = {
  required: (val: any): boolean => !isValueEmpty(val),
  whitespace: (val: any): boolean => !(/^\s+$/.test(val) || val === ''),
  boolean: (val: any): boolean => isBoolean(val),
  max: (val: any, num: number): boolean =>
    isNumber(val) ? val <= num : getCharacterLength(val) <= num,
  min: (val: any, num: number): boolean =>
    isNumber(val) ? val >= num : getCharacterLength(val) >= num,
  len: (val: any, num: number): boolean => getCharacterLength(String(val)) === num,
  number: (val: any): boolean => isNumber(val),
  enum: (val: any, strs: Array<string>): boolean => strs.includes(val),
  idcard: (val: any): boolean => /^(\d{18,18}|\d{15,15}|\d{17,17}x)$/i.test(val),
  telnumber: (val: any): boolean => /^1[3-9]\d{9}$/.test(val),
  pattern: (val: any, regexp: RegExp): boolean => regexp.test(val),
  // 自定义校验规则，可能是异步校验
  validator: (val: any, validate: any): ReturnType<any> => validate(val),
}

export type ValidateFuncType = (typeof VALIDATE_MAP)[keyof typeof VALIDATE_MAP]

/**
 * 校验某一条数据的某一条规则，一种校验规则不满足则不再进行校验。
 * @param value 值
 * @param rule 校验规则
 * @returns 两种校验结果，一种是内置校验规则的校验结果哦，二种是自定义校验规则（validator）的校验结果
 */
export async function validateOneRule(value: any, rule: any): Promise<any> {
  let validateResult: any = { result: true }
  const keys = Object.keys(rule) as (keyof any)[]
  let vOptions: undefined | any[keyof any]
  let vValidateFun: any
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]!
    // 非必填选项，值为空，非自定义规则：无需校验，直接返回 true
    if (!rule.required && isValueEmpty(value) && !rule.validator) {
      return validateResult
    }

    const validateRule: ValidateFuncType = VALIDATE_MAP[key as keyof typeof VALIDATE_MAP]
    // 找到一个校验规则，则无需再找，因为参数只允许对一个规则进行校验
    if (validateRule && (rule[key] || rule[key] === 0)) {
      // rule 值为 true 则表示没有校验参数，只是对值进行默认规则校验
      vOptions = rule[key] === true ? undefined : rule[key]
      vValidateFun = validateRule
      break
    }
  }
  if (vValidateFun) {
    // @ts-ignore
    validateResult = await vValidateFun(value, vOptions)
    // 如果校验不通过，则返回校验不通过的规则
    if (isBoolean(validateResult)) {
      return { ...rule, result: validateResult }
    }
    // 校验结果为 CustomValidateObj，只有自定义校验规则会存在这种情况
    if (isObject(validateResult)) {
      return validateResult
    }
  }
  return validateResult
}

// 单个数据进行全规则校验，校验成功也可能会有 message
export async function validate(value: any, rules: Array<any>): Promise<any[]> {
  const all = rules.map((rule) => validateOneRule(value, rule))
  const r = await Promise.all(all)
  return r
}
