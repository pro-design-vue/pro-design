<!--
 * @Author: shen
 * @Date: 2023-11-18 13:06:40
 * @LastEditors: shen
 * @LastEditTime: 2025-08-27 13:44:46
 * @Description:
-->
<script lang="ts">
import type { PropType } from 'vue'
import { defineComponent, computed, onMounted, ref } from 'vue'
import { Popover, Tooltip, Checkbox } from 'ant-design-vue'
import { SettingOutlined } from '@ant-design/icons-vue'
import { useInjectContainer } from '../../hooks/useContainer'
import { genColumnKey } from '../../utils/util'
import { useIntl } from '@pro-design-vue/components/config-provider'
import GroupCheckboxList from './GroupCheckboxList.vue'

export default defineComponent({
  name: 'ColumnSetting',
  inheritAttrs: false,
  props: {
    prefixCls: String,
    checkable: {
      type: Boolean,
      default: true,
    },
    checkedReset: {
      type: Boolean,
      default: true,
    },
    draggable: {
      type: Boolean,
      default: true,
    },
    listsHeight: {
      type: Number,
      default: undefined,
    },
    columns: {
      type: Array as PropType<any[]>,
      default: () => [],
    },
  },
  components: { Popover, Tooltip, Checkbox, GroupCheckboxList, SettingOutlined },
  setup(props) {
    const intl = useIntl()
    const columnRef = ref(null)
    const counter = useInjectContainer()
    const className = computed(() => `${props.prefixCls}-column-setting`)
    const localColumns = computed(() => props.columns)
    const { columnsMap, setColumnsMap, clearPersistenceStorage } = counter

    onMounted(() => {
      if (counter.props.columnsState?.value) {
        columnRef.value = JSON.parse(JSON.stringify(counter.props.columnsState?.value || {}))
      }
    })

    /**
     * 设置全部选中，或全部未选中
     *
     * @param show
     */
    const setAllSelectAction = (show: boolean = true) => {
      const columnKeyMap = {}
      const loopColumns = (columns: any) => {
        columns.forEach(({ key, fixed, index, children, disable }: any) => {
          const columnKey = genColumnKey(key, index)
          if (columnKey) {
            columnKeyMap[columnKey] = {
              // 子节点 disable 时，不修改节点显示状态
              show: disable ? columnsMap[columnKey]?.show : show,
              fixed,
              disable,
              order: columnsMap[columnKey]?.order,
            }
          }
          if (children) {
            loopColumns(children)
          }
        })
      }
      loopColumns(localColumns.value)
      setColumnsMap(columnKeyMap)
    }

    /** 全选和反选 */
    const checkedAll = (e: any) => {
      if (e.target.checked) {
        setAllSelectAction()
      } else {
        setAllSelectAction(false)
      }
    }

    /** 重置项目 */
    const clearClick = () => {
      clearPersistenceStorage?.()
      // setColumnsMap(counter.props.columnsState?.defaultValue || columnRef.value || counter.defaultColumnKeyMap.value!)
      setColumnsMap({
        ...counter.defaultColumnKeyMap.value!,
        ...(counter.props.columnsState?.defaultValue || columnRef.value),
      })
    }

    // 未选中的 key 列表
    const unCheckedKeys = computed(() =>
      Object.values(columnsMap.value).filter((value) => !value || value.show === false),
    )

    // 是否已经选中
    const indeterminate = computed(
      () =>
        unCheckedKeys.value.length > 0 && unCheckedKeys.value.length !== localColumns.value.length,
    )

    return {
      intl,
      indeterminate,
      unCheckedKeys,
      localColumns,
      clearClick,
      checkedAll,
      setAllSelectAction,
      className,
    }
  },
})
</script>

<template>
  <Popover
    trigger="click"
    placement="bottomLeft"
    :arrow="false"
    :overlay-class-name="`${className}-popover`"
    :overlay-style="{ paddingTop: '0', width: '224px' }"
  >
    <Tooltip :title="intl.getMessage('tableToolBar.columnSetting', '列设置')">
      <div :class="`${prefixCls}-toolbar-actions-item`">
        <SettingOutlined />
      </div>
    </Tooltip>
    <template #title>
      <div :class="`${className}-title`">
        <Checkbox
          v-if="checkable"
          :indeterminate="indeterminate"
          :checked="unCheckedKeys.length === 0 && unCheckedKeys.length !== localColumns.length"
          @change="checkedAll"
        >
          {{ intl.getMessage('tableToolBar.columnDisplay', '列展示') }}
        </Checkbox>
        <div v-else></div>
        <a v-if="checkedReset" :class="`${className}-action-rest-button`" @click="clearClick">
          {{ intl.getMessage('tableToolBar.reset', '重置') }}
        </a>
      </div>
    </template>
    <template #content>
      <GroupCheckboxList
        :checkable="checkable"
        :draggable="draggable"
        :className="className"
        :localColumns="localColumns"
        :listsHeight="listsHeight"
      />
    </template>
  </Popover>
</template>
