<!--
 * @Author: shen
 * @Date: 2025-10-22 16:31:15
 * @LastEditors: shen
 * @LastEditTime: 2025-12-26 17:03:08
 * @Description:
-->
<script setup lang="tsx">
import { ProField } from '@pro-design-vue/components'
import { Space, Radio, Descriptions, Form } from 'ant-design-vue'
import { ref } from 'vue'
const state = ref<any>('read')
</script>

<template>
  <div style="margin: 100px; padding: 50px 30px; width: 1000px; border: 1px solid #f1f1f1">
    <Form>
      <Space>
        <Radio.Group v-model:value="state">
          <Radio value="read">只读</Radio>
          <Radio value="edit">编辑</Radio>
        </Radio.Group>
      </Space>
      <br />
      <br />
      <Descriptions :column="2">
        <Descriptions.Item label="空字符串">
          <ProField text="" mode="read" />
        </Descriptions.Item>
        <Descriptions.Item label="头像">
          <ProField
            text="https://avatars2.githubusercontent.com/u/8186664?s=60&v=4"
            mode="read"
            valueType="avatar"
          />
        </Descriptions.Item>
        <Descriptions.Item label="文本">
          <ProField text="这是一段文本" valueType="text" :mode="state" />
        </Descriptions.Item>
        <Descriptions.Item label="图片">
          <ProField
            text="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
            valueType="image"
            :mode="state"
          />
        </Descriptions.Item>
        <Descriptions.Item label="金额">
          <ProField text="100" valueType="money" :mode="state" />
        </Descriptions.Item>
        <Descriptions.Item label="颜色">
          <ProField valueType="color" :mode="state" />
        </Descriptions.Item>
        <Descriptions.Item label="数字">
          <ProField text="19897979797979" valueType="digit" :mode="state" />
        </Descriptions.Item>
        <Descriptions.Item label="选择框">
          <ProField
            :mode="state"
            :value-enum="{
              all: { text: '全部', disabled: true, status: 'Default' },
              open: {
                text: '未解决',
                status: 'Error',
              },
              closed: {
                text: '已解决',
                status: 'Success',
              },
              processing: {
                text: '解决中',
                status: 'Processing',
              },
            }"
          />
        </Descriptions.Item>
      </Descriptions>
    </Form>
  </div>
</template>
