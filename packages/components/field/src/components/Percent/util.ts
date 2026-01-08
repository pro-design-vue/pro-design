/*
 * @Author: shen
 * @Date: 2025-12-29 09:06:22
 * @LastEditors: shen
 * @LastEditTime: 2026-01-05 15:55:39
 * @Description:
 */
/** 获取展示符号 */
export function getSymbolByRealValue(realValue: number) {
  if (realValue === 0) {
    return null
  }
  if (realValue > 0) {
    return '+'
  }
  return '-'
}

/** 获取颜色 */
export function getColorByRealValue(realValue: number /** ,color: string */) {
  if (realValue === 0) {
    return ''
  }
  return realValue > 0 ? '#52c41a' : '#ff4d4f'
}

/** 获取到最后展示的数字 */
export function getRealTextWithPrecision(realValue: number, precision: number = 2) {
  return precision >= 0 ? realValue?.toFixed(precision) : realValue
}

/**
 * 转化为数字
 */
export function toNumber(value: any): number {
  if (typeof value === 'symbol' || value instanceof Symbol) {
    return NaN
  }

  return Number(value)
}
