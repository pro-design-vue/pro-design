<!--
 * @Author: shen
 * @Date: 2025-05-22 09:08:36
 * @LastEditors: shen
 * @LastEditTime: 2025-10-09 10:02:46
 * @Description:
-->
<script setup lang="ts">
import type { ProConfigProviderProps } from './typing'
import { computed, ref } from 'vue'
import { useProConfigProvide } from './context'

interface Props extends ProConfigProviderProps {}

defineOptions({
  name: 'ConfigProviderContainer',
})

const props = defineProps<Props>()

const contentOffsetTop = ref(props.contentOffsetTop)
useProConfigProvide({
  pro: computed(() => props.pro),
  proPrefixCls: computed(() => props.proPrefixCls),
  intl: computed(() => props.intl),
  locale: computed(() => props.locale),
  contentOffsetTop: computed(() => props.contentOffsetTop || contentOffsetTop.value),
  setContentOffsetTop: (offsetTop: number) => {
    contentOffsetTop.value = offsetTop
  },
})
</script>

<template>
  <slot />
</template>
