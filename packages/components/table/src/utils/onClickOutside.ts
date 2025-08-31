/*
 * @Author: shen
 * @Date: 2022-11-03 18:02:20
 * @LastEditors: shen
 * @LastEditTime: 2022-11-06 13:45:55
 * @Description:
 */
import { ref, unref, onBeforeUnmount } from 'vue'
import type { ComponentPublicInstance, Ref } from 'vue'

type MaybeElement = HTMLElement | SVGElement | ComponentPublicInstance | undefined | null
type MaybeRef<T> = T | Ref<T>
type MaybeElementRef<T extends MaybeElement = MaybeElement> = MaybeRef<T>
interface ConfigurableWindow {
  window?: Window
}
interface OnClickOutsideOptions extends ConfigurableWindow {
  ignore?: MaybeElementRef[]
  capture?: boolean
  detectIframe?: boolean
}
type OnClickOutsideHandler<
  T extends {
    detectIframe: OnClickOutsideOptions['detectIframe']
  } = {
    detectIframe: false
  },
> = (evt: T['detectIframe'] extends true ? PointerEvent | FocusEvent : PointerEvent) => void

const defaultWindow = typeof window != 'undefined' ? window : undefined

function unrefElement<T extends MaybeElement>(elRef: MaybeElementRef<T>): MaybeElement {
  const plain = unref(elRef)
  return (plain as ComponentPublicInstance)?.$el ?? plain
}

export default function onClickOutside<T extends OnClickOutsideOptions>(
  target: MaybeElementRef,
  handler: OnClickOutsideHandler<{
    detectIframe: T['detectIframe']
  }>,
  options: T = {} as T,
) {
  const { window = defaultWindow, ignore, capture = true, detectIframe = false } = options

  if (!window) return

  const shouldListen = ref(true)

  let fallback: number

  const listener = (event: PointerEvent) => {
    window.clearTimeout(fallback)

    const el = unrefElement(target)

    if (
      !el ||
      el === event.target ||
      event.composedPath().includes(el as any) ||
      !shouldListen.value
    )
      return

    handler(event)
  }

  const shouldIgnore = (event: PointerEvent) => {
    return (
      ignore &&
      ignore.some((target) => {
        const el = unrefElement(target)
        return el && (event.target === el || event.composedPath().includes(el as any))
      })
    )
  }

  const pointerdownListener = (e: PointerEvent) => {
    const el = unrefElement(target)
    shouldListen.value = !!el && !e.composedPath().includes(el as never) && !shouldIgnore(e)
  }

  const pointerupListener = (e: PointerEvent) => {
    if (e.button === 0) {
      const path = e.composedPath()
      e.composedPath = () => path
      fallback = window.setTimeout(() => listener(e), 50)
    }
  }

  const blurListener = (e: PointerEvent) => {
    const el = unrefElement(target)
    if (
      document.activeElement?.tagName === 'IFRAME' &&
      !(el as any)?.contains(document.activeElement)
    )
      handler(e as any)
  }

  window.addEventListener('click', listener as any, { passive: true, capture })
  window.addEventListener('pointerdown', pointerdownListener, { passive: true })
  window.addEventListener('pointerup', pointerupListener, { passive: true })
  detectIframe && window.addEventListener('blur', blurListener as any)

  const clear = () => {
    window.removeEventListener('click', listener as any)
    window.removeEventListener('pointerdown', pointerdownListener)
    window.removeEventListener('pointerup', pointerupListener)
    window.removeEventListener('blur', blurListener as any)
  }

  onBeforeUnmount(() => {
    clear()
  })
  return clear
}
