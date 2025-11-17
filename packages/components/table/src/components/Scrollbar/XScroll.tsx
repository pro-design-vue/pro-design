/*
 * @Author: shen
 * @Date: 2023-11-07 15:07:59
 * @LastEditors: shen
 * @LastEditTime: 2025-11-17 14:49:48
 * @Description:
 */
import {
  defineComponent,
  computed,
  ref,
  watch,
  onMounted,
  onBeforeUnmount,
  // withModifiers,
} from 'vue'
import { useInjectTable } from '../context/TableContext'
import { useHScrollSyncInject } from '../../hooks/useHScrollSync'
import { isMacOsUserAgent, isIOSUserAgent } from '../../utils/browser'
import { addClass, removeClass } from '../../utils/class'

import type { CSSProperties } from 'vue'

export default defineComponent({
  props: { onlyAutoShow: { type: Boolean }, notShowAuto: { type: Boolean } },
  setup: (props) => {
    const tableContext = useInjectTable()
    const prefixCls = computed(() => `${tableContext.props.prefixCls}`)
    const scrollViewportRef = ref<HTMLDivElement>()
    const rootRef = ref<HTMLDivElement>()
    const isScrollbarActive = ref(false)
    const commonStyle = computed<any>(() => {
      const scrollBarSize = `${tableContext.scrollBarSize.value || 15}px`
      const style = {
        height: scrollBarSize,
        minHeight: scrollBarSize,
        maxHeight: scrollBarSize,
        width: '100%',
      }
      return style
    })
    const isApple = isMacOsUserAgent() || isIOSUserAgent()

    const stickyStyle = computed(() => {
      const scrollBarSize = `-${tableContext.scrollBarSize.value || 15}px`
      const horizontalScrollSticky = tableContext.props.horizontalScrollSticky
      const paginationSticky = tableContext.props.paginationSticky
      if (horizontalScrollSticky === true) {
        let bottom = 0
        if (tableContext.pos.value.bottom && !!paginationSticky) {
          bottom +=
            paginationSticky === true
              ? tableContext.bottomPaginationHeight.value
              : (paginationSticky.offsetBottom || 0) + tableContext.bottomPaginationHeight.value
        }
        return {
          position: 'sticky',
          'z-index': 8,
          bottom: `${bottom}px`,
          marginTop: isApple ? scrollBarSize : 0,
        }
      }
      return {}
    })
    const isIosScroll = computed(() => 0 === tableContext.scrollBarSize.value && isApple)
    const rootClass = computed(() => ({
      [`${prefixCls.value}-horizontal-scroll`]: true,
      [`${prefixCls.value}-horizontal-scroll-hidden`]: 0 === tableContext.scrollBarSize.value,
      [`${prefixCls.value}-scrollbar-active`]: isScrollbarActive.value,
      [`${prefixCls.value}-apple-scroll`]: isApple,
    }))

    const showHorizontalScrollbar = computed(
      () =>
        tableContext.showHorizontalScrollbar.value &&
        (!props.onlyAutoShow || isIosScroll.value) &&
        (!props.notShowAuto || !isIosScroll.value),
    )
    const showVerticalScrollbar = computed(() => tableContext.showVerticalScrollbar.value)
    const horizontalStyle = computed<any>(() => {
      const width = `${tableContext.bodyMaxWidth.value}px`
      return { ...commonStyle.value, width, minWidth: width, maxWidth: width }
    })
    const verticalStyle = computed<CSSProperties>(() => ({
      width: `${tableContext.scrollBarSize.value}px`,
      height: '100%',
      overflowX: 'hidden',
    }))
    const { addHScrollDom, removeHScrollDom } = useHScrollSyncInject()

    let timer: any = null
    const onScroll = () => {
      if (isIosScroll.value) {
        clearTimeout(timer)
        addClass(rootRef.value!, `${prefixCls.value}-scrolling`)
        timer = setTimeout(() => {
          removeClass(rootRef.value!, `${prefixCls.value}-scrolling`)
        }, 500)
      }
    }

    onMounted(() => {
      watch(
        scrollViewportRef,
        () => {
          if (scrollViewportRef.value) {
            removeHScrollDom(scrollViewportRef.value)
            scrollViewportRef.value.removeEventListener('scroll', onScroll)
            addHScrollDom(scrollViewportRef.value, true)
            scrollViewportRef.value.addEventListener('scroll', onScroll, { passive: true })
          }
        },
        { immediate: true },
      )
    })
    onBeforeUnmount(() => {
      clearTimeout(timer)
      if (scrollViewportRef.value) {
        removeHScrollDom(scrollViewportRef.value)
        scrollViewportRef.value.removeEventListener('scroll', onScroll)
      }
    })

    return () => {
      if (showHorizontalScrollbar.value) {
        return (
          <div
            ref={rootRef}
            class={rootClass.value}
            aria-hidden="true"
            style={{ ...commonStyle.value, ...stickyStyle.value }}
            onMousedown={() => (isScrollbarActive.value = true)}
            onMouseenter={() => (isScrollbarActive.value = true)}
            // onTouchstart={withModifiers(() => (isScrollbarActive.value = true), ['passive'])}
            onMouseleave={() => (isScrollbarActive.value = false)}
            onTouchend={() => (isScrollbarActive.value = false)}
          >
            <div
              key="center"
              ref={scrollViewportRef}
              class={`${prefixCls.value}-horizontal-scroll-viewport`}
              style={commonStyle.value}
            >
              <div
                class={`${prefixCls.value}-body-horizontal-scroll-container`}
                style={horizontalStyle.value}
              ></div>
            </div>
            {showVerticalScrollbar.value && <div style={verticalStyle.value}></div>}
          </div>
        )
      }
      return null
    }
  },
})
