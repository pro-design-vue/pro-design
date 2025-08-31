/*
 * @Author: shen
 * @Date: 2023-11-19 11:39:26
 * @LastEditors: shen
 * @LastEditTime: 2023-11-19 11:39:32
 * @Description:
 */
export const omitUndefinedAndEmptyArr = <T>(obj: T): T => {
  const newObj = {} as T
  Object.keys(obj || {}).forEach((key) => {
    if (Array.isArray(obj[key]) && obj[key]?.length === 0) {
      return
    }
    if (obj[key] === undefined) {
      return
    }
    newObj[key] = obj[key]
  })
  return newObj
}
