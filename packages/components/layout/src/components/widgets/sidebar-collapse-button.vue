<!--
 * @Author: shen
 * @Date: 2025-06-12 09:44:33
 * @LastEditors: shen
 * @LastEditTime: 2025-08-27 13:20:11
 * @Description:
-->
<script setup lang="ts">
import { usePrefixCls } from '@pro-design-vue/hooks'
import { ChevronsRightIcon, ChevronsLeftIcon } from '../icons'

const prefixCls = usePrefixCls('layout-sidebar-collapse-button')
const collapsed = defineModel<boolean>('collapsed')

function handleCollapsed() {
  collapsed.value = !collapsed.value
}
</script>

<template>
  <div :class="prefixCls" @click.stop="handleCollapsed">
    <ChevronsRightIcon v-if="collapsed" style="font-size: 16px" />
    <ChevronsLeftIcon v-else style="font-size: 16px" />
  </div>
</template>
