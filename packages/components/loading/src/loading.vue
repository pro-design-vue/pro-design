<!--
 * @Author: shen
 * @Date: 2025-06-20 16:04:00
 * @LastEditors: shen
 * @LastEditTime: 2025-08-27 13:28:28
 * @Description:
-->
<script lang="ts" setup>
import { ref, watch } from 'vue'

import { usePrefixCls } from '@pro-design-vue/hooks'

interface Props {
  /**
   * @zh_CN 最小加载时间
   * @en_US Minimum loading time
   */
  minLoadingTime?: number

  /**
   * @zh_CN loading状态开启
   */
  spinning?: boolean
  /**
   * @zh_CN 文字
   */
  text?: string
}

defineOptions({
  name: 'ProLoading',
})

const props = withDefaults(defineProps<Props>(), {
  minLoadingTime: 50,
  text: '',
})

const prefixCls = usePrefixCls('loading')

// const startTime = ref(0);
const showSpinner = ref(false)
const renderSpinner = ref(false)
const timer = ref<ReturnType<typeof setTimeout>>()

watch(
  () => props.spinning,
  (show) => {
    if (!show) {
      showSpinner.value = false
      clearTimeout(timer.value)
      return
    }

    // startTime.value = performance.now();
    timer.value = setTimeout(() => {
      // const loadingTime = performance.now() - startTime.value;

      showSpinner.value = true
      if (showSpinner.value) {
        renderSpinner.value = true
      }
    }, props.minLoadingTime)
  },
  {
    immediate: true,
  },
)

function onTransitionEnd() {
  if (!showSpinner.value) {
    renderSpinner.value = false
  }
}
</script>

<template>
  <div
    :class="[
      prefixCls,
      {
        [`${prefixCls}--hidden`]: !showSpinner,
      },
    ]"
    @transitionend="onTransitionEnd"
  >
    <slot name="icon" v-if="renderSpinner">
      <span :class="`${prefixCls}-dot`">
        <i v-for="index in 4" :key="index"></i>
      </span>
    </slot>

    <div v-if="text" :class="`${prefixCls}-text`">{{ text }}</div>
    <slot></slot>
  </div>
</template>
