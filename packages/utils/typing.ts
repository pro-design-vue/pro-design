/*
 * @Author: shen
 * @Date: 2025-12-08 10:20:32
 * @LastEditors: shen
 * @LastEditTime: 2026-01-16 09:15:41
 * @Description:
 */
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
  TooltipProps,
  SpaceProps,
} from 'ant-design-vue'
import type { RangePickerProps } from 'ant-design-vue/es/date-picker'
import type { NamePath } from 'ant-design-vue/es/form/interface'
import type { CSSProperties, VNode } from 'vue'

export type ProVNode = string | number | boolean | VNode | null | undefined
export type Key = string | number | bigint
export type Entity = Record<string, any>
export type ProFieldMode = 'read' | 'edit' | 'update'

export type ProFormInstance<Values = Entity> = {
  /** @name 获取被 ProForm 格式化后的所有数据 */
  getFieldsFormatValue: (allData?: true) => any
  /** @name 获取对应字段名的值 */
  getFieldValue: (name: NamePath) => any
  /** @name 获取一组字段名对应的值，会按照对应结构返回。默认返回现存字段值，当调用getFieldsValue(true)时返回所有值 */
  getFieldsValue: (nameList?: true | NamePath[]) => Partial<Values> | undefined
  /** @name 获取被 ProForm 格式化后的单个数据 */
  getFieldFormatValue: (name: NamePath) => any
  /** @name 获取被 ProForm 格式化后的单个数据,包含他的name */
  getFieldFormatValueObject: (name: NamePath) => Values | undefined
  /** @name 验字段后返回格式化之后的所有数据 */
  validateFieldsReturnFormatValue: (nameList?: NamePath[]) => Promise<any> | undefined
  /** @name 设置表单的值,如果你不希望传入对象被修改，请克隆后传入 */
  setFieldValue: (name: NamePath, value: any) => void
  /** @name 设置表单的值 */
  setFieldsValue: (values: Values, isMerge?: boolean) => void
  /** @name 重置一组字段到initialValues */
  resetInitialValues: (values: Entity) => void
  /** @name 重置一组字段到initialValues */
  resetFields: (nameList?: NamePath[]) => void
  /** @name 移除表单项的校验结果。传入待移除的表单项的name属性或者name组成的数组，如不传则移除整个表单的校验结果 */
  clearValidate: (nameList?: NamePath[]) => void
  /** @name 触发表单验证 */
  validateFields: (nameList?: NamePath[]) => Promise<Values> | undefined
  /** @name 触发表单验证 */
  validate: (nameList?: NamePath[]) => Promise<Values> | undefined
  /** @name 重置所有字段到initialValues */
  reset: () => void
  /** @name 提交表单，与点击submit按钮效果相同 */
  submit: () => void
}

/**
 * 这是一个泛型类型定义，用于定义 FieldPropsTypeBase 类型。该类型包含了以下类型参数：

 * Entity：表示表单项的数据实体类型，默认为 Record<string, any>。
 * ComponentsType：表示表单项对应的组件类型，默认为 'text'。
 * ExtraProps：表示表单项组件的额外属性类型，默认为 Record<string, any>。
 * FieldPropsType：表示表单项组件的属性类型，默认为 Record<string, any>。
 *
 * 该类型定义了一种联合类型，可以是一个函数类型，也可以是一个对象类型。具体来说：
 * 如果是一个函数类型，它接收两个参数 form 和 config，并返回一个对象类型，该对象类型可以是 FieldPropsType 或 Record<string, any>。
 * 其中，form 是 antd 的 ProFormInstance 类型，config 是 ProSchema 和其它额外属性的联合类型，并包含了一些表单项相关的信息。
 * 如果不是一个函数类型，它可以是 FieldPropsType 或 Record<string, any> 中的任意一个。
 * 该类型的作用是定义一个通用的表单项属性类型，使得在不同的表单项组件中，可以共用这个属性类型，提高了代码的重用性。
 */
type FieldPropsTypeBase<
  T = Entity,
  ComponentsType = 'text',
  ExtraProps = Entity,
  FieldPropsType = ProFieldValueTypeWithFieldProps['text'],
> =
  | ((
      form: ProFormInstance<any>,
      config: ProSchema<T, ExtraProps> & {
        type: ComponentsType
        isEditable?: boolean
        rowKey?: string
        rowIndex: number
        entity: T
      },
    ) => FieldPropsType | T)
  | FieldPropsType
  | T

/**
 * 这段代码定义了一个泛型类型 ValueTypeWithFieldPropsBase，它包含了以下属性：
 * - Entity：泛型类型，表示数据实体对象的类型；
 * - ComponentsType：泛型类型，表示组件的类型；
 * - ExtraProps：泛型类型，表示额外的属性；
 * - ValueType：泛型类型，表示字段的值类型，默认为字符串类型。
 *
 * 该类型的主要作用是用于定义 ProTable 组件的列属性 ProColumns 中的字段属性，包括字段的类型（valueType）和自定义属性（fieldProps）。其中：
 * - valueType 属性可以是字符串类型，也可以是 ProFieldValueType 枚举类型，也可以是一个对象类型 ProFieldValueObject，或者是一个返回值为这些类型之一的函数。它表示字段的类型，如文本、数字、日期等；
 * - fieldProps 属性是一个泛型类型 FieldPropsTypeBase，它表示该字段对应的组件的属性，用于定制组件的展示形式、校验规则、事件等等。根据字段类型的不同，其属性值也会有所不同。
 */
type ValueTypeWithFieldPropsBase<
  T = Entity,
  ComponentsType = 'form',
  ExtraProps = Record<string, any>,
  ValueType = 'text',
> = {
  valueType?:
    | ValueType
    | ProFieldValueType
    | ((entity: T, type: ComponentsType) => ValueType | ProFieldValueType)
  fieldProps?: FieldPropsTypeBase<
    T,
    ComponentsType,
    ExtraProps,
    ValueType extends ProFieldValueType
      ? ProFieldValueTypeWithFieldProps[ValueType]
      : ProFieldValueTypeWithFieldProps['text']
  >
}

/**
 * 这段代码定义了一个泛型类型 ValueTypeWithFieldProps，它有四个类型参数。
 * 这个类型的作用是用来描述在一个数据表格中某个字段的值（value）以及可能需要传递给这个字段的其他属性（fieldProps），以便在 UI 上正确地展示这个字段。
 * 具体来说，这个类型有一个属性 valueType，表示字段的值的类型，可以是 'text'、'money'、'percent'、'image'、ProFieldValueType 中的一个，也可以是一个函数。
 *
 * 它的参数是该行数据和组件类型（例如 'table' 或 'form'），返回值为上述值中的一种。
 *
 * 此外，这个类型还有一个属性 fieldProps，表示需要传递给该字段的其他属性，它的类型是一个泛型 FieldPropsTypeBase。这个泛型有四个类型参数，
 * 分别是：
 *  - Entity 表示该字段所在行的数据类型；
 *  - ComponentsType 表示该字段所在的组件类型；
 *  - ExtraProps 表示传递给该字段的其他属性的类型；
 *  - ValueType 表示该字段的值的类型，可以是 'text'、'money'、'percent'、'image'、ProFieldValueType 中的一种。
 * 最终，fieldProps 属性的类型会根据 valueType 的不同，来选择特定的类型进行限制，以确保传递给该字段的其他属性符合它的值的类型。
 */
export type ValueTypeWithFieldProps<
  T,
  ComponentsType,
  ExtraProps,
  ValueType = 'text',
> = ValueTypeWithFieldPropsBase<T, ComponentsType, ExtraProps, ValueType>

export type PageInfo = {
  pageSize: number
  total: number
  current: number
}

/** 支持的变形，还未完全支持完毕 */
export type ProSchemaComponentTypes =
  | 'form'
  | 'list'
  | 'descriptions'
  | 'table'
  | 'cardList'
  | undefined

export type ProCoreActionType<T = {}> = {
  /** @name 刷新 */
  reload: (resetPageIndex?: boolean) => Promise<void>
  /** @name 刷新并清空，只清空页面，不包括表单 */
  reloadAndRest?: () => Promise<void>
  /** @name 重置任何输入项，包括表单 */
  reset?: () => void
  /** @name 清空选择 */
  clearSelected?: () => void
  /** @name 页面的信息都在里面 */
  pageInfo?: PageInfo
} & T

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
  money: Entity
  /** 索引 */
  index: Entity
  /** 索引带边框 */
  indexBorder: Entity
  /** 下拉选择 */
  option: Entity
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
  color: {
    disabled?: boolean
    value?: string
    popoverProps?: PopoverProps
    disableAlpha?: boolean
    disableFields?: boolean
    presetColors?: string[]
    onChange?: (...args: any[]) => void
  }
  /** 分段器 */
  segmented: SegmentedProps
  /** 分组 */
  group: ProFormBaseGroupProps
  /** 表单列表 */
  formList: Entity
  /** 表单集合 */
  formSet: Entity
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

export type ProFormBaseGroupProps = {
  /**
   * @name 分组的标题
   */
  title?: ProVNode
  /**
   * @name 分组的标题
   * @deprecated 尽量用 title
   */
  label?: ProVNode
  /**
   * @name 标题旁边的？号提示展示的信息
   *
   * @example 自定义提示信息
   * <ProForm.Group title="标题"  tooltip="自定义提示信息">
   *  @example 自定义Icon
   * <ProForm.Group title="标题"  tooltip={{icon:<Info/>,title:自定义提示信息}}>
   */
  tooltip?:
    | (TooltipProps & {
        icon?: ProVNode
      })
    | string
  /**
   * @name 额外的内容配置,在标题的另外一边
   *
   * @example 额外的内容配置
   * <ProForm.Group title="标题" extra={<ProFormSwitch name="open"/>} />
   */
  extra?: ProVNode
  /**
   * @name 组件之前的间隔
   */
  size?: SpaceProps['size']
  /**
   * @name 自定义样式
   */
  style?: CSSProperties
  /**
   * @name 自定义 title 样式
   * @example 增加背景颜色
   * <ProForm.Group titleStyle={{ backgroundColor: '#f0f0f0' }} />
   */
  titleStyle?: CSSProperties
  /**
   * @name 自定义title
   * @example 自定义标题
   * <ProForm.Group title={(_,props)=><span>自定义标题</span>}>
   */
  titleRender?: (title: ProVNode, props: ProFormBaseGroupProps) => ProVNode
  /** 子项的对齐方式 */
  align?: SpaceProps['align']
  spaceProps?: SpaceProps
  /**
   * @name 子项的排列方式
   */
  direction?: SpaceProps['direction']
  /**
   * @name 布局方式，键值对模式和两行模式
   * @default inline
   */
  labelLayout?: 'inline' | 'twoLine'
  /**
   * @name 是否折叠
   */
  collapsed?: boolean
  /**
   * @name 是否可折叠
   */
  collapsible?: boolean
  /**
   * @name 默认的折叠状态
   *  */
  defaultCollapsed?: boolean
  /**
   * @name 折叠修改的事件
   *  */
  onCollapse?: (collapsed: boolean) => void
  /**
   * @name 自定选中一个input，只能有一个生效
   */
  autoFocus?: boolean
}

/** 各个组件公共支持的 render */
export type ProSchema<
  T = Entity,
  ExtraProps = unknown,
  ComponentsType extends ProSchemaComponentTypes = 'form',
  ValueType = 'text',
  ExtraFormItemProps = unknown,
> = {
  /** @name 确定这个列的唯一值,一般用于 dataIndex 重复的情况 */
  key?: Key
  /**
   * 支持一个数字，[a,b] 会转化为 obj.a.b
   *
   * @name 与实体映射的key
   */
  dataIndex?: unknown

  /**
   * 支持 ReactNode 和 方法
   *
   * @name 标题
   */
  title?:
    | ((
        schema: ProSchema<T, ExtraProps, ComponentsType, ValueType, ExtraFormItemProps>,
        type: ComponentsType,
        dom: ProVNode,
      ) => ProVNode)
    | ProVNode

  /** @name 展示一个 icon，hover 是展示一些提示信息 */
  tooltip?: TooltipProps | string

  /**
   * 支持 object 和Map，Map 是支持其他基础类型作为 key
   *
   * @name 映射值的类型
   */
  valueEnum?:
    | ((row: T) => ProSchemaValueEnumObj | ProSchemaValueEnumMap)
    | ProSchemaValueEnumObj
    | ProSchemaValueEnumMap

  /**
   * @name 自定义的 formItemProps
   */
  formItemProps?:
    | (FormItemProps & ExtraFormItemProps)
    | ((
        form: ProFormInstance<any>,
        config: ProSchema<T, ExtraProps, ComponentsType, ValueType, ExtraFormItemProps> & {
          type: ComponentsType
          isEditable?: boolean
          rowKey?: string
          rowIndex: number
          entity: T
        },
      ) => FormItemProps & ExtraFormItemProps)

  /**
   * 修改的数据是会被 valueType 消费
   *
   * @name 自定义 render 内容
   */
  renderText?: (text: any, record: T, index: number, action: ProCoreActionType) => any
  /**
   * Render 方法只管理的只读模式，编辑模式需要使用 renderFormItem
   *
   * @name 自定义只读模式的dom
   */
  render?: (
    dom: ProVNode,
    entity: T,
    index: number,
    action: ProCoreActionType | undefined,
    schema: ProSchema<T, ExtraProps, ComponentsType, ValueType, ExtraFormItemProps> & {
      isEditable?: boolean
      type: ComponentsType
    },
  ) =>
    | ProVNode
    | {
        children: ProVNode
        props: any
      }

  /**
   * 返回一个 ReactNode，会自动包裹 value 和 onChange
   *
   * @name 自定义编辑模式
   */
  renderFormItem?: (
    schema: ProSchema<T, ExtraProps, ComponentsType, ValueType, ExtraFormItemProps> & {
      isEditable?: boolean
      index?: number
      type: ComponentsType
      originProps?: any
    },
    config: {
      onSelect?: (value: any) => void
      onChange?: <T = any>(value: T) => void
      value?: any
      type: ComponentsType
      recordKey?: Key | Key[]
      record?: T
      isEditable?: boolean
      defaultRender: (newItem: ProSchema<T, ExtraProps, ComponentsType, ValueType>) => VNode | null
    },
    form: ProFormInstance,
    // action?: Omit<
    //   UseEditableUtilType,
    //   'newLineRecord' | 'editableKeys' | 'actionRender' | 'setEditableRowKeys'
    // >,
  ) => ProVNode

  /**
   *  @name 可编辑表格是否可编辑
   *
   * @example 不允许编辑
   * editable=false
   *
   * @example 如果id=1不允许编辑
   * editable={(value,row,index)=> row.id !==1 }
   */
  // editable?: false | ProTableEditableFnType<Entity>;

  /** @name 从服务器请求枚举 */
  request?: ProFieldRequestData
  /** @name request防抖动时间 默认10 单位ms */
  debounceTime?: number
  /** @name 从服务器请求的参数，改变了会触发 reload */
  params?: ((record: T, column: ProSchema<T, ExtraProps>) => Entity) | Entity
  /** @name 依赖字段的name，暂时只在拥有 request 的项目中生效，会自动注入到 params 中 */
  dependencies?: NamePath[]

  /**
   *  @name 忽略 FormItem，必须要和 renderFormItem 组件一起使用
   */
  ignoreFormItem?: boolean

  /** @name 在 descriptions 隐藏 */
  hideInDescriptions?: boolean
  /** @name 在 Form 中隐藏 */
  hideInForm?: boolean
  /** @name 在 table 中隐藏 */
  hideInTable?: boolean
  /** @name 在 table的查询表单 中隐藏 */
  hideInSearch?: boolean
  /** 设置到 ProField 上面的 Props，内部属性 */
  proFieldProps?: ProFieldProps & Entity
} & ExtraProps &
  ValueTypeWithFieldProps<T, ComponentsType, ExtraProps, ValueType>

export interface ProFieldProps {
  /**
   * 空文本占位符
   */
  emptyText?: ProVNode
  /**
   * 标签名称
   */
  label?: ProVNode
  /**
   * 渲染模式
   */
  mode?: 'read' | 'edit'
  /**
   * 设置 useSwr 的 key
   */
  proFieldKey?: string
  /**
   * 自定义渲染函数
   */
  render?: any
  /**
   * 是否只读
   */
  readonly?: boolean
}

export type SearchTransformKeyFn = (value: any, namePath: string, allValues: any) => any
export type SearchConvertKeyFn = (value: any, field: NamePath) => string | boolean | Entity
