/*
 * @Author: shen
 * @Date: 2026-01-07 14:31:12
 * @LastEditors: shen
 * @LastEditTime: 2026-01-07 14:31:44
 * @Description:
 */
import { get, set, type Entity } from '@pro-design-vue/utils'
import type { InternalNamePath } from 'ant-design-vue/es/form/interface'

export function cloneByNamePathList(store: Entity, namePathList: InternalNamePath[]): Entity {
  let newStore = {}
  namePathList.forEach((namePath) => {
    const value = get(store, namePath)
    newStore = set(newStore, namePath, value)
  })

  return newStore
}
