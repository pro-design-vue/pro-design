<!--
 * @Author: shen
 * @Date: 2023-11-16 10:57:27
 * @LastEditors: shen
 * @LastEditTime: 2025-07-29 09:19:43
 * @Description:
-->
<script lang="ts">
import type { PropType } from 'vue'
import type { Key } from './interface'
import { defineComponent } from 'vue'
import { Space } from 'ant-design-vue'

export default defineComponent({
  name: 'ProTableAlert',
  props: {
    prefixCls: String,
    selectedRowKeys: {
      type: Array as PropType<Key[]>,
      default: () => [],
    },
    selectedRows: {
      type: Array as PropType<any[]>,
      default: () => [],
    },
  },
  inheritAttrs: false,
  components: { Space },
  emits: ['cleanSelected'],
  setup(_, { emit, slots }) {
    const onCleanSelected = () => {
      emit('cleanSelected')
    }
    return {
      slots,
      onCleanSelected,
    }
  },
})
</script>

<template>
  <div :class="`${prefixCls}-alert`">
    <div :class="`${prefixCls}-alert-container`">
      <div :class="`${prefixCls}-alert-info`">
        <slot
          name="info"
          :selected-row-keys="selectedRowKeys"
          :selected-rows="selectedRows"
          :on-clean-selected="onCleanSelected"
        >
          <Space>
            已选择 {{ selectedRowKeys.length }} 项
            <a class="pro-link" v-if="slots.actions" @click="onCleanSelected" key="0">取消选择</a>
          </Space>
        </slot>
      </div>
      <div :class="`${prefixCls}-alert-actions`">
        <Space>
          <slot
            name="actions"
            :selected-row-keys="selectedRowKeys"
            :selected-rows="selectedRows"
            :on-clean-selected="onCleanSelected"
          >
            <a class="pro-link" @click="onCleanSelected" key="0">取消选择</a>
          </slot>
        </Space>
      </div>
    </div>
  </div>
</template>
