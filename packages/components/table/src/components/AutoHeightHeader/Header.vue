<!--
 * @Author: shen
 * @Date: 2023-11-06 16:03:18
 * @LastEditors: shen
 * @LastEditTime: 2025-08-27 13:42:47
 * @Description:
-->
<script lang="ts">
import { defineComponent, ref, provide, computed, onMounted, onBeforeUnmount } from 'vue'
import { useInjectTable } from '../context/TableContext'
import { VIEWPORT_REF, AUTO_HEADER_HEIGHT } from '../../utils/constant'
import { useHScrollSyncInject } from '../../hooks/useHScrollSync'
import { useProvideHeader } from '../context/HeaderContext'
import { resize } from '@pro-design-vue/directives'
import eagerComputed from '../../utils/eagerComputed'
import XScroll from '../Scrollbar/XScroll'
import ColGroup from './ColGroup'
import HeaderRow from './HeaderRow.vue'

import type { PropType, CSSProperties } from 'vue'
import type { HeaderSticky } from '../interface'

export default defineComponent({
  name: 'TableHeader',
  components: { XScroll, ColGroup, HeaderRow },
  inheritAttrs: false,
  directives: { resize },
  props: {
    prefixCls: String,
    wrapText: { type: Boolean, default: false },
    sticky: { type: [Boolean, Object] as PropType<boolean | HeaderSticky>, default: false },
  },
  emits: ['scrollLeft', 'resizeheight'],
  setup(props, { emit }) {
    const headerRef = ref<HTMLDivElement>()
    const viewportRef = ref<HTMLDivElement>()
    const tableContext = useInjectTable()
    const maxHeaderHeight = ref(0)
    const dragColumnPlaceholderRef = ref<HTMLSpanElement>()

    provide(VIEWPORT_REF, viewportRef)
    provide(AUTO_HEADER_HEIGHT, true)

    const showHeaderScrollbar = computed(() => tableContext.props.showHeaderScrollbar)

    const { addHScrollDom, removeHScrollDom } = useHScrollSyncInject()

    onMounted(() => {
      addHScrollDom(viewportRef.value!)
    })
    onBeforeUnmount(() => {
      removeHScrollDom(viewportRef.value!)
    })

    useProvideHeader({
      dragColumnPlaceholderRef,
      headerRef,
      maxHeaderHeight,
    })

    const headerClass = computed(() => ({
      [`${props.prefixCls}-header`]: true,
      [`${props.prefixCls}-auto-header-height`]: true,
      [`${props.prefixCls}-sticky-header`]: props.sticky,
      [`${props.prefixCls}-show-header-scrollbar`]: tableContext.props.showHeaderScrollbar,
    }))
    const viewportClass = computed(() => ({ [`${props.prefixCls}-center-viewport`]: true }))
    const viewportStyle = computed(() => ({
      height: `calc(100% + ${tableContext.showHorizontalScrollbar.value ? tableContext.scrollBarSize.value || 15 : 0}px)`,
    }))

    const headerStyle = computed<CSSProperties>(() => {
      const style: CSSProperties = { height: `${maxHeaderHeight.value}px` }
      if (props.sticky) {
        style.top = `${(typeof props.sticky == 'object' ? props.sticky.offsetHeader : 0) || 0}px`
      }
      return style
    })

    const scrollbarStyle = computed<CSSProperties>(() => {
      const barSize = `${tableContext.showVerticalScrollbar.value ? tableContext.scrollBarSize.value : 0}px`
      return {
        display: barSize === '0px' ? 'none' : 'block',
        width: barSize,
        minWidth: barSize,
        maxWidth: barSize,
        position: 'sticky',
        right: `-${barSize}`,
      }
    })

    const shadowRightStyle = computed<CSSProperties | undefined>(() => {
      return tableContext.rightWidth.value ? undefined : { display: 'none' }
    })
    const shadowLeftStyle = computed<CSSProperties | undefined>(() =>
      tableContext.leftWidth.value
        ? undefined
        : { position: 'absolute', left: '0px', top: '0px', bottom: '0px' },
    )

    return {
      headerClass,
      viewportClass,
      columnRows: eagerComputed(() => tableContext.columnRowsForAutoHeaderHeight.value),
      viewportStyle,
      scrollbarStyle,
      headerStyle,
      headerRef,
      dragColumnPlaceholderRef,
      viewportRef,
      maxHeaderHeight,
      handleResize: (e: CustomEvent) => {
        maxHeaderHeight.value = e.detail.height
      },
      shadowRightStyle,
      shadowLeftStyle,
      showHeaderScrollbar,
      handleHeightResize: (e: CustomEvent) => {
        emit('resizeheight', e)
      },
    }
  },
})
</script>

<template>
  <div
    v-resize:height
    key="header"
    :class="headerClass"
    :style="headerStyle"
    @resizeheight="handleHeightResize"
  >
    <div ref="viewportRef" :class="viewportClass" :style="viewportStyle">
      <div ref="headerRef" :class="`${prefixCls}-header-container`">
        <table
          v-resize:height
          key="header"
          :style="{
            'table-layout': 'fixed',
            width: '100%',
            'border-collapse': 'separate',
            'border-spacing': '0',
            position: 'absolute',
          }"
          @resizeheight="handleResize"
        >
          <ColGroup />
          <thead :class="`${prefixCls}-thead`">
            <template v-for="(item, index) in columnRows" :key="item.rowIndex">
              <HeaderRow
                :level="index + 1"
                :prefix-cls="prefixCls"
                :cells="item"
                :wrap-text="wrapText"
              />
            </template>
          </thead>
        </table>
        <span ref="dragColumnPlaceholderRef" :class="`${prefixCls}-drag-column-placeholder`"></span>
      </div>
    </div>
    <div :class="`${prefixCls}-header-scrollbar`" :style="scrollbarStyle"></div>
    <div
      v-if="shadowLeftStyle"
      :class="`${prefixCls}-cell-shadow-left`"
      :style="shadowLeftStyle"
    ></div>
    <div
      v-if="shadowRightStyle"
      :class="`${prefixCls}-cell-shadow-right`"
      :style="shadowRightStyle"
    ></div>
    <XScroll v-if="showHeaderScrollbar" only-auto-show />
  </div>
  <XScroll v-if="showHeaderScrollbar" not-show-auto />
</template>
