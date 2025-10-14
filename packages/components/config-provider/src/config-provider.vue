<!--
 * @Author: shen
 * @Date: 2025-05-22 09:08:36
 * @LastEditors: shen
 * @LastEditTime: 2025-10-14 14:42:11
 * @Description:
-->
<script setup lang="ts">
import type { ProConfigProviderProps } from './typing'
import { ConfigProvider, App, theme as antTheme } from 'ant-design-vue'
import { DEFAULT_LOCALE } from '@pro-design-vue/constants'
import { zhCNIntl } from './intl'
import { computed, nextTick, watch } from 'vue'
import { isArray, omit } from '@pro-design-vue/utils'
import dayjs from 'dayjs'
import ConfigProviderContainer from './config-provider-container.vue'
import antdDefaultLocale from 'ant-design-vue/es/locale/zh_CN.js'
import { defaultToken } from './defaultToken'

interface Props extends ProConfigProviderProps {}

defineOptions({
  name: 'ProConfigProvider',
})

const {
  intl = {
    ...zhCNIntl,
    locale: 'default',
  },
  proPrefixCls = 'pro',
  dark = false,
  compact = false,
  token,
  locale = antdDefaultLocale,
  theme,
  table,
  drawer,
  modal,
  form,
  app,
  prefixCls = 'ant',
  componentSize,
  ...rest
} = defineProps<Props>()
// 默认国际化为zh-cn
if (locale.locale === DEFAULT_LOCALE.toLocaleLowerCase()) {
  import('dayjs/locale/zh-cn.js').then((value) => {
    dayjs.locale(value)
  })
}

const mergerTheme = computed(() => {
  const algorithm = dark ? [antTheme.darkAlgorithm] : [antTheme.defaultAlgorithm]
  if (compact) {
    algorithm.push(antTheme.compactAlgorithm)
  }

  if (theme?.algorithm) {
    if (isArray(theme?.algorithm)) {
      algorithm.push(...theme?.algorithm)
    } else {
      algorithm.push(theme?.algorithm)
    }
  }

  return {
    ...theme,
    algorithm,
    token: {
      ...defaultToken,
      ...theme?.token,
      ...token,
    },
  }
})

watch(
  () => dark,
  async () => {
    await nextTick()
    const root = document.documentElement
    root.classList.toggle('dark', dark)
  },
  {
    immediate: true,
  },
)
ConfigProvider.config({
  prefixCls,
})
</script>

<template>
  <ConfigProvider
    v-bind="rest"
    :locale
    :prefixCls
    :theme="mergerTheme"
    :componentSize
    :form="
      omit(form ?? {}, ['resetOnSubmit', 'labelWidth', 'resetText', 'searchText', 'labelWidth'])
    "
  >
    <App v-bind="app">
      <ConfigProviderContainer
        :contentOffsetTop
        :intl
        :dark
        :proPrefixCls
        :table
        :form
        :locale
        :drawer
        :modal
        :prefixCls
        :componentSize
      >
        <slot />
      </ConfigProviderContainer>
    </App>
  </ConfigProvider>
</template>
