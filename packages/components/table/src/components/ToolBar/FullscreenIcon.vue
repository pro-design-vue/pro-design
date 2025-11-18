<!--
 * @Author: shen
 * @Date: 2023-11-15 09:12:16
 * @LastEditors: shen
 * @LastEditTime: 2025-11-18 17:25:04
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

    return {
      h,
      intl,
      fullscreen,
    }
  },
})
</script>

<template>
  <template v-if="fullscreen">
    <Tooltip :title="intl.getMessage('tableToolBar.exitFullScreen', '退出全屏')">
      <div :class="`${prefixCls}-toolbar-actions-item`">
        <FullscreenExitOutlined />
      </div>
    </Tooltip>
  </template>
  <template v-else>
    <Tooltip :title="intl.getMessage('tableToolBar.fullScreen', '全屏')">
      <div :class="`${prefixCls}-toolbar-actions-item`">
        <FullscreenOutlined />
      </div>
    </Tooltip>
  </template>
</template>
