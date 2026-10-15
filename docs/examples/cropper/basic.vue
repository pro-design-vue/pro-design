<script setup lang="ts">
import { ProCropper } from 'pro-design-vue'
</script>

<template>
  <div style="max-width: 600px">
    <ProCropper
      img-src="https://pro-design.shene.org.cn/logo_big.png"
      :cropper-width="4"
      :cropper-height="3"
      :cropper-props="{
        viewMode: 1,
        dragMode: 'move',
        autoCropArea: 1,
        background: false,
      }"
    />
  </div>
</template>
