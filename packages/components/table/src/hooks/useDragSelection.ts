import type { Ref } from 'vue'
import type { CustomMouseEvent } from './RangeInterface'

import { watch } from 'vue'
import { DRAG_BUFF } from '../components/Drag/constant'
import { eventsClose } from '../utils/util'

export const isOverFormFieldElement = (mouseEvent: MouseEvent | KeyboardEvent) => {
  const tagName = (mouseEvent.target as HTMLElement)?.tagName?.toLocaleLowerCase()
  return !!tagName?.match('^a$|textarea|input|select|button')
}

export const useDragSelection = (params: {
  bodyElementRef: Ref<HTMLElement | undefined>
  rootElementRef: Ref<HTMLElement | undefined>
  onDragStart: (event: CustomMouseEvent) => void
  onDragging: (event: CustomMouseEvent) => void
  onDragStop: () => void
  level: number
  enableRangeSelection: Ref<boolean>
}) => {
  let dragging = false
  let cacheStartTouch: any = null
  let startTarget: EventTarget | null = null
  let cacheTouch: TouchList[number] | null | undefined
  const destroyHandlers: Array<() => void> = []
  const batchEvent = (eventList: any[]) => {
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

  const getTouch = (touches: TouchList) => {
    for (let i = 0; i < touches.length; i++) {
      if (touches[i]!.identifier === cacheTouch?.identifier) {
        return touches[i]
      }
    }
    return null
  }

  const handleMouseMoveOrTouchMove = (
    event: CustomMouseEvent | TouchEvent,
    cacheEvent: CustomMouseEvent | TouchEvent,
  ) => {
    if (!dragging) {
      if (eventsClose(event as any, cacheEvent as any, DRAG_BUFF)) {
        return
      }
      dragging = true
      params.onDragStart(cacheEvent as CustomMouseEvent)
      params.onDragging(cacheEvent as CustomMouseEvent)
    }
    params.onDragging(event as CustomMouseEvent)
  }
  const handleMouseUpOrToucheEnd = () => {
    if (dragging) {
      dragging = false
      params.onDragStop()
    }
    cacheStartTouch = null
    startTarget = null
    cacheTouch = null
    destroyHandlers.forEach((fn) => fn())
    destroyHandlers.length = 0
  }
  const isOverForm = (event: CustomMouseEvent) => !isOverFormFieldElement(event)
  const mouseMoveHandler = (event: CustomMouseEvent) => {
    if (isOverForm(event)) {
      event.preventDefault()
    }
    handleMouseMoveOrTouchMove(event, cacheStartTouch)
  }
  const touchMoveHandler = (event: TouchEvent) => {
    getTouch(event.touches) && handleMouseMoveOrTouchMove(event, cacheStartTouch)
  }
  const touchEndHandler = (event: TouchEvent) => {
    getTouch(event.changedTouches) && handleMouseUpOrToucheEnd()
  }

  const onBodyMousedown = (e: CustomMouseEvent) => {
    if (params.level !== e.cellInfo?.level) return
    if (isOverForm(e)) {
      e.preventDefault()
    }
    dragging = false
    cacheStartTouch = e
    startTarget = e.cellInfo?.cellTarget
    params.bodyElementRef.value
    batchEvent([
      {
        target: document,
        type: 'mousemove',
        listener: (e: CustomMouseEvent) => mouseMoveHandler(e),
      },
      {
        target: document,
        type: 'mouseup',
        listener: () => {
          handleMouseUpOrToucheEnd()
        },
      },
      {
        target: document,
        type: 'contextmenu',
        listener: (e: CustomMouseEvent) => e.preventDefault(),
      },
    ])
    mouseMoveHandler(e)
  }
  let bodyTouchStartHandle
  watch(
    [() => params.bodyElementRef.value, params.enableRangeSelection],
    ([bodyEl], [oldBodyEl]) => {
      if (oldBodyEl) {
        oldBodyEl.removeEventListener('mousedown', onBodyMousedown as any)
        if (bodyTouchStartHandle) {
          oldBodyEl.removeEventListener('touchstart', bodyTouchStartHandle)
          bodyTouchStartHandle = null
          destroyHandlers.forEach((fn) => fn())
          destroyHandlers.length = 0
        }
      }
      if (bodyEl && params.enableRangeSelection.value) {
        bodyEl.addEventListener('mousedown', onBodyMousedown as any)
        bodyTouchStartHandle = (e3) => {
          e3.cancelable && (e3.preventDefault(), e3.stopPropagation())
        }
      }
    },
  )
  return {
    onBodyMousedown,
    onBodyTouchstart: (touchEvent: TouchEvent) => {
      dragging = false
      const touch = touchEvent.touches[0]
      cacheTouch = touch
      params.bodyElementRef.value
      const endHandle = (event: TouchEvent) => touchEndHandler(event)
      const target = touchEvent.target
      const body = document.body
      batchEvent([
        {
          target: body,
          type: 'touchmove',
          listener: (e: TouchEvent) => {
            e.cancelable && e.preventDefault()
          },
          options: { passive: false },
        },
        {
          target,
          type: 'touchmove',
          listener: (e: TouchEvent) => touchMoveHandler(e),
          options: { passive: true },
        },
        {
          target,
          type: 'touchend',
          listener: endHandle,
          options: { passive: true },
        },
        {
          target,
          type: 'touchcancel',
          listener: endHandle,
          options: { passive: true },
        },
      ])
    },
    getStartTarget: () => startTarget,
  }
}
