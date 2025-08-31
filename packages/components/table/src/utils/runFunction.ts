/*
 * @Author: shen
 * @Date: 2023-11-12 21:26:14
 * @LastEditors: shen
 * @LastEditTime: 2023-11-12 21:26:20
 * @Description:
 */
export function runFunction<T extends any[]>(valueEnum: any, ...rest: T) {
  if (typeof valueEnum === 'function') {
    return valueEnum(...rest)
  }
  return valueEnum
}
