import type { Ref, VNode } from 'vue'
import type { RafFrame } from '../../utils/raf'
import type { FinallyColumnType, Key } from '../interface'

import {
  ref,
  inject,
  computed,
  shallowRef,
  onMounted,
  onBeforeUnmount,
  watch,
  watchEffect,
  nextTick,
  render,
  createVNode,
  toRaw,
} from 'vue'
import { useInjectSlots } from '../context/TableSlotsContext'
import { useInjectTable } from '../context/TableContext'
import { useInjectHeader } from '../context/HeaderContext'
import { VIEWPORT_REF, DRAG_COLUMN_DIS_UNIT, AUTO_HEADER_HEIGHT } from '../../utils/constant'
import { dragForbidIcon, dragLeftAndRightIcon } from './icon'
import { eventsClose } from '../../utils/util'
import { OFFSET_X, OFFSET_Y, DRAG_BUFF } from './constant'
import raf from '../../utils/raf'

interface ColumnDragHandler {
  columnKey: Ref<Key>
  disabled: Ref<boolean>
  column: Ref<FinallyColumnType>
  domRef: Ref<HTMLDivElement | undefined>
}

export const ICON_TYPE_DOWN = 'ICON_TYPE_DOWN'
export const ICON_TYPE_FORBID = 'ICON_TYPE_FORBID'

const getRootDocument = () => document.fullscreenElement || document.body

const useColumnDragHandler: ({
  columnKey,
  disabled,
  column,
  domRef,
}: ColumnDragHandler) => void = ({ columnKey, disabled, column, domRef }) => {
  const dragging = ref(false)
  const viewportRef = inject<Ref<HTMLDivElement | undefined>>(VIEWPORT_REF)
  const {
    prefixCls,
    draggingColumnKey,
    onColumnDragEnd,
    scrollTo,
    leftWidth,
    rightWidth,
    centerWidth,
    bodyWidth,
    leftHeaderColumns,
    visibleCenterHeaderColumns,
    rightHeaderColumns,
    columnDrag,
  } = useInjectTable()
  const autoHeight = inject<boolean>(AUTO_HEADER_HEIGHT, false)

  const offsetLeft = ref(0)
  const colPosition = ref()
  watchEffect(() => {
    if (column.value.fixed === 'right') {
      offsetLeft.value = leftWidth.value + centerWidth.value
      colPosition.value = 'right'
    } else if (column.value.fixed) {
      offsetLeft.value = 0
      colPosition.value = 'left'
    } else {
      offsetLeft.value = leftWidth.value
      colPosition.value = 'center'
    }
    if (autoHeight) {
      offsetLeft.value = 0
    }
  })

  const { dragColumnPlaceholderRef, headerRef } = useInjectHeader()
  const tableSlotsContext = useInjectSlots()

  let rafFrame: RafFrame
  const clientY = ref()
  const clientX = ref()
  const clientX2 = ref()
  const dragOverColumn = ref()
  const dragGhostDom = document.createElement('div')
  let scrollTimer: any
  let clientXTimer: any
  const scrollLeft = ref(0)
  const allowed = ref(true)
  let cacheMouseEvent: any = null
  let headerRect: DOMRect | Record<string, any> = {}
  let offsetWidth = 0
  const destroyHandlers: Array<() => void> = []
  let dragGhostImage: VNode | null = null
  const iconType = ref(ICON_TYPE_DOWN)

  const headerColumns = computed(() => {
    switch (colPosition.value) {
      case 'left':
        return leftHeaderColumns.value
      case 'center':
        return visibleCenterHeaderColumns.value
      case 'right':
        return rightHeaderColumns.value
      default:
        return []
    }
  })

  const calDragX = computed(() => {
    let handler: () => boolean = () => false
    if (autoHeight && colPosition.value !== 'center') {
      handler = () => {
        const { x } = headerRect
        const minOffetLeft =
          colPosition.value === 'left'
            ? viewportRef?.value?.scrollLeft + x
            : viewportRef?.value?.scrollLeft + x + bodyWidth.value - rightWidth.value
        const maxOffetLeft =
          colPosition.value === 'left'
            ? minOffetLeft + leftWidth.value
            : minOffetLeft + rightWidth.value
        const pageXOffset = window.pageXOffset || document.documentElement.scrollLeft
        if (clientX.value + OFFSET_X <= minOffetLeft) {
          dragGhostDom.style.left = minOffetLeft + pageXOffset - 20 + 'px'
          return true
        } else if (clientX.value + OFFSET_X >= maxOffetLeft) {
          dragGhostDom.style.left = maxOffetLeft + pageXOffset - 20 + 'px'
          return true
        } else {
          return false
        }
      }
    } else if (colPosition.value !== 'center') {
      handler = () => {
        const { x, width } = headerRect
        const pageXOffset = window.pageXOffset || document.documentElement.scrollLeft
        if (clientX.value + OFFSET_X <= x) {
          dragGhostDom.style.left = x + pageXOffset - 20 + 'px'
          return true
        } else if (clientX.value + OFFSET_X >= x + width) {
          dragGhostDom.style.left = x + pageXOffset + width - 20 + 'px'
          return true
        } else {
          return false
        }
      }
    } else {
      handler = () => {
        const { x, width } = viewportRef!.value!.getBoundingClientRect()
        const pageXOffset = window.pageXOffset || document.documentElement.scrollLeft
        if (clientX.value + OFFSET_X <= x + leftWidth.value) {
          dragGhostDom.style.left = x + pageXOffset + leftWidth.value - 20 + 'px'
          return true
        } else if (clientX.value + OFFSET_X >= x + width - rightWidth.value) {
          dragGhostDom.style.left = x + pageXOffset + width - rightWidth.value - 20 + 'px'
          return true
        } else {
          return false
        }
      }
    }
    return handler
  })

  const calDragY = () => {
    const { y, height } = headerRect
    const pageYOffset = window.pageYOffset || document.documentElement.scrollTop
    if (clientY.value + OFFSET_Y <= y) {
      dragGhostDom.style.top = y + pageYOffset - 20 + 'px'
      return true
    } else if (clientY.value > y + height) {
      dragGhostDom.style.top = y + pageYOffset + height - 10 + 'px'
      return true
    } else {
      return false
    }
  }

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
  const columnDragEvent = shallowRef<MouseEvent | Touch>()
  const handleMouseMoveOrTouchMove = (
    event: MouseEvent | Touch,
    cacheEvent: MouseEvent | Touch,
  ) => {
    columnDragEvent.value = event
    if (!dragging.value) {
      if (eventsClose(event, cacheEvent, DRAG_BUFF)) {
        return
      }
      dragging.value = true
      clientX2.value = event.clientX
      draggingColumnKey.value = columnKey.value
      offsetWidth = domRef.value?.offsetWidth || 0
      getRootDocument().appendChild(dragGhostDom)
      renderDragGhost()
    }
    allowed.value = true
    clientX.value = event.clientX
    clientY.value = event.clientY
    if (calDragY()) {
      allowed.value = false
      clearInterval(clientXTimer)
    } else {
      dragGhostDom.style.top = event.pageY - 10 + 'px'
    }

    if (calDragX.value()) {
      allowed.value = false
    } else {
      dragGhostDom.style.left = event.pageX - 10 + 'px'
    }
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
    columnDragEvent.value = event
    cacheMouseEvent = null
    cacheTouch = null
    cacheStartTouch = null
    clearInterval(clientXTimer)
    draggingColumnKey.value = ''
    dragColumnPlaceholderRef.value!.style.opacity = '0'
    destroyHandlers.forEach((fn) => fn())
    destroyHandlers.length = 0
    raf.cancel(rafFrame)
  }

  const documentTouchMoveHandler = (event: TouchEvent) => {
    event.cancelable && event.preventDefault()
  }

  const onTouchStart = (event: TouchEvent) => {
    dragOverColumn.value = null
    if (disabled.value) {
      return
    }
    dragging.value = false
    const touch = event.touches[0]
    cacheStartTouch = touch
    cacheTouch = touch
    headerRect = headerRef.value!.getBoundingClientRect()
    const dom = domRef.value
    const eventList = [
      {
        target: document,
        type: 'touchmove',
        listener: documentTouchMoveHandler,
        options: { passive: false },
      },
      {
        target: dom,
        type: 'touchmove',
        listener: touchMoveHandler,
        options: { passive: true },
      },
      {
        target: dom,
        type: 'touchend',
        listener: touchEndHandler,
        options: { passive: true },
      },
      {
        target: dom,
        type: 'touchcancel',
        listener: touchEndHandler,
        options: { passive: true },
      },
    ]
    batchEvent(eventList)
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
  const onMousedown = (event: MouseEvent) => {
    event.preventDefault()
    dragOverColumn.value = null
    if (disabled.value) {
      return
    }
    dragging.value = false
    cacheMouseEvent = event
    headerRect = headerRef.value!.getBoundingClientRect()
    const doc = document
    batchEvent([
      { target: doc, type: 'mousemove', listener: mouseMoveHandler },
      { target: doc, type: 'mouseup', listener: mouseUpHandler },
      { target: doc, type: 'contextmenu', listener: contextmenuHandler },
    ])
  }
  const contextmenuHandler = (event: MouseEvent) => event.preventDefault()
  const mouseMoveHandler = (event: MouseEvent) => {
    handleMouseMoveOrTouchMove(event, cacheMouseEvent)
  }
  const mouseUpHandler = (event: MouseEvent) => {
    handleMouseUpOrToucheEnd(event)
  }
  const mergeColumnDrag = computed(
    () => column.value.drag || (column.value.drag === undefined && columnDrag.value),
  )

  onMounted(() => {
    nextTick(() => {
      watch(
        [domRef, mergeColumnDrag],
        ([newDom], [oldDom]) => {
          if (oldDom) {
            oldDom.removeEventListener('mousedown', onMousedown)
            oldDom.removeEventListener('touchstart', onTouchStart)
          }
          if (newDom && mergeColumnDrag.value) {
            newDom.addEventListener('mousedown', onMousedown)
            newDom.addEventListener('touchstart', onTouchStart, { passive: true })
          }
        },
        { flush: 'post', immediate: true },
      )
    })
  })
  onBeforeUnmount(() => {
    if (domRef.value) {
      domRef.value.removeEventListener('mousedown', onMousedown)
      domRef.value.removeEventListener('touchstart', onTouchStart)
    }
    raf.cancel(rafFrame)
    render(null, dragGhostDom)
  })

  const renderDragGhostImage = () => {
    let dragIcon = dragLeftAndRightIcon
    if (iconType.value === ICON_TYPE_FORBID) {
      dragIcon = dragForbidIcon
    }
    return tableSlotsContext.columnDragGhost
      ? tableSlotsContext.columnDragGhost({
          targetColumn: toRaw(dragOverColumn.value),
          column: column.value,
          icon: createVNode(
            'span',
            { class: `${prefixCls.value}-drag-ghost-image-icon`, innerHTML: dragIcon },
            null,
          ),
          allowed: allowed.value,
          dragging: dragging.value,
          event: columnDragEvent.value!,
        })
      : [
          createVNode(
            'span',
            { class: `${prefixCls.value}-drag-ghost-image-icon`, innerHTML: dragIcon },
            null,
          ),
          createVNode(
            'span',
            {
              class: `${prefixCls.value}-drag-ghost-image-label`,
              style: { maxWidth: `${offsetWidth}px` },
            },
            [column.value.title],
          ),
        ]
  }

  const renderDragGhost = () => {
    if (!dragGhostImage) {
      dragGhostImage = createVNode(renderDragGhostImage)
      render(dragGhostImage, dragGhostDom)
    }
  }

  watch(
    [prefixCls],
    () => {
      dragGhostDom.className = `${prefixCls.value}-drag-ghost-image`
    },
    { immediate: true },
  )
  watch([clientX, colPosition], () => {
    clearInterval(clientXTimer)
    if (colPosition.value === 'center' && allowed.value) {
      clientXTimer = setInterval(() => {
        const { x, width } = viewportRef!.value!.getBoundingClientRect()
        if (clientX.value + 30 > x + width - rightWidth.value) {
          scrollTo({ left: viewportRef!.value!.scrollLeft + DRAG_COLUMN_DIS_UNIT }, 'auto', true)
          clearTimeout(scrollTimer)
          scrollTimer = setTimeout(() => {
            scrollLeft.value = viewportRef!.value!.scrollLeft + DRAG_COLUMN_DIS_UNIT
          })
        } else if (clientX.value < x + leftWidth.value) {
          const left = Math.max(viewportRef!.value!.scrollLeft - DRAG_COLUMN_DIS_UNIT, 0)
          scrollTo({ left }, 'auto', true)
          clearTimeout(scrollTimer)
          scrollTimer = setTimeout(() => {
            scrollLeft.value = left
          })
        }
      }, 30)
    }
  })

  const handleDraging = () => {
    const pageX = clientX.value
    const { x } = headerRef.value!.getBoundingClientRect()
    const rawColumns = toRaw(headerColumns.value)
    const rawClientX = offsetLeft.value - x

    let currentOffetLeft = 0
    let scrollLeft = 0
    if (autoHeight && colPosition.value !== 'center') {
      scrollLeft = viewportRef!.value!.scrollLeft
      currentOffetLeft =
        colPosition.value === 'left'
          ? scrollLeft
          : scrollLeft + bodyWidth.value - rightWidth.value - leftWidth.value - centerWidth.value
    }

    for (let i = 0, len = rawColumns.length; i < len; i++) {
      const { left, finallyWidth } = rawColumns[i]!
      const columnClientX = left! - rawClientX + currentOffetLeft
      if (
        !rawColumns[i]!.__Internal__Column__ &&
        pageX > columnClientX &&
        pageX < columnClientX + finallyWidth!
      ) {
        dragOverColumn.value = rawColumns[i]
      }
    }
    if (dragOverColumn.value && dragOverColumn.value.left !== column.value.left) {
      dragColumnPlaceholderRef.value!.style.opacity = '1'
      dragColumnPlaceholderRef.value!.style.zIndex = column.value.fixed ? '3' : 'unset'
      if (dragOverColumn.value.left > column.value.left!) {
        dragColumnPlaceholderRef.value!.style.left = `${
          dragOverColumn.value.left -
          offsetLeft.value +
          dragOverColumn.value.finallyWidth +
          currentOffetLeft -
          1
        }px`
      } else {
        dragColumnPlaceholderRef.value!.style.left = `${dragOverColumn.value.left - offsetLeft.value + currentOffetLeft - 1}px`
      }
    } else {
      dragColumnPlaceholderRef.value!.style.opacity = '0'
    }
  }

  watch([dragging, clientX, allowed, scrollLeft], () => {
    raf.cancel(rafFrame)
    rafFrame = raf(() => {
      if (dragging.value && !allowed.value) {
        iconType.value = ICON_TYPE_FORBID
      }
      if (dragging.value && allowed.value) {
        iconType.value = ''
        handleDraging()
      } else {
        dragColumnPlaceholderRef.value!.style.opacity = '0'
      }
    })
  })

  watch(dragging, () => {
    if (!dragging.value && allowed.value && dragOverColumn.value) {
      raf.cancel(rafFrame)
      onColumnDragEnd({
        column: column.value.originColumn!,
        targetColumn: toRaw(dragOverColumn.value.originColumn),
        event: columnDragEvent.value!,
        dir: column.value.left! <= dragOverColumn.value.left ? 'right' : 'left',
      })
    }
  })
}
export default useColumnDragHandler
