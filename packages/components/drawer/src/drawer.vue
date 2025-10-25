<!--
 * @Author: shen
 * @Date: 2025-06-23 16:43:27
 * @LastEditors: shen
 * @LastEditTime: 2025-10-25 16:35:00
 * @Description:
-->
<script setup lang="ts">
import type { DrawerProps } from 'ant-design-vue'

import { computed, ref } from 'vue'
import { Drawer } from 'ant-design-vue'
import { CloseOutlined, FullscreenOutlined, FullscreenExitOutlined } from '@ant-design/icons-vue'
import { ProButton } from '@pro-design-vue/components/button'
import { omitKeysAndUndefined } from '@pro-design-vue/utils'
import { useIsMobile, usePrefixCls } from '@pro-design-vue/hooks'
import { useProConfigInject } from '@pro-design-vue/components/config-provider'

export interface Props extends DrawerProps {
  description?: string
  showFullscreen?: boolean
  defaultFullscreen?: boolean
}
defineOptions({
  name: 'ProDrawer',
})

const props = withDefaults(defineProps<Props>(), {
  autofocus: false,
  closable: true,
  destroyOnClose: true,
  getContainer: 'body',
  mask: true,
  maskClosable: true,
  open: false,
  showFullscreen: undefined,
})

const emit = defineEmits<{ close: [e: Event]; fullScreen: [value: boolean] }>()

const prefixCls = usePrefixCls('drawer')
const { isMobile } = useIsMobile()
const { drawer } = useProConfigInject()
const fullscreen = ref(props.defaultFullscreen)
const hasFullscreen = computed(() => isMobile.value || fullscreen.value)
const mergeShowFullscreen = computed(() => props.showFullscreen ?? drawer?.value?.showFullscreen)

const drawerProps = computed(() =>
  omitKeysAndUndefined(props, ['rootClassName', 'closable', 'onClose', 'title', 'width', 'height']),
)

const width = computed(() => {
  if (fullscreen.value) {
    return '100%'
  }
  return props.width
})

const height = computed(() => {
  if (hasFullscreen.value) {
    return '100%'
  }
  return props.height
})

const handleClose = (e: Event) => {
  fullscreen.value = props.defaultFullscreen
  props['onUpdate:open']?.(false)
  emit('close', e)
}

const handleBtnClose = (e: Event) => {
  handleClose(e)
}

const handleFullScreen = () => {
  fullscreen.value = !fullscreen.value
  emit('fullScreen', fullscreen.value)
}
</script>

<template>
  <Drawer
    v-bind="drawerProps"
    :root-class-name="`${prefixCls} ${rootClassName || ''}`"
    :closable="false"
    :width
    :height
    @close="handleClose"
  >
    <template #title v-if="title || $slots.title">
      <slot name="title">
        <div :class="`${prefixCls}-title`">{{ title }}</div>
      </slot>
      <slot name="description">
        <div :class="`${prefixCls}-description`">{{ description }}</div>
      </slot>
    </template>
    <template #extra v-if="title || $slots.title">
      <slot name="extra" />
      <ProButton
        v-if="mergeShowFullscreen && !isMobile"
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
    </template>
    <template #default>
      <div :class="`${prefixCls}-body`"><slot /></div>
    </template>

    <template #footer v-if="$slots.footer">
      <slot name="footer" />
    </template>
  </Drawer>
</template>
