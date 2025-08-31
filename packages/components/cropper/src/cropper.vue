<!--
 * @Author: shen
 * @Date: 2023-09-28 09:28:44
 * @LastEditors: shen
 * @LastEditTime: 2025-08-28 11:04:44
 * @Description:
-->
<script setup lang="ts">
import type { PropType } from 'vue'
import { ref, onMounted } from 'vue'
import { Slider } from 'ant-design-vue'
import { usePrefixCls } from '@pro-design-vue/hooks'
import Cropper from 'cropperjs'

defineOptions({
  name: 'ProCropper',
})

let cropper: Cropper
const prefixCls = usePrefixCls('cropper')

const props = defineProps({
  imgSrc: {
    type: String,
    default: '',
  },
  cropperWidth: {
    type: Number,
    default: undefined,
  },
  cropperHeight: {
    type: Number,
    default: undefined,
  },
  cropperProps: {
    type: Object as PropType<Record<string, any>>,
    default: () => ({}),
  },
})

const scale = ref(1)

const imgRef = ref<HTMLImageElement>()

const onZoom = (type: string) => {
  let newValue: number
  if (type === 'minus') {
    newValue = scale.value - 0.1
  } else {
    newValue = scale.value + 0.1
  }
  cropper.zoom(newValue - scale.value)
  scale.value = newValue
}

const getCroppedCanvas = (file: File, options?: Cropper.GetCroppedCanvasOptions) => {
  if (!cropper) {
    return
  }
  const croppedData = cropper.getCroppedCanvas(options).toDataURL(file.type)
  return croppedData
}
onMounted(() => {
  if (imgRef.value) {
    cropper = new Cropper(imgRef.value, props.cropperProps ?? {})
  }
})

defineExpose({
  getCroppedCanvas,
})
</script>

<template>
  <div :class="prefixCls">
    <div :class="`${prefixCls}-container`">
      <img ref="imgRef" :src="imgSrc" :class="`${prefixCls}-img`" alt="" />
    </div>
    <div :class="`${prefixCls}-control`">
      <button @click="onZoom('minus')">-</button>
      <Slider v-model:value="scale" :min="0.5" :max="3" :step="0.1"></Slider>
      <button @click="onZoom('plus')">+</button>
    </div>
  </div>
</template>
