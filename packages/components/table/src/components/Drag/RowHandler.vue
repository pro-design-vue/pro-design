<!--
 * @Author: shen
 * @Date: 2023-11-06 16:03:18
 * @LastEditors: shen
 * @LastEditTime: 2025-08-29 13:59:21
 * @Description:
-->
<script lang="ts">
import type { PropType, VNode } from 'vue'
import type { ColumnType, DefaultRecordType, DragRowEventInfo, Key } from '../interface'
import type { RafFrame } from '../../utils/raf'

import {
  defineComponent,
  ref,
  computed,
  watch,
  onMounted,
  onBeforeUnmount,
  render,
  shallowRef,
  createVNode,
  reactive,
} from 'vue'
import { useInjectTable } from '../context/TableContext'
import { useInjectBody } from '../context/BodyContext'
import { useInjectBodyRow } from '../context/BodyRowsContext'
import { useInjectSlots } from '../context/TableSlotsContext'
import {
  ICON_TYPE_DOWN,
  ICON_TYPE_FORBID,
  ICON_TYPE_UP,
  OFFSET_X,
  OFFSET_Y,
  DOWN,
  UP,
} from './constant'
import { dragForbidIcon, dragUpAndDownIcon, dragIcon } from './icon'
import { eventsClose } from '../../utils/util'
import { useAutoScroll } from '../../hooks/useAutoScroll'
import raf from '../../utils/raf'

export default defineComponent({
  name: 'RowDragHandler',
  props: {
    columnKey: [String, Number],
    disabled: Boolean,
    column: Object as PropType<ColumnType<DefaultRecordType>>,
  },
  setup(props, { slots }) {
    const dragging = ref(false)
    const spanRef = ref<HTMLSpanElement>()

    const {
      prefixCls,
      dragRowsHandle,
      draggingRowKey,
      insertToRowKey,
      onRowDragEnd,
      scrollTo,
      bodyMaxWidth,
      isMyChildren,
      getRecordByKey,
      getIndexsByKey,
      childrenColumnName,
      getKeyByIndexs,
      scrollTop,
      scrollLeft,
      showVerticalScrollbar,
      showHorizontalScrollbar,
    } = useInjectTable()
    const { dragRowPlaceholderRef, bodyRef } = useInjectBody()
    const { height, top, rowKey } = useInjectBodyRow()
    const tableSlotsContext = useInjectSlots()

    let rafFrame: RafFrame
    const clientY = ref()
    const clientX = ref()
    const clientY2 = ref()
    const dragGhostDom = document.createElement('div')
    const allowed = ref(true)
    let cacheMouseEvent: MouseEvent | null = null
    let bodyRect: DOMRect | Record<string, any> = {}
    let parentOffsetWidth = 0
    const destroyHandlers: Array<() => void> = []
    let dragGhostImage: VNode | null = null
    const iconType = ref(ICON_TYPE_DOWN)
    const fromIndexs = computed(() => getIndexsByKey(rowKey.value))

    onMounted(() => {
      if (dragRowsHandle.has(props.columnKey!)) {
        dragRowsHandle.get?.(props.columnKey!)?.add(spanRef.value!)
      } else {
        dragRowsHandle.set(props.columnKey!, new Set([spanRef.value!]))
      }
    })
    onBeforeUnmount(() => {
      dragRowsHandle.get(props.columnKey!)?.delete(spanRef.value!)
      if (dragRowsHandle.get(props.columnKey!)?.size === 0) {
        dragRowsHandle.delete(props.columnKey!)
      }
      raf.cancel(rafFrame)
      render(null, dragGhostDom)
    })

    const batchEvent = (eventList: any) => {
      eventList.forEach((config: any) => {
        const { target, type, listener, options } = config
        target.addEventListener(type, listener, options)
      })
      destroyHandlers.push(() => {
        eventList.forEach((config: any) => {
          const { target, type, listener, options } = config
          target.removeEventListener(type, listener, options)
        })
      })
    }
    const rowDragEvent = shallowRef<MouseEvent | Touch>()
    const handleMouseMoveOrTouchMove = (
      event: MouseEvent | Touch,
      cacheEvent: MouseEvent | Touch,
    ) => {
      rowDragEvent.value = event
      if (!dragging.value) {
        if (eventsClose(event, cacheEvent, 4)) {
          return
        }
        dragging.value = true
        clientY2.value = event.clientY
        draggingRowKey.value = rowKey.value
        parentOffsetWidth = spanRef.value!.parentElement!.offsetWidth
        getRootDocument().appendChild(dragGhostDom)
        renderDragGhost()
      }
      allowed.value = true
      clientX.value = event.clientX
      clientY.value = event.clientY
      ;(() => {
        const { y, height } = bodyRect
        const pageYOffset = window.pageYOffset || document.documentElement.scrollTop
        return clientY.value + 10 <= y
          ? ((dragGhostDom.style.top = y + pageYOffset - 20 + 'px'), true)
          : clientY.value > y + height &&
              ((dragGhostDom.style.top = y + pageYOffset + height - OFFSET_Y + 'px'), true)
      })()
        ? ((allowed.value = false), ensureCleared())
        : (check(event, false), (dragGhostDom.style.top = event.pageY - OFFSET_Y + 'px'))
      ;(() => {
        const { x, width } = bodyRect
        const left = window.pageXOffset || document.documentElement.scrollLeft
        return clientX.value + OFFSET_X <= x
          ? ((dragGhostDom.style.left = x + left - 20 + 'px'), true)
          : clientX.value + OFFSET_X >= x + width &&
              ((dragGhostDom.style.left = x + left + width - 20 + 'px'), true)
      })()
        ? (allowed.value = false)
        : (dragGhostDom.style.left = event.pageX - OFFSET_X + 'px')
    }

    let cacheStartTouch: TouchList[number] | null | undefined
    let cacheTouch: TouchList[number] | null | undefined
    const getTouch = (touches: TouchList) => {
      for (let i = 0; i < touches.length; i++) {
        if (touches[i]?.identifier === cacheTouch?.identifier) {
          return touches[i]
        }
      }
      return null
    }

    const handleMouseUpOrToucheEnd = (event: MouseEvent | Touch) => {
      if (dragging.value) {
        dragging.value = false
        getRootDocument().removeChild(dragGhostDom)
      }
      rowDragEvent.value = event
      cacheMouseEvent = null
      cacheTouch = null
      cacheStartTouch = null
      ensureCleared()
      draggingRowKey.value = null
      insertToRowKey.value = null
      dragRowPlaceholderRef.value!.style.opacity = '0'
      destroyHandlers.forEach((fn) => fn())
      destroyHandlers.length = 0
      raf.cancel(rafFrame)
    }

    const documentTouchMoveHandler = (event: TouchEvent) => {
      event.cancelable && event.preventDefault()
    }
    const touchMoveHandler = (event: TouchEvent) => {
      const touch = getTouch(event.touches)
      touch && handleMouseMoveOrTouchMove(touch, cacheTouch!)
    }
    const touchEndHandler = (event: TouchEvent) => {
      let touch = getTouch(event.touches)
      if (!touch) {
        touch = cacheStartTouch
      }
      handleMouseUpOrToucheEnd(touch!)
    }

    const contextmenuHandler = (event: MouseEvent) => event.preventDefault()
    const mouseMoveHandler = (event: MouseEvent) => {
      handleMouseMoveOrTouchMove(event, cacheMouseEvent!)
    }
    const mouseUpHandler = (event: MouseEvent) => {
      handleMouseUpOrToucheEnd(event)
    }

    const renderDragGhostImage = () => {
      let dragIcon = dragUpAndDownIcon
      if (iconType.value === ICON_TYPE_FORBID) {
        dragIcon = dragForbidIcon
      }
      if (tableSlotsContext.rowDragGhost) {
        if ('preTargetInfo' in dragRowEventInfo) {
          return tableSlotsContext.rowDragGhost({
            record: getRecordByKey(rowKey.value),
            preTargetInfo: dragRowEventInfo.preTargetInfo,
            nextTargetInfo: dragRowEventInfo.nextTargetInfo,
            column: props.column!,
            icon: createVNode(
              'span',
              { class: `${prefixCls.value}-drag-ghost-image-icon`, innerHTML: dragIcon },
              null,
            ),
            allowed: allowed.value,
            dragging: dragging.value,
            event: rowDragEvent.value!,
          })
        }
      }
      return [
        createVNode(
          'span',
          { class: `${prefixCls.value}-drag-ghost-image-icon`, innerHTML: dragIcon },
          null,
        ),
        createVNode(
          'span',
          {
            class: `${prefixCls.value}-drag-ghost-image-label`,
            style: { maxWidth: `${parentOffsetWidth}px` },
          },
          [slots.label?.()],
        ),
      ]
    }

    const renderDragGhost = () => {
      if (!dragGhostImage) {
        dragGhostImage = createVNode(renderDragGhostImage)
      }
      render(dragGhostImage, dragGhostDom)
    }

    watch(
      [prefixCls],
      () => {
        dragGhostDom.className = `${prefixCls.value}-drag-ghost-image`
      },
      { immediate: true },
    )
    const dragRowEventInfo = reactive<DragRowEventInfo>({} as DragRowEventInfo)
    const getRootDocument = () => document.fullscreenElement || document.body

    const getDragDirection = () => {
      const { top } = spanRef.value!.getBoundingClientRect()
      return clientY.value - top >= 0 ? DOWN : UP
    }

    const handleDraging = () => {
      const { preTargetInfo, nextTargetInfo } = dragRowEventInfo
      if (isMyChildren(rowKey.value, preTargetInfo?.rowKey || '') || !allowed.value) {
        dragRowPlaceholderRef.value!.style.opacity = '0'
        insertToRowKey.value = null
        return
      }
      let nextTargetRowKey: any = null
      const preTargetParentIndexs = preTargetInfo ? preTargetInfo.indexs.slice(0, -1) : []
      let preTargetParentRowKey = preTargetParentIndexs.length
        ? getKeyByIndexs(preTargetParentIndexs.join('-'))
        : null
      if (nextTargetInfo) {
        const { y, centerY, record, rowKey: nextRowKey } = nextTargetInfo
        if (
          record[childrenColumnName.value] &&
          clientY.value > y + OFFSET_Y &&
          clientY.value < centerY
        ) {
          nextTargetRowKey = nextRowKey
        }
      }
      if (preTargetInfo && nextTargetRowKey === null) {
        if (
          (nextTargetInfo &&
            !isMyChildren(preTargetInfo.rowKey, nextTargetInfo.rowKey) &&
            nextTargetInfo.indexs.slice(0, -1).join('-') !==
              preTargetInfo.indexs.slice(0, -1).join('-')) ||
          !nextTargetInfo
        ) {
          const { centerY, height, y } = preTargetInfo
          if (clientY.value < centerY + height / 4) {
            nextTargetRowKey = preTargetParentIndexs.length
              ? getKeyByIndexs(preTargetParentIndexs.join('-'))
              : null
          } else if (
            clientY.value < y + height &&
            (!nextTargetInfo || nextTargetInfo.indexs.length < preTargetInfo.indexs.length)
          ) {
            const preTargetParentParentIndexs = preTargetParentIndexs.slice(0, -1)
            nextTargetRowKey = preTargetParentParentIndexs.length
              ? getKeyByIndexs(preTargetParentParentIndexs.join('-'))
              : null
            preTargetParentRowKey = nextTargetRowKey
          } else {
            preTargetParentRowKey = null
          }
        } else {
          isMyChildren(preTargetInfo.rowKey, nextTargetInfo.rowKey) &&
            (nextTargetRowKey = preTargetInfo.rowKey)
        }
      }

      nextTargetRowKey === rowKey.value && (nextTargetRowKey = null)
      if (nextTargetRowKey !== nextTargetInfo?.rowKey) {
        dragRowPlaceholderRef.value!.style.opacity = '1'
        dragRowPlaceholderRef.value!.style.top = `${preTargetInfo ? preTargetInfo.top + preTargetInfo.height : 0}px`
        dragRowPlaceholderRef.value!.style.width = `${bodyMaxWidth.value}px`
        if (!nextTargetInfo && preTargetInfo) {
          dragRowPlaceholderRef.value!.style.top =
            preTargetInfo.top +
            preTargetInfo.height -
            dragRowPlaceholderRef.value!.offsetHeight +
            'px'
        } else if (!preTargetInfo) {
          dragRowPlaceholderRef.value!.style.top = `0px`
        }
      } else {
        dragRowPlaceholderRef.value!.style.opacity = '0'
      }
      dragRowEventInfo.insertToRowKey = (nextTargetRowKey ?? preTargetParentRowKey) as Key
      insertToRowKey.value = dragRowEventInfo.insertToRowKey
    }

    watch([dragging, clientY, allowed], () => {
      raf.cancel(rafFrame)
      rafFrame = raf(() => {
        dragging.value && !allowed.value && (iconType.value = ICON_TYPE_FORBID)
        if (dragging.value && allowed.value) {
          const dir = getDragDirection()
          iconType.value = dir === DOWN ? ICON_TYPE_DOWN : ICON_TYPE_UP
          const targetInfos: any[] = []
          for (const dragHandle of dragRowsHandle.get(props.columnKey!)!.values()) {
            const { y } = dragHandle.getBoundingClientRect()
            const top = +dragHandle.getAttribute('data-scroll-top')!
            const height = +dragHandle.getAttribute('data-height')!
            const rowKeyType = dragHandle.getAttribute('data-row-key-type')
            let rowKey: Key = dragHandle.getAttribute('data-row-key')!
            rowKey = rowKeyType === 'number' ? +rowKey : rowKey
            targetInfos.push({
              y,
              top,
              height,
              rowKey,
              record: getRecordByKey(rowKey),
              indexs: getIndexsByKey(rowKey),
              centerY: y + height / 2,
            })
          }
          targetInfos.sort((a, b) => a.centerY - b.centerY)
          let preTargetInfo = targetInfos[targetInfos.length - 1] || null
          let nextTargetInfo = null
          const currentClientY = clientY.value
          for (let i = 0, len = targetInfos.length; i < len; i++) {
            const targetInfo = targetInfos[i]
            const { centerY } = targetInfo
            if (currentClientY <= centerY) {
              preTargetInfo = targetInfos[i - 1] || null
              nextTargetInfo = targetInfo
              break
            }
          }

          const newDragRowEventInfo = {
            record: getRecordByKey(rowKey.value),
            top: top.value,
            height: height.value,
            dir,
            rowKey: rowKey.value,
            event: rowDragEvent.value,
            column: props.column,
            preTargetInfo,
            nextTargetInfo,
            fromIndexs: fromIndexs.value,
            insertToRowKey: undefined,
          }
          Object.assign(dragRowEventInfo, newDragRowEventInfo)
          handleDraging()
        } else {
          dragRowPlaceholderRef.value!.style.opacity = '0'
        }
      })
    })

    const { check, ensureCleared } = useAutoScroll({
      scrollContainer: bodyRef,
      scrollAxis: 'y',
      getVerticalPosition: () => scrollTop.value,
      setVerticalPosition: (pos: number) => {
        scrollTo(pos)
      },
      getHorizontalPosition: () => scrollLeft.value,
      setHorizontalPosition: (pos: number) => scrollTo({ left: pos }),
      showVerticalScrollbar: showVerticalScrollbar,
      showHorizontalScrollbar: showHorizontalScrollbar,
    })

    watch(dragging, () => {
      if (!dragging.value && allowed.value) {
        onRowDragEnd(Object.assign({}, dragRowEventInfo, { event: rowDragEvent.value }))
      }
    })

    const className = computed(() => ({
      [`${prefixCls.value}-drag-handle`]: true,
      [`${prefixCls.value}-drag-handle-disabled`]: props.disabled,
      [`${prefixCls.value}-drag-dragging`]: dragging.value,
    }))

    return {
      dragIcon,
      dragging,
      className,
      spanRef,
      top,
      height,
      rowKey,
      rowKeyType: computed(() => typeof rowKey.value),
      onMousedown: (event: MouseEvent) => {
        event.preventDefault()
        if (props.disabled) {
          return
        }
        dragging.value = false
        cacheMouseEvent = event
        bodyRect = bodyRef.value!.getBoundingClientRect()
        batchEvent([
          { target: document, type: 'mousemove', listener: mouseMoveHandler },
          { target: document, type: 'mouseup', listener: mouseUpHandler },
          { target: document, type: 'contextmenu', listener: contextmenuHandler },
        ])
      },
      onTouchStart: (event: TouchEvent) => {
        if (props.disabled) return
        dragging.value = false
        const touch = event.touches[0]
        cacheStartTouch = touch
        cacheTouch = touch
        bodyRect = bodyRef.value!.getBoundingClientRect()
        const spanDom = spanRef.value
        const eventList = [
          {
            target: document,
            type: 'touchmove',
            listener: documentTouchMoveHandler,
            options: { passive: false },
          },
          {
            target: spanDom,
            type: 'touchmove',
            listener: touchMoveHandler,
            options: { passive: true },
          },
          {
            target: spanDom,
            type: 'touchend',
            listener: touchEndHandler,
            options: { passive: true },
          },
          {
            target: spanDom,
            type: 'touchcancel',
            listener: touchEndHandler,
            options: { passive: true },
          },
        ]
        batchEvent(eventList)
      },
    }
  },
})
</script>

<template>
  <span
    ref="spanRef"
    :class="className"
    :aria-grabbed="dragging"
    :aria-hidden="true"
    :data-scroll-top="top"
    :data-height="height"
    :data-row-key="rowKey"
    :data-row-key-type="rowKeyType"
    :innerHTML="dragIcon"
    unselectable="on"
    @mousedown.stop="onMousedown"
    @touchstartPassive="onTouchStart"
  >
  </span>
</template>
