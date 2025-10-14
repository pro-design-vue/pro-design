<!--
 * @Author: shen
 * @Date: 2025-09-06 11:17:01
 * @LastEditors: shen
 * @LastEditTime: 2025-10-14 14:38:53
 * @Description:
-->
<script setup lang="ts">
import { ProConfigProvider } from 'pro-design-vue'
import { useData } from 'vitepress'
import DefaultTheme from 'vitepress/theme'

const { Layout } = DefaultTheme
const { isDark } = useData()
</script>

<template>
  <ClientOnly>
    <ProConfigProvider
      :dark="isDark"
      :token="{
        colorPrimary: 'hsl(212 100% 45%)',
      }"
    >
      <Layout />
    </ProConfigProvider>
  </ClientOnly>
</template>
