<!--
 * @Author: shen
 * @Date: 2023-11-06 16:03:18
 * @LastEditors: shen
 * @LastEditTime: 2025-10-12 19:10:27
 * @Description:
-->
<script lang="ts">
import type { PropType } from 'vue'
import type { UseFetchDataAction } from '../../hooks/useFetchData'
import type { OptionConfig, Key, OptionSearchProps } from '../interface'

import { defineComponent, h, computed, onMounted } from 'vue'
import { Space, Tooltip } from 'ant-design-vue'
import {
  ReloadOutlined,
  FilterOutlined,
  SettingOutlined,
  ColumnHeightOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons-vue'
import { omit, omitUndefined } from '@pro-design-vue/utils'
import { useIntl } from '@pro-design-vue/components/config-provider'
import Search from './Search.vue'
import DensityIcon from './DensityIcon.vue'
import FullscreenIcon from './FullscreenIcon.vue'
import ColumnSetting from '../ColumnSetting/ColumnSetting.vue'

export default defineComponent({
  name: 'TableToolBar',
  inheritAttrs: false,
  components: {
    Space,
    ProSearch: Search,
    DensityIcon,
    Tooltip,
    ColumnSetting,
    ReloadOutlined,
    InfoCircleOutlined,
    FullscreenIcon,
  },
  props: {
    prefixCls: String,
    title: String,
    subTitle: String,
    tooltip: String,
    options: { type: [Object, Boolean] as PropType<OptionConfig | false>, default: undefined },

    actionsRef: Object as PropType<UseFetchDataAction<any> & { fullScreen: () => void }>,
    selectedRowKeys: {
      type: Array as PropType<Key[]>,
      default: () => [],
    },
    selectedRows: {
      type: Array as PropType<any[]>,
      default: () => [],
    },
    tableColumn: {
      type: Array as PropType<any[]>,
      default: () => [],
    },
    onFormSearchSubmit: {
      type: Function as PropType<(params: any) => void>,
      default: undefined,
    },
  },
  setup(props) {
    const intl = useIntl()

    const defaultOptions = {
      reload: () => props.actionsRef?.reload(),
      density: true,
      setting: true,
      filter: false,
      search: false,
      fullScreen: () => props.actionsRef?.fullScreen(),
    }

    const mergeOptions = computed<OptionConfig>(() => {
      if (props.options === false) {
        return {}
      }
      return { ...defaultOptions, ...props.options }
    })

    const defaultSearchConfig = {
      onChange: (e) => {
        props.actionsRef!.keyword.value = e.target.value!
      },
    }

    const searchConfig: any = computed(() => {
      if (props.options === false) {
        return false
      }
      if (!mergeOptions.value!.search) return false

      if (mergeOptions.value!.search === true) return defaultSearchConfig

      return omit(
        {
          ...(mergeOptions.value!.search ?? {}),
          ...defaultSearchConfig,
        },
        ['name', 'onSearch'],
      )
    })

    const onSearch = async (keyword: string) => {
      if (!props.options || !props.options.search) {
        return
      }
      const { name = 'keyword' } = props.options.search === true ? {} : props.options.search

      /** 如果传入的 onSearch 返回值为 false，应该直接拦截请求 */
      const success = (props.options.search as OptionSearchProps)?.onSearch?.(keyword)

      if (success === false) return

      props.onFormSearchSubmit?.(
        omitUndefined({
          [name]: keyword,
        }),
      )
    }

    const onReload = (e) => {
      if (mergeOptions.value.reload === true) {
        defaultOptions.reload()
      } else if (typeof mergeOptions.value.reload === 'function') {
        mergeOptions.value.reload?.(e, props.actionsRef)
      }
    }

    const onFullScreen = (e) => {
      if (mergeOptions.value.fullScreen === true) {
        defaultOptions.fullScreen()
      } else if (typeof mergeOptions.value.fullScreen === 'function') {
        mergeOptions.value.fullScreen?.(e, props.actionsRef)
      }
    }

    onMounted(() => {
      if (searchConfig.value.value || searchConfig.value.defaultValue) {
        props.actionsRef!.keyword.value =
          searchConfig.value.value || searchConfig.value.defaultValue
      }
    })

    return {
      h,
      intl,
      mergeOptions,
      searchConfig,
      FilterOutlined,
      SettingOutlined,
      ColumnHeightOutlined,
      onSearch,
      onReload,
      onFullScreen,
    }
  },
})
</script>

<template>
  <div :class="`${prefixCls}-toolbar`">
    <div :class="`${prefixCls}-toolbar-container`">
      <slot name="toolbar">
        <div :class="`${prefixCls}-toolbar-left`">
          <div :class="`${prefixCls}-toolbar-title`" v-if="!!title || !!$slots.title">
            <slot name="title">
              {{ title }}
            </slot>
            <div :class="`${prefixCls}-toolbar-subtitle`">{{ subTitle }}</div>
            <Tooltip v-if="tooltip" :title="tooltip">
              <InfoCircleOutlined style="margin-inline-start: 3px" />
            </Tooltip>
          </div>
          <Space :class="`${prefixCls}-toolbar-options`" v-if="options !== false">
            <template v-if="mergeOptions.search !== false && !(!!title || !!$slots.title)">
              <ProSearch v-bind="searchConfig" @search="onSearch" />
              <slot name="searchExtra" :set-params="actionsRef!.setParams" />
            </template>
          </Space>
        </div>
        <div :class="`${prefixCls}-toolbar-right`">
          <Space :class="`${prefixCls}-toolbar-actions`">
            <template v-if="mergeOptions.search !== false && (!!title || !!$slots.title)">
              <ProSearch v-bind="searchConfig" @search="onSearch" />
              <slot name="searchExtra" :set-params="actionsRef!.setParams" />
            </template>
            <slot name="actions" :set-params="actionsRef!.setParams"></slot>
            <template v-if="options !== false">
              <Tooltip
                v-if="mergeOptions.reload !== false"
                :title="intl.getMessage('tableToolBar.reload', '刷新')"
              >
                <div :class="`${prefixCls}-toolbar-actions-item`">
                  <ReloadOutlined :spin="actionsRef?.pollingLoading.value" @click="onReload" />
                </div>
              </Tooltip>
              <DensityIcon v-if="mergeOptions.density !== false" :prefixCls="prefixCls" />
              <ColumnSetting
                v-if="mergeOptions.setting !== false"
                :prefix-cls="prefixCls"
                :columns="tableColumn"
              />
              <span v-if="mergeOptions.fullScreen !== false" @click="onFullScreen">
                <FullscreenIcon :prefixCls="prefixCls" />
              </span>
            </template>
          </Space>
        </div>
      </slot>
    </div>
  </div>
</template>
