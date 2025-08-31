/*
 * @Author: shen
 * @Date: 2022-04-11 22:50:08
 * @LastEditors: shen
 * @LastEditTime: 2025-07-30 11:03:57
 * @Description:
 */
let supportSticky = false

if (typeof window != 'undefined' && !!window.getComputedStyle) {
  const dom = document.createElement('div')
  supportSticky = ['', '-webkit-', '-moz-', '-ms-'].some((b) => {
    try {
      dom.style.position = b + 'sticky'
    } catch (_) {}
    return dom.style.position != ''
  })
} else {
  supportSticky = true
}

export default supportSticky
