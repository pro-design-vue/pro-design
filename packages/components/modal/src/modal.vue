<!--
 * @Author: shen
 * @Date: 2025-06-23 16:43:27
 * @LastEditors: shen
 * @LastEditTime: 2025-09-24 16:34:14
 * @Description:
-->
<script setup lang="ts">
import type { ModalProps } from 'ant-design-vue'

import { computed, ref, useTemplateRef, useAttrs } from 'vue'
import { Modal } from 'ant-design-vue'
import { CloseOutlined, FullscreenOutlined, FullscreenExitOutlined } from '@ant-design/icons-vue'
import { ProButton } from '@pro-design-vue/components/button'
import { omitKeysAndUndefined } from '@pro-design-vue/utils'
import { useIsMobile, usePrefixCls } from '@pro-design-vue/hooks'
import { useDraggable, useElementBounding, useResizeObserver } from '@vueuse/core'
export interface Props extends Omit<ModalProps, 'visible'> {
  /**
   * @zh_CN 标题描述信息
   */
  description?: string
  /**
   * @zh_CN 是否可以切换全屏
   */
  showFullscreen?: boolean
  /**
   * @zh_CN 默认全屏
   */
  defaultFullscreen?: boolean
  /**
   * @zh_CN 是否可以拖拽
   */
  draggable?: boolean
  /**
   * @zh_CN 距离顶部距离
   */
  top?: number
}
defineOptions({
  name: 'ProModal',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<Props>(), {
  autofocus: false,
  closable: true,
  destroyOnClose: true,
  getContainer: () => document.body,
  mask: true,
  keyboard: true,
  maskClosable: true,
  open: false,
  showFullscreen: false,
  draggable: false,
  top: 100,
})
const emit = defineEmits<{ cancel: [e: Event]; fullScreen: [value: boolean] }>()
const attrs = useAttrs()
const prefixCls = usePrefixCls('modal')
// const open = defineModel<boolean>('open')
const isDrag = ref(false)
const fullscreen = ref(props.defaultFullscreen)
const { isMobile } = useIsMobile()
const bodyWidth = ref(0)
const modalHeaderEl = useTemplateRef<HTMLElement>('modalHeaderRef')
const { width } = useElementBounding(modalHeaderEl)
useResizeObserver(document.body, (entries) => {
  const entry = entries[0]
  const { width } = entry?.contentRect || ({} as DOMRectReadOnly)
  bodyWidth.value = width
})
const hasFullscreen = computed(() => isMobile.value || fullscreen.value)
const hasDraggable = computed(() => props.draggable && !hasFullscreen.value)

const { style } = useDraggable(modalHeaderEl, {
  disabled: computed(() => !hasDraggable.value),
  onMove() {
    isDrag.value = true
  },
})

const modalProps = computed(() =>
  omitKeysAndUndefined(props, ['closable', 'onCancel', 'title', 'width', 'height']),
)

const modalClass = computed(() => ({
  [prefixCls]: true,
  [attrs.class as string]: true,
  [`${prefixCls}--fullscreen`]: hasFullscreen.value,
  [`${prefixCls}--draggable`]: hasDraggable.value,
}))

const modalStyle = computed(() => {
  if (isDrag.value) {
    return style.value
  }
  if (hasDraggable.value) {
    return {
      left: (bodyWidth.value - width.value) / 2 + 'px',
      top: `${props.top}px`,
    }
  }
  return {
    top: `${props.top}px`,
  }
})

const modalWidth = computed(() => {
  if (hasFullscreen.value) {
    return '100%'
  }
  return props.width
})

const handleClose = (e: Event) => {
  fullscreen.value = props.defaultFullscreen
  props['onUpdate:open']?.(false)
  emit('cancel', e)
}

const handleBtnClose = (e: Event) => {
  e.stopPropagation()
  handleClose(e)
}

const handleFullScreen = () => {
  fullscreen.value = !fullscreen.value
  emit('fullScreen', fullscreen.value)
}
</script>

<template>
  <Modal
    v-bind="modalProps"
    :class="modalClass"
    :closable="false"
    :width="modalWidth"
    :style="modalStyle"
    @cancel="handleClose"
  >
    <template #title>
      <div ref="modalHeaderRef" :class="`${prefixCls}-header`">
        <slot name="title">
          <div :class="`${prefixCls}-title`">{{ title }}</div>
        </slot>
        <slot name="description">
          <div :class="`${prefixCls}-description`">{{ description }}</div>
        </slot>
        <div :class="`${prefixCls}-extra`">
          <ProButton
            v-if="showFullscreen && !isMobile"
            :class="`${prefixCls}-fullscreen`"
            size="small"
            shape="circle"
            type="text"
            @click="handleFullScreen"
          >
            <template #icon>
              <FullscreenOutlined v-if="!fullscreen" />
              <FullscreenExitOutlined v-else />
            </template>
          </ProButton>
          <ProButton
            v-if="closable"
            :class="`${prefixCls}-close`"
            size="small"
            shape="circle"
            type="text"
            @click="handleBtnClose"
          >
            <template #icon>
              <CloseOutlined />
            </template>
          </ProButton>
        </div>
      </div>
    </template>
    <template #default>
      <slot />
    </template>

    <template #footer v-if="$slots.footer">
      <slot name="footer" />
    </template>
  </Modal>
</template>
