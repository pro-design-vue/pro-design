<!--
 * @Author: shen
 * @Date: 2025-05-22 09:08:36
 * @LastEditors: shen
 * @LastEditTime: 2025-11-10 17:18:55
 * @Description:
-->
<script setup lang="ts">
import type { ProConfigProviderProps } from './typing'
import { computed, ref } from 'vue'
import { useProConfigProvide } from './context'
import { useCssVariables } from './useCssVariables'

interface Props extends ProConfigProviderProps {}

defineOptions({
  name: 'ConfigProviderContainer',
})

const props = defineProps<Props>()

const contentOffsetTop = ref(props.contentOffsetTop)

useCssVariables(computed(() => props.dark))

useProConfigProvide({
  table: computed(() => props.table),
  form: computed(() => props.form),
  modal: computed(() => props.modal),
  drawer: computed(() => props.drawer),
  prefixCls: computed(() => props.prefixCls),
  componentSize: computed(() => props.componentSize),
  proPrefixCls: computed(() => props.proPrefixCls),
  intl: computed(() => props.intl),
  locale: computed(() => props.locale),
  dark: computed(() => props.dark),
  accessCodes: computed(() => props.accessCodes),
  contentOffsetTop: computed(() => props.contentOffsetTop || contentOffsetTop.value),
  setContentOffsetTop: (offsetTop: number) => {
    contentOffsetTop.value = offsetTop
  },
})
</script>

<template>
  <slot />
</template>
