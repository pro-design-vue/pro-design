/*
 * @Author: shen
 * @Date: 2026-01-06 17:03:54
 * @LastEditors: shen
 * @LastEditTime: 2026-01-06 17:03:58
 * @Description:
 */
export const isDropdownValueType = (valueType: string) => {
  let isDropdown = false
  if (
    (typeof valueType === 'string' &&
      valueType.startsWith('date') &&
      !valueType.endsWith('Range')) ||
    valueType === 'select' ||
    valueType === 'time'
  ) {
    isDropdown = true
  }
  return isDropdown
}
