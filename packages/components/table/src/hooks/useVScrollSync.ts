/*
 * @Author: shen
 * @Date: 2023-11-04 17:47:16
 * @LastEditors: shen
 * @LastEditTime: 2023-11-10 16:26:57
 * @Description:
 */
import { onBeforeUnmount, provide, inject, watch } from 'vue'
import raf from '../utils/raf'

import type { Ref, InjectionKey } from 'vue'

export interface VScrollSyncProvide {
  removeVScrollDom: (dom: HTMLElement) => void
  addVScrollDom: (dom: HTMLElement, useRaf?: boolean) => void
}

const VScrollSymbolKey: InjectionKey<VScrollSyncProvide> = Symbol('VScrollSymbolKey')
export const useVScrollSyncProvide = ({
  scrollTop,
  maxScrollTop,
  onScroll,
  updateAnimate,
  bodyWidth,
}: {
  scrollTop: Ref<number>
  bodyWidth: Ref<number>
  maxScrollTop: Ref<number>
  onScroll: (e: UIEvent) => void
  updateAnimate: () => void
}) => {
  const domsSet = new Set<HTMLElement>()
  const setAllDoms = (scrollTop: number) => {
    const top = Math.max(0, Math.min(scrollTop, maxScrollTop.value))
    domsSet.forEach((dom) => {
      dom.scrollTop = top
    })
  }

  let rafFrame: any
  const handle = (e: Event) => {
    const top = (e.target as HTMLElement)?.scrollTop
    if (top !== scrollTop.value) {
      updateAnimate()
      setAllDoms(top)
      scrollTop.value = top
      onScroll(e as UIEvent)
    }
  }

  watch(
    scrollTop,
    () => {
      setAllDoms(scrollTop.value)
    },
    { immediate: true },
  )
  watch(bodyWidth, (_, oldValue) => {
    if (oldValue === 0) {
      setAllDoms(scrollTop.value)
    }
  })

  const rafHandle = (e: Event) => {
    const top = (e.target as HTMLElement)?.scrollTop
    if (top !== scrollTop.value) {
      raf.cancel(rafFrame)
      updateAnimate()
      rafFrame = raf(() => {
        scrollTop.value = top
        onScroll(e as UIEvent)
      })
    }
  }

  onBeforeUnmount(() => {
    domsSet.forEach((dom) => {
      dom.removeEventListener('scroll', handle)
      dom.removeEventListener('scroll', rafHandle)
    })
    domsSet.clear()
  })

  const value = {
    addVScrollDom: (dom: HTMLElement, useRaf?: boolean) => {
      if (dom) {
        domsSet.add(dom)
        dom.scrollTop = scrollTop.value
        dom.addEventListener('scroll', useRaf ? rafHandle : handle, { passive: true })
      }
    },
    removeVScrollDom: (dom: HTMLElement) => {
      if (dom) {
        domsSet.delete(dom)
        dom.removeEventListener('scroll', handle)
        dom.removeEventListener('scroll', rafHandle)
      }
    },
  }
  provide(VScrollSymbolKey, value)
}
export const useVScrollSyncInject = () => {
  return inject(VScrollSymbolKey, {} as VScrollSyncProvide)
}
