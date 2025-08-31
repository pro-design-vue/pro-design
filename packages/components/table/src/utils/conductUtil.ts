/*
 * @Author: shen
 * @Date: 2022-04-10 07:36:31
 * @LastEditors: shen
 * @LastEditTime: 2023-11-04 15:26:48
 * @Description:
 */
import type { Key } from '../components/interface'
import { warning } from './warning'

export type GetCheckDisabled<RecordType> = (record: RecordType) => boolean
interface ConductReturnType {
  checkedKeys: Key[]
  halfCheckedKeys: Key[]
}
export interface Entity {
  record: any
  rowKey: Key
  pos: string
  parent?: Entity
  children?: Entity[]
  [key: string]: any
}
export interface DataEntity extends Omit<Entity, 'parent' | 'children'> {
  parent?: DataEntity
  children?: DataEntity[]
  level: number
}

function removeFromCheckedKeys(halfCheckedKeys: Set<Key>, checkedKeys: Set<Key>) {
  const filteredKeys = new Set<Key>()
  halfCheckedKeys.forEach((key) => {
    if (!checkedKeys.has(key)) {
      filteredKeys.add(key)
    }
  })
  return filteredKeys
}

export function isCheckDisabled(node: any) {
  const { disabled, disableCheckbox, checkable } = node || {}
  return !!(disabled || disableCheckbox) || checkable === false
}

function fillConductCheck(
  keys: Set<Key>,
  levelEntities: Map<number, Set<DataEntity>>,
  maxLevel: number,
  syntheticGetCheckDisabled: GetCheckDisabled<any>,
): ConductReturnType {
  const checkedKeys = new Set<Key>(keys)
  const halfCheckedKeys = new Set<Key>()

  // Add checked keys top to bottom
  for (let level = 0; level <= maxLevel; level += 1) {
    const entities = levelEntities.get(level) || new Set()
    entities.forEach((entity) => {
      const { rowKey, record, children = [] } = entity

      if (checkedKeys.has(rowKey) && !syntheticGetCheckDisabled(record)) {
        children
          .filter((childEntity) => !syntheticGetCheckDisabled(childEntity.record))
          .forEach((childEntity) => {
            checkedKeys.add(childEntity.rowKey)
          })
      }
    })
  }

  // Add checked keys from bottom to top
  const visitedKeys = new Set<Key>()
  for (let level = maxLevel; level >= 0; level -= 1) {
    const entities = levelEntities.get(level) || new Set()
    entities.forEach((entity) => {
      const { parent, record } = entity

      // Skip if no need to check
      if (
        syntheticGetCheckDisabled(record) ||
        !entity.parent ||
        visitedKeys.has(entity.parent.rowKey)
      ) {
        return
      }

      // Skip if parent is disabled
      if (syntheticGetCheckDisabled(entity.parent.record)) {
        visitedKeys.add(parent?.rowKey)
        return
      }

      let allChecked = true
      let partialChecked = false

      ;(parent?.children || [])
        .filter((childEntity) => !syntheticGetCheckDisabled(childEntity.record))
        .forEach(({ rowKey }) => {
          const checked = checkedKeys.has(rowKey)
          if (allChecked && !checked) {
            allChecked = false
          }
          if (!partialChecked && (checked || halfCheckedKeys.has(rowKey))) {
            partialChecked = true
          }
        })

      if (allChecked) {
        checkedKeys.add(parent?.rowKey)
      }
      if (partialChecked) {
        halfCheckedKeys.add(parent?.rowKey)
      }

      visitedKeys.add(parent?.rowKey)
    })
  }

  return {
    checkedKeys: Array.from(checkedKeys),
    halfCheckedKeys: Array.from(removeFromCheckedKeys(halfCheckedKeys, checkedKeys)),
  }
}

function cleanConductCheck(
  keys: Set<Key>,
  halfKeys: Key[],
  levelEntities: Map<number, Set<DataEntity>>,
  maxLevel: number,
  syntheticGetCheckDisabled: GetCheckDisabled<any>,
): ConductReturnType {
  const checkedKeys = new Set<Key>(keys)
  let halfCheckedKeys = new Set<Key>(halfKeys)

  // Remove checked keys from top to bottom
  for (let level = 0; level <= maxLevel; level += 1) {
    const entities = levelEntities.get(level) || new Set()
    entities.forEach((entity) => {
      const { rowKey, record, children = [] } = entity

      if (
        !checkedKeys.has(rowKey) &&
        !halfCheckedKeys.has(rowKey) &&
        !syntheticGetCheckDisabled(record)
      ) {
        children
          .filter((childEntity) => !syntheticGetCheckDisabled(childEntity.record))
          .forEach((childEntity) => {
            checkedKeys.delete(childEntity.rowKey)
          })
      }
    })
  }

  // Remove checked keys form bottom to top
  halfCheckedKeys = new Set<Key>()
  const visitedKeys = new Set<Key>()
  for (let level = maxLevel; level >= 0; level -= 1) {
    const entities = levelEntities.get(level) || new Set()

    entities.forEach((entity) => {
      const { parent, record } = entity

      // Skip if no need to check
      if (
        syntheticGetCheckDisabled(record) ||
        !entity.parent ||
        visitedKeys.has(entity.parent.rowKey)
      ) {
        return
      }

      // Skip if parent is disabled
      if (syntheticGetCheckDisabled(entity.parent.record)) {
        visitedKeys.add(parent?.rowKey)
        return
      }

      let allChecked = true
      let partialChecked = false

      ;(parent?.children || [])
        .filter((childEntity) => !syntheticGetCheckDisabled(childEntity.record))
        .forEach(({ rowKey }) => {
          const checked = checkedKeys.has(rowKey)
          if (allChecked && !checked) {
            allChecked = false
          }
          if (!partialChecked && (checked || halfCheckedKeys.has(rowKey))) {
            partialChecked = true
          }
        })

      if (!allChecked) {
        checkedKeys.delete(parent?.rowKey)
      }
      if (partialChecked) {
        halfCheckedKeys.add(parent?.rowKey)
      }

      visitedKeys.add(parent?.rowKey)
    })
  }

  return {
    checkedKeys: Array.from(checkedKeys),
    halfCheckedKeys: Array.from(removeFromCheckedKeys(halfCheckedKeys, checkedKeys)),
  }
}

export function conductCheck(
  keyList: Key[],
  checked: true | { checked: false; halfCheckedKeys: Key[] },
  keyEntities: Record<Key, DataEntity>,
  levelEntities: Map<number, Set<DataEntity>>,
  maxLevel: number,
  getCheckDisabled?: GetCheckDisabled<any>,
): ConductReturnType {
  const warningMissKeys: Key[] = []

  // We only handle exist keys
  const keys = new Set<Key>(
    keyList.filter((key) => {
      const hasEntity = !!keyEntities[key]
      if (!hasEntity) {
        warningMissKeys.push(key)
      }

      return hasEntity
    }),
  )

  warning(
    !warningMissKeys.length,
    `Tree missing follow keys: ${warningMissKeys
      .slice(0, 100)
      .map((key) => `'${key}'`)
      .join(', ')}`,
  )

  let syntheticGetCheckDisabled: GetCheckDisabled<any>
  if (getCheckDisabled) {
    syntheticGetCheckDisabled = getCheckDisabled
  } else {
    syntheticGetCheckDisabled = isCheckDisabled
  }

  let result: ConductReturnType
  if (checked === true) {
    result = fillConductCheck(keys, levelEntities, maxLevel, syntheticGetCheckDisabled)
  } else {
    result = cleanConductCheck(
      keys,
      checked.halfCheckedKeys,
      levelEntities,
      maxLevel,
      syntheticGetCheckDisabled,
    )
  }

  return result
}
