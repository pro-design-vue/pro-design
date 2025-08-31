<!--
 * @Author: shen
 * @Date: 2023-11-06 16:03:18
 * @LastEditors: shen
 * @LastEditTime: 2025-08-27 13:46:08
 * @Description:
-->
<script lang="ts">
import type { PropType, CSSProperties } from 'vue'
import type { HeaderSticky } from '../interface'

import { defineComponent, ref, provide, computed, onMounted, onBeforeUnmount } from 'vue'
import { VIEWPORT_REF } from '../../utils/constant'
import { useHScrollSyncInject } from '../../hooks/useHScrollSync'
import { useInjectTable } from '../context/TableContext'
import { resize } from '@pro-design-vue/directives'
import XScroll from '../Scrollbar/XScroll'
import HeaderRowsWrap from './HeaderRowsWrap.vue'

export default defineComponent({
  name: 'TableHeader',
  components: { XScroll, HeaderRowsWrap },
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

    provide(VIEWPORT_REF, viewportRef)
    const maxHeaderHeight = computed(() => tableContext.maxHeaderHeight.value)
    const { addHScrollDom, removeHScrollDom } = useHScrollSyncInject()

    onMounted(() => {
      addHScrollDom(viewportRef.value!)
    })
    onBeforeUnmount(() => {
      removeHScrollDom(viewportRef.value!)
    })

    const showHeaderScrollbar = computed(() => tableContext.props.showHeaderScrollbar)
    const headerClass = computed(() => ({
      [`${props.prefixCls}-header`]: true,
      [`${props.prefixCls}-sticky-header`]: props.sticky,
      [`${props.prefixCls}-show-header-scrollbar`]: showHeaderScrollbar.value,
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

    return {
      headerClass,
      viewportClass,
      viewportStyle,
      scrollbarStyle: computed<CSSProperties>(() => {
        const barSize = `${tableContext.showVerticalScrollbar.value ? tableContext.scrollBarSize.value : 0}px`
        return {
          display: '0px' === barSize ? 'none' : 'block',
          width: barSize,
          minWidth: barSize,
          maxWidth: barSize,
          position: 'sticky',
          right: `-${barSize}`,
        }
      }),
      headerStyle,
      headerRef,
      viewportRef,
      maxHeaderHeight,
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
    role="presentation"
    :class="headerClass"
    :style="headerStyle"
    @resizeheight="handleHeightResize"
  >
    <div ref="viewportRef" :class="viewportClass" :style="viewportStyle">
      <div :class="`${prefixCls}-header-container`">
        <HeaderRowsWrap key="left" :prefix-cls="prefixCls" :wrap-text="wrapText" type="left" />
        <HeaderRowsWrap key="center" :prefix-cls="prefixCls" :wrap-text="wrapText" type="center" />
        <HeaderRowsWrap key="right" :prefix-cls="prefixCls" :wrap-text="wrapText" type="right" />
      </div>
    </div>
    <div :class="`${prefixCls}-header-scrollbar`" :style="scrollbarStyle"></div>
    <XScroll v-if="showHeaderScrollbar" only-auto-show />
  </div>
  <XScroll v-if="showHeaderScrollbar" not-show-auto />
</template>
