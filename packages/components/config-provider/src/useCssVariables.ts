/*
 * @Author: shen
 * @Date: 2025-06-06 09:26:03
 * @LastEditors: shen
 * @LastEditTime: 2025-10-16 19:25:14
 * @Description:
 */
import { theme } from 'ant-design-vue'
import { watch, type ComputedRef } from 'vue'
import { DEFAULT_NAMESPACE } from '@pro-design-vue/constants'
import { generatorColorVariables } from '@pro-design-vue/utils'
import { updateCSSVariables } from './update-css-variables'
import { defaultDarkToken, defaultToken } from './defaultToken'

// 缓存色盘计算结果，避免相同颜色重复执行 getColors() 等 CPU 密集操作
const colorVariablesCache = new Map<string, Record<string, string>>()

function getCacheKey(color: string, dark: boolean): string {
  return `${color}:${dark}`
}

function cachedGeneratorColorVariables(
  colorItems: Array<{ alias: string; color: string; name: string; key: string }>,
  dark: boolean,
  namespace: string,
): Record<string, string> {
  const result: Record<string, string> = {}

  for (const item of colorItems) {
    const cacheKey = getCacheKey(item.color, dark)
    if (colorVariablesCache.has(cacheKey)) {
      // 使用缓存的色盘结果，按 key 过滤
      const cached = colorVariablesCache.get(cacheKey)!
      for (const [varName, value] of Object.entries(cached)) {
        if (varName.includes(`--${namespace}-${item.name}-`)) {
          result[varName] = value
        }
        if (
          item.alias &&
          item.alias !== item.name &&
          varName.includes(`--${namespace}-${item.alias}-`)
        ) {
          result[varName] = value
        }
        // alias 主色（如 --pro-primary）
        if (item.alias && varName === `--${namespace}-${item.alias}`) {
          result[varName] = value
        }
      }
    } else {
      const generated = generatorColorVariables([item], dark, namespace)
      colorVariablesCache.set(cacheKey, generated)
      Object.assign(result, generated)
    }
  }

  return result
}

export function useCssVariables(isDark: ComputedRef<boolean>) {
  const { useToken } = theme
  const { token } = useToken()

  watch(
    [token, isDark],
    ([newToken, dark], [oldToken]) => {
      const changedColorVariables = [
        { alias: 'primary', color: newToken.colorPrimary, name: 'primary', key: 'colorPrimary' },
        { alias: 'warning', color: newToken.colorWarning, name: 'yellow', key: 'colorWarning' },
        { alias: 'success', color: newToken.colorSuccess, name: 'green', key: 'colorSuccess' },
        { alias: 'error', color: newToken.colorError, name: 'red', key: 'colorError' },
      ].filter((item) => {
        const defaultColor = dark ? defaultDarkToken[item.key] : defaultToken[item.key]
        const oldColor = oldToken?.[item.key] || defaultColor
        return (
          newToken[item.key] !== defaultColor ||
          (newToken[item.key] === defaultColor && oldColor !== defaultColor)
        )
      })
      const colorVariables = cachedGeneratorColorVariables(
        changedColorVariables,
        false,
        DEFAULT_NAMESPACE,
      )
      const darkColorVariables = cachedGeneratorColorVariables(
        changedColorVariables,
        true,
        DEFAULT_NAMESPACE,
      )
      // 要设置的 CSS 变量映射
      const colorMappings = {
        [`--${DEFAULT_NAMESPACE}-green-500`]: `--${DEFAULT_NAMESPACE}-success`,
        [`--${DEFAULT_NAMESPACE}-primary-500`]: `--${DEFAULT_NAMESPACE}-primary`,
        [`--${DEFAULT_NAMESPACE}-red-500`]: `--${DEFAULT_NAMESPACE}-error`,
        [`--${DEFAULT_NAMESPACE}-yellow-500`]: `--${DEFAULT_NAMESPACE}-warning`,
      }

      Object.entries(colorMappings).forEach(([sourceVar, targetVar]) => {
        const colorValue = colorVariables[sourceVar]
        if (colorValue) {
          document.documentElement.style.setProperty(targetVar, colorValue)
        }
      })

      updateCSSVariables(colorVariables)

      updateCSSVariables(
        darkColorVariables,
        ".dark, .dark[data-theme='custom'], .dark[data-theme='default']",
        '__pro-dark-styles__',
      )

      if (defaultToken.borderRadius !== newToken.borderRadius) {
        document.documentElement.style.setProperty(
          `--${DEFAULT_NAMESPACE}-radius`,
          `${newToken.borderRadius}px`,
        )
      }
    },
    {
      immediate: true,
    },
  )
}
