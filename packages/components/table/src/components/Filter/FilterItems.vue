<!--
 * @Author: shen
 * @Date: 2023-11-07 21:51:35
 * @LastEditors: shen
 * @LastEditTime: 2025-07-30 10:36:46
 * @Description:
-->
<script lang="ts">
import type { PropType } from 'vue'
import type { Key, ColumnFilterItem, TableLocale, GetPopupContainer } from '../interface'

import { defineComponent, computed } from 'vue'
import { Empty, Menu, SubMenu, MenuItem } from 'ant-design-vue'
import { useInjectTable } from '../context/TableContext'
import { RenderSlot } from '@pro-design-vue/utils'
import Checkbox from '../Checkbox'
import Radio from '../Radio'

export default defineComponent({
  name: 'FilterItems',
  inheritAttrs: false,
  components: {
    Checkbox,
    Empty,
    Radio,
    AMenu: Menu,
    SubMenu,
    MenuItem,
    RenderSlot,
  },
  props: {
    filters: Array as PropType<ColumnFilterItem[]>,
    prefixCls: String,
    dropdownPrefixCls: String,
    filteredKeys: Array as PropType<Key[]>,
    filterMultiple: Boolean,
    locale: { type: Object as PropType<TableLocale>, default: undefined },
    root: Boolean,
    getPopupContainer: Function as PropType<GetPopupContainer>,
    onSelectKeys: Function,
    onOpenChange: Function,
    onMenuClick: Function,
    openKeys: Array as PropType<string[]>,
  },
  setup(props) {
    const { prefixCls: rootPrefixCls } = useInjectTable()
    const menuProps = computed(() =>
      props.root
        ? {
            multiple: props.filterMultiple,
            getPopupContainer: props.getPopupContainer,
            onSelect: props.onSelectKeys,
            onDeselect: props.onSelectKeys,
            selectedKeys: props.filteredKeys,
            onOpenChange: props.onOpenChange,
            onClick: props.onMenuClick,
            openKeys: props.openKeys,
            class: `${props.prefixCls}-dropdown-menu`,
          }
        : {},
    )
    return {
      emptyImage: Empty.PRESENTED_IMAGE_SIMPLE,
      menuProps,
      rootPrefixCls,
      props,
    }
  },
})
</script>

<template>
  <component :is="root ? 'AMenu' : 'RenderSlot'" v-bind="menuProps">
    <template v-if="filters && filters.length">
      <template
        v-for="(filter, index) in filters"
        :key="filter.value === undefined ? index : filter.value"
      >
        <SubMenu
          v-if="filter.children"
          :title="filter.text"
          :popup-class-name="`${prefixCls}-dropdown-submenu`"
          :key="filter.value === undefined ? index : String(filter.value)"
        >
          <FilterItems
            v-bind="props"
            v-for="(child, childIndex) in filter.children"
            :key="child.value === undefined ? childIndex : String(child.value)"
            :filters="[child]"
            :root="false"
          ></FilterItems>
        </SubMenu>
        <template v-else>
          <MenuItem :key="filter.value === undefined ? index : String(filter.value)">
            <component
              :is="filterMultiple ? 'Checkbox' : 'Radio'"
              :prefix-cls="rootPrefixCls"
              :checked="
                filteredKeys?.includes(filter.value === undefined ? index : String(filter.value))
              "
            />
            <span>{{ filter.text }}</span>
          </MenuItem>
        </template>
      </template>
    </template>
    <div v-else style="margin: 16px 0">
      <Empty
        :image="emptyImage"
        :description="locale && locale.filterEmptyText"
        :image-style="{ height: 24 }"
      />
    </div>
  </component>
</template>
