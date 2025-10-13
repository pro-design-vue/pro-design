/*
 * @Author: shen
 * @Date: 2025-06-06 09:26:03
 * @LastEditors: shen
 * @LastEditTime: 2025-10-13 10:52:04
 * @Description:
 */
import { theme } from 'ant-design-vue'
import { watch, type ComputedRef } from 'vue'
import { DEFAULT_NAMESPACE } from '@pro-design-vue/constants'
import { generatorColorVariables } from '@pro-design-vue/utils'
import { updateCSSVariables } from './update-css-variables'
import { defaultDarkToken, defaultToken } from './defaultToken'

export function useCssVariables(isDark: ComputedRef<boolean>) {
  const { useToken } = theme
  const { token } = useToken()

  watch(
    [token, isDark],
    ([newToken, dark], [oldToken]) => {
      const colorVariables = generatorColorVariables(
        [
          { color: newToken.colorPrimary, name: 'primary', key: 'colorPrimary' },
          { alias: 'warning', color: newToken.colorWarning, name: 'yellow', key: 'colorWarning' },
          { alias: 'success', color: newToken.colorSuccess, name: 'green', key: 'colorSuccess' },
          { alias: 'error', color: newToken.colorError, name: 'red', key: 'colorError' },
        ].filter((item) => {
          const defaultColor = dark ? defaultDarkToken[item.key] : defaultToken[item.key]
          return newToken[item.key] !== defaultColor && oldToken?.[item.key] !== defaultColor
        }),
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
