/*
 * @Author: shen
 * @Date: 2022-11-03 17:45:33
 * @LastEditors: shen
 * @LastEditTime: 2025-07-30 11:04:07
 * @Description:
 */
let supportsPassive = false
try {
  const opts = Object.defineProperty({}, 'passive', {
    get() {
      supportsPassive = true
    },
  })
  window.addEventListener('testPassive', null as any, opts)
  window.removeEventListener('testPassive', null as any, opts)
} catch (_) {}

export default supportsPassive
