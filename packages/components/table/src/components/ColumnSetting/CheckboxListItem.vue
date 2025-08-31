<!--
 * @Author: shen
 * @Date: 2023-11-19 13:39:31
 * @LastEditors: shen
 * @LastEditTime: 2025-08-27 13:44:32
 * @Description:
-->
<script lang="ts">
import type { PropType } from 'vue'
import type { ColumnsState } from '../interface'

import { defineComponent } from 'vue'
import { Tooltip } from 'ant-design-vue'
import {
  VerticalAlignTopOutlined,
  VerticalAlignMiddleOutlined,
  VerticalAlignBottomOutlined,
} from '@ant-design/icons-vue'
import { useInjectContainer } from '../../hooks/useContainer'
import { useIntl } from '@pro-design-vue/components/config-provider'

export default defineComponent({
  name: 'CheckboxListItem',
  inheritAttrs: false,
  components: {
    Tooltip,
    VerticalAlignMiddleOutlined,
    VerticalAlignTopOutlined,
    VerticalAlignBottomOutlined,
  },
  props: {
    className: String,
    title: String,
    columnKey: [String, Number],
    fixed: [Boolean, String] as PropType<boolean | 'left' | 'right'>,
    isRoot: Boolean,
  },
  setup(props) {
    const { columnsMap, setColumnsMap } = useInjectContainer()
    const intl = useIntl()

    const onClick = (fixed?: 'left' | 'right') => {
      const config = columnsMap.value[props.columnKey ?? ''] || {}
      const columnKeyMap = {
        ...columnsMap.value,
        [props.columnKey ?? '']: { ...config, fixed } as ColumnsState,
      }
      setColumnsMap(columnKeyMap)
    }

    return {
      intl,
      onClick,
    }
  },
})
</script>

<template>
  <span :class="`${className}-list-item`" :key="columnKey">
    <div :class="`${className}-list-item-title`">
      <slot />
    </div>
    <span v-if="isRoot" :class="`${className}-list-item-option`">
      <Tooltip
        :title="intl.getMessage('tableToolBar.leftPin', '固定在列首')"
        v-if="fixed !== 'left'"
      >
        <span @click.stop.prevent="onClick('left')">
          <VerticalAlignTopOutlined />
        </span>
      </Tooltip>
      <Tooltip :title="intl.getMessage('tableToolBar.noPin', '不固定')" v-if="!!fixed">
        <span @click.stop.prevent="onClick()">
          <VerticalAlignMiddleOutlined />
        </span>
      </Tooltip>
      <Tooltip
        :title="intl.getMessage('tableToolBar.rightPin', '固定在列尾')"
        v-if="fixed !== 'right'"
      >
        <span @click.stop.prevent="onClick('right')">
          <VerticalAlignBottomOutlined />
        </span>
      </Tooltip>
    </span>
  </span>
</template>
