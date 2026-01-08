/*
 * @Author: shen
 * @Date: 2026-01-04 09:12:53
 * @LastEditors: shen
 * @LastEditTime: 2026-01-08 09:08:48
 * @Description:
 */

import type {
  ButtonProps,
  ColProps,
  FormInstance,
  FormItemProps,
  FormProps,
  RowProps,
} from 'ant-design-vue'
import type { ProRequestData } from './hooks/useFetchData'
import type {
  Entity,
  ProFieldProps,
  ProFormBaseGroupProps,
  ProFormInstance,
  ProVNode,
  SearchConvertKeyFn,
} from '@pro-design-vue/utils'
import type { CSSProperties, VNode } from 'vue'
import type { Dayjs } from 'dayjs'
import type { ProFormItemProps } from './components/FormItem'

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
  colProps?: ColProps
  /**
   * only works when grid is enabled
   * @default
   * { gutter: 8 }
   */
  rowProps?: RowProps
}

// 给控件扩展的通用的属性
export type ExtendsProps = {
  allowClear?: boolean
  bordered?: boolean
  colSize?: number
  /**
   * 需要与 request 配合使用
   *
   * @name 网络请求用的输出，会触发reload
   */
  params?: ((form: ProFormInstance) => Record<string, any>) | Record<string, any>

  /** @name 需要放在formItem 时使用 */
  ignoreFormItem?: boolean

  /**
   * 实验性质，可能 api 会有改动，谨慎使用
   *
   * @name 只读模式
   */
  readonly?: boolean

  /**
   * @name 获取时转化值，一般用于将数据格式化为组件接收的格式
   */
  convertValue?: SearchConvertKeyFn

  /**
   * 给 protable 开的口子
   *
   * @name 自定义的 formItemProps
   */
  formItemProps?: FormItemProps
}

export type ProFormGroupProps = ProFormBaseGroupProps & ProFormGridConfig

/** @name 用于配置操作栏 */
export type SearchConfig = {
  /** @name 重置按钮的文本 */
  resetText?: ProVNode
  /** @name 提交按钮的文本 */
  submitText?: ProVNode
}

export type SubmitterProps<T = Entity> = {
  /** @name 提交方法 */
  onSubmit?: (value?: T) => void
  /** @name 重置方法 */
  onReset?: (value?: T) => void
  /** @name 搜索的配置，一般用来配置文本 */
  searchConfig?: SearchConfig
  /** @name 提交按钮的 props */
  submitButtonProps?: false | (ButtonProps & { preventDefault?: boolean })
  /** @name 重置按钮的 props */
  resetButtonProps?: false | (ButtonProps & { preventDefault?: boolean })
  /** @name 自定义操作的渲染 */
  render?:
    | ((
        props: SubmitterProps &
          T & {
            submit: () => void
            reset: () => void
          },
        dom: VNode[],
      ) => ProVNode[] | ProVNode | false)
    | false
}

export type CommonFormProps<T = Entity, U = Entity> = {
  /**
   * @name 自定义提交的配置
   *
   * @example 不展示提交按钮和重置按钮
   * submitter={false}
   * @example 修改重置按钮的样式，并且隐藏提交按钮
   * submitter={{resetButtonProps: { type: 'dashed'},submitButtonProps: { style: { display: 'none', }}}}
   *
   * @example 修改提交按钮和重置按钮的顺序
   * submitter={{ render:(props,dom)=> [...dom]}}
   *
   * @example 修改提交和重置按钮文字
   * submitter={{ searchConfig: { submitText: '提交2',resetText: '重置2'}}}
   */
  submitter?:
    | SubmitterProps<{
        form?: FormInstance
      }>
    | false

  /**
   * @name 表单默认值，只有初始化以及重置时生效
   */
  initialValues?: Entity
  /**
   * @name 表单结束后调用
   * @description 支持异步操作，更加方便
   *
   * @example onFinish={async (values) => { await save(values); return true }}
   */
  onFinish?: (formData: T) => Promise<boolean | void> | void
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
   * @name 同步结果到 url 中
   * */
  syncToUrl?: boolean | ((values: T, type: 'get' | 'set') => T)

  /**
   * @name 当 syncToUrl 为 true，在页面回显示时，以url上的参数为主，默认为false
   */
  syncToUrlAsImportant?: boolean

  /**
   * @name 额外的 url 参数 中
   * */
  extraUrlParams?: Entity

  /**
   * 同步结果到 initialValues,默认为true如果为false，reset的时将会忽略从url上获取的数据
   *
   * @name 是否将 url 参数写入 initialValues
   */
  syncToInitialValues?: boolean

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
    | (string & {})
    | 'string'
    | 'number'
    | ((value: Dayjs, valueType: string) => string | number)
    | false

  /**
   * @name 表单初始化成功，比如布局，label等计算完成
   * @example  (values)=>{ console.log(values) }
   */
  onInit?: (values: T, form: ProFormInstance<any>) => void
  /**
   * @name 表单引用
   * @example  (form)=>{ formRef.value = form }
   */
  formRef?: (form: ProFormInstance<any>) => void
  /**
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
} & ProFormGridConfig

export type FieldProps = {
  style?: CSSProperties
  width?: string
}

export type BaseFormProps<T = Entity, U = Entity> = {
  fieldProps?: FieldProps
  proFieldProps?: ProFieldProps
  formItemProps?: FormItemProps
  groupProps?: ProFormGroupProps
  /** 是否回车提交 */
  isKeyPressSubmit?: boolean
  /** Form 组件的类型，内部使用 */
  formComponentType?: 'DrawerForm' | 'ModalForm' | 'QueryFilter'
} & Omit<FormProps, 'onFinish'> &
  CommonFormProps<T, U>

export type ProFormProps<T = Entity, U = Entity> = Omit<FormProps, 'onFinish'> &
  Omit<BaseFormProps<T, U>, 'formComponentType'>

export type ProFormFieldItemProps<T = Record<string, any>, K = any> = {
  /**
   * @name 设置到控件上的属性
   *
   * @example 设置select 多选
   * <ProFormSelect fieldProps={{mode:"multiple"}} />
   * @example 设置select 多选
   * <ProFormText fieldProps={{placeholder:"请输入！"}} />
   */
  fieldProps?: Partial<FieldProps & T>
  /**
   * @name 输入的描述，没有值的时候展示
   */
  placeholder?: string | string[]
  /**
   * @name 只读模式渲染文本,没有值的时候展示
   */
  emptyText?: ProVNode
  /**
   * @name disabled=true 时控件不可用
   */
  disabled?: boolean
  /**
   * @type auto 使用组件默认的宽度
   * @type xs=104px 适用于短数字、短文本或选项。
   * @type sm=216px 适用于较短字段录入、如姓名、电话、ID 等。
   * @type md=328px 标准宽度，适用于大部分字段长度。
   * @type lg=440px 适用于较长字段录入，如长网址、标签组、文件路径等。
   * @type xl=552px 适用于长文本录入，如长链接、描述、备注等，通常搭配自适应多行输入框或定高文本域使用。
   */
  width?: number | 'sm' | 'md' | 'xl' | 'xs' | 'lg'
  /**
   * @name 设置到 ProField 上面的 Props，内部属性
   */
  proFieldProps?: ProFieldProps
} & Omit<ProFormItemProps, 'valueType'> &
  Pick<ProFormGridConfig, 'colProps' | 'rowProps'> &
  ExtendsProps
