/*
 * @Author: shen
 * @Date: 2023-11-01 13:16:05
 * @LastEditors: shen
 * @LastEditTime: 2023-11-11 12:37:15
 * @Description:
 */
import { shallowRef } from 'vue'

type ThemeType = 'light' | 'dark'

export const animateRows = shallowRef(true)
export const theme = shallowRef<ThemeType>('light')
export const primaryColor = shallowRef('#1677ff')

export const setConfig = (config: {
  animateRows?: boolean
  theme?: ThemeType
  primaryColor?: string
  prefixCls?: string
}) => {
  if (config.animateRows !== undefined) {
    animateRows.value = config.animateRows
  }

  if (config.theme !== undefined) {
    theme.value = config.theme
  }

  if (config.primaryColor !== undefined) {
    primaryColor.value = config.primaryColor
  }
}
