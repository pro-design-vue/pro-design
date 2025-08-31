<!--
 * @Author: shen
 * @Date: 2023-11-15 09:12:16
 * @LastEditors: shen
 * @LastEditTime: 2025-07-30 09:00:54
 * @Description:
-->
<script lang="ts">
import { defineComponent, h, computed } from 'vue'
import { Dropdown, Tooltip, Menu } from 'ant-design-vue'
import { ColumnHeightOutlined } from '@ant-design/icons-vue'
import { useInjectContainer } from '../../hooks/useContainer'
import { useIntl } from '../../../../config-provider'
import type { DensitySize } from '../interface'

export default defineComponent({
  name: 'DensityIcon',
  inheritAttrs: false,
  components: { Dropdown, Tooltip, AMenu: Menu, ColumnHeightOutlined },
  props: { prefixCls: String },
  setup() {
    const intl = useIntl()
    const counter = useInjectContainer()
    const menuProps = computed(() => {
      return {
        selectedKeys: [counter.tableSize.value as string],
        onClick: ({ key }) => {
          counter.setTableSize?.(key as DensitySize)
        },
        items: [
          {
            key: 'default',
            label: intl.getMessage('tableToolBar.densityLarger', '宽松'),
          },
          {
            key: 'middle',
            label: intl.getMessage('tableToolBar.densityMiddle', '中等'),
          },
          {
            key: 'small',
            label: intl.getMessage('tableToolBar.densitySmall', '紧凑'),
          },
        ],
      }
    })
    return {
      h,
      intl,
      menuProps,
      ColumnHeightOutlined,
    }
  },
})
</script>

<template>
  <Dropdown trigger="click" :overlayStyle="{ width: '80px' }">
    <Tooltip :title="intl.getMessage('tableToolBar.density', '密度')">
      <div :class="`${prefixCls}-toolbar-actions-item`">
        <ColumnHeightOutlined />
      </div>
    </Tooltip>
    <template #overlay>
      <AMenu v-bind="menuProps" />
    </template>
  </Dropdown>
</template>
