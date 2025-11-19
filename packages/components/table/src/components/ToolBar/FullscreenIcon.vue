<!--
 * @Author: shen
 * @Date: 2023-11-15 09:12:16
 * @LastEditors: shen
 * @LastEditTime: 2025-11-19 16:56:18
 * @Description:
-->
<script lang="ts">
import { computed, defineComponent, h } from 'vue'
import { Tooltip } from 'ant-design-vue'
import { FullscreenExitOutlined, FullscreenOutlined } from '@ant-design/icons-vue'
import { useIntl } from '../../../../config-provider'
import { useInjectContainer } from '../../hooks/useContainer'

export default defineComponent({
  name: 'FullscreenIcon',
  inheritAttrs: false,
  components: { Tooltip, FullscreenExitOutlined, FullscreenOutlined },
  props: { prefixCls: String },
  setup() {
    const intl = useIntl()
    const counter = useInjectContainer()
    const fullscreen = computed(() => counter.hasFullScreen.value)

    const title = computed(() =>
      fullscreen.value
        ? intl.getMessage('tableToolBar.exitFullScreen', '退出全屏')
        : intl.getMessage('tableToolBar.fullScreen', '全屏'),
    )
    return {
      h,
      title,
      fullscreen,
    }
  },
})
</script>

<template>
  <Tooltip :title="title">
    <div :class="`${prefixCls}-toolbar-actions-item`" v-bind="$attrs">
      <template v-if="fullscreen">
        <FullscreenExitOutlined />
      </template>
      <template v-else>
        <FullscreenOutlined />
      </template>
    </div>
  </Tooltip>
</template>
