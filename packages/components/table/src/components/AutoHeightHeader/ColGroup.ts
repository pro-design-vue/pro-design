/*
 * @Author: shen
 * @Date: 2022-11-07 11:38:20
 * @LastEditors: shen
 * @LastEditTime: 2022-11-07 12:08:14
 * @Description:
 */
import { createVNode } from 'vue'
import { useInjectTable } from '../context/TableContext'

const ColGroup = () => {
  const allColumns = useInjectTable().allColumns.value
  return createVNode('colgroup', null, [
    allColumns.map((column) => {
      const { finallyWidth } = column
      return createVNode('col', { style: { width: `${finallyWidth}px` } }, null)
    }),
  ])
}

export default ColGroup
