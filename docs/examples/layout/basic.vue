<template>
  <ProLayout
    header-mode="static"
    :sidebar-fixed="false"
    :sidebar-fixed-button="false"
    footer-enable
    :footer-fixed="false"
    style="height: 500px"
  >
    <template #logo> Logo区域 </template>
    <template #header> Header区域 </template>
    <template #menu>Menu区域</template>
    <template #tabbar>Tabbar区域</template>
    <template #content>Content区域</template>
    <template #footer>Footer区域</template>
  </ProLayout>
</template>

<script setup lang="ts">
import { ProLayout } from 'pro-design-vue'
</script>
