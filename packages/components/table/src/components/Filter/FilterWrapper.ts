/*
 * @Author: shen
 * @Date: 2022-11-07 13:03:05
 * @LastEditors: shen
 * @LastEditTime: 2024-02-21 13:53:58
 * @Description:
 */
import { createVNode } from 'vue'

const FilterDropdownMenuWrapper: (
  _props: any,
  {
    slots,
  }: {
    slots: any
  },
) => any = (_props, { slots }) => {
  return createVNode('div', { onClick: (e: any) => e.stopPropagation() }, [slots.default?.()])
}
export default FilterDropdownMenuWrapper
