<!--
 * @Author: shen
 * @Date: 2025-09-06 11:17:01
 * @LastEditors: shen
 * @LastEditTime: 2025-09-12 10:44:47
 * @Description:
-->
<script setup lang="ts">
import { ConfigProvider } from 'ant-design-vue'
import DefaultTheme from 'vitepress/theme'
import antdDefaultLocale from 'ant-design-vue/es/locale/zh_CN'
const { Layout } = DefaultTheme
</script>

<template>
  <ConfigProvider :locale="antdDefaultLocale">
    <Layout />
  </ConfigProvider>
</template>
