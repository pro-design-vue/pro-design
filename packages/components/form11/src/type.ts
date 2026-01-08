/*
 * @Author: shen
 * @Date: 2023-07-30 08:16:19
 * @LastEditors: shen
 * @LastEditTime: 2025-12-09 14:15:26
 * @Description:
 */
import dayjs from 'dayjs'
import { ProFieldType } from './fieldType'
import type {
  ButtonProps,
  ColProps,
  FormItemProps,
  FormProps,
  RowProps,
  SpaceProps,
} from 'ant-design-vue'
import type { VNode } from 'vue'

export type Theme = 'default' | 'custom'
export type Entity = Record<string, any>
export type NamePath = string | string[]
export type Key = string | number
export type ProVNode = string | number | boolean | VNode | null | undefined
export interface Option {
  value: Key
  label?: any
  text?: any
  key?: Key
  disabled?: boolean
  children?: Option[]
  isLeaf?: boolean
}

export type SpanConfig =
  | number
  | {
      xs: number
      sm: number
      md: number
      lg: number
      xl: number
      xxl: number
    }

export type ProRequestData<T = Entity, U = Record<string, any>> = (
  params: U,
  index?: number,
) => Promise<T>
export type SearchTransformKeyFn = (
  value: any,
  namePath: NamePath,
  allValues: any,
) => string | Record<string, any>
export type SearchConvertKeyFn = (
  value: any,
  namePath: NamePath,
) => string | boolean | Record<string, any>

export type TransformerMapType = Map<
  NamePath,
  {
    transform?: SearchTransformKeyFn
    convertValue?: SearchConvertKeyFn
  }
>

export type ProFormPropsType<T = Entity, U = Record<string, any>, FieldType = 'text'> = Omit<
  FormProps,
  'onFinish'
> &
  CommonFormProps<T, U, FieldType>
export interface ProFormGridConfig {
  /**
   * open grid layout
   * @default false
   */
  grid?: boolean
  /**
   * only works when grid is enabled
   *
   * When passing the `span` attribute, the default value is empty
   * @default
   * { xs: 24 }
   */
  colProps?: ColProps & {
    class?: string
    style?: StyleSheet
  }
  /**
   * only works when grid is enabled
   * @default
   * { gutter: 8 }
   */
  rowProps?: RowProps & {
    class?: string
    style?: StyleSheet
  }
}

/** @name 用于配置操作栏 */
export type SearchConfig = {
  /** @name 重置按钮的文本 */
  resetText?: ProVNode
  /** @name 提交按钮的文本 */
  submitText?: ProVNode
}

export type SubmitterProps<T = Entity> = {
  /** @name 提交方法 */
  onSubmit?: (formData: T, action?: ProFormActionType) => Promise<boolean | void> | boolean | void
  /** @name 重置方法 */
  onReset?: (formData: T, action?: ProFormActionType) => Promise<boolean | void> | boolean | void
  /** @name 搜索的配置，一般用来配置文本 */
  searchConfig?: SearchConfig
  /** @name 提交按钮的 props */
  submitButtonProps?: false | (ButtonProps & { preventDefault?: boolean })
  /** @name 重置按钮的 props */
  resetButtonProps?: false | (ButtonProps & { preventDefault?: boolean })
  /** @name 操作按钮渲染位置 */
  teleport?: string | HTMLElement
  /** @name 反转提交及重置按钮 */
  reverse?: boolean
  /** @name grid布局下 */
  colProps?: ColProps
  /** @name 自定义操作的渲染 */
  render?:
    | ((paramer: {
        props: SubmitterProps & {
          submit: () => void
          reset: () => void
        }
        action: ProFormActionType
        defaultDoms: VNode | VNode[]
      }) => VNode | false)
    | false
}

export type ReadonlyProps = {
  theme?: Theme
  customUi?: boolean
  tooltip?: boolean | string
  copy?: boolean
  emptyText?: string
  ellipsis?: boolean
  autoLine?: boolean
}

export type CommonFormProps<T = Entity, U = Record<string, any>, FieldType = 'text'> = {
  /**
   * @name 表单结束后调用
   * @description 支持异步操作，更加方便
   */
  onFinish?: (formData: T) => Promise<boolean | void> | boolean | void
  /**
   * @name 提交表单且数据验证失败后回调事件
   */
  onFinishFailed?: (errorInfo: any) => void
  /**
   * @name 表单数据重置回调事件
   */
  onReset?: (formData?: T) => void
  /**
   * @name 表单按钮的 loading 状态
   */
  loading?: boolean
  /**
   * @name 这是一个可选的属性(onLoadingChange)，它接受一个名为loading的参数，类型为boolean，表示加载状态是否改变。
   * 当loading状态发生变化时，将会调用一个函数，这个函数接受这个loading状态作为参数，并且没有返回值(void)。
   */
  onLoadingChange?: (loading: boolean) => void
  /**
   * @name 表单数据变化回调事件
   */
  onValuesChange?: (values: T) => void

  /**
   * 如果为 false,会原样保存。
   *
   * @default true
   * @param 要不要值中的 Null 和 undefined
   */
  omitNil?: boolean
  /**
   * 格式化 Date 的方式，默认转化为 string
   *
   * @example  dateFormatter="string" : Moment -> YYYY-MM-DD
   * @example  dateFormatter="YYYY-MM-DD  HH:mm:SS" Moment -> YYYY-MM-DD  HH:mm:SS
   * @example  dateFormatter="HH:mm:SS" Moment -> HH:mm:SS
   * @example  dateFormatter="number" Moment -> timestamp
   * @example  dateFormatter=false Moment -> Moment
   * @example  dateFormatter={(value)=>value.format("YYYY-MM-DD")}
   */
  dateFormatter?:
    | 'string'
    | 'number'
    | ((value: dayjs.Dayjs, fieldType: `${ProFieldType}`) => string | number)
    | false
  initialValues?: T
  /**
   * @name 发起网络请求的参数
   *
   * @example  params={{productId: 1}}
   * */
  params?: U
  /**
   * @name 发起网络请求的参数,返回值会覆盖给 initialValues
   *
   * @example async (params)=>{ return initialValues }
   */
  request?: ProRequestData<T, U>
  /**
   * @name 终止网络请求
   * */
  requestAbort?: boolean

  /** 是否回车提交 */
  isKeyPressSubmit?: boolean

  /** 用于控制form 是否相同的key，高阶用法 */
  formKey?: string

  /**
   * @name自动选中第一项
   * @description 只对有input的类型有效
   */
  autoFocusFirstInput?: boolean

  /**
   *  @name 是否只读模式，对所有表单项生效
   *  @description 优先低于表单项的 readonly
   */
  readonly?: boolean
  readonlyProps?: ReadonlyProps
  submitter?: SubmitterProps | false
  items: ProFormItemType<T, FieldType>[]
  theme: Theme
  customUi?: boolean
} & ProFormGridConfig

export type ProFormActionType<T = Entity> = {
  /** @name 获取对应字段名的值 */
  getFieldValue: (name: NamePath) => any
  /** @name 获取一组字段名对应的值，会按照对应结构返回。默认返回现存字段值，当调用getFieldsValue(true)时返回所有值 */
  getFieldsValue: (nameList?: true | NamePath[]) => Partial<T> | undefined
  /** @name 获取被SForm格式化后的单个数据 */
  getFieldFormatValue: (name: NamePath) => T | undefined
  /** @name 获取被SForm格式化后的单个数据,包含他的name */
  getFieldFormatValueObject: (name: NamePath) => T | undefined
  /** @name 验字段后返回格式化之后的所有数据 */
  validateFieldsReturnFormatValue: (nameList?: NamePath[]) => Promise<any> | undefined
  /** @name 设置表单的值,如果你不希望传入对象被修改，请克隆后传入 */
  setFieldValue: (name: NamePath, value: any) => void
  /** @name 设置表单的值 */
  setFieldsValue: (values: T, isMerge?: boolean) => void
  /** @name 重置一组字段到initialValues */
  resetInitialValues: (values: Entity) => void
  /** @name 重置一组字段到initialValues */
  resetField: (name: NamePath) => void
  /** @name 移除表单项的校验结果。传入待移除的表单项的name属性或者name组成的数组，如不传则移除整个表单的校验结果 */
  clearValidate: (name?: NamePath) => void
  /** @name 触发表单验证 */
  validateFields: (nameList?: NamePath[]) => Promise<T> | undefined
  /** @name 重置所有字段到initialValues */
  reset: () => void
  /** @name 提交表单，与点击submit按钮效果相同 */
  submit: () => void
}

export type ExtraSItemType = {
  className?: string
  customUi?: boolean
  /**
   * @type auto 使用组件默认的宽度
   * @type xs=104px 适用于短数字、短文本或选项。
   * @type sm=216px 适用于较短字段录入、如姓名、电话、ID 等。
   * @type md=328px 标准宽度，适用于大部分字段长度。
   * @type lg=440px 适用于较长字段录入，如长网址、标签组、文件路径等。
   * @type xl=552px 适用于长文本录入，如长链接、描述、备注等，通常搭配自适应多行输入框或定高文本域使用。
   */
  width?: string | number
  ignoreWidth?: boolean
  name?: NamePath
  originName?: NamePath
  defaultKeyWords?: string
  linkage?: {
    disabled?: Key[] | ((value: any, formData: any, rowData?: Entity) => Key[])
    hidden?: Key[] | ((value: any, formData: any, rowData?: Entity) => Key[])
    clear?: NamePath[] | ((value: any, formData: any, rowData?: Entity) => NamePath[])
    request?: Key[] | ((value: any) => Key[])
  }
} & Pick<ProFormGridConfig, 'rowProps' | 'colProps'>

export type ProFormItemType<T = Entity, FieldType = 'text'> = {
  key?: Key
  originKey?: Key
  /** @name 展示一个 icon，hover 是展示一些提示信息 */
  tooltip?: string | true

  hidden?: boolean
  /**
   * 只有在栅格模式下，控制分组是否栅格
   *
   * @name 分组是否栅格
   */
  grid?: boolean
  /**
   * 支持 VNode 和 方法
   *
   * @name 标题
   */
  title?: ProVNode | ((params: { formData: T; readonly?: boolean; rowData?: Entity }) => ProVNode)

  /**
   * 支持 VNode 和 方法
   *
   * @name 标题扩展，
   */
  extra?: {
    label?: ProVNode | ((params: { formData: T; rowData?: Entity }) => ProVNode)
    item?: ProVNode | ((params: { formData: T; rowData?: Entity }) => ProVNode)
  }

  /**
   * 支持 object 和Map，Map 是支持其他基础类型作为 key
   *
   * @name 映射值的类型
   */
  valueEnum?:
    | ((formData: T, rowData?: Entity) => ProValueEnumObj | ProValueEnumMap)
    | ProValueEnumObj
    | ProValueEnumMap
  options?:
    | (string | number | RequestOptionsType)[]
    | ((formData: T, rowData?: Entity) => (string | number | RequestOptionsType)[])
  /**
   * @name 自定义的 formItemProps
   */
  formItemProps?:
    | Record<string, any>
    | ((formData: T, config: ProFormItemType<T, FieldType>) => Record<string, any>)

  colSize?: number
  /** 是否只读模式 */
  readonly?: ((formData: T, rowData?: Entity) => boolean) | boolean
  readonlyProps?: ReadonlyProps
  /** 搜索表单的默认值 */
  initialValue?: any
  allowClear?: boolean
  disabled?: ((formData: T, rowData?: Entity) => boolean) | boolean
  rules?:
    | ((formData: T, action: ProFormActionType, rowData?: Entity) => FormItemProps['rules'])
    | FormItemProps['rules']

  /**
   * @name 获取时转化值，一般用于将数据格式化为组件接收的格式
   * @param value 字段的值
   * @param namePath 字段的name
   * @returns 字段新的值
   *
   *
   * @example a,b => [a,b]     convertValue: (value,namePath)=> value.split(",")
   * @example string => json   convertValue: (value,namePath)=> JSON.parse(value)
   * @example number => date   convertValue: (value,namePath)=> Dayjs(value)
   * @example YYYY-MM-DD => date   convertValue: (value,namePath)=> Dayjs(value,"YYYY-MM-DD")
   * @example  string => object   convertValue: (value,namePath)=> { return {value,label:value} }
   */
  convertValue?: SearchConvertKeyFn
  /**
   * @name 提交时转化值，一般用于将值转化为提交的数据
   * @param value 字段的值
   * @param namePath 字段的name
   * @param allValues 所有的字段
   * @returns 字段新的值，如果返回对象，会和所有值 merge 一次
   *
   * @example {name:[a,b] => {name:a,b }    transform: (value,namePath,allValues)=> value.join(",")
   * @example {name: string => { newName:string }    transform: (value,namePath,allValues)=> { newName:value }
   * @example {name:dayjs} => {name:string transform: (value,namePath,allValues)=> value.format("YYYY-MM-DD")
   * @example {name:dayjs}=> {name:时间戳} transform: (value,namePath,allValues)=> value.valueOf()
   * @example {name:{value,label}} => { name:string} transform: (value,namePath,allValues)=> value.value
   * @example {name:{value,label}} => { valueName,labelName  } transform: (value,namePath,allValues)=> { valueName:value.value, labelName:value.name }
   */
  transform?: SearchTransformKeyFn
  /** Form 的排序 */
  order?: number
  placeholder?: string | string[]
  fieldType?: FieldType | `${ProFieldType}`
  fieldProps?:
    | ((formData: T, action: ProFormActionType, rowData?: Entity) => Record<string, any>)
    | Record<string, any>
  spaceProps?: SpaceProps
  /** @name 从服务器请求枚举 */
  request?: FieldRequestData
  /** @name 从服务器请求的参数，改变了会触发 reload */
  params?: ((record: T) => Record<string, any>) | Record<string, any>
  /** @name 依赖字段的name，暂时只在拥有 request 的项目中生效，会自动注入到 params 中 */
  dependencies?: NamePath[]
  renderFormItem?:
    | string
    | ((config: {
        value: any
        onChange: <T = any>(value: T, ...args: any[]) => void
        defaultDom: VNode
        formData: T
        rowData?: Entity
        action: ProFormActionType
      }) => VNode | string)
  render?: ProVNode | ((params: { formData: T; defaultDom: VNode; rowData?: Entity }) => ProVNode)
  onChange?: (...args: any[]) => void
  onInit?: (ref: any) => void
  /** 嵌套子项 */
  children?:
    | ProFormItemType<T, FieldType | `${ProFieldType}`>[]
    | ((formData: T, rowData?: Entity) => ProFormItemType<T, FieldType | `${ProFieldType}`>[])
} & ExtraSItemType

export type SFormListProps = {
  min?: number
}

/**
 * 支持 Map 和 Record<string,any>
 *
 * @name ValueEnum 的类型
 */
export type ProValueEnumMap = Map<string | number | boolean, ProValueEnumType | ProVNode>

export type ProValueEnumObj = Record<string, ProValueEnumType | ProVNode>

export type ProFieldValueEnumType = ProValueEnumMap | ProValueEnumObj

/**
 * 用于配置 ValueEnum 的通用配置
 */
export type ProValueEnumType = {
  /** @name 演示的文案 */
  text: ProVNode
  /** @name 预定的颜色 */
  status?: string
  /** @name 自定义的颜色 */
  color?: string
  /** @name 是否禁用 */
  disabled?: boolean
}

export type FocusEventHandler = (e: FocusEvent) => void
export type MouseEventHandler = (e: MouseEvent) => void
export type KeyboardEventHandler = (e: KeyboardEvent) => void
export type CompositionEventHandler = (e: CompositionEvent) => void
export type ClipboardEventHandler = (e: ClipboardEvent) => void
export type ChangeEventHandler = (e: ChangeEvent) => void
export type WheelEventHandler = (e: WheelEvent) => void
export type ChangeEvent = Event & {
  target: {
    value?: string
  }
}

export type CheckboxChangeEvent = Event & {
  target: {
    checked?: boolean
  }
}

export type EventHandler = (...args: any[]) => void

export type RequestOptionsType = {
  label?: string
  value?: string | number | boolean
  optionType?: 'optGroup' | 'option'
  options?: Omit<RequestOptionsType, 'children' | 'optionType'>[]
  text?: string
  title?: string
  key?: Key
  disabled?: boolean
  children?: RequestOptionsType[]
  isLeaf?: boolean
  [key: string]: any
}

export type FieldRequestData<U = any> = (
  params: U,
  index?: number,
) => Promise<
  | (string | number | RequestOptionsType)[]
  | {
      success: true
      total: number
      data: (string | number | RequestOptionsType)[]
    }
>
