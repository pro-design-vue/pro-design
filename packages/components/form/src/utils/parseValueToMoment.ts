/*
 * @Author: shen
 * @Date: 2023-09-01 09:30:50
 * @LastEditors: shen
 * @LastEditTime: 2025-09-12 11:19:37
 * @Description:
 */
import { isNil } from '@pro-design-vue/utils'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat.js'

dayjs.extend(customParseFormat)

type DateValue = dayjs.Dayjs | dayjs.Dayjs[] | string | string[] | number | number[]

/**
 * 一个比较hack的moment判断工具
 * @param value
 * @returns
 */
const isMoment = (value: any) => !!value?._isAMomentObject

const parseValueToDay = (
  value: DateValue,
  formatter?: string,
): dayjs.Dayjs | dayjs.Dayjs[] | null | undefined => {
  if (isNil(value) || dayjs.isDayjs(value) || isMoment(value)) {
    if (isMoment(value)) {
      return dayjs(value as dayjs.Dayjs)
    }
    return value as dayjs.Dayjs | null | undefined
  }
  if (Array.isArray(value)) {
    return (value as any[]).map((v) => parseValueToDay(v, formatter) as dayjs.Dayjs)
  }
  if (typeof value === 'number') return dayjs(value)
  return dayjs(value, formatter)
}

export default parseValueToDay
