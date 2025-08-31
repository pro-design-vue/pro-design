/*
 * @Author: shen
 * @Date: 2022-04-20 08:40:43
 * @LastEditors: shen
 * @LastEditTime: 2022-11-03 18:13:40
 * @Description:
 */
import supportsPassive from './supportsPassive'

export default function addEventListenerWrap(
  target: HTMLElement,
  eventType: keyof HTMLElementEventMap,
  cb: any,
  option?: boolean | AddEventListenerOptions,
) {
  if (target && target.addEventListener) {
    let opt = option
    if (
      opt === undefined &&
      supportsPassive &&
      (eventType === 'touchstart' || eventType === 'touchmove' || eventType === 'wheel')
    ) {
      opt = { passive: false }
    }
    target.addEventListener(eventType, cb, opt)
  }
  return {
    remove: () => {
      if (target && target.removeEventListener) {
        target.removeEventListener(eventType, cb)
      }
    },
  }
}
