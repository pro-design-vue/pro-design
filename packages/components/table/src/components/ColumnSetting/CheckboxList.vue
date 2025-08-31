<!--
 * @Author: shen
 * @Date: 2023-11-19 13:39:31
 * @LastEditors: shen
 * @LastEditTime: 2025-08-29 13:57:20
 * @Description:
-->
<script lang="ts">
import type { PropType } from 'vue'
import type { DataNode } from 'ant-design-vue/es/tree'
import type { ColumnsState, Key } from '../interface'
import { defineComponent, computed, shallowRef, ref, triggerRef } from 'vue'
import { useInjectContainer } from '../../hooks/useContainer'
import { Tree } from 'ant-design-vue'
import { omit, RenderVNode } from '@pro-design-vue/utils'
import { genColumnKey } from '../../utils/util'
import { watch } from 'vue'
import CheckboxListItem from './CheckboxListItem.vue'
export default defineComponent({
  name: 'CheckboxList',
  inheritAttrs: false,
  components: { Tree, CheckboxListItem, RenderVNode },
  props: {
    className: String,
    title: String,
    checkable: {
      type: Boolean,
      default: true,
    },
    draggable: {
      type: Boolean,
      default: true,
    },
    showTitle: {
      type: Boolean,
      default: true,
    },
    listHeight: {
      type: Number,
      default: undefined,
    },
    list: {
      type: Array as PropType<any[]>,
      default: () => [],
    },
  },
  setup(props) {
    const { columnsMap, setColumnsMap, sortKeyColumns, setSortKeyColumns } = useInjectContainer()
    const checkedKeys = shallowRef<string[]>([])
    const treeMap = new Map<string | number, DataNode>()
    const treeData = ref<any[]>([])
    const show = computed(() => props.list && props.list.length > 0)

    const loopData = (
      data: any[],
      parentConfig?: ColumnsState & {
        columnKey: string
      },
    ): DataNode[] => {
      return data.map(({ key, children, ...rest }) => {
        const columnKey = genColumnKey(
          key,
          [parentConfig?.columnKey, rest.index || '0'].filter(Boolean).join('-'),
        )
        const config = columnsMap.value[columnKey || 'null'] || { show: true }
        if (config.show !== false && !children) {
          checkedKeys.value.push(columnKey)
        }
        const item: DataNode = {
          key: columnKey,
          ...omit(rest, ['className']),
          selectable: false,
          disabled: config.disable === true,
          disableCheckbox:
            typeof config.disable === 'boolean' ? config.disable : config.disable?.checkbox,
          isLeaf: parentConfig ? true : undefined,
          isRoot: parentConfig ? false : true,
        }
        if (children) {
          item.children = loopData(children, {
            ...config,
            columnKey,
          })
          // 如果children 已经全部是show了，把自己也设置为show
          if (
            item.children?.every((childrenItem) =>
              checkedKeys.value?.includes(childrenItem.key as string),
            )
          ) {
            checkedKeys.value.push(columnKey)
          }
        }
        treeMap.set(key, item)
        return item
      })
    }

    watch(
      [columnsMap, () => props.list, show],
      () => {
        checkedKeys.value = []
        const newData = loopData(props.list)
        triggerRef(checkedKeys)
        treeData.value = newData?.map(({ disabled, ...config }) => {
          return omit(config, ['disabled'])
        })
      },
      { immediate: true },
    )

    const move = (id: Key, targetId: Key, dropPosition: number) => {
      const newMap = { ...columnsMap.value }
      const newColumns = [...sortKeyColumns.value]
      const findIndex = newColumns.findIndex((columnKey) => columnKey === id)
      const targetIndex = newColumns.findIndex((columnKey) => columnKey === targetId)
      const isDownWard = dropPosition > findIndex
      if (findIndex < 0) return
      const targetItem = newColumns[findIndex]!
      newColumns.splice(findIndex, 1)

      if (dropPosition === 0) {
        newColumns.unshift(targetItem)
      } else {
        newColumns.splice(isDownWard ? targetIndex : targetIndex + 1, 0, targetItem)
      }
      // 重新生成排序数组
      newColumns.forEach((key, order) => {
        newMap[key] = { ...(newMap[key] || {}), order }
      })
      // 更新数组
      setColumnsMap(newMap)
      setSortKeyColumns(newColumns)
    }

    /** 选中反选功能 */
    const onCheckTree = (e) => {
      const newColumnMap = { ...columnsMap.value }

      const loopSetShow = (key: string | number) => {
        const newSetting = { ...newColumnMap[key] }
        newSetting.show = e.checked
        // 如果含有子节点，也要选中
        if (treeMap?.get(key)?.children) {
          treeMap.get(key)?.children?.forEach((item) => loopSetShow(item.key))
        }
        newColumnMap[key] = newSetting
      }
      loopSetShow(e.node.key)
      setColumnsMap({ ...newColumnMap })
    }

    return { show, treeData, checkedKeys, onCheckTree, move }
  },
})
</script>

<template>
  <template v-if="show">
    <span v-if="showTitle" :class="`${className}-list-title`">
      {{ title }}
    </span>
    <div style="max-height: 260px; overflow: auto">
      <Tree
        block-node
        :selectable="false"
        :checkable="checkable"
        :draggable="draggable && !!treeData?.length && treeData?.length > 1"
        :checkedKeys="checkedKeys"
        :height="listHeight"
        :treeData="treeData"
        @check="(_, e) => onCheckTree(e)"
        @drop="
          (info) => {
            const dropKey = info.node.key
            const dragKey = info.dragNode.key
            const { dropPosition, dropToGap } = info
            const position = dropPosition === -1 || !dropToGap ? dropPosition + 1 : dropPosition
            move(dragKey, dropKey, position)
          }
        "
      >
        <template #title="{ title, key, fixed, isRoot }">
          <CheckboxListItem
            v-if="title"
            :className="className"
            :columnKey="key"
            :fixed="fixed"
            :isRoot="isRoot"
          >
            <RenderVNode :vnode="title" />
          </CheckboxListItem>
        </template>
      </Tree>
    </div>
  </template>
</template>
