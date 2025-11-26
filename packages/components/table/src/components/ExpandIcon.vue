<!--
 * @Author: shen
 * @Date: 2023-11-09 11:35:58
 * @LastEditors: shen
 * @LastEditTime: 2025-11-26 15:20:06
 * @Description:
-->
<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useInjectTable } from './context/TableContext'
export default defineComponent({
  name: 'ProTableExpandIcon',
  props: {
    prefixCls: String,
    record: Object,
    expanded: Boolean,
    expandable: Boolean,
    disabled: Boolean,
    onExpand: Function,
    expandIconType: String,
  },
  emits: ['expand'],
  setup(props, { emit }) {
    const tableContext = useInjectTable()

    const className = computed(() => {
      const { prefixCls, expanded, expandable, disabled, expandIconType } = props
      const expandIconClass = `${prefixCls}-row-expand-icon`
      return {
        [expandIconClass]: true,
        [`${expandIconClass}-${expandIconType}`]: true,
        [`${expandIconClass}-spaced`]: !expandable,
        [`${expandIconClass}-expanded`]: expandable && expanded,
        [`${expandIconClass}-collapsed`]: expandable && !expanded,
        [`${expandIconClass}-disabled`]: !!disabled,
      }
    })
    return {
      handleClick: () => {
        if (props.disabled) {
          return
        }
        emit('expand', props.record)
      },
      className,
      label: computed(() =>
        props.expanded ? tableContext.locale.value.collapse : tableContext.locale.value.expand,
      ),
      expandIcon: computed(() => tableContext.props.expandIcon),
      props,
    }
  },
})
</script>

<template>
  <span v-if="expandIcon" @click.stop>
    <component :is="() => expandIcon!(props as any)"></component>
  </span>
  <button
    v-else
    type="button"
    :class="className"
    :aria-label="label"
    @click.stop="handleClick"
  ></button>
</template>
