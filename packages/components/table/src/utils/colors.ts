/*
 * @Author: shen
 * @Date: 2023-11-01 17:01:38
 * @LastEditors: shen
 * @LastEditTime: 2025-08-29 14:31:22
 * @Description:
 */
import { generate } from '@ant-design/colors'

export interface ColorMap {
  1: string
  2: string
  3: string
  4: string
  5: string
  6: string
  7: string
  8: string
  9: string
  10: string
}
interface Opts {
  theme?: 'dark' | 'default'
  backgroundColor?: string
}
export type GenerateColorMap = (baseColor: string, opts?: Opts) => ColorMap
export const generateColorPalettes: GenerateColorMap = (baseColor: string, opts?: Opts) => {
  const colors = generate(baseColor, opts)
  return {
    1: colors[0]!,
    2: colors[1]!,
    3: colors[2]!,
    4: colors[3]!,
    5: colors[4]!,
    6: colors[5]!,
    7: colors[6]!,
    8: colors[4]!,
    9: colors[5]!,
    10: colors[6]!,
  }
}
