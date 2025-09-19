<!--
 * @Author: shen
 * @Date: 2023-11-06 22:03:08
 * @LastEditors: shen
 * @LastEditTime: 2025-09-19 15:05:47
 * @Description:
-->
<script lang="ts">
import { defineComponent, computed, ref, watch, onMounted, shallowRef, onBeforeUnmount } from 'vue'
import { Empty } from 'ant-design-vue'
import { useInjectSlots } from '../context/TableSlotsContext'
import { useProvideBody } from '../context/BodyContext'
import { useInjectTable } from '../context/TableContext'
import { useInjectHover } from '../../hooks/useHover'
import { useVScrollSyncInject } from '../../hooks/useVScrollSync'
import { useHScrollSyncInject } from '../../hooks/useHScrollSync'
import { RenderVNode, RenderSlot } from '../../utils/renderVNode'
import { resize } from '@pro-design-vue/directives'
import useTooltip from '../../hooks/useTooltip'
import onClickOutside from '../../utils/onClickOutside'
import BodyRows from './BodyRows.vue'
import XScroll from '../Scrollbar/XScroll'
import YScroll from '../Scrollbar/YScroll'

import type { PropType, CSSProperties } from 'vue'
import type { SummaryFixed } from '../interface'
import type { CustomSlotsType } from '../../utils/type'

export default defineComponent({
  name: 'TableBody',
  components: {
    BodyRows,
    Empty,
    RenderVNode,
    RenderSlot,
    HorizontalScroll: XScroll,
    YScroll,
  },
  directives: { resize },
  inheritAttrs: false,
  props: {
    prefixCls: String as PropType<string>,
    wrapText: { type: Boolean as PropType<boolean>, default: false },
    bodyScrollWidth: { type: Number as PropType<number> },
    bodyWidth: { type: Number as PropType<number> },
    bodyHeight: { type: Number as PropType<number> },
    height: { type: [Number, String] as PropType<number | string> },
    scrollX: [Number, String] as PropType<number | string>,
    summaryFixed: [Boolean, String] as PropType<boolean | SummaryFixed>,
    emptyText: Function,
    summary: Function,
  },
  emits: [
    'scroll',
    'scrollLeft',
    'scrollTop',
    'update:bodyWidth',
    'update:bodyHeight',
    'update:bodyScrollWidth',
    'keydown',
  ],
  slots: {} as CustomSlotsType<{
    emptyText: any
    default: any
  }>,
  setup(props, { emit, attrs, expose }) {
    const tableContext = useInjectTable()
    const tableSlotsContext = useInjectSlots()

    const dragRowPlaceholderRef = ref<HTMLDivElement>()
    const bodyRef = ref<HTMLDivElement>()
    const bodyInnerRef = ref<HTMLDivElement>()
    const scrollLayerRef = ref<HTMLDivElement>()
    const viewportRef = ref<HTMLDivElement>()
    const summaryViewportRef = ref<HTMLDivElement>()

    const bodyViewportRef = ref<HTMLDivElement>()
    const bodyContainerRef = ref<HTMLDivElement>()

    const summaryHeight = ref(0)

    const leftColumns = computed(() => tableContext.leftColumns.value)
    const centerColumns = computed(() => tableContext.centerColumns.value)
    const rightColumns = computed(() => tableContext.rightColumns.value)
    const showWatermark = computed(() => tableContext.status.value.code !== 4)

    const leftPopupContainer = ref<HTMLDivElement>()
    const centerPopupContainer = ref<HTMLDivElement>()
    const rightPopupContainer = ref<HTMLDivElement>()

    const leftTarget = ref<HTMLDivElement>()
    const centerTarget = ref<HTMLDivElement>()
    const rightTarget = ref<HTMLDivElement>()

    const { hoverColumnKey } = useInjectHover()
    const { open } = useTooltip({ hoverColumnKey })

    const popupContent = shallowRef<any>()
    const popupContentPos = ref<string | null>()
    const contextmenuPos = ref({ clientX: 0, clientY: 0 })

    const setTargetStyle = (target: HTMLDivElement) => {
      target.style.display = 'none'
      target.style.opacity = '0'
      target.style.left = '0px'
      target.style.top = '0px'
      target.style.height = '1px'
      target.style.maxWidth = props.bodyWidth! - 4 + 'px'
    }

    const setContextmenuPopupPos = () => {
      const { clientX, clientY } = contextmenuPos.value
      const popupPos = popupContentPos.value
      const target =
        popupPos === 'left'
          ? leftTarget.value
          : popupPos === 'right'
            ? rightTarget.value
            : centerTarget.value
      if (!popupPos || !target) {
        return
      }
      target.style.display = 'block'
      const { left, top } = target.parentElement!.getBoundingClientRect()
      const firstChild = target.children[0]!
      const minHeight = Math.min(
        target.scrollHeight,
        firstChild.scrollHeight!,
        viewportHeight.value - 4,
      )
      target.style.opacity = '1'
      target.style.height = `${minHeight}px`
      let leftPos = clientX - left
      let rightPos = clientY - top
      if (rightPos + minHeight > viewportHeight.value) {
        rightPos = viewportHeight.value - minHeight - 2
      }

      if (popupContentPos.value === 'center') {
        if (leftPos + target.offsetWidth > tableContext.centerWidth.value) {
          leftPos = tableContext.centerWidth.value - target.offsetWidth - 2
        }
      } else if (popupContentPos.value === 'right') {
        if (leftPos + target.offsetWidth > tableContext.rightWidth.value) {
          leftPos = tableContext.rightWidth.value - target.offsetWidth - 2
        }
      } else {
        if (leftPos + target.offsetWidth > props.bodyWidth!) {
          leftPos = props.bodyWidth! - target.offsetWidth - 2
        }
      }
      target.style.left = `${leftPos}px`
      target.style.top = `${rightPos}px`
    }

    const showYScrollbar = computed(() => tableContext.showVerticalScrollbar.value)
    const showXScrollbar = computed(() => tableContext.showHorizontalScrollbar.value)

    watch(
      [tableContext.centerWidth, tableContext.rightWidth, () => props.bodyWidth],
      () => {
        setContextmenuPopupPos()
      },
      { flush: 'post' },
    )

    let contextmenuTimer: any

    onClickOutside(leftTarget, () => {
      if (popupContentPos.value === 'left') {
        popupContentPos.value = null
        setTargetStyle(leftTarget.value!)
      }
    })
    onClickOutside(centerTarget, () => {
      if (popupContentPos.value === 'center') {
        popupContentPos.value = null
        setTargetStyle(centerTarget.value!)
      }
    })
    onClickOutside(rightTarget, () => {
      if (popupContentPos.value === 'right') {
        popupContentPos.value = null
        setTargetStyle(rightTarget.value!)
      }
    })

    useProvideBody({
      onBodyCellContextmenu: (event, args, type) => {
        if (tableContext.props.hasContextmenuPopup) {
          const { clientX, clientY } = event
          setTargetStyle(leftTarget.value!)
          setTargetStyle(centerTarget.value!)
          setTargetStyle(rightTarget.value!)
          popupContentPos.value = type
          popupContent.value = () =>
            tableSlotsContext.contextmenuPopup?.({
              event,
              ...args,
              hidePopup: () => {
                ;((popupContentPos.value = null),
                  setTargetStyle(leftTarget.value!),
                  setTargetStyle(centerTarget.value!),
                  setTargetStyle(rightTarget.value!))
              },
            })
          contextmenuPos.value = { clientX, clientY }
          clearTimeout(contextmenuTimer)
          contextmenuTimer = setTimeout(() => {
            setContextmenuPopupPos()
          })
          event.preventDefault()
        }
      },
      bodyRef,
      tooltipOpen: open,
      leftPopupContainer,
      centerPopupContainer,
      rightPopupContainer,
      dragRowPlaceholderRef,
    })

    expose({ bodyRef })

    onBeforeUnmount(() => {
      clearTimeout(contextmenuTimer)
      clearTimeout(undefined)
    })
    const { addHScrollDom, removeHScrollDom } = useHScrollSyncInject()
    const { addVScrollDom, removeVScrollDom } = useVScrollSyncInject()

    onMounted(() => {
      watch(
        summaryViewportRef,
        (newValue, oldValue) => {
          removeHScrollDom(oldValue!)
          addHScrollDom(newValue!)
        },
        { flush: 'post', immediate: true },
      )
      watch(
        bodyContainerRef,
        (newValue, oldValue) => {
          removeHScrollDom(oldValue!)
          addHScrollDom(newValue!)
        },
        { flush: 'post', immediate: true },
      )
      watch(
        bodyViewportRef,
        (newValue, oldValue) => {
          removeVScrollDom(oldValue!)
          addVScrollDom(newValue!)
        },
        { flush: 'post', immediate: true },
      )
    })
    onBeforeUnmount(() => {
      removeHScrollDom(summaryViewportRef.value!)
      removeHScrollDom(bodyContainerRef.value!)
      removeVScrollDom(bodyViewportRef.value!)
    })

    const bodyInnerWidth = ref(0)
    const emptyHeight = ref(0)

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

    const bodyViewportStyle = computed<CSSProperties>(() => ({
      width: `calc(100% + ${tableContext.showVerticalScrollbar.value ? tableContext.scrollBarSize.value || 15 : 0}px)`,
      // width: `calc(100% + 0px)`,
      overflowX: 'hidden',
      overflowY: 'auto',
      height: '100%',
    }))
    const isEmpty = computed(() => 0 === tableContext.pageData.value.length)
    const leftShadowStyle = computed<CSSProperties>(() =>
      props.bodyWidth! - tableContext.rightWidth.value > tableContext.leftWidth.value
        ? {
            position: 'absolute',
            left: `${tableContext.leftWidth.value}px`,
            height: '100%',
          }
        : { display: 'none' },
    )
    const rightShadowStyle = computed<CSSProperties>(() =>
      tableContext.rightWidth.value
        ? {
            position: 'absolute',
            left: props.bodyWidth! - tableContext.rightWidth.value + 'px',
            height: '100%',
          }
        : { display: 'none' },
    )
    const bodyClass = computed(() => ({
      [`${props.prefixCls}-body`]: true,
      [`${props.prefixCls}-unselectable`]: false !== tableContext.props.rangeSelection,
    }))
    const fixLeftClass = computed(() => ({
      [`${props.prefixCls}-fix-left`]: true,
      [`${props.prefixCls}-no-columns`]: !leftColumns.value.length,
    }))
    const fixRightClass = computed(() => ({
      [`${props.prefixCls}-fix-right`]: true,
      [`${props.prefixCls}-no-columns`]: !rightColumns.value.length,
    }))
    const centerClass = computed(() => ({
      [`${props.prefixCls}-center`]: true,
      [`${props.prefixCls}-no-columns`]: !centerColumns.value.length,
    }))
    const summaryViewportClass = computed(() => ({
      [`${props.prefixCls}-center-viewport`]: true,
    }))
    const containerClass = computed(() => ({
      [`${props.prefixCls}-center-container`]: true,
    }))
    const viewportHeight = computed(
      () =>
        tableContext.viewportHeight.value +
        (props.summaryFixed ? emptyHeight.value : summaryHeight.value + emptyHeight.value),
    )
    const containerStyle = computed<CSSProperties>(() => ({
      width: `${tableContext.centerWidth.value}px`,
      height: `${viewportHeight.value}px`,
    }))
    const summaryViewportStyle = computed<CSSProperties>(() => ({
      height: `calc(100% + ${tableContext.scrollBarSize.value || 15}px)`,
    }))
    const scrollLayerStyle = computed<CSSProperties>(() => ({
      height: `${viewportHeight.value}px`,
      width: `${tableContext.bodyMaxWidth.value}px`,
      minWidth: '100%',
    }))
    const rowsHeightStyle = computed<CSSProperties>(() => ({
      height: `${viewportHeight.value}px`,
      overflow: 'hidden',
      minHeight: '100%',
      transform: 'translateZ(0)',
    }))
    const bodyStyle = computed<CSSProperties>(() => ({
      ...(attrs.style || {}),
      maxHeight: 'number' == typeof props.height ? `${props.height}px` : props.height,
      overflowY: 'hidden',
    }))
    const bodyContainerStyle = computed<CSSProperties>(
      () =>
        ({
          height: tableContext.showHorizontalScrollbar.value
            ? `calc(100% + ${tableContext.scrollBarSize.value || 15}px)`
            : 'calc(100%)',
          zIndex: 'unset !important',
          overflowX: 'auto',
          overflowY: 'hidden',
        }) as any,
    )
    const centerStyle = computed<CSSProperties>(() => ({ height: `${viewportHeight.value}px` }))
    const leftStyle = computed<CSSProperties>(() => {
      const width = `${tableContext.leftWidth.value}px`
      return {
        width,
        minWidth: width,
        maxWidth: width,
        height: `${viewportHeight.value}px`,
      }
    })
    const rightStyle = computed<CSSProperties>(() => {
      const width = `${tableContext.rightWidth.value}px`
      return {
        width,
        minWidth: width,
        maxWidth: width,
        height: `${viewportHeight.value}px`,
      }
    })
    const summaryClass = computed(() => ({
      [`${props.prefixCls}-summary`]: true,
      [`${props.prefixCls}-position-absolute`]: !isEmpty.value,
    }))
    const fixedSummaryClass = computed(() => [
      summaryClass.value,
      `${props.prefixCls}-summary-fixed`,
      `${props.prefixCls}-summary-fixed-${props.summaryFixed}`,
    ])
    const summaryStyle = computed<CSSProperties>(() => {
      const styles = { height: `${summaryHeight.value}px` }
      return Object.assign(
        styles,
        props.summaryFixed
          ? showXScrollbar.value
            ? { borderTop: 'none' }
            : {}
          : {
              position: 'absolute',
              bottom: 0,
              width: `${props.bodyWidth}px`,
              borderTop: 'none',
            },
      ) as CSSProperties
    })
    const topSummaryStyle = computed<CSSProperties>(() => {
      if ('object' == typeof tableContext.props.sticky) {
        const { offsetHeader = 0, topSummary = false } = tableContext.props.sticky
        return topSummary
          ? ({
              ...summaryStyle.value,
              position: 'sticky',
              top: `${offsetHeader + tableContext.realHeaderHeight.value}px`,
            } as CSSProperties)
          : (summaryStyle.value as CSSProperties)
      }
      return summaryStyle.value as CSSProperties
    })
    const emptyStyle = computed<CSSProperties>(() => ({ width: `${props.bodyWidth}px` }))
    return {
      bodyContainerStyle,
      measureDomStyle: computed<any>(() => ({
        width: '100%',
        height: '100%!important',
        position: 'absolute!important',
        fontSize: '100px!important',
        opacity: '0.1!important',
        textAlign: 'center!important',
        top: '0px!important',
        left: '0px!important',
        pointerEvents: 'none',
        display: 'block!important',
        color: '#000000!important',
        margin: '0px!important',
        padding: '0px!important',
        transform: 'unset!important',
        visibility: 'visible!important',
        zIndex: '999!important',
      })),
      isEmpty,
      emptyStyle,
      handleEmptyHeight: (e: CustomEvent) => {
        emptyHeight.value = e.detail.height
      },
      bodyClass,
      fixLeftClass,
      fixRightClass,
      centerClass,
      containerClass,
      summaryViewportClass,
      summaryClass,
      rightStyle,
      centerStyle,
      leftStyle,
      summaryViewportStyle,
      containerStyle,
      summaryStyle,
      viewportHeight,
      leftColumns,
      centerColumns,
      rightColumns,
      bodyInnerWidth,
      handleBodyInnerResize: (e: CustomEvent) => {
        bodyInnerWidth.value = e.detail.width
      },
      handleBodyScrollResize: (e: CustomEvent) => {
        emit('update:bodyScrollWidth', e.detail.width)
      },
      bodyRef,
      bodyInnerRef,
      viewportRef,
      summaryViewportRef,
      handleResize: (e: CustomEvent) => {
        summaryHeight.value = e.detail.height
      },
      bodyStyle,
      handleBodyResize: (e: CustomEvent) => {
        emit('update:bodyWidth', e.detail.width)
        emit('update:bodyHeight', e.detail.height)
      },
      emptyImage: Empty.PRESENTED_IMAGE_SIMPLE,
      scrollLayerStyle,
      getRowClassName: (record: any, index: number) => {
        const rowClassName = tableContext.props.rowClassName
        return (
          typeof rowClassName == 'function' ? rowClassName(record, index) : rowClassName
        ) as string
      },
      showWatermark,
      leftPopupContainer,
      centerPopupContainer,
      rightPopupContainer,
      dragRowPlaceholderRef,
      leftShadowStyle,
      rightShadowStyle,
      fixedSummaryClass,
      scrollLayerRef,
      scrollbarStyle,
      topSummaryStyle,
      leftTarget,
      centerTarget,
      rightTarget,
      popupContent,
      popupContentPos,
      handleContextmenuPopupResize: () => {
        setContextmenuPopupPos()
      },
      handleDragStart: (e: MouseEvent) => {
        if (e.target instanceof HTMLImageElement) {
          e.preventDefault()
          return false
        }
      },
      handleKeydown: (e: KeyboardEvent) => {
        emit('keydown', e)
      },
      bodyViewportStyle,
      bodyViewportRef,
      bodyContainerRef,
      rowsHeightStyle,
      showYScrollbar,
    }
  },
})
</script>

<template>
  <RenderSlot>
    <div
      v-if="summary && summaryFixed === 'top'"
      key="summary"
      :class="fixedSummaryClass"
      :style="topSummaryStyle"
    >
      <div :class="summaryViewportClass" :style="summaryViewportStyle">
        <div
          ref="summaryViewportRef"
          :class="`${prefixCls}-summary-container`"
          :style="{ height: 'calc(100% + 15px)' }"
        >
          <div v-resize:height @resizeheight="handleResize">
            <RenderVNode :vnode="summary"></RenderVNode>
          </div>
        </div>
        <div :class="`${prefixCls}-cell-shadow-left`" :style="leftShadowStyle"></div>
        <div :class="`${prefixCls}-cell-shadow-right`" :style="rightShadowStyle"></div>
        <div :class="`${prefixCls}-summary-scrollbar`" :style="scrollbarStyle"></div>
      </div>
    </div>
  </RenderSlot>
  <div
    v-resize
    key="body"
    ref="bodyRef"
    :class="bodyClass"
    :style="bodyStyle"
    @dragstart="handleDragStart"
    @keydown="handleKeydown"
    @resize="handleBodyResize"
  >
    <div
      :style="{
        width: '100%',
        overflow: 'hidden',
        position: 'relative',
        transform: 'translateZ(0)',
      }"
    >
      <div
        ref="bodyViewportRef"
        :class="`${prefixCls}-body-viewport-container`"
        :style="bodyViewportStyle"
      >
        <div :style="rowsHeightStyle">
          <div
            ref="bodyContainerRef"
            :class="`${prefixCls}-body-container`"
            :style="bodyContainerStyle"
          >
            <div ref="leftPopupContainer" key="left" :class="fixLeftClass" :style="leftStyle">
              <BodyRows
                v-if="leftColumns.length"
                :get-row-class-name="getRowClassName"
                type="left"
                :prefix-cls="prefixCls"
                :wrap-text="wrapText"
              />
              <div v-else :class="`${prefixCls}-cell-shadow-left`"></div>
              <div
                v-if="summary && !summaryFixed"
                key="summary"
                :class="summaryClass"
                :style="summaryStyle"
              >
                <div :class="summaryViewportClass" :style="summaryViewportStyle">
                  <div ref="summaryViewportRef" :class="`${prefixCls}-summary-container`">
                    <div v-resize:height @resizeheight="handleResize">
                      <RenderVNode :vnode="summary"></RenderVNode>
                    </div>
                  </div>
                  <div :style="leftShadowStyle" :class="`${prefixCls}-cell-shadow-left`"></div>
                  <div :style="rightShadowStyle" :class="`${prefixCls}-cell-shadow-right`"></div>
                </div>
              </div>

              <div ref="leftTarget" :class="`${prefixCls}-body-contextmenu-container`">
                <div
                  v-resize
                  :class="`${prefixCls}-body-contextmenu-container-inner`"
                  @resize="handleContextmenuPopupResize"
                >
                  <component v-if="popupContentPos === 'left'" :is="popupContent"></component>
                </div>
              </div>
            </div>
            <div key="center" :class="centerClass" :style="centerStyle">
              <div ref="centerPopupContainer" :class="containerClass" :style="containerStyle">
                <BodyRows
                  v-if="centerColumns.length"
                  :get-row-class-name="getRowClassName"
                  type="center"
                  :prefix-cls="prefixCls"
                  :wrap-text="wrapText"
                />
                <div ref="centerTarget" :class="`${prefixCls}-body-contextmenu-container`">
                  <div
                    v-resize
                    :class="`${prefixCls}-body-contextmenu-container-inner`"
                    @resize="handleContextmenuPopupResize"
                  >
                    <component v-if="popupContentPos === 'center'" :is="popupContent"></component>
                  </div>
                </div>
              </div>
            </div>
            <div key="right" ref="rightPopupContainer" :class="fixRightClass" :style="rightStyle">
              <BodyRows
                v-if="rightColumns.length"
                :get-row-class-name="getRowClassName"
                type="right"
                :prefix-cls="prefixCls"
                :wrap-text="wrapText"
              />
              <div v-else :class="`${prefixCls}-cell-shadow-right`"></div>
              <div ref="rightTarget" :class="`${prefixCls}-body-contextmenu-container`">
                <div
                  v-resize="true"
                  :class="`${prefixCls}-body-contextmenu-container-inner`"
                  @resize="handleContextmenuPopupResize"
                >
                  <component v-if="popupContentPos === 'right'" :is="popupContent"></component>
                </div>
              </div>
            </div>
            <span ref="dragRowPlaceholderRef" :class="`${prefixCls}-drag-placeholder`"></span>
          </div>
        </div>
        <div v-if="isEmpty" key="empty" :class="`${prefixCls}-empty-container`">
          <div v-resize:height style="padding: 1px" @resizeheight="handleEmptyHeight">
            <RenderVNode :vnode="emptyText"> <Empty :image="emptyImage" /> </RenderVNode>
          </div>
        </div>
      </div>
      <div v-resize :style="measureDomStyle" @resize="handleBodyResize"></div>
      <div
        v-resize:width
        :class="`${prefixCls}-body-scroll-measure`"
        :style="`min-width: ${bodyInnerWidth}px`"
        @resizewidth="handleBodyScrollResize"
      ></div>
      <div
        v-resize:width
        :class="`${prefixCls}-body-inner-measure`"
        :style="`min-width: ${scrollX}px`"
        @resizewidth="handleBodyInnerResize"
      ></div>
    </div>
    <YScroll :style="`height: ${bodyHeight}px`" />
  </div>
  <RenderSlot>
    <div
      v-if="summary && summaryFixed === 'bottom'"
      key="summary"
      :class="fixedSummaryClass"
      :style="summaryStyle"
    >
      <div :class="summaryViewportClass" :style="summaryViewportStyle">
        <div
          ref="summaryViewportRef"
          :class="`${prefixCls}-summary-container`"
          :style="{ height: 'calc(100% + 15px)' }"
        >
          <div v-resize:height="true" @resizeheight="handleResize">
            <RenderVNode :vnode="summary"></RenderVNode>
          </div>
        </div>
        <div :style="leftShadowStyle" :class="`${prefixCls}-cell-shadow-left`"></div>
        <div :style="rightShadowStyle" :class="`${prefixCls}-cell-shadow-right`"></div>
        <div :class="`${prefixCls}-summary-scrollbar`" :style="scrollbarStyle"></div>
      </div>
    </div>
  </RenderSlot>
  <HorizontalScroll />
</template>
