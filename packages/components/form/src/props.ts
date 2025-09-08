/*
 * @Author: shen
 * @Date: 2023-07-30 08:16:14
 * @LastEditors: shen
 * @LastEditTime: 2025-09-08 09:37:42
 * @Description:
 */
import type { CSSProperties, ExtractPropTypes, PropType } from 'vue'
import type {
  ProFormPropsType,
  ProFormItemType,
  Entity,
  SpanConfig,
  ProFormActionType,
} from './type'

import type { StepsProps, StepProps, FormProps } from 'ant-design-vue'

export const antFormProps = () => ({
  layout: {
    type: String as PropType<FormProps['layout']>,
    default: 'horizontal',
  },
  labelCol: {
    type: Object as PropType<FormProps['labelCol']>,
  },
  wrapperCol: {
    type: Object as PropType<FormProps['wrapperCol']>,
  },
  colon: {
    type: Boolean as PropType<FormProps['colon']>,
    default: true,
  },
  labelAlign: {
    type: String as PropType<FormProps['labelAlign']>,
    default: 'right',
  },
  labelWrap: Boolean as PropType<FormProps['labelWrap']>,
  disabled: {
    type: Boolean as PropType<FormProps['disabled']>,
    default: false,
  },
  prefixCls: String as PropType<FormProps['prefixCls']>,
  requiredMark: [String, Boolean] as PropType<FormProps['requiredMark']>,
  validateMessages: Object as PropType<FormProps['validateMessages']>,
  validateTrigger: {
    type: [String, Array] as PropType<FormProps['validateTrigger']>,
    default: 'change',
  },
  validateOnRuleChange: {
    type: Boolean as PropType<FormProps['validateOnRuleChange']>,
    default: true,
  },
  scrollToFirstError: {
    type: [Boolean, Object] as PropType<FormProps['scrollToFirstError']>,
    default: false,
  },
  name: String,
})

export const commonFieldProps = () => ({
  value: {
    type: [String, Array, Number, Object, Boolean] as PropType<any>,
  },
  readonly: {
    type: Boolean,
    default: undefined,
  },
  readonlyProps: {
    type: Object as PropType<ProFormItemType['readonlyProps']>,
    default: undefined,
  },
  valueEnum: {
    type: [Function, Object] as PropType<ProFormItemType['valueEnum']>,
    default: undefined,
  },
  options: {
    type: [Array, Function] as PropType<ProFormItemType['options']>,
    default: undefined,
  },
  request: {
    type: Function as PropType<ProFormItemType['request']>,
    default: undefined,
  },
  params: {
    type: [Function, Object] as PropType<ProFormItemType['params']>,
    default: undefined,
  },
  dependencies: {
    type: Array as PropType<ProFormItemType['dependencies']>,
    default: undefined,
  },
  onChange: {
    type: Function as PropType<ProFormItemType['onChange']>,
  },
})

export const baseFormProps = () => ({
  ...antFormProps(),
  // name: String,
  loading: {
    type: Boolean,
    default: undefined,
  },
  showLoading: {
    type: Boolean,
    default: true,
  },
  submitOnLoading: {
    type: Boolean,
    default: true,
  },
  gridSubmitter: {
    type: Boolean,
    default: false,
  },
  omitNil: { type: Boolean, default: true },
  readonly: Boolean,
  grid: Boolean,
  isKeyPressSubmit: Boolean,
  formKey: String,
  theme: {
    type: String as PropType<ProFormPropsType['theme']>,
    default: 'custom',
  },
  customUi: {
    type: Boolean,
    default: true,
  },
  initialValues: {
    type: Object as PropType<ProFormPropsType['initialValues']>,
  },
  readonlyProps: {
    type: Object as PropType<ProFormPropsType['readonlyProps']>,
  },
  colProps: {
    type: Object as PropType<ProFormPropsType['colProps']>,
  },
  rowProps: {
    type: Object as PropType<ProFormPropsType['rowProps']>,
  },
  dateFormatter: {
    type: [String, Function, Boolean] as PropType<ProFormPropsType['dateFormatter']>,
    default: 'string',
  },
  params: {
    type: Object as PropType<ProFormPropsType['params']>,
  },
  items: {
    type: Array as PropType<ProFormItemType<Entity, any>[]>,
  },
  request: {
    type: Function as PropType<ProFormPropsType['request']>,
  },
  requestAbort: {
    type: Boolean,
  },
  submitter: {
    type: [Object, Boolean] as PropType<ProFormPropsType['submitter']>,
    default: undefined,
  },
  onReset: {
    type: Function as PropType<ProFormPropsType['onReset']>,
  },
  onFinish: {
    type: Function as PropType<ProFormPropsType['onFinish']>,
  },
  onFinishFailed: {
    type: Function as PropType<ProFormPropsType['onFinishFailed']>,
  },
  onLoadingChange: {
    type: Function as PropType<ProFormPropsType['onLoadingChange']>,
  },
  onValuesChange: {
    type: Function as PropType<ProFormPropsType['onValuesChange']>,
  },
  onInit: {
    type: Function as PropType<(values: any, formAction: ProFormActionType) => void>,
    default: undefined,
  },
})

export const drawerOrModalFormProps = () => ({
  ...baseFormProps(),
  submitTimeout: {
    type: Number,
    default: undefined,
  },
  title: {
    type: String,
    default: undefined,
  },
  width: {
    type: [String, Number] as PropType<string | number>,
    default: 800,
  },
  open: {
    type: Boolean,
    default: undefined,
  },
  closeOnFinish: {
    type: Boolean,
    default: true,
  },
  confirmOnValuesChange: {
    type: Boolean,
    default: true,
  },
  onOpenChange: {
    type: Function as PropType<(open: boolean) => void>,
    default: undefined,
  },
})

export const queryFilterProps = () => ({
  ...baseFormProps(),
  preserve: {
    type: Boolean,
    default: true,
  },
  defaultCollapsed: {
    type: Boolean,
    default: true,
  },
  collapsed: {
    type: Boolean as PropType<boolean | undefined>,
    default: undefined,
  },
  defaultColsNumber: Number,
  defaultFormItemsNumber: Number,
  labelWidth: {
    type: [String, Number] as PropType<number | 'auto'>,
    default: '80',
  },
  searchText: String,
  resetText: String,
  searchGutter: {
    type: Number,
    default: 24,
  },
  span: {
    type: [Number, Object] as PropType<SpanConfig>,
  },
  // span: definePropType<SpanConfig>([Number, String]),
  showHiddenNum: Boolean,
  ignoreRules: Boolean,
  resetOnSubmit: Boolean,
  onCollapse: {
    type: Function as PropType<(val: boolean) => void>,
    default: undefined,
  },
  onResize: {
    type: Function as PropType<(width: number, height: number) => void>,
    default: undefined,
  },
})
export const stepsFormProps = () => ({
  ...baseFormProps(),
  current: {
    type: Number,
    default: undefined,
  },
  steps: {
    type: Array as PropType<(StepProps & { formProps?: BaseFormProps })[]>,
    default: () => [],
  },
  items: {
    type: Array as PropType<ProFormItemType<Entity, any>[][]>,
    default: () => [],
  },
  stepsProps: {
    type: Object as PropType<StepsProps>,
  },
  containerStyle: {
    type: Object as PropType<CSSProperties>,
  },
  onCurrentChange: {
    type: Function as PropType<(current: number) => void>,
    default: undefined,
  },
})

export const formProps = () => ({
  ...baseFormProps(),
  ...drawerOrModalFormProps(),
  ...queryFilterProps(),
  ...stepsFormProps(),
  items: {
    type: Array as PropType<Array<ProFormItemType<Entity, any>[]> | ProFormItemType<Entity, any>[]>,
    default: () => [],
  },
})

export type BaseFormProps = Partial<ExtractPropTypes<ReturnType<typeof baseFormProps>>>

export type ProFormProps = Partial<ExtractPropTypes<ReturnType<typeof formProps>>>
export type ProQueryFilterProps = Partial<ExtractPropTypes<ReturnType<typeof queryFilterProps>>>
export type ProStepsFormProps = Partial<ExtractPropTypes<ReturnType<typeof stepsFormProps>>>
export type ProDrawerOrModalFormProps = Partial<
  ExtractPropTypes<ReturnType<typeof drawerOrModalFormProps>>
>
