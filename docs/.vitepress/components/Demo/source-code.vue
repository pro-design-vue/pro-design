<!--
 * @Author: shen
 * @Date: 2025-09-05 09:12:32
 * @LastEditors: shen
 * @LastEditTime: 2025-10-08 21:02:59
 * @Description:
-->
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import Prism from 'prismjs'
import 'prismjs/components/prism-markup' // 引入 Vue 语法高亮

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

const parentRef = ref()
const decoded = computed(() => {
  return decodeURIComponent(props.source)
})

onMounted(() => {
  Prism.highlightAllUnder(parentRef.value)
})
</script>

<template>
  <div v-show="visible" class="example-source-wrapper" ref="parentRef">
    <pre><code class="language-markup">{{ decoded }}</code></pre>
  </div>
</template>

<style scoped lang="less">
:deep(.language-vue) {
  margin: 0 !important;
  border-radius: 0 !important;
}
</style>
