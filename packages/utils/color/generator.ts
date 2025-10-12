/*
 * @Author: shen
 * @Date: 2025-05-10 22:33:31
 * @LastEditors: shen
 * @LastEditTime: 2025-10-12 11:04:00
 * @Description:
 */
import { getColors } from 'theme-colors'

import { convertToHslCssVar, TinyColor } from './convert'

interface ColorItem {
  alias?: string
  color: string
  name: string
  key: string
}

function generatorColorVariables(colorItems: ColorItem[], namespace?: string) {
  const colorVariables: Record<string, string> = {}

  colorItems.forEach(({ alias, color, name }) => {
    if (color) {
      const colorsMap = getColors(new TinyColor(color).toHexString())

      let mainColor = colorsMap['500']

      const colorKeys = Object.keys(colorsMap)

      colorKeys.forEach((key) => {
        const colorValue = colorsMap[key]

        if (colorValue) {
          const hslColor = convertToHslCssVar(colorValue)
          colorVariables[`--${namespace}-${name}-${key}`] = hslColor
          if (alias) {
            colorVariables[`--${namespace}-${alias}-${key}`] = hslColor
          }

          if (key === '500') {
            mainColor = hslColor
          }
        }
      })
      if (alias && mainColor) {
        colorVariables[`--${namespace}-${alias}`] = mainColor
      }
    }
  })
  return colorVariables
}

export { generatorColorVariables }
