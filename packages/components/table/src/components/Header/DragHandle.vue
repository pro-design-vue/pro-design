<!--
 * @Author: shen
 * @Date: 2023-11-07 22:37:42
 * @LastEditors: shen
 * @LastEditTime: 2025-08-29 14:01:00
 * @Description:
-->
<script lang="ts">
import type { PropType } from 'vue'
import type { EventHandler } from '../EventInterface'
import type { FinallyColumnType, ResizeActionType } from '../interface'
import type { RafFrame } from '../../utils/raf'

import { defineComponent, onUnmounted, computed, getCurrentInstance, ref } from 'vue'
import { useInjectTable } from '../context/TableContext'
import { defaultMinWidth } from '../../hooks/useColumns'
import raf from '../../utils/raf'
import addEventListenerWrap from '../../utils/addEventListener'

const events = {
  mouse: {
    start: 'mousedown',
    move: 'mousemove',
    stop: 'mouseup',
  },
  touch: {
    start: 'touchstart',
    move: 'touchmove',
    stop: 'touchend',
  },
}
type HandleEvent = MouseEvent & TouchEvent

export default defineComponent({
  name: 'DragHandle',
  props: {
    prefixCls: String as PropType<string>,
    minWidth: { type: Number as PropType<number>, default: defaultMinWidth },
    maxWidth: { type: Number as PropType<number>, default: Infinity },
    column: { type: Object as PropType<FinallyColumnType<any>>, default: undefined },
  },
  setup(props) {
    let startX = 0
    let moveEvent = { remove: () => {} }
    let stopEvent = { remove: () => {} }

    const tableContext = useInjectTable()

    const removeEvents = () => {
      moveEvent.remove()
      stopEvent.remove()
    }
    onUnmounted(() => {
      removeEvents()
    })

    const minWidth = computed(() =>
      typeof props.minWidth != 'number' || isNaN(props.minWidth) ? defaultMinWidth : props.minWidth,
    )
    const maxWidth = computed(() =>
      typeof props.maxWidth != 'number' || isNaN(props.maxWidth) ? Infinity : props.maxWidth,
    )

    let rafFrame: RafFrame
    let baseWidth = 0
    const dragging = ref(false)

    const updateWidth = (e: HandleEvent, action: ResizeActionType) => {
      let pageX = 0
      if (e.touches) {
        if (e.touches.length) {
          // touchmove
          pageX = e.touches[0]!.pageX
        } else {
          // touchend
          pageX = e.changedTouches[0]!.pageX
        }
      } else {
        pageX = e.pageX
      }
      const tmpDeltaX = startX - pageX
      let w = Math.max(baseWidth - tmpDeltaX, minWidth.value)
      w = Math.min(w, maxWidth.value)
      raf.cancel(rafFrame)
      rafFrame = raf(() => {
        tableContext.onResizeColumn?.(w, props.column!.originColumn!, action)
      })
    }

    const handleMove = (e: HandleEvent) => {
      updateWidth(e, 'move')
    }
    const handleStop = (e: HandleEvent) => {
      dragging.value = false
      updateWidth(e, 'end')
      removeEvents()
    }

    const instance = getCurrentInstance()
    const handleStart = (e: HandleEvent, eventsFor: any) => {
      dragging.value = true
      removeEvents()
      baseWidth = instance?.vnode.el!.parentNode.offsetWidth
      if (e instanceof MouseEvent && e.which !== 1) {
        return
      }
      tableContext.onResizeColumn?.(baseWidth, props.column!.originColumn!, 'start')
      if (e.stopPropagation) e.stopPropagation()
      startX = e.touches ? e.touches[0]!.pageX : e.pageX
      moveEvent = addEventListenerWrap(document.documentElement, eventsFor.move, handleMove)
      stopEvent = addEventListenerWrap(document.documentElement, eventsFor.stop, handleStop)
    }

    const handleDown: EventHandler = (e: HandleEvent) => {
      handleStart(e, events.mouse)
    }
    const handleTouchDown: EventHandler = (e: HandleEvent) => {
      handleStart(e, events.touch)
    }

    return {
      handleDown,
      handleTouchDown,
      dragging,
    }
  },
})
</script>

<template>
  <div
    :class="`${prefixCls}-resize-handle ${dragging ? 'dragging' : ''}`"
    @mousedown.stop.prevent="handleDown"
    @touchstartPassive.stop="handleTouchDown"
    @click.stop.prevent
  >
    <slot> <div :class="`${prefixCls}-resize-handle-line`"></div> </slot>
  </div>
</template>
