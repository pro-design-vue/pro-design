<script setup lang="ts">
import { ProCounter } from 'pro-design-vue'
import { Divider } from 'ant-design-vue'
</script>

<template>
  <ProCounter :duration="3000" :end-val="30000" :start-val="1" />
  <Divider type="vertical" />
  <ProCounter :duration="3000" :end-val="2000000" :start-val="1" prefix="$" separator="/" />
</template>
