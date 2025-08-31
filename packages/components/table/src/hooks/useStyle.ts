/*
 * @Author: shen
 * @Date: 2023-11-01 14:44:13
 * @LastEditors: shen
 * @LastEditTime: 2025-08-29 14:28:43
 * @Description:
 */
import { watch } from 'vue'
import { generateColorPalettes } from '../utils/colors'
import canUseDom from '../utils/canUseDom'

import type { Ref } from 'vue'

const styleMap = new Map()

export const useStyle = (
  primaryColor: Ref<string>,
  mergedPrefixCls: Ref<string>,
  theme: Ref<'light' | 'dark'>,
) => {
  const removeOldDom = (value: string) => {
    if (!canUseDom()) {
      return
    }

    document.querySelectorAll(`style[data-key="${value}"]`).forEach((dom) => {
      dom.parentNode?.removeChild(dom)
    })
  }

  const setCssVars = (key: string, colorVarsMap: Record<string, string>) => {
    if (!canUseDom()) {
      return
    }
    const style = document.createElement('style')
    style.innerHTML =
      'html:root{' +
      Object.keys(colorVarsMap)
        .map((varKey) => `${varKey}: ${colorVarsMap[varKey]};`)
        .join('') +
      '}'
    style.setAttribute('data-key', key)
    document.head.appendChild(style)
  }

  watch(
    [primaryColor, mergedPrefixCls, theme],
    (_, [oldPrimaryColor, oldPrefixCls, oldTheme]) => {
      if (oldPrimaryColor && oldPrefixCls && oldTheme) {
        const key = `${oldPrefixCls}-${oldPrimaryColor}-${oldTheme}`
        const value = styleMap.get(key)
        if (value === 1) {
          removeOldDom(value)
          styleMap.delete(key)
        } else {
          styleMap.set(key, value - 1)
        }
      }
      if (canUseDom()) {
        document.getElementsByTagName('html')[0]?.setAttribute('data-theme', theme.value)
      }

      const key = `${mergedPrefixCls.value}-${primaryColor.value}-${theme.value}`
      if (styleMap.has(key)) {
        styleMap.set(key, styleMap.get(key) + 1)
      } else {
        styleMap.set(key, 1)
        const colorVarsMap = {
          [`--${mergedPrefixCls.value}-primary-color`]: primaryColor.value || '#1677ff',
        }
        const colors = generateColorPalettes(primaryColor.value || '#1677ff', {
          theme: 'dark' === theme.value ? 'dark' : 'default',
        })

        Array(10)
          .fill(0)
          .forEach((_, index) => {
            colorVarsMap[`--${mergedPrefixCls.value}-primary-color-${index + 1}`] =
              colors[index + 1]
          })
        setCssVars(key, colorVarsMap)
      }
    },
    { immediate: true },
  )
}
