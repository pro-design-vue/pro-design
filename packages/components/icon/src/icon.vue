<!--
 * @Author: shen
 * @Date: 2025-06-16 15:21:45
 * @LastEditors: shen
 * @LastEditTime: 2025-08-27 15:53:05
 * @Description:
-->
<script setup lang="ts">
import type { Component } from 'vue'

import { computed } from 'vue'
import { isFunction, isHttpUrl, isObject, isString } from '@pro-design-vue/utils'
import Icon from '@ant-design/icons-vue'

const props = defineProps<{
  // 没有是否显示默认图标
  fallback?: boolean
  icon?: Component | (() => void) | string
}>()

const isRemoteIcon = computed(() => {
  return isString(props.icon) && isHttpUrl(props.icon)
})

const isComponent = computed(() => {
  const { icon } = props
  return !isString(icon) && (isObject(icon) || isFunction(icon))
})
</script>

<template>
  <component :is="icon as Component" v-if="isComponent" v-bind="$attrs" />
  <img v-else-if="isRemoteIcon" :src="icon as string" v-bind="$attrs" />
  <Icon v-else-if="fallback" v-bind="$attrs">
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
  </Icon>
</template>
