<script setup lang="ts">
import { ProIcon } from 'pro-design-vue'
import { HomeOutlined } from '@ant-design/icons-vue'
</script>

<template>
  <div style="display: flex; gap: 16px; align-items: center">
    <!-- 组件图标 -->
    <ProIcon :icon="HomeOutlined" style="font-size: 24px; color: #1677ff" />
    <!-- class 类名图标 -->
    <ProIcon icon="home" style="font-size: 24px; color: #52c41a" />
    <!-- 远程图片图标 -->
    <ProIcon
      icon="https://pro-design.shene.org.cn/logo_small.png"
      style="width: 24px; height: 24px"
    />
    <!-- 插槽方式 -->
    <ProIcon style="font-size: 24px; color: #faad14">
      <template #component="svgProps">
        <svg viewBox="0 0 24 24" width="1em" height="1em" v-bind="svgProps">
          <path
            fill="currentColor"
            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
          />
        </svg>
      </template>
    </ProIcon>
    <!-- fallback 默认图标 -->
    <ProIcon fallback style="font-size: 24px" />
  </div>
</template>
