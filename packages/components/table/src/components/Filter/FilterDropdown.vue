<!--
 * @Author: shen
 * @Date: 2023-11-07 21:51:35
 * @LastEditors: shen
 * @LastEditTime: 2025-07-30 10:38:03
 * @Description:
-->
<script lang="ts">
import type { PropType } from 'vue'
import type { FinallyColumnType, DefaultRecordType, Key, FilterConfirmProps } from '../interface'

import { defineComponent, ref, computed, watch, onUnmounted } from 'vue'
import { Dropdown } from 'ant-design-vue'
import { FilterFilled } from '@ant-design/icons-vue'
import { useInjectTable } from '../context/TableContext'
import { useInjectSlots } from '../context/TableSlotsContext'
import { isEqual, RenderVNode } from '@pro-design-vue/utils'
import { ProButton } from '../../../../button'
import eagerComputed from '../../utils/eagerComputed'
import FilterWrapper from './FilterWrapper'
import FilterItems from './FilterItems.vue'
import devWarning from '../../utils/devWarning'

export default defineComponent({
  name: 'FilterDropdown',
  components: {
    FilterFilled,
    Dropdown,
    FilterItems,
    ProButton,
    RenderVNode,
    FilterWrapper,
  },
  inheritAttrs: false,
  props: {
    prefixCls: { type: String, default: '' },
    column: { type: Object as PropType<FinallyColumnType<DefaultRecordType>>, required: true },
  },
  setup(props) {
    const tableContext = useInjectTable()
    const tableSlotsContext = useInjectSlots()

    const filteredKeys = ref<Key[]>([])
    const openKeys = ref<string[]>([])
    const dropdownPrefixCls = computed(() => tableContext.props.dropdownPrefixCls || 'ant-dropdown')
    const columnKey = computed(() => props.column.columnKey)
    const filterStates = computed(() => tableContext.filterStates.value)
    const filterState = computed(() =>
      filterStates.value.find(({ key }) => columnKey.value === key),
    )

    watch(
      filterState,
      () => {
        filteredKeys.value = filterState.value?.filteredKeys || []
      },
      { immediate: true },
    )

    const getPopupContainer = computed(
      () => props.column?.getPopupContainer ?? tableContext.props.getPopupContainer,
    )

    const showFilterDropdown = ref(false)

    devWarning(
      !('onFilterDropdownVisibleChange' in props.column),
      '@table',
      'column.onFilterDropdownVisibleChange is deprecated. Please use column.onFilterDropdownOpenChange instead.',
    )
    devWarning(
      !('filterDropdownVisible' in props.column),
      '@table',
      'column.filterDropdownVisible is deprecated. Please use column.filterDropdownOpen instead.',
    )

    const triggerOpen = (open: boolean) => {
      showFilterDropdown.value = open
      const { onFilterDropdownOpenChange, onFilterDropdownVisibleChange } = props.column || {}
      const onOpenChange = onFilterDropdownOpenChange || onFilterDropdownVisibleChange
      onOpenChange?.(open)
    }

    const mergedOpen = eagerComputed(() => {
      const { filterDropdownVisible, filterDropdownOpen } = props.column || {}
      const open = filterDropdownOpen ?? filterDropdownVisible
      return typeof open == 'boolean' ? open : showFilterDropdown.value
    })

    let openKeysTimer = 0
    const onOpenChange = (keys: string[]) => {
      openKeysTimer = window.setTimeout(() => {
        openKeys.value = keys
      })
    }
    const onMenuClick = () => {
      window.clearTimeout(openKeysTimer)
    }

    onUnmounted(() => {
      window.clearTimeout(openKeysTimer)
    })

    const changeFilter = (keys: Key[]) => {
      const newKeys = keys && keys.length ? keys : null
      const state = filterState.value

      if (!(newKeys !== null || (state && state.filteredKeys))) return null
      if (isEqual(newKeys, state?.filteredKeys)) return null

      const newFilterState = { column: props.column, key: columnKey.value, filteredKeys: newKeys }
      tableContext?.changeFilter(newFilterState)
    }

    const onSelectKeys = ({ selectedKeys }: { selectedKeys?: Key[] }) => {
      filteredKeys.value = selectedKeys || []
    }
    const onConfirm = () => {
      triggerOpen(false)
      changeFilter(filteredKeys.value)
    }
    const onReset = () => {
      filteredKeys.value = []
      triggerOpen(false)
      changeFilter([])
    }
    const doFilter = (param: FilterConfirmProps = { closeDropdown: true }) => {
      triggerOpen(!param.closeDropdown)
      changeFilter(filteredKeys.value)
    }

    const customFilterDropdown = computed(() => {
      const { filterDropdown, slots = {}, customFilterDropdown } = props.column
      return (
        filterDropdown ||
        (slots.filterDropdown && tableSlotsContext[slots.filterDropdown]) ||
        (customFilterDropdown && tableSlotsContext.customFilterDropdown)
      )
    })

    const custocustomFilterDropdownProps = computed(() => ({
      prefixCls: props.prefixCls,
      setSelectedKeys: (keys: Key[]) => onSelectKeys({ selectedKeys: keys }),
      selectedKeys: filteredKeys.value,
      confirm: doFilter,
      clearFilters: onReset,
      filters: props.column.filters,
      column: props.column.originColumn,
      open: mergedOpen.value,
    }))

    const customFilterIcon = computed(() => {
      return (
        props.column?.filterIcon ||
        (props.column?.slots?.filterIcon && tableSlotsContext[props.column?.slots?.filterIcon]) ||
        tableSlotsContext.customFilterIcon
      )
    })

    const filterItemsProps = computed(() => {
      const { column } = props
      return {
        filters: column.filters,
        prefixCls: props.prefixCls,
        filteredKeys: filteredKeys.value,
        filterMultiple:
          column.filterMultiple === null ||
          column.filterMultiple === undefined ||
          column.filterMultiple,
        locale: tableContext.locale.value,
        onSelectKeys: onSelectKeys,
        onOpenChange: onOpenChange,
        onMenuClick: onMenuClick,
        openKeys: openKeys.value,
      }
    })

    const filtered = eagerComputed(() => !!filteredKeys.value?.length)

    return {
      getPopupContainer,
      triggerOpen,
      mergedOpen,
      onReset,
      onConfirm,
      onDropdownOpenChange: (open: boolean) => {
        triggerOpen(open)
        if (!(open || customFilterDropdown.value)) {
          onConfirm()
        }
      },
      doFilter,
      filterItemsProps,
      onSelectKeys,
      filteredKeys,
      dropdownPrefixCls,
      filtered,
      locale: tableContext.locale,
      customFilterDropdown,
      customFilterIcon,
      custocustomFilterDropdownProps,
    }
  },
})
</script>

<template>
  <Dropdown
    :trigger="['click']"
    :open="mergedOpen"
    :get-popup-container="getPopupContainer"
    placement="bottomRight"
    :overlay-class-name="`${prefixCls}-dropdown-root`"
    @open-change="onDropdownOpenChange"
    @click.stop
  >
    <template #overlay>
      <FilterWrapper :class="`${prefixCls}-dropdown`">
        <RenderVNode
          v-if="customFilterDropdown"
          :vnode="customFilterDropdown(custocustomFilterDropdownProps)"
        ></RenderVNode>
        <template v-else>
          <FilterItems
            v-bind="filterItemsProps"
            root
            :dropdown-prefix-cls="dropdownPrefixCls"
            :get-popup-container="getPopupContainer"
            :prefix-cls="prefixCls"
          />
          <div :class="`${prefixCls}-dropdown-btns`">
            <ProButton
              type="link"
              size="small"
              :disabled="filteredKeys.length === 0"
              @click="onReset"
            >
              {{ locale.filterReset }}
            </ProButton>
            <ProButton type="primary" size="small" @click="onConfirm">
              {{ locale.filterConfirm }}
            </ProButton>
          </div>
        </template>
      </FilterWrapper>
    </template>
    <span :class="{ [`${prefixCls}-trigger`]: true, active: filtered }">
      <RenderVNode
        v-if="customFilterIcon"
        :vnode="
          customFilterIcon({
            column: column.originColumn,
            filtered: filtered,
          })
        "
      />
      <FilterFilled v-else />
    </span>
  </Dropdown>
</template>
