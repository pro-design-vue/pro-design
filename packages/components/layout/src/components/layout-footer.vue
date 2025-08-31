<!--
 * @Author: shen
 * @Date: 2025-06-16 11:01:47
 * @LastEditors: shen
 * @LastEditTime: 2025-08-27 13:22:54
 * @Description:
-->
<script setup lang="ts">
import { usePrefixCls } from '@pro-design-vue/hooks'
import type { CSSProperties } from 'vue'

import { computed } from 'vue'

interface Props {
  /**
   * 是否固定在底部
   */
  fixed?: boolean
  height: number
  /**
   * 是否显示
   * @default true
   */
  show?: boolean
  width: string
  zIndex: number
}

const props = withDefaults(defineProps<Props>(), {
  show: true,
})
const prefixCls = usePrefixCls('layout-footer')

const style = computed((): CSSProperties => {
  const { fixed, height, show, width, zIndex } = props
  return {
    height: `${height}px`,
    marginBottom: show ? '0' : `-${height}px`,
    position: fixed ? 'fixed' : 'static',
    width,
    zIndex,
  }
})
</script>

<template>
  <footer :style="style" :class="prefixCls">
    <slot></slot>
  </footer>
</template>
