<!--
 * @Author: shen
 * @Date: 2025-08-27 13:11:33
 * @LastEditors: shen
 * @LastEditTime: 2025-08-27 15:55:31
 * @Description: 
-->
<template>
  <icon>
    <template #component="svgProps">
      <svg viewBox="0 0 24 24" width="1em" height="1em" v-bind="svgProps">
        <path
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M4 12h16"
        />
        <path
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M4 18h16"
        />
        <path
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M4 6h16"
        />
      </svg>
    </template>
  </icon>
</template>

<script setup lang="ts">
import Icon from '@ant-design/icons-vue'
</script>
