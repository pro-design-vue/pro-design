/*
 * @Author: shen
 * @Date: 2023-11-04 16:05:23
 * @LastEditors: shen
 * @LastEditTime: 2023-11-04 17:02:59
 * @Description:
 */
import { onBeforeUnmount, provide, inject, watch } from 'vue'
import raf from '../utils/raf'

import type { Ref, InjectionKey } from 'vue'

export interface HScrollSyncProvide {
  removeHScrollDom: (dom: HTMLElement) => void
  addHScrollDom: (dom: HTMLElement, useRaf?: boolean) => void
}

const HScrollSymbolKey: InjectionKey<HScrollSyncProvide> = Symbol('HScrollSymbolKey')

export const useHScrollSyncProvide = ({
  scrollLeft,
  maxScrollLeft,
  onScroll,
  bodyWidth,
}: {
  scrollLeft: Ref<number>
  maxScrollLeft: Ref<number>
  onScroll: (e: UIEvent) => void
  bodyWidth: Ref<number>
}) => {
  const domsSet = new Set<HTMLElement>()
  const setAllDoms = (scrollLeft: number) => {
    const left = Math.max(0, Math.min(scrollLeft, maxScrollLeft.value))
    domsSet.forEach((dom) => {
      dom.scrollLeft = left
    })
  }
  let rafFrame: any
  const handle = (e: Event) => {
    const left = (e.target as HTMLElement)?.scrollLeft
    if (left !== scrollLeft.value) {
      setAllDoms(left)
      scrollLeft.value = left
      onScroll(e as UIEvent)
    }
  }
  const rafHandle = (e: Event) => {
    const left = (e.target as HTMLElement)?.scrollLeft
    if (left !== scrollLeft.value) {
      raf.cancel(rafFrame)
      rafFrame = raf(() => {
        scrollLeft.value = left
        onScroll(e as UIEvent)
      })
    }
  }

  watch(
    scrollLeft,
    () => {
      setAllDoms(scrollLeft.value)
    },
    { immediate: true },
  )
  watch(bodyWidth, (_, oldValue) => {
    if (oldValue === 0) {
      setAllDoms(scrollLeft.value)
    }
  })
  onBeforeUnmount(() => {
    domsSet.forEach((dom) => {
      dom.removeEventListener('scroll', handle)
      dom.removeEventListener('scroll', rafHandle)
    })
    domsSet.clear()
  })
  const value = {
    addHScrollDom: (dom: HTMLElement, useRaf?: boolean) => {
      if (dom) {
        domsSet.add(dom)
        dom.scrollLeft = scrollLeft.value
        dom.addEventListener('scroll', useRaf ? rafHandle : handle, { passive: true })
      }
    },
    removeHScrollDom: (dom: HTMLElement) => {
      if (dom) {
        domsSet.delete(dom)
        dom.removeEventListener('scroll', handle)
        dom.removeEventListener('scroll', rafHandle)
      }
    },
  }
  provide(HScrollSymbolKey, value)
}
export const useHScrollSyncInject = () => {
  return inject(HScrollSymbolKey, {} as HScrollSyncProvide)
}
