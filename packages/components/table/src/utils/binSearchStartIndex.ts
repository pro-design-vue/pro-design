/*
 * @Author: shen
 * @Date: 2022-11-03 18:12:41
 * @LastEditors: shen
 * @LastEditTime: 2025-08-29 14:29:45
 * @Description:
 */
function binSearchStartIndex<T>(
  arr: T[],
  predicate: (value: T, index?: number) => boolean,
): number {
  let startIndex = 0
  let endIndex = arr.length - 1
  for (; startIndex < endIndex; ) {
    const middleIndex = startIndex + Math.floor((endIndex - startIndex) / 2)
    predicate(arr[middleIndex]!) ? (endIndex = middleIndex) : (startIndex = middleIndex + 1)
  }
  return startIndex
}
export default binSearchStartIndex
