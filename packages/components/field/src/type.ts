/*
 * @Author: shen
 * @Date: 2025-12-08 09:15:41
 * @LastEditors: shen
 * @LastEditTime: 2025-12-25 15:05:01
 * @Description:
 */

import type { VNode } from 'vue'
import type {
  FormItemProps,
  InputProps,
  TextAreaProps,
  DatePickerProps,
  TimeRangePickerProps,
  SelectProps,
  CheckboxProps,
  RateProps,
  SliderProps,
  RadioProps,
  ProgressProps,
  InputNumberProps,
  AvatarProps,
  SwitchProps,
  ImageProps,
  CascaderProps,
  TreeSelectProps,
  SegmentedProps,
  DividerProps,
  PopoverProps,
} from 'ant-design-vue'
import type { RangePickerProps } from 'ant-design-vue/es/date-picker'
import type { Key, ProVNode } from '@pro-design-vue/utils'

export type ProFieldMode = 'read' | 'edit' | 'update'

export type RequestOptionsType = {
  /**
   * 选项的文本内容，可以是一个 React 组件。
   */
  label?: ProVNode
  /**
   * 选项的值，可以是一个字符串或数字类型。
   */
  value?: string | number | boolean
  /** 渲染的节点类型 */
  optionType?: 'optGroup' | 'option'
  /**
   * 当节点类型为 optGroup 时，可以使用该属性来定义其包含的子选项，每个子选项也可以使用 RequestOptionsType 类型来定义。
   */
  options?: Omit<RequestOptionsType, 'children' | 'optionType'>[]
  /** 其他自定义属性。 */
  [key: string]: any
}

export type SelectOptionType = Partial<RequestOptionsType>[]

export type ProFieldRequestData<U = any> = (params: U, props: any) => Promise<RequestOptionsType[]>
/**
 * 用于配置 ValueEnum 的通用配置
 */
export type ProSchemaValueEnumType = {
  /** @name 演示的文案 */
  text: any
  /** @name 预定的颜色 */
  status?: string
  /** @name 自定义的颜色 */
  color?: string
  /** @name 是否禁用 */
  disabled?: boolean
}

/**
 * 支持 Map 和 Object
 *
 * @name ValueEnum 的类型
 */
export type ProSchemaValueEnumMap = Map<string | number | boolean, ProSchemaValueEnumType>

/**
 * 支持 Map 和 Object
 */
export type ProSchemaValueEnumObj = Record<string, ProSchemaValueEnumType>

export type ProFieldValueEnumType = ProSchemaValueEnumMap | ProSchemaValueEnumObj
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
export type ProFieldValueTypeWithFieldProps = {
  /** 文本输入框 */
  text: InputProps
  /** 密码输入框 */
  password: InputProps & {
    visibilityToggle?: boolean
    visible?: boolean
    iconRender?: any
    'onUpdate:visible'?: (visible: boolean) => void
  }
  /** 金额 */
  money: Record<string, any>
  /** 索引 */
  index: Record<string, any>
  /** 索引带边框 */
  indexBorder: Record<string, any>
  /** 下拉选择 */
  option: Record<string, any>
  /** 多行文本 */
  textarea: TextAreaProps
  /** 日期选择器 */
  date: DatePickerProps
  /** 周选择器 */
  dateWeek: DatePickerProps
  /** 月选择器 */
  dateMonth: DatePickerProps
  /** 季度选择器 */
  dateQuarter: DatePickerProps
  /** 年选择器 */
  dateYear: DatePickerProps
  /** 日期时间选择器 */
  dateTime: DatePickerProps
  /** 相对时间 */
  fromNow: DatePickerProps
  /** 日期范围选择器 */
  dateRange: RangePickerProps
  /** 日期时间范围选择器 */
  dateTimeRange: RangePickerProps
  /** 周范围选择器 */
  dateWeekRange: RangePickerProps
  /** 月范围选择器 */
  dateMonthRange: RangePickerProps
  /** 季范围选择器 */
  dateQuarterRange: RangePickerProps
  /** 年范围选择器 */
  dateYearRange: RangePickerProps
  /** 时间选择器 */
  time: TimeRangePickerProps
  /** 时间范围选择器 */
  timeRange: TimeRangePickerProps
  /** 下拉选择器 */
  select: SelectProps
  /** 复选框 */
  checkbox: CheckboxProps
  /** 评分 */
  rate: RateProps
  /** 滑动条 */
  slider: SliderProps
  /** 单选框 */
  radio: RadioProps
  /** 单选框按钮 */
  radioButton: RadioProps
  /** 进度条 */
  progress: ProgressProps
  /** 百分比输入框 */
  percent: InputNumberProps
  /** 数字输入框 */
  digit: InputNumberProps
  /** 数字范围输入框 */
  digitRange: InputNumberProps
  /** 秒数输入框 */
  second: InputNumberProps
  /** 代码输入框 */
  code: InputProps | TextAreaProps
  /** JSON 代码输入框 */
  jsonCode: InputProps | TextAreaProps
  /** 头像 */
  avatar: AvatarProps
  /** 开关 */
  switch: SwitchProps
  /** 图片 */
  image: ImageProps | InputProps
  /** 级联选择 */
  cascader: CascaderProps
  /** 树形选择 */
  treeSelect: TreeSelectProps
  /** 颜色选择器 */
  color: SketchPickerProps &
    ColorPickerProps & {
      value?: string
      popoverProps?: PopoverProps
      mode?: 'read' | 'edit'
      onChange?: (color: string) => void
      colors?: string[]
    }
  /** 分段器 */
  segmented: SegmentedProps
  /** 分组 */
  // group: ProFormBaseGroupProps;
  /** 表单列表 */
  formList: Record<string, any>
  /** 表单集合 */
  formSet: Record<string, any>
  /** 分割线 */
  divider: DividerProps
  /** 显示/隐藏 */
  dependency: FormItemProps
}

/**
 * @param textarea 文本框
 * @param password 密码框
 * @param money 金额 option 操作 需要返回一个数组
 * @param date 日期 YYYY-MM-DD
 * @param dateWeek 周选择器
 * @param dateMonth 月选择器
 * @param dateQuarter 季度选择器
 * @param dateYear 年选择器
 * @param dateRange 日期范围 YYYY-MM-DD[]
 * @param dateTime 日期和时间 YYYY-MM-DD HH:mm:ss
 * @param dateTimeRange 范围日期和时间 YYYY-MM-DD HH:mm:ss[]
 * @param time: 时间 HH:mm:ss
 * @param timeRange: 时间区间 HH:mm:ss[]
 * @param index：序列
 * @param indexBorder：序列
 * @param progress: 进度条
 * @param percent: 百分比
 * @param digit 数值
 * @param second 秒速
 * @param fromNow 相对于当前时间
 * @param avatar 头像
 * @param code 代码块
 * @param image 图片设置
 * @param jsonCode Json 的代码块，格式化了一下
 * @param color 颜色选择器
 */
export type ProFieldValueType = Extract<keyof ProFieldValueTypeWithFieldProps, any>

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
