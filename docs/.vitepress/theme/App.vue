<!--
 * @Author: shen
 * @Date: 2025-09-06 11:17:01
 * @LastEditors: shen
 * @LastEditTime: 2025-11-25 08:47:14
 * @Description:
-->
<script setup lang="ts">
import { ProConfigProvider } from 'pro-design-vue'
import { useData } from 'vitepress'
import DefaultTheme from 'vitepress/theme'

const { Layout } = DefaultTheme
const { isDark } = useData()

const getPopupContainer = (triggerNode?: HTMLElement) => {
  return (triggerNode?.parentNode || document.body) as HTMLElement
}
</script>

<template>
  <ClientOnly>
    <ProConfigProvider
      :dark="isDark"
      :getPopupContainer
      :token="{
        colorPrimary: 'hsl(212 100% 45%)',
      }"
    >
      <Layout />
    </ProConfigProvider>
  </ClientOnly>
</template>
