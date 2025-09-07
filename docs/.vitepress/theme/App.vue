<!--
 * @Author: shen
 * @Date: 2025-09-06 11:17:01
 * @LastEditors: shen
 * @LastEditTime: 2025-09-07 23:28:05
 * @Description:
-->
<script setup lang="ts">
import { ProConfigProvider } from 'pro-design-vue'
import DefaultTheme from 'vitepress/theme'
import antdDefaultLocale from 'ant-design-vue/es/locale/zh_CN'
const { Layout } = DefaultTheme
</script>

<template>
  <ProConfigProvider :locale="antdDefaultLocale">
    <Layout />
  </ProConfigProvider>
</template>
