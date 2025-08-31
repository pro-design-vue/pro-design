<!--
 * @Author: shen
 * @Date: 2025-08-27 13:11:33
 * @LastEditors: shen
 * @LastEditTime: 2025-08-27 15:51:38
 * @Description: 
-->
<template>
  <icon>
    <template #component="svgProps">
      <svg viewBox="0 0 24 24" width="1em" height="1em" v-bind="svgProps">
        <path
          stroke="currentColor"
          fill="none"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          d="m6 17 5-5-5-5"
        />
        <path
          stroke="currentColor"
          fill="none"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          d="m13 17 5-5-5-5"
        />
      </svg>
    </template>
  </icon>
</template>

<script setup lang="ts">
import Icon from '@ant-design/icons-vue'
</script>
