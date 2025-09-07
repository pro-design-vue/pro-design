<template>
  <Space>
    <ProButton
      type="primary"
      tooltip="我是按钮提示"
      :tooltip-props="{
        color: 'red',
      }"
      >Tooltip按钮</ProButton
    >
    <ProButton
      mode="dropdown"
      :dropdown-props="{
        placement: 'bottomLeft',
      }"
      :items="[
        {
          key: '01',
          label: '按钮1',
        },
        {
          key: '02',
          label: '按钮2',
        },
      ]"
      @menu-click="handleMenuClick"
      >Dropdown按钮</ProButton
    >
    <ProButton
      type="primary"
      mode="confirm"
      :confirm-props="{
        title: '提示',
        content: '我是确认内容',
      }"
      @confirm="handleConfirm"
      @cancel="handleCancel"
      >Confirm按钮</ProButton
    >
    <ProButton
      mode="popconfirm"
      :popconfirm-props="{
        title: '提示',
        description: '我是确认内容',
      }"
      @confirm="handleConfirm"
      @cancel="handleCancel"
      >Popconfirm按钮</ProButton
    >
  </Space>
</template>

<script setup lang="ts">
import { ProButton } from 'pro-design-vue'
import { Space } from 'ant-design-vue'

const handleMenuClick = ({ key }) => {
  console.log('menuKey', key)
}

const handleConfirm = () => {
  console.log('confirm')
}

const handleCancel = () => {
  console.log('cancel')
}
</script>
