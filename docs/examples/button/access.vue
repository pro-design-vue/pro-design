<template>
  <ProConfigProvider :accessCodes="accessCodes">
    <Space direction="vertical">
      <Space>
        <span style="display: inline-block; width: 80px">当前权限码：</span>
        <Tag v-for="code in codes" :key="code">{{ code }}</Tag>
      </Space>
      <Space>
        <ProButton access-code="user:read" type="primary">用户查看（有权限）</ProButton>
        <ProButton access-code="user:edit" type="primary">用户编辑（有权限）</ProButton>
        <ProButton access-code="admin:delete" danger>管理员删除（无权限）</ProButton>
        <ProButton access-code="order:export">订单导出（无权限）</ProButton>
      </Space>
    </Space>
  </ProConfigProvider>
</template>

<script setup lang="ts">
import { ProButton, ProConfigProvider } from 'pro-design-vue'
import { Space, Tag } from 'ant-design-vue'
import { ref } from 'vue'

const codes = ['user:read', 'user:edit', 'user:create']
const accessCodes = ref(new Set(codes))
</script>
