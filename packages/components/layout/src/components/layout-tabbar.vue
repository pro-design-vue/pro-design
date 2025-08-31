<!--
 * @Author: shen
 * @Date: 2025-06-16 10:56:44
 * @LastEditors: shen
 * @LastEditTime: 2025-08-27 11:30:52
 * @Description:
-->
<script setup lang="ts">
import { usePrefixCls } from '@pro-design-vue/hooks'
import type { CSSProperties } from 'vue'

import { computed } from 'vue'

interface Props {
  /**
   * 高度
   */
  height: number
}

const props = withDefaults(defineProps<Props>(), {})
const prefixCls = usePrefixCls('layout-tabbar')
const style = computed((): CSSProperties => {
  const { height } = props
  return {
    height: `${height}px`,
  }
})
</script>

<template>
  <section :style="style" :class="prefixCls">
    <slot></slot>
  </section>
</template>
