<!--
 * @Author: shen
 * @Date: 2023-11-15 09:12:16
 * @LastEditors: shen
 * @LastEditTime: 2025-10-12 18:34:04
 * @Description:
-->
<script lang="ts">
import { defineComponent, h, onMounted, ref } from 'vue'
import { Tooltip, Menu } from 'ant-design-vue'
import { FullscreenExitOutlined, FullscreenOutlined } from '@ant-design/icons-vue'
import { useIntl } from '../../../../config-provider'
import { isBrowser } from '@pro-design-vue/utils'

export default defineComponent({
  name: 'FullscreenIcon',
  inheritAttrs: false,
  components: { Tooltip, FullscreenExitOutlined, FullscreenOutlined },
  props: { prefixCls: String },
  setup() {
    const intl = useIntl()
    const fullscreen = ref(false)

    onMounted(() => {
      if (!isBrowser()) {
        return
      }
      document.onfullscreenchange = () => {
        fullscreen.value = !!document.fullscreenElement
      }
    })

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
