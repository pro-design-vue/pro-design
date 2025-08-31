/*
 * @Author: shen
 * @Date: 2022-11-03 18:04:01
 * @LastEditors: shen
 * @LastEditTime: 2025-08-29 14:32:24
 * @Description:
 */
function omit<T extends object, K extends keyof T>(obj: T, fields: K[]): Omit<T, K> {
  const shallowCopy = Object.assign({}, obj)
  for (let i = 0; i < fields.length; i += 1) {
    const key = fields[i]
    delete shallowCopy[key!]
  }
  return shallowCopy
}
export default omit
