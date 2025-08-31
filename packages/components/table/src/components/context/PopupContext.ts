/*
 * @Author: shen
 * @Date: 2023-11-03 13:18:10
 * @LastEditors: shen
 * @LastEditTime: 2023-11-03 13:30:19
 * @Description:
 */
import { inject, shallowRef, provide } from 'vue'
import type { InjectionKey, ShallowRef } from 'vue'
export interface PopupContextProps {
  showPopupContent: ShallowRef<(...args: any[]) => void>
  hidePopupContent: ShallowRef<(...args: any[]) => void>
  visible: ShallowRef<boolean>
  getPopupContainer: ShallowRef<() => HTMLDivElement | null>
  registerPopupContext: (opt: {
    showPopupContent: (...args: any[]) => void
    hidePopupContent: (...args: any[]) => void
    getPopupContainer: () => HTMLDivElement | null
  }) => void
}
export const PopupContextKey: InjectionKey<PopupContextProps> = Symbol('PopupContextProps')
export const useProvidePopup = () => {
  const showPopupContent = shallowRef(() => {})
  const hidePopupContent = shallowRef(() => {})
  const visible = shallowRef(false)
  const getPopupContainer = shallowRef(() => null)
  provide(PopupContextKey, {
    showPopupContent,
    hidePopupContent,
    visible,
    getPopupContainer,
    registerPopupContext: (opt) => {
      showPopupContent.value = opt.showPopupContent || (() => {})
      hidePopupContent.value = opt.hidePopupContent || (() => {})
      getPopupContainer.value = (opt.getPopupContainer || (() => null)) as any
    },
  })
}
export const useInjectPopup = () => {
  return inject(PopupContextKey, {} as PopupContextProps)
}
