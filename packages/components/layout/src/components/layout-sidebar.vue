<script setup lang="ts">
import type { CSSProperties } from 'vue'

import { computed, shallowRef, useSlots, watchEffect } from 'vue'

import { useScrollLock } from '@vueuse/core'

import { SidebarCollapseButton, SidebarFixedButton } from './widgets'
import { usePrefixCls } from '@pro-design-vue/hooks'

interface Props {
  /**
   * 折叠区域高度
   * @default 42
   */
  collapseHeight?: number
  /**
   * 折叠宽度
   * @default 48
   */
  collapseWidth?: number
  /**
   * 隐藏的dom是否可见
   * @default true
   */
  domVisible?: boolean
  /**
   * 扩展区域宽度
   */
  extraWidth: number
  /**
   * 固定扩展区域
   * @default false
   */
  fixedExtra?: boolean
  /**
   * 头部高度
   */
  headerHeight: number
  /**
   * 是否侧边混合模式
   * @default false
   */
  isSidebarMixed?: boolean
  /**
   * 顶部margin
   * @default 60
   */
  marginTop?: number
  /**
   * 混合菜单宽度
   * @default 80
   */
  mixedWidth?: number
  /**
   * 顶部padding
   * @default 60
   */
  paddingTop?: number
  /**
   * 是否显示
   * @default true
   */
  show?: boolean
  /**
   * 显示折叠按钮
   * @default true
   */
  showCollapseButton?: boolean
  /**
   * 显示固定按钮
   * @default true
   */
  showFixedButton?: boolean
  /**
   * 主题
   */
  theme: string

  /**
   * 宽度
   */
  width: number
  /**
   * zIndex
   * @default 0
   */
  zIndex?: number
  /**
   * 固定
   */
  fixed?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  collapseHeight: 42,
  collapseWidth: 48,
  domVisible: true,
  fixedExtra: false,
  isSidebarMixed: false,
  marginTop: 0,
  mixedWidth: 70,
  paddingTop: 0,
  show: true,
  fixed: true,
  showCollapseButton: true,
  showFixedButton: true,
  zIndex: 0,
})

const emit = defineEmits<{ leave: [] }>()
const prefixCls = usePrefixCls('layout-sidebar')
const collapse = defineModel<boolean>('collapse')
const extraCollapse = defineModel<boolean>('extraCollapse')
const expandOnHovering = defineModel<boolean>('expandOnHovering')
const expandOnHover = defineModel<boolean>('expandOnHover')
const extraVisible = defineModel<boolean>('extraVisible')

const isLocked = useScrollLock(document.body)
const slots = useSlots()

const asideRef = shallowRef<HTMLDivElement | null>()

const hiddenSideStyle = computed((): CSSProperties => calcMenuWidthStyle(true))

const style = computed((): CSSProperties => {
  const { isSidebarMixed, marginTop, paddingTop, zIndex } = props

  return {
    ...calcMenuWidthStyle(false),
    height: `calc(100% - ${marginTop}px)`,
    marginTop: `${marginTop}px`,
    paddingTop: `${paddingTop}px`,
    zIndex,
    ...(isSidebarMixed && extraVisible.value ? { transition: 'none' } : {}),
  }
})

const extraStyle = computed((): CSSProperties => {
  const { extraWidth, show, width, zIndex } = props

  return {
    left: `${width}px`,
    width: extraVisible.value && show ? `${extraWidth}px` : 0,
    zIndex,
  }
})

const extraTitleStyle = computed((): CSSProperties => {
  const { headerHeight } = props

  return {
    height: `${headerHeight - 1}px`,
  }
})

const contentWidthStyle = computed((): CSSProperties => {
  const { collapseWidth, fixedExtra, isSidebarMixed, mixedWidth } = props
  if (isSidebarMixed && fixedExtra) {
    return { width: `${collapse.value ? collapseWidth : mixedWidth}px` }
  }
  return {}
})

const contentStyle = computed((): CSSProperties => {
  const { collapseHeight, headerHeight } = props

  return {
    height: `calc(100% - ${headerHeight + collapseHeight}px)`,
    paddingTop: '8px',
    ...contentWidthStyle.value,
  }
})

const headerStyle = computed((): CSSProperties => {
  const { headerHeight, isSidebarMixed } = props

  return {
    ...(isSidebarMixed ? { display: 'flex', justifyContent: 'center' } : {}),
    height: `${headerHeight - 1}px`,
    ...contentWidthStyle.value,
  }
})

const extraContentStyle = computed((): CSSProperties => {
  const { collapseHeight, headerHeight } = props
  return {
    height: `calc(100% - ${headerHeight + collapseHeight}px)`,
  }
})

const collapseStyle = computed((): CSSProperties => {
  return {
    height: `${props.collapseHeight}px`,
  }
})

watchEffect(() => {
  extraVisible.value = props.fixedExtra ? true : extraVisible.value
})

function calcMenuWidthStyle(isHiddenDom: boolean): CSSProperties {
  const { extraWidth, fixedExtra, isSidebarMixed, show, width } = props

  let widthValue =
    width === 0
      ? '0px'
      : `${width + (isSidebarMixed && fixedExtra && extraVisible.value ? extraWidth : 0)}px`

  const { collapseWidth } = props

  if (isHiddenDom && expandOnHovering.value && !expandOnHover.value) {
    widthValue = `${collapseWidth}px`
  }

  return {
    ...(widthValue === '0px' ? { overflow: 'hidden' } : {}),
    flex: `0 0 ${widthValue}`,
    marginLeft: show ? 0 : `-${widthValue}`,
    maxWidth: widthValue,
    minWidth: widthValue,
    width: widthValue,
  }
}

function handleMouseenter(e: MouseEvent) {
  if (e?.offsetX < 10) {
    return
  }

  // 未开启和未折叠状态不生效
  if (expandOnHover.value) {
    return
  }
  if (!expandOnHovering.value) {
    collapse.value = false
  }
  if (props.isSidebarMixed) {
    isLocked.value = true
  }
  expandOnHovering.value = true
}

function handleMouseleave() {
  emit('leave')
  if (props.isSidebarMixed) {
    isLocked.value = false
  }
  if (expandOnHover.value) {
    return
  }

  expandOnHovering.value = false
  collapse.value = true
  extraVisible.value = false
}
</script>

<template>
  <div v-if="domVisible && fixed" :style="hiddenSideStyle" :class="[prefixCls, theme]"></div>
  <aside
    :class="[
      prefixCls,
      theme,
      {
        [`${prefixCls}--fixed`]: fixed,
        [`${prefixCls}--mixed`]: isSidebarMixed,
        [`${prefixCls}--no-mixed`]: !isSidebarMixed,
      },
    ]"
    :style="style"
    @mouseenter="handleMouseenter"
    @mouseleave="handleMouseleave"
  >
    <SidebarFixedButton
      v-if="!collapse && !isSidebarMixed && showFixedButton"
      v-model:expand-on-hover="expandOnHover"
    />
    <div v-if="slots.logo" :style="headerStyle">
      <slot name="logo"></slot>
    </div>
    <div :style="contentStyle" :class="`${prefixCls}-content`">
      <div :class="`${prefixCls}-scroll`">
        <slot></slot>
      </div>
    </div>

    <div :style="collapseStyle"></div>
    <SidebarCollapseButton
      v-if="showCollapseButton && !isSidebarMixed"
      v-model:collapsed="collapse"
    />
    <div
      v-if="isSidebarMixed"
      ref="asideRef"
      :class="{
        [`${prefixCls}-extra`]: true,
        [`${prefixCls}-extra--border`]: extraVisible,
      }"
      :style="extraStyle"
    >
      <SidebarCollapseButton
        v-if="isSidebarMixed && expandOnHover && showCollapseButton"
        v-model:collapsed="extraCollapse"
      />

      <SidebarFixedButton
        v-if="!extraCollapse && showFixedButton"
        v-model:expand-on-hover="expandOnHover"
      />
      <div v-if="!extraCollapse" :style="extraTitleStyle" :class="`${prefixCls}-extra-title`">
        <slot name="extra-title"></slot>
      </div>
      <div :style="extraContentStyle" :class="`${prefixCls}-extra-content`">
        <div :class="`${prefixCls}-scroll`">
          <slot name="extra"></slot>
        </div>
      </div>
    </div>
  </aside>
</template>
