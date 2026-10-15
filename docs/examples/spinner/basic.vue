<script setup lang="ts">
import { ref } from 'vue'
import { ProSpinner } from 'pro-design-vue'
import { Button } from 'ant-design-vue'

const spinning = ref(false)
</script>

<template>
  <div>
    <Button type="primary" @click="spinning = !spinning">
      {{ spinning ? '停止' : '开始' }}加载
    </Button>
    <div
      style="
        position: relative;
        height: 100px;
        margin-top: 16px;
        border: 1px solid #eee;
        border-radius: 8px;
      "
    >
      <ProSpinner :spinning="spinning" />
      <div style="padding: 16px; color: #999; text-align: center">
        {{ spinning ? '加载中...' : '内容区域' }}
      </div>
    </div>
  </div>
</template>
