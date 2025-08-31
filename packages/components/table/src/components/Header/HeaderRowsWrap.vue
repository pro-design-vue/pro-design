<!--
 * @Author: shen
 * @Date: 2023-11-08 15:58:42
 * @LastEditors: shen
 * @LastEditTime: 2025-08-27 13:46:42
 * @Description:
-->
<script lang="ts">
import type { PropType, CSSProperties } from 'vue'
import type { RowType } from '../interface'

import { defineComponent, computed, ref } from 'vue'
import { useInjectTable } from '../context/TableContext'
import { useProvideHeader } from '../context/HeaderContext'
import { resize } from '@pro-design-vue/directives'
import HeaderRows from './HeaderRows.vue'

export default defineComponent({
  name: 'TableHeaderWrap',
  components: { HeaderRows },
  directives: { resize },
  inheritAttrs: false,
  props: {
    prefixCls: String as PropType<string>,
    wrapText: { type: Boolean as PropType<boolean>, default: false },
    type: String as PropType<'left' | 'center' | 'right'>,
  },
  setup(props) {
    const dragColumnPlaceholderRef = ref<HTMLSpanElement>()
    const headerRef = ref<HTMLDivElement>()
    const centerContainerRef = ref<HTMLDivElement>()
    const tableContext = useInjectTable()

    const leftColumns = computed(() => tableContext.leftHeaderColumns.value)
    const centerColumns = computed(() => tableContext.centerHeaderColumns.value)
    const visibleCenterHeaderColumns = computed(() => tableContext.visibleCenterHeaderColumns.value)
    const rightColumns = computed(() => tableContext.rightHeaderColumns.value)
    const maxHeaderHeight = computed(() => tableContext.maxHeaderHeight.value)

    useProvideHeader({
      dragColumnPlaceholderRef,
      headerRef,
      maxHeaderHeight,
    })

    const fixLeftClass = computed(() => ({
      [`${props.prefixCls}-fix-left`]: true,
      [`${props.prefixCls}-row-wrapper`]: true,
      [`${props.prefixCls}-no-columns`]: !leftColumns.value.length,
      [`${props.prefixCls}-last-columns`]:
        leftColumns.value.length &&
        rightColumns.value.length === 0 &&
        centerColumns.value.length === 0,
    }))
    const fixRightClass = computed(() => ({
      [`${props.prefixCls}-fix-right`]: true,
      [`${props.prefixCls}-row-wrapper`]: true,
      [`${props.prefixCls}-no-columns`]: !rightColumns.value.length,
      [`${props.prefixCls}-last-columns`]: rightColumns.value.length,
    }))
    const centerClass = computed(() => ({
      [`${props.prefixCls}-center`]: true,
      [`${props.prefixCls}-row-wrapper`]: true,
      [`${props.prefixCls}-no-columns`]: !centerColumns.value.length,
      [`${props.prefixCls}-last-columns`]:
        centerColumns.value.length && rightColumns.value.length === 0,
    }))

    const rootClass = computed(() =>
      'left' === props.type
        ? fixLeftClass.value
        : 'center' === props.type
          ? centerClass.value
          : 'right' === props.type
            ? fixRightClass.value
            : '',
    )

    const viewportClass = computed(() => ({ [`${props.prefixCls}-center-viewport`]: true }))
    const containerClass = computed(() => ({ [`${props.prefixCls}-center-container`]: true }))
    const containerStyle = computed<CSSProperties>(() => ({
      width: `${tableContext.centerWidth.value}px`,
    }))
    const centerStyle = computed<CSSProperties>(() => ({}))
    const leftStyle = computed<CSSProperties>(() => {
      const leftWidth = `${tableContext.leftWidth.value}px`
      return { width: leftWidth, minWidth: leftWidth, maxWidth: leftWidth }
    })
    const rightStyle = computed<CSSProperties>(() => {
      const rightWidth = `${tableContext.rightWidth.value}px`
      return { width: rightWidth, minWidth: rightWidth, maxWidth: rightWidth }
    })
    const rootStyle = computed<CSSProperties>(() =>
      'left' === props.type
        ? leftStyle.value
        : 'center' === props.type
          ? centerStyle.value
          : 'right' === props.type
            ? rightStyle.value
            : {},
    )
    const shadowRightStyle = computed<CSSProperties | undefined>(() =>
      tableContext.rightWidth.value ? undefined : { display: 'none' },
    )

    return {
      fixLeftClass,
      fixRightClass,
      centerClass,
      containerClass,
      viewportClass,
      rightStyle,
      centerStyle,
      leftStyle,
      containerStyle,
      centerColumns,
      headerRef,
      tableContext,
      centerContainerRef,
      leftGap: (type: RowType) =>
        type === 'left'
          ? 0
          : type === 'center'
            ? tableContext.leftWidth.value
            : tableContext.leftWidth.value + tableContext.centerWidth.value,
      visibleCenterHeaderColumns,
      leftColumns,
      rightColumns,
      dragColumnPlaceholderRef,
      shadowRightStyle,
      rootClass,
      rootStyle,
    }
  },
})
</script>

<template>
  <div
    v-if="('center' === type && centerColumns.length) || 'center' !== type"
    ref="headerRef"
    :class="rootClass"
    :style="rootStyle"
  >
    <template v-if="type === 'left'">
      <HeaderRows
        :prefix-cls="prefixCls"
        :wrap-text="wrapText"
        type="left"
        :columns="leftColumns"
        :left-gap="leftGap('left')"
      />
      <div :class="`${prefixCls}-cell-shadow-left`"></div>
      <span
        v-show="tableContext.leftWidth.value"
        ref="dragColumnPlaceholderRef"
        :class="`${prefixCls}-drag-column-placeholder`"
      ></span>
    </template>
    <template v-else-if="type === 'center'">
      <div ref="centerContainerRef" :class="containerClass" :style="containerStyle">
        <HeaderRows
          :prefix-cls="prefixCls"
          :wrap-text="wrapText"
          type="center"
          :columns="visibleCenterHeaderColumns"
          :left-gap="leftGap('center')"
        />
      </div>
      <span
        v-show="tableContext.centerWidth.value"
        ref="dragColumnPlaceholderRef"
        :class="`${prefixCls}-drag-column-placeholder`"
      ></span>
    </template>
    <template v-else>
      <div :class="`${prefixCls}-cell-shadow-right`" :style="shadowRightStyle"></div>
      <HeaderRows
        :prefix-cls="prefixCls"
        :wrap-text="wrapText"
        type="right"
        :columns="rightColumns"
        :left-gap="leftGap('right')"
      />
      <span
        v-show="tableContext.rightWidth.value"
        ref="dragColumnPlaceholderRef"
        :class="`${prefixCls}-drag-column-placeholder`"
      ></span>
    </template>
  </div>
</template>
