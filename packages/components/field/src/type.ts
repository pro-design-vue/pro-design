/*
 * @Author: shen
 * @Date: 2025-12-08 09:15:41
 * @LastEditors: shen
 * @LastEditTime: 2026-01-06 13:26:09
 * @Description:
 */

import type { VNode } from 'vue'

import type {
  Key,
  ProFieldValueType,
  ProSchemaValueEnumMap,
  ProSchemaValueEnumObj,
  ProVNode,
  RequestOptionsType,
} from '@pro-design-vue/utils'

export type ProFieldMode = 'read' | 'edit' | 'update'

export type SelectOptionType = Partial<RequestOptionsType>[]

export type ProFieldRequestData<U = any> = (params: U, props: any) => Promise<RequestOptionsType[]>
/**
 * BaseProField 的类型设置
 */
export type BaseProFieldProps = {
  /** 值的类型 */
  text: VNode
  /** 放置到组件上 props */
  fieldProps?: any
  /**
   * 组件的渲染模式类型
   * @option read 渲染只读模式
   * @option edit 渲染编辑模式
   * */
  mode: ProFieldMode
  /**
   * 简约模式
   */
  plain?: boolean
  /** 轻量模式 */
  light?: boolean
  /** Label */
  label?: any
  /** 映射值的类型 */
  valueEnum?: ProSchemaValueEnumObj | ProSchemaValueEnumMap
  /** 唯一的key，用于网络请求 */
  proFieldKey?: Key
}

/** Render 第二个参数，里面包含了一些常用的参数 */
export type ProFieldRenderProps = {
  mode?: ProFieldMode
  readonly?: boolean
  placeholder?: string | string[]
  value?: any
  onChange?: (...rest: any[]) => void
} & BaseProFieldProps

export type ProRenderFieldPropsType = {
  /**
   * 自定义只读模式的渲染器
   * @params props 关于dom的配置
   * @params dom 默认的 dom
   * @return 返回一个用于读的 dom
   */
  render?: (params: {
    text: any
    props: Omit<ProFieldRenderProps, 'value' | 'onChange'>
    dom: VNode
  }) => ProVNode

  /**
   * 一个自定义的编辑渲染器。
   * @params text 默认的值类型
   * @params props 关于dom的配置
   * @params dom 默认的 dom
   * @return 返回一个用于编辑的dom
   */
  renderFormItem?: (params: { text: any; props: ProFieldRenderProps; dom: VNode }) => ProVNode
}

/**
 * ProFieldValueTypeWithFieldProps
 * 字段值类型与 ProFieldProps 的映射关系
 */

/**
 * ProFieldValueObjectType 对象，用于描述值为 'progress' | 'money' | 'percent' | 'image' 类型的 ProField 的属性。
 * @typedef {Object} ProFieldValueObjectType
 * @property {('progress' | 'money' | 'percent' | 'image')} type - 值的类型。
 * @property {('normal' | 'active' | 'success' | 'exception' | undefined)} [status] - 状态。
 * @property {string} [locale] - 本地化语言。
 * @property {((value: any) => boolean) | boolean} [showSymbol] - 是否显示符号。
 * @property {boolean} [showColor] - 是否显示颜色。
 * @property {number} [precision] - 精度。
 * @property {boolean} [moneySymbol] - 是否显示货币符号。
 * @property {ProFieldRequestData} [request] - 远程请求数据。
 * @property {number} [width] - 图片的宽度。
 */
export type ProFieldValueObjectType = {
  /**
   * 类型
   * - 'progress': 进度条
   * - 'money': 金钱格式
   * - 'percent': 百分比
   * - 'image': 图片
   */
  type: 'progress' | 'money' | 'percent' | 'image'
  /**
   * 状态
   * - 'normal': 正常
   * - 'active': 活动中
   * - 'success': 成功
   * - 'exception': 异常
   */
  status?: 'normal' | 'active' | 'success' | 'exception' | undefined
  /** 本地化信息 */
  locale?: string
  /**
   * 百分比相关
   * - showSymbol?: 是否显示百分号，默认为 true
   * - showColor?: 是否显示颜色条，默认为 false
   * - precision?: 保留几位小数，默认为 2
   */
  showSymbol?: ((value: any) => boolean) | boolean
  showColor?: boolean
  precision?: number
  /**
   * 金钱相关
   * - moneySymbol?: 是否显示货币符号，默认为 true
   */
  moneySymbol?: boolean
  /** 数据请求 */
  request?: ProFieldRequestData
  /**
   * width?: 图片宽度，默认为 80
   */
  width?: number
}

export type RenderProps = Omit<ProFieldRenderProps, 'text'> &
  ProRenderFieldPropsType & {
    /** 从服务器读取选项 */
    request?: ProFieldRequestData
    params?: Record<string, any>
    emptyText?: ProVNode
    open?: boolean
    onOpenChange?: (open: boolean) => void
    [key: string]: any
  }

export type ProFieldTextType = ProVNode | ProVNode[] | Record<string, any> | Record<string, any>[]

export type ProFieldProps = {
  text?: ProFieldTextType
  valueType?: ProFieldValueType | ProFieldValueObjectType
} & RenderProps
