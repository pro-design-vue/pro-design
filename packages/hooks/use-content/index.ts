import {
  camelCase,
  hasOwn,
  isArray,
  isFunction,
  isObject,
  isString,
  kebabCase,
} from '@pro-design-vue/utils'
import {
  h,
  getCurrentInstance,
  type ComponentInternalInstance,
  type VNode,
  isVNode,
  Fragment,
  type Slot,
  type VNodeProps,
} from 'vue'

interface JSXRenderContext {
  defaultNode?: VNode | string
  params?: Record<string, any>
  props?: Record<string, any>
  slots?: {
    [x: string]: Slot | Slot<any> | undefined
  }
  slotFirst?: boolean
  // 是否不打印 LOG
  silent?: boolean
}

type OptionsType = VNode | JSXRenderContext | string

function getDefaultNode(options?: OptionsType) {
  let defaultNode
  if (isObject(options) && 'defaultNode' in options) {
    defaultNode = options.defaultNode
  } else if (isVNode(options) || isString(options)) {
    defaultNode = options
  }
  return defaultNode
}

export function getChildren(content: VNode[]) {
  const childList: VNode[] = []
  const innerGetChildren = (content: VNode[]) => {
    if (!isArray(content)) return
    content.forEach((item: VNode) => {
      if (item.children && isArray(item.children)) {
        if (item.type !== Fragment) return
        innerGetChildren(item.children as VNode[])
      } else {
        childList.push(item)
      }
    })
    return childList
  }

  return innerGetChildren(content)
}

export function getParams(options?: OptionsType) {
  // TODO:PAOPAO in ??? in my view, it is better to use hasOwnProperty instead of in if it is not necessary.
  return isObject(options) && 'params' in options ? options.params : {}
}

// and only hooks tnode import this one, so, can we move it to tnode hooks directly????
export function getSlotFirst(options?: OptionsType): boolean {
  return isObject(options) && 'slotFirst' in options ? !!options.slotFirst : false
}

export function getSlots(
  instance: ComponentInternalInstance,
  options?: OptionsType,
): {
  [x: string]: Slot | Slot<any> | undefined
} {
  const extraSlots = isObject(options) && 'slots' in options ? options.slots : {}
  const slots = { ...instance.slots, ...extraSlots }
  return slots
}

export function getProps(
  instance: ComponentInternalInstance,
  options?: OptionsType,
): VNodeProps & {
  [x: string]: any
} {
  const extraProps = isObject(options) && 'props' in options ? options.props : {}
  const props = { ...instance.props, ...extraProps }
  return props
}

/**
 * 判断一个 VNode 是否是注释节点（Comment）
 * Vue 3 中注释节点的 type 是 Comment
 *
 * @param node - 任意节点
 * @returns 是否为注释类型的 VNode
 */
export const isCommentVNode = (node: unknown): node is VNode => {
  return isVNode(node) && node.type === Comment
}

// 兼容处理插槽名称，同时支持驼峰命名和中划线命名，示例：value-display 和 valueDisplay
function handleSlots(
  slots: {
    [x: string]: Slot | Slot<any> | undefined
  },
  name: string,
  params?: Record<string, any>,
) {
  // 检查是否存在 驼峰命名 的插槽（过滤注释节点）
  let node = slots[camelCase(name)]?.(params)
  if (node && node.filter((t) => !isCommentVNode(t)).length) return node
  // 检查是否存在 中划线命名 的插槽
  node = slots[kebabCase(name)]?.(params)
  if (node && node.filter((t) => !isCommentVNode(t)).length) return node
  return null
}

/**
 * 是否为空节点，需要过滤掉注释节点。注释节点也会被认为是空节点
 */
function isEmptyNode(node: any) {
  if ([undefined, null, ''].includes(node)) return true
  const innerNodes = node instanceof Array ? node : [node]
  const r = innerNodes.filter((node) => node?.type?.toString() !== 'Symbol(Comment)')
  return !r.length
}

// TODO 可以把这里移动到 utils 中
/**
 * 检查用户是否有主动传 prop
 * @param instance 组件实例
 * @param propName prop 名称
 * @returns boolean
 */
function isPropExplicitlySet(vProps: VNodeProps, propName: string) {
  return hasOwn(vProps, camelCase(propName)) || hasOwn(vProps, kebabCase(propName))
}

/**
/**
 * 通过 JSX 的方式渲染 VNode，props 和 插槽同时处理，也能处理默认值为 true 则渲染默认节点的情况
 * 优先级：用户注入的 props 值 > slot > 默认 props 值
 * 如果 props 值为 true ，则使用插槽渲染。如果也没有插槽的情况下，则使用 defaulVNode 渲染
 * @example const renderVNodeJSX = useVNodeJSX()
 * @return () => {}
 * @param name 插槽和属性名称
 * @param options 值可能为默认渲染节点，也可能是默认渲染节点和参数的集合
 * @example renderVNodeJSX('closeBtn')  优先级 props function 大于 插槽
 * @example renderVNodeJSX('closeBtn', <close-icon />)。 当属性值为 true 时则渲染 <close-icon />
 * @example renderVNodeJSX('closeBtn', { defaulVNode: <close-icon />, params })。 params 为渲染节点时所需的参数
 */
export const useVNodeJSX = () => {
  const instance = getCurrentInstance()!
  return function (name: string, options?: OptionsType) {
    // 渲染节点时所需的参数
    const renderParams = getParams(options)
    // 默认渲染节点
    const defaulVNode = getDefaultNode(options)
    // 获取所有slots
    const slots = getSlots(instance, options)
    // 获取所有props
    const props = getProps(instance, options)

    // 是否显示设置 slot 优先
    const isSlotFirst = getSlotFirst(options)
    // 插槽
    const renderSlot = slots[camelCase(name)] || slots[kebabCase(name)]

    if (isSlotFirst && renderSlot) {
      // 1. 如果显示设置了 slot 优先，并且存在 slot，那么优先使用 slot
      return handleSlots(slots, name, renderParams)
    } else {
      // 2. 否者按照 用户主动传入的 props 值 > slot > 默认 props 值
      // 2.1 处理主动传入的 prop
      if (isPropExplicitlySet(props, name)) {
        // 2.1.1 如果有传，那么优先使用 prop 的值
        const propsNode = props[camelCase(name)] || props[kebabCase(name)]
        // 如果该属性的类型有多种且包含 Boolean 和 Slot 的情况下，处理 boolean casting true 的场景
        // const types = instance.type.props[name]?.type
        // if (types?.length > 1) {
        //   if (types.includes(Boolean) && types.includes(Function)) {
        //     if (propsNode === '' && !renderSlot) return defaulVNode
        //   }
        // }
        // 2.1.2 如果 prop 的值为 false 或者 null，那么直接不渲染
        if (propsNode === false || propsNode === null) return
        // 2.1.3 如果 prop 的值为 true，那么使用 slot 渲染
        if (propsNode === true) {
          return handleSlots(slots, name, renderParams) || defaulVNode
        }
        if (isFunction(propsNode)) return propsNode(h, renderParams)
        const isPropsEmpty = [undefined, ''].includes(propsNode as any)
        if (isPropsEmpty && renderSlot) {
          return handleSlots(slots, name, renderParams)
        }
        // 2.1.6 如果 prop 的值为其他值，那么直接返回
        return propsNode
      }
      // 2.2 如果未主动传入 prop，那么渲染 slot，当然前提是存在 slot
      if (renderSlot) {
        return handleSlots(slots, name, renderParams)
      }
      // 2.3 如果未主动传入 prop，也没有 slot，那么就走 prop
      const propsNode = props[camelCase(name)] || props[kebabCase(name)]
      if (propsNode === false || propsNode === null) return
      if (propsNode === true) {
        return defaulVNode
      }
      if (isFunction(propsNode)) return propsNode(h, renderParams)
      return propsNode
    }
  }
}

/**
 * 在setup中，通过JSX的方式 VNode，props 和 插槽同时处理。与 renderVNodeJSX 区别在于属性值为 undefined 时会渲染默认节点
 * @example const renderVNodeJSXDefault = useVNodeDefault()
 * @return () => {}
 * @param name 插槽和属性名称
 * @example renderVNodeJSXDefault('closeBtn')
 * @example renderVNodeJSXDefault('closeBtn', <close-icon />) closeBtn 为空时，则兜底渲染 <close-icon />
 * @example renderVNodeJSXDefault('closeBtn', { defaulVNode: <close-icon />, params }) 。params 为渲染节点时所需的参数
 */
export const useVNodeDefault = () => {
  const renderVNodeJSX = useVNodeJSX()
  return function (name: string, options?: VNode | JSXRenderContext) {
    const defaulVNode = getDefaultNode(options)
    return renderVNodeJSX(name, options) || defaulVNode
  }
}

/**
 * 在setup中，用于处理相同名称的 VNode 渲染
 * @example const renderContent = useContent()
 * @return () => {}
 * @param name1 第一个名称，优先级高于 name2
 * @param name2 第二个名称
 * @param defaulVNode 默认渲染内容：当 name1 和 name2 都为空时会启动默认内容渲染
 * @example renderContent('default', 'content')
 * @example renderContent('default', 'content', '我是默认内容')
 * @example renderContent('default', 'content', { defaulVNode: '我是默认内容', params })
 */
export const useContent = () => {
  const renderVNodeJSX = useVNodeJSX()
  return function (name1: string, name2: string, options?: VNode | JSXRenderContext) {
    // assemble params && defaulVNode
    const params = getParams(options)
    const defaulVNode = getDefaultNode(options)

    const toParams = params ? { params } : undefined

    const node1 = renderVNodeJSX(name1, toParams)
    const node2 = renderVNodeJSX(name2, toParams)

    const res = isEmptyNode(node1) ? node2 : node1
    return isEmptyNode(res) ? defaulVNode : res
  }
}

/**
 * 过滤掉注释节点。
 *
 * @param nodes - VNode 数组
 * @returns 去除注释节点后的 VNode 数组。
 */
export const filterCommenVNode = (nodes: VNode[]): VNode[] => {
  return nodes.filter((node) => !isCommentVNode(node))
}
