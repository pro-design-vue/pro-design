<!--
 * @Author: shen
 * @Date: 2025-06-12 09:52:41
 * @LastEditors: shen
 * @LastEditTime: 2025-08-27 13:20:20
 * @Description:
-->
<script setup lang="ts">
import { usePrefixCls } from '@pro-design-vue/hooks'
import { PinIcon, PinOffIcon } from '../icons'

const prefixCls = usePrefixCls('layout-sidebar-fixed-button')
const expandOnHover = defineModel<boolean>('expandOnHover')

function toggleFixed() {
  expandOnHover.value = !expandOnHover.value
}
</script>

<template>
  <div :class="prefixCls" @click="toggleFixed">
    <PinOffIcon v-if="!expandOnHover" style="font-size: 14px" />
    <PinIcon v-else style="font-size: 14px" />
  </div>
</template>
