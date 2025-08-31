<!--
 * @Author: shen
 * @Date: 2025-07-17 10:11:59
 * @LastEditors: shen
 * @LastEditTime: 2025-08-27 15:23:33
 * @Description:
-->
<script setup lang="ts">
import { RouterView } from 'vue-router'
import { ProConfigProvider, ProLayout } from '@pro-design-vue/components'
// import antdEnLocale from 'ant-design-vue/es/locale/en_US'
import antdDefaultLocale from 'ant-design-vue/es/locale/zh_CN'
</script>

<template>
  <ProConfigProvider pro-prefix-cls="pro1" prefix-cls="pro-ant" :locale="antdDefaultLocale">
    <ProLayout>
      <template #content>
        <RouterView />
      </template>
    </ProLayout>
  </ProConfigProvider>
</template>
