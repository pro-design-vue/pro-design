/*
 * @Author: shen
 * @Date: 2026-01-04 09:12:57
 * @LastEditors: shen
 * @LastEditTime: 2026-01-07 16:35:59
 * @Description:
 */
import type { FormProps } from 'ant-design-vue'
import type { PropType } from 'vue'
import type { BaseFormProps } from './type'
import { omit } from '@pro-design-vue/utils'

const antFormProps = {
  layout: {
    type: String as PropType<FormProps['layout']>,
    default: undefined,
  },
  labelCol: {
    type: Object as PropType<FormProps['labelCol']>,
    default: undefined,
  },
  wrapperCol: {
    type: Object as PropType<FormProps['wrapperCol']>,
    default: undefined,
  },
  colon: {
    type: Boolean as PropType<FormProps['colon']>,
    default: undefined,
  },
  requiredMark: {
    type: [Boolean, String] as PropType<FormProps['requiredMark']>,
    default: undefined,
  },
  labelAlign: {
    type: String as PropType<FormProps['labelAlign']>,
    default: undefined,
  },
  labelWrap: Boolean as PropType<FormProps['labelWrap']>,
  disabled: {
    type: Boolean as PropType<FormProps['disabled']>,
    default: false,
  },
  prefixCls: String as PropType<FormProps['prefixCls']>,
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
}

export const baseFormProps = {
  ...antFormProps,
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
  omitNil: { type: Boolean, default: true },
  readonly: Boolean,
  grid: Boolean,
  isKeyPressSubmit: {
    type: Boolean,
    default: undefined,
  },
  formKey: String,
  autoFocusFirstInput: {
    type: Boolean,
    default: undefined,
  },
  customUi: {
    type: Boolean,
    default: true,
  },
  initialValues: {
    type: Object as PropType<BaseFormProps['initialValues']>,
  },
  formItemProps: {
    type: Object as PropType<BaseFormProps['formItemProps']>,
  },
  fieldProps: {
    type: Object as PropType<BaseFormProps['fieldProps']>,
  },
  proFieldProps: {
    type: Object as PropType<BaseFormProps['proFieldProps']>,
  },
  groupProps: {
    type: Object as PropType<BaseFormProps['groupProps']>,
  },
  formComponentType: {
    type: Object as PropType<BaseFormProps['formComponentType']>,
  },
  colProps: {
    type: Object as PropType<BaseFormProps['colProps']>,
  },
  rowProps: {
    type: Object as PropType<BaseFormProps['rowProps']>,
  },
  dateFormatter: {
    type: [String, Function, Boolean] as PropType<BaseFormProps['dateFormatter']>,
    default: 'string',
  },
  formRef: {
    type: Function as PropType<BaseFormProps['formRef']>,
  },
  params: {
    type: Object as PropType<BaseFormProps['params']>,
  },
  request: {
    type: Function as PropType<BaseFormProps['request']>,
  },
  requestAbort: {
    type: Boolean,
  },
  submitter: {
    type: [Object, Boolean] as PropType<BaseFormProps['submitter']>,
    default: undefined,
  },
  onFinish: {
    type: Function as PropType<BaseFormProps['onFinish']>,
  },
  onFinishFailed: {
    type: Function as PropType<BaseFormProps['onFinishFailed']>,
  },
  onLoadingChange: {
    type: Function as PropType<BaseFormProps['onLoadingChange']>,
  },
  onValuesChange: {
    type: Function as PropType<BaseFormProps['onValuesChange']>,
  },
  onInit: {
    type: Function as PropType<BaseFormProps['onInit']>,
    default: undefined,
  },
}

export const proFormProps = omit(baseFormProps, ['formComponentType'])
