/*
 * @Author: shen
 * @Date: 2023-11-01 15:21:22
 * @LastEditors: shen
 * @LastEditTime: 2023-11-01 15:21:39
 * @Description:
 */
function canUseDom(): boolean {
  return !('undefined' == typeof window || !window.document || !window.document.createElement)
}
export default canUseDom
