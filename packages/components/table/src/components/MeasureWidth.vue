<!--
 * @Author: shen
 * @Date: 2023-11-06 16:03:18
 * @LastEditors: shen
 * @LastEditTime: 2025-07-30 10:51:48
 * @Description:
-->
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'MeasureWidth',
  inheritAttrs: false,
})
</script>

<template>
  <div
    style="
      position: absolute;
      top: 0;
      left: 0;
      z-index: -999;
      width: 1px;
      height: 0;
      padding: 0;
      margin: 0;
      overflow: hidden;
      pointer-events: none;
    "
  ></div>
</template>
