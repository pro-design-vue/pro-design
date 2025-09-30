import { isVNode, camelize, Fragment, Comment } from 'vue'

import type { CSSProperties, VNodeChild, VNodeNormalizedChildren, VNode } from 'vue'
import type {
  Bordered,
  BorderedType,
  ColumnsType,
  ColumnType,
  DataIndex,
  Key,
} from '../components/interface'

export function is(val: unknown, type: string) {
  return toString.call(val) === `[object ${type}]`
}

export function isFunction(val: unknown): val is Function {
  return typeof val === 'function'
}

export function isArray(val: any): val is Array<any> {
  return val && Array.isArray(val)
}

export function isString(val: unknown): val is string {
  return is(val, 'String')
}

export declare const isSymbol: (val: any) => boolean

export function isObject(val: any): val is Record<any, any> {
  return val !== null && is(val, 'Object')
}

export declare function getColumnKey<RecordType>(
  column: ColumnType<RecordType>,
  defaultKey: string,
): Key

/**
 * 根据 key 和 dataIndex 生成唯一 id
 *
 * @param key 用户设置的 key
 * @param dataIndex 在对象中的数据
 * @param index 序列号，理论上唯一
 */
export const genColumnKey = (key?: string | number, index?: number | string): string => {
  if (key) {
    return Array.isArray(key) ? key.join('-') : key.toString()
  }
  return `${index}`
}

export function getColumnPos(index: number, pos?: string) {
  return pos ? `${pos}-${index}` : `${index}`
}
export declare function getNewColumnsByWidth<RecordType>(
  columns: ColumnsType<RecordType>,
  newWidths: Record<string, number>,
  pos?: string,
): ColumnsType<RecordType>
export declare type SortOrder = 'desc' | 'asc' | null
export interface ColumnTitleProps<RecordType> {
  /** @deprecated Please use `sorterColumns` instead. */
  sortOrder?: SortOrder
  /** @deprecated Please use `sorterColumns` instead. */
  sortColumn?: ColumnType<RecordType>
  sortColumns?: {
    column: ColumnType<RecordType>
    order: SortOrder
  }[]
  filters?: Record<string, string[]>
}
export declare function renderColumnTitle<RecordType>(
  title: any,
  props: ColumnTitleProps<RecordType>,
): any
export function objectToEmpty(obj: Record<string, any>): void {
  for (const key in obj) Object.prototype.hasOwnProperty.call(obj, key) && delete obj[key]
}

function toArray<T>(arr: T | readonly T[]): T[] {
  if (arr === undefined || arr === null) {
    return []
  }
  return (Array.isArray(arr) ? arr : [arr]) as T[]
}

export function getPathValue<ValueType, ObjectType extends object>(
  record: ObjectType,
  path: DataIndex,
): ValueType | null {
  // Skip if path is empty
  if (!path && typeof path !== 'number') {
    return record as unknown as ValueType
  }

  const pathList = toArray(path)

  let current: ValueType | ObjectType = record

  for (let i = 0; i < pathList.length; i += 1) {
    if (!current) {
      return null
    }

    const prop = pathList[i]!
    current = current[prop]
  }

  return current as ValueType
}

export declare function setPathValue<ValueType, ObjectType extends object>(
  record: ObjectType,
  path: DataIndex,
  value: ValueType,
): ValueType

export function isValidElement(element: VNode | VNode[]) {
  if (Array.isArray(element) && element.length === 1) {
    element = element[0]!
  }
  return element && isVNode(element) && typeof element.type !== 'symbol' // remove text node
}

export const parseStyleText = (cssText: string | CSSProperties, camel?: boolean) => {
  const res = {}
  const listDelimiter = /;(?![^(]*\))/g
  const propertyDelimiter = /:(.+)/
  if (typeof cssText === 'object') return cssText
  cssText.split(listDelimiter).forEach(function (item) {
    if (item) {
      const tmp = item.split(propertyDelimiter)
      if (tmp.length > 1) {
        const k = camel ? camelize(tmp[0]!.trim()) : tmp[0]!.trim()
        res[k] = tmp[1]!.trim()
      }
    }
  })
  return res
}

export function setPromise(fn: any): {
  promise: Promise<void>
  cancel: () => void
} {
  let rejectFn: (reason?: any) => void
  let isCancel = false
  return {
    promise: new Promise((resolve, reject) => {
      rejectFn = reject
      Promise.resolve().then(() => {
        resolve('')
      })
    })
      .then(() => {
        if (!isCancel) {
          fn()
        }
      })
      .catch(() => {}),
    cancel: () => {
      isCancel = true
      rejectFn && rejectFn()
    },
  }
}

export function arrDel(list: Key[], value: Key) {
  if (!list) return []
  const clone = list.slice()
  const index = clone.indexOf(value)
  if (index >= 0) {
    clone.splice(index, 1)
  }
  return clone
}

export function arrAdd(list: Key[], value: Key) {
  const clone = (list || []).slice()
  if (clone.indexOf(value) === -1) {
    clone.push(value)
  }
  return clone
}
export declare function isEmptyElement(c: any): boolean

const isValid = (value: any): boolean => {
  return value !== undefined && value !== null && value !== ''
}
export default isValid

export type VNodeChildAtom = Exclude<VNodeChild, Array<any>>
export type RawSlots = Exclude<VNodeNormalizedChildren, Array<any> | null | string>

export type FlattenVNodes = Array<VNodeChildAtom | RawSlots>
const flattenChildren = (
  children: FlattenVNodes | VNode | VNodeNormalizedChildren,
  filterEmpty = true,
): FlattenVNodes => {
  const vNodes = isArray(children) ? children : [children]
  const result: FlattenVNodes = []
  vNodes.forEach((child: any) => {
    if (isArray(child)) {
      result.push(...flattenChildren(child, filterEmpty))
    } else if (child && child.type === Fragment) {
      result.push(...flattenChildren(child.children, filterEmpty))
    } else if (child && isVNode(child)) {
      if (filterEmpty && !isEmptyElement(child)) {
        result.push(child)
      } else if (!filterEmpty) {
        result.push(child)
      }
    } else if (isValid(child)) {
      result.push(child)
    }
  })
  return result
}
export function convertChildrenToColumns<RecordType>(
  elements: any[] = [],
): ColumnsType<RecordType> {
  const flattenElements = flattenChildren(elements)
  const columns: any[] = []
  flattenElements.forEach((element: any) => {
    if (!element) {
      return
    }
    const key = element.key
    const style = element.props?.style || {}
    const cls = element.props?.class || ''
    const props = element.props || {}
    for (const [k, v] of Object.entries(props)) {
      props[camelize(k)] = v
    }
    const { default: children, ...restSlots } = element.children || {}
    const column = { ...restSlots, ...props, style, class: cls }
    if (key) {
      column.key = key
    }
    if (element.type?.__S_TABLE_COLUMN_GROUP) {
      column.children = convertChildrenToColumns(
        typeof children === 'function' ? children() : children,
      )
    } else {
      const customRender = element.children?.default
      column.customRender = column.customRender || customRender
    }
    columns.push(column)
  })
  return columns
}

export const eventsClose = (e1: MouseEvent | Touch, e2: MouseEvent | Touch, diff: number) => {
  return (
    diff !== 0 &&
    Math.max(Math.abs(e1.clientX - e2.clientX), Math.abs(e1.clientY - e2.clientY)) <= diff
  )
}
export declare function getNestItemData<T>(
  data: T[],
  indexs: number[],
  childrenColumnName: string,
): T
export function addNestItemData<T>(
  data: T[],
  indexs: number[],
  childrenColumnName: string,
  itemData: T,
): any[] {
  let item: T
  let copyData: T[] = data
  let currentData: T[] = []
  const indexsLen = indexs.length
  if (indexsLen === 0) {
    data.splice(0, 0, itemData)
    return data
  }
  for (let i = 0; i < indexsLen; i++) {
    item = copyData[indexs[i]!]!
    if (i === indexsLen - 1) {
      currentData = copyData
    }
    copyData = item?.[childrenColumnName] || []
  }
  currentData.splice(indexs[indexsLen - 1]! + 1, 0, itemData)
  return currentData
}

export function deleteNestItemData<T>(
  data: T[],
  indexs: number[],
  childrenColumnName: string,
): any[] {
  let item: T
  let copyData: T[] = data
  let currentData: T[] = []
  const indexsLen = indexs.length
  for (let i = 0; i < indexsLen; i++) {
    item = copyData[indexs[i]!]!
    if (i === indexsLen - 1) {
      currentData = copyData
    }
    copyData = item?.[childrenColumnName] || []
  }
  currentData.splice(indexs[indexsLen - 1]!, 1)
  return currentData
}

export function isPromise<T = any>(val: any): val is Promise<T> {
  return is(val, 'Promise') && isFunction(val.then) && isFunction(val.catch)
}

export function ensureValidVNode(vnodes: any): any {
  return vnodes.some(
    (vnode: any) =>
      !isVNode(vnode) ||
      (vnode.type !== Comment && !(vnode.type === Fragment && !ensureValidVNode(vnode.children))),
  )
    ? vnodes
    : null
}

export const isBordered = (borderType: BorderedType, border?: Bordered) => {
  if (border === undefined) {
    return false
  }
  if (typeof border === 'boolean') {
    return border
  }
  return border[borderType]
}
