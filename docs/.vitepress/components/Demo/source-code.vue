<!--
 * @Author: shen
 * @Date: 2025-09-05 09:12:32
 * @LastEditors: shen
 * @LastEditTime: 2025-09-07 23:27:23
 * @Description:
-->
<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  visible: {
    type: Boolean,
    required: true,
  },
  source: {
    type: String,
    required: true,
  },
})
const decoded = computed(() => {
  return decodeURIComponent(props.source)
})
</script>

<template>
  <div v-show="visible" class="example-source-wrapper">
    <div class="example-source" v-html="decoded" />
  </div>
</template>

<style scoped lang="less">
:deep(.language-vue) {
  margin: 0 !important;
  border-radius: 0 !important;
}
</style>
