<!--
 * @Author: shen
 * @Date: 2025-05-22 09:08:36
 * @LastEditors: shen
 * @LastEditTime: 2025-08-27 10:42:50
 * @Description:
-->
<script setup lang="ts">
import type { ProConfigProviderProps } from './typing'

import { ConfigProvider, App } from 'ant-design-vue'
import { zhCNIntl } from './intl'
import ConfigProviderContainer from './config-provider-container.vue'

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
  ...rest
} = defineProps<Props>()

ConfigProvider.config({
  prefixCls: rest.prefixCls,
})
</script>

<template>
  <ConfigProvider v-bind="rest">
    <App>
      <ConfigProviderContainer :contentOffsetTop :intl :proPrefixCls :locale="rest.locale">
        <slot />
      </ConfigProviderContainer>
    </App>
  </ConfigProvider>
</template>
