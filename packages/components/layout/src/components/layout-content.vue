<!--
 * @Author: shen
 * @Date: 2025-06-11 11:06:43
 * @LastEditors: shen
 * @LastEditTime: 2025-08-27 13:22:15
 * @Description:
-->
<script setup lang="ts">
import type { CSSProperties } from 'vue'
import type { ContentCompactType } from '../typing'

import { ProSlot } from '@pro-design-vue/components/slot'
import { computed } from 'vue'
import { useLayoutContentStyle } from '../hooks/use-layout-style'
import { usePrefixCls } from '@pro-design-vue/hooks'
interface Props {
  /**
   * 内容区域定宽
   */
  contentCompact: ContentCompactType
  /**
   * 定宽布局宽度
   */
  contentCompactWidth: number
  padding: number
  paddingBottom: number
  paddingLeft: number
  paddingRight: number
  paddingTop: number
}

const props = withDefaults(defineProps<Props>(), {})
const prefixCls = usePrefixCls('layout-content')

const { contentElement, overlayStyle } = useLayoutContentStyle()

const style = computed((): CSSProperties => {
  const { contentCompact, padding, paddingBottom, paddingLeft, paddingRight, paddingTop } = props

  const compactStyle: CSSProperties =
    contentCompact === 'compact'
      ? { margin: '0 auto', width: `${props.contentCompactWidth}px` }
      : {}
  return {
    ...compactStyle,
    flex: 1,
    padding: `${padding}px`,
    paddingBottom: `${paddingBottom}px`,
    paddingLeft: `${paddingLeft}px`,
    paddingRight: `${paddingRight}px`,
    paddingTop: `${paddingTop}px`,
  }
})
</script>

<template>
  <main ref="contentElement" :style="style" :class="prefixCls">
    <ProSlot :style="overlayStyle">
      <slot name="overlay"></slot>
    </ProSlot>
    <slot></slot>
  </main>
</template>
