/*
 * @Author: shen
 * @Date: 2022-04-12 15:45:46
 * @LastEditors: shen
 * @LastEditTime: 2026-04-16 10:00:00
 * @Description:
 */
import type { Directive } from 'vue'
import ResizeObserver from 'resize-observer-polyfill'

type ResizableElement = HTMLElement & {
  __resizeObserver__arg?: string
  __resizeObserver__rect?: {
    height: number
    width: number
  }
}

function resizeHandler(
  target: ResizableElement,
  arg: string | undefined,
  rect: DOMRect | { height: number; width: number },
  cacheRect: { height?: number; width?: number },
) {
  const { width, height } = rect
  const { width: oldWidth, height: oldHeight } = cacheRect

  const newWidth = Math.floor(width)
  const newHeight = Math.floor(height)

  if (arg === 'width') {
    if (newWidth !== oldWidth) {
      target.dispatchEvent(new CustomEvent('resizewidth', { detail: { width: newWidth } }))
    }
  } else if (arg === 'height') {
    if (newHeight !== oldHeight) {
      target.dispatchEvent(new CustomEvent('resizeheight', { detail: { height: newHeight } }))
    }
  } else if (newWidth !== oldWidth || newHeight !== oldHeight) {
    target.dispatchEvent(
      new CustomEvent('resize', { detail: { width: newWidth, height: newHeight } }),
    )
  }
  target.__resizeObserver__rect = { width: newWidth, height: newHeight }
}

const sharedObservers: Record<string, ResizeObserver> = {}
const observerRefCounts: Record<string, number> = {}

function getSharedObserver(arg: string | undefined): ResizeObserver {
  const key = arg || '__default__'
  if (!sharedObservers[key]) {
    sharedObservers[key] = new ResizeObserver((entries: ResizeObserverEntry[]) => {
      for (let i = 0; i < entries.length; i++) {
        const target = entries[i]!.target as ResizableElement
        resizeHandler(
          target,
          target.__resizeObserver__arg,
          target.getBoundingClientRect(),
          target.__resizeObserver__rect || {},
        )
      }
    })
    observerRefCounts[key] = 0
  }
  return sharedObservers[key]
}

function sharedObserve(el: ResizableElement, arg: string | undefined) {
  const key = arg || '__default__'
  el.__resizeObserver__arg = arg
  const observer = getSharedObserver(arg)
  observer.observe(el)
  observerRefCounts[key] = (observerRefCounts[key] || 0) + 1
}

function sharedUnobserve(el: ResizableElement, arg: string | undefined) {
  const key = arg || '__default__'
  const observer = sharedObservers[key]
  if (observer) {
    observer.unobserve(el)
    observerRefCounts[key]!--
    if (observerRefCounts[key]! <= 0) {
      observer.disconnect()
      delete sharedObservers[key]
      delete observerRefCounts[key]
    }
  }
  el.__resizeObserver__arg = undefined
}

export const resize: Directive = {
  created(el, binding) {
    const { arg, value = true } = binding
    if (value) {
      sharedObserve(el, arg)
    }
  },
  updated(el, binding) {
    const { arg, value = true } = binding
    if (value && el.__resizeObserver__arg === undefined) {
      sharedObserve(el, arg)
    } else if (!value && el.__resizeObserver__arg !== undefined) {
      sharedUnobserve(el, arg)
    }
  },
  beforeUnmount(el, binding) {
    const { arg, value = true } = binding
    if (value) {
      resizeHandler(el, arg, { width: 0, height: 0 }, el.__resizeObserver__rect || {})
      sharedUnobserve(el, arg)
    }
  },
}
