<!--
 * @Author: shen
 * @Date: 2025-09-06 11:17:01
 * @LastEditors: shen
 * @LastEditTime: 2025-09-12 14:24:58
 * @Description:
-->
<script setup lang="ts">
import { computed } from 'vue'
import { ConfigProvider, theme } from 'ant-design-vue'
import { useData } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import antdDefaultLocale from 'ant-design-vue/es/locale/zh_CN'

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
  <ConfigProvider :locale="antdDefaultLocale" :theme="tokenTheme">
    <Layout />
  </ConfigProvider>
</template>
