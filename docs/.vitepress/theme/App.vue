<!--
 * @Author: shen
 * @Date: 2025-09-06 11:17:01
 * @LastEditors: shen
 * @LastEditTime: 2025-10-10 16:25:17
 * @Description:
-->
<script setup lang="ts">
import { computed } from 'vue'
import { theme } from 'ant-design-vue'
import { ProConfigProvider } from 'pro-design-vue'
import { useData } from 'vitepress'
import DefaultTheme from 'vitepress/theme'

const { Layout } = DefaultTheme
const { isDark } = useData()
const tokenTheme = computed(() => {
  return {
    token: {
      colorPrimary: 'hsl(212 100% 45%)',
    },
    // 暗黑模式isDark的时候使用darkAlgorithm算法
    algorithm: isDark.value ? theme.darkAlgorithm : theme.defaultAlgorithm,
  }
})
</script>

<template>
  <ClientOnly>
    <ProConfigProvider :theme="tokenTheme">
      <Layout />
    </ProConfigProvider>
  </ClientOnly>
</template>
