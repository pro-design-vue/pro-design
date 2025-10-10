<!--
 * @Author: shen
 * @Date: 2025-05-22 09:08:36
 * @LastEditors: shen
 * @LastEditTime: 2025-10-10 15:05:21
 * @Description:
-->
<script setup lang="ts">
import type { ProConfigProviderProps } from './typing'

import { ConfigProvider, App } from 'ant-design-vue'
import { DEFAULT_LOCALE } from '@pro-design-vue/constants'
import { zhCNIntl } from './intl'
import dayjs from 'dayjs'
import ConfigProviderContainer from './config-provider-container.vue'
import antdDefaultLocale from 'ant-design-vue/es/locale/zh_CN.js'

interface Props extends ProConfigProviderProps {}

defineOptions({
  name: 'ProConfigProvider',
})

const {
  intl = {
    ...zhCNIntl,
    locale: 'default',
  },
  pro,
  proPrefixCls = 'pro',
  locale = antdDefaultLocale,
  ...rest
} = defineProps<Props>()
// 默认国际化为zh-cn
if (locale.locale === DEFAULT_LOCALE.toLocaleLowerCase()) {
  import('dayjs/locale/zh-cn.js').then((value) => {
    dayjs.locale(value)
  })
}
ConfigProvider.config({
  prefixCls: rest.prefixCls,
})
</script>

<template>
  <ConfigProvider v-bind="rest" :locale="locale">
    <App>
      <ConfigProviderContainer :contentOffsetTop :intl :proPrefixCls :pro :locale="locale">
        <slot />
      </ConfigProviderContainer>
    </App>
  </ConfigProvider>
</template>
