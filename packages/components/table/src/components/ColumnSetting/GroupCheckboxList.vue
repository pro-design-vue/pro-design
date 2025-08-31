<!--
 * @Author: shen
 * @Date: 2023-11-18 20:37:59
 * @LastEditors: shen
 * @LastEditTime: 2025-08-27 13:44:52
 * @Description:
-->
<script lang="ts">
import type { PropType } from 'vue'
import { defineComponent, ref, watch, computed } from 'vue'
import { useIntl } from '@pro-design-vue/components/config-provider'
import CheckboxList from './CheckboxList.vue'

export default defineComponent({
  name: 'GroupCheckboxList',
  components: { CheckboxList },
  inheritAttrs: false,
  props: {
    className: String,
    checkable: {
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
    localColumns: {
      type: Array as PropType<any[]>,
      default: () => [],
    },
  },
  setup(props) {
    const intl = useIntl()
    const rightList = ref<any[]>([])
    const leftList = ref<any[]>([])
    const list = ref<any[]>([])

    watch(
      () => props.localColumns,
      () => {
        const right: any[] = []
        const left: any[] = []
        const center: any[] = []
        props.localColumns.forEach((item: any) => {
          /** 不在 setting 中展示的 */
          if (item.hideInSetting) {
            return
          }
          const { fixed } = item
          if (fixed === 'left' || fixed === true) {
            left.push(item)
            return
          }
          if (fixed === 'right') {
            right.push(item)
            return
          }
          center.push(item)
        })
        rightList.value = right
        leftList.value = left
        list.value = center
      },
      {
        immediate: true,
      },
    )

    const showRight = computed(() => rightList.value && rightList.value.length > 0)
    const showLeft = computed(() => leftList.value && leftList.value.length > 0)

    const listClass = computed(() => ({
      [`${props.className}-list`]: true,
      [`${props.className}-list-group`]: showRight.value || showLeft.value,
    }))
    return { intl, showRight, showLeft, rightList, leftList, list, listClass }
  },
})
</script>

<template>
  <div :class="listClass">
    <CheckboxList
      :title="intl.getMessage('tableToolBar.leftFixedTitle', '固定在左侧')"
      :list="leftList"
      :checkable="checkable"
      :draggable="draggable"
      :className="className"
      :listsHeight="listsHeight"
    />
    <CheckboxList
      :title="intl.getMessage('tableToolBar.noFixedTitle', '不固定')"
      :list="list"
      :checkable="checkable"
      :draggable="draggable"
      :className="className"
      :showTitle="showLeft || showRight"
      :listsHeight="listsHeight"
    />
    <CheckboxList
      :title="intl.getMessage('tableToolBar.rightFixedTitle', '固定在右侧')"
      :list="rightList"
      :checkable="checkable"
      :draggable="draggable"
      :className="className"
      :listsHeight="listsHeight"
    />
  </div>
</template>
