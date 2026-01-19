/*
 * @Author: shen
 * @Date: 2023-08-09 10:36:49
 * @LastEditors: shen
 * @LastEditTime: 2026-01-19 13:25:29
 * @Description:
 */
import type { PropType } from 'vue'
import type { ProFormFieldItemProps } from '../../type'

import { computed, defineComponent, ref, shallowRef, watch } from 'vue'
import { isDeepEqual, isEqual, omit, runFunction, type ProSchema } from '@pro-design-vue/utils'
import { formItemProps } from 'ant-design-vue/es/form'
import { createField } from '../../BaseForm/createField'
import ProField from '@pro-design-vue/components/field'

export type ProFormFieldProps<T = any, FiledProps = Record<string, any>> = ProSchema<
  T,
  ProFormFieldItemProps<FiledProps> & {
    mode?: 'edit' | 'read' | 'update'
    // 用来判断是不是被嵌套渲染的 dom
    isDefaultDom?: boolean
    plain?: boolean
    text?: any
    initialValue?: any
    getFieldProps?: () => Record<string, any>
    getFormItemProps?: () => Record<string, any>
    /**
     * dependencies value
     */
    dependenciesValues?: Record<string, any>
    originDependencies?: Record<string, any>
  },
  any,
  any
> & {
  onChange?: (...args: any) => any
  autoFocus?: boolean
  ignoreWidth?: boolean
}

export const proFormFieldProps = {
  ...formItemProps(),
  name: {
    type: [String, Number, Array] as PropType<ProFormFieldProps['name']>,
    default: undefined,
  },
  mode: {
    type: String as PropType<ProFormFieldProps['mode']>,
    default: undefined,
  },
  text: {
    type: [Object, String, Number, null, Boolean, Array] as PropType<ProFormFieldProps['text']>,
    default: undefined,
  },
  value: {
    type: [Object, String, Number, null, Boolean, Array] as PropType<ProFormFieldProps['text']>,
    default: undefined,
  },
  emptyText: {
    type: [Object, String, Number, null, Boolean, Array, Function] as PropType<
      ProFormFieldProps['emptyText']
    >,
    default: undefined,
  },
  addonBefore: {
    type: [Object, String, Number, null] as PropType<ProFormFieldProps['addonBefore']>,
    default: undefined,
  },
  addonAfter: {
    type: [Object, String, Number, null] as PropType<ProFormFieldProps['addonAfter']>,
    default: undefined,
  },
  tooltip: {
    type: [Object, String] as PropType<ProFormFieldProps['tooltip']>,
    default: undefined,
  },
  disabled: {
    type: Boolean as PropType<ProFormFieldProps['disabled']>,
    default: undefined,
  },
  autoFocus: {
    type: Boolean as PropType<ProFormFieldProps['disabled']>,
    default: undefined,
  },
  ignoreWidth: {
    type: Boolean as PropType<ProFormFieldProps['ignoreWidth']>,
    default: undefined,
  },
  ignoreFormItem: {
    type: Boolean as PropType<ProFormFieldProps['ignoreFormItem']>,
    default: undefined,
  },
  allowClear: {
    type: Boolean as PropType<ProFormFieldProps['allowClear']>,
    default: undefined,
  },
  width: {
    type: [Number, String] as PropType<ProFormFieldProps['width']>,
    default: undefined,
  },
  valueType: {
    type: [Object, String] as PropType<ProFormFieldProps['valueType']>,
    default: 'text',
  },
  fieldProps: {
    type: Object as PropType<ProFormFieldProps['fieldProps']>,
    default: undefined,
  },
  proFieldProps: {
    type: Object as PropType<ProFormFieldProps['proFieldProps']>,
    default: undefined,
  },
  colProps: {
    type: Object as PropType<ProFormFieldProps['colProps']>,
    default: undefined,
  },
  rowProps: {
    type: Object as PropType<ProFormFieldProps['rowProps']>,
    default: undefined,
  },
  placeholder: {
    type: [String, Array] as PropType<ProFormFieldProps['placeholder']>,
    default: undefined,
  },
  initialValue: {
    type: [Object, String, Number, null, Boolean, Array] as PropType<
      ProFormFieldProps['initialValue']
    >,
    default: undefined,
  },
  valueEnum: {
    type: [Object, Function] as PropType<ProFormFieldProps['valueEnum']>,
    default: undefined,
  },
  debounceTime: {
    type: Number,
    default: undefined,
  },
  request: {
    type: Function as PropType<ProFormFieldProps['request']>,
    default: undefined,
  },
  params: {
    type: Object as PropType<ProFormFieldProps['params']>,
    default: undefined,
  },
  grid: {
    type: Object as PropType<ProFormFieldProps['grid']>,
    default: undefined,
  },
  bordered: {
    type: Boolean,
    default: undefined,
  },
  readonly: {
    type: Boolean,
    default: undefined,
  },
  transform: {
    type: Function as PropType<ProFormFieldProps['transform']>,
    default: undefined,
  },
  convertValue: {
    type: Function as PropType<ProFormFieldProps['convertValue']>,
    default: undefined,
  },
  dataFormat: {
    type: String,
    default: undefined,
  },
  proFormFieldKey: {
    type: [String, Number, BigInt] as PropType<ProFormFieldProps['proFormFieldKey']>,
    default: undefined,
  },
  render: {
    type: Function as PropType<ProFormFieldProps['render']>,
    default: undefined,
  },
  renderFormItem: {
    type: Function as PropType<ProFormFieldProps['renderFormItem']>,
    default: undefined,
  },
  onChange: {
    type: Function as PropType<ProFormFieldProps['onChange']>,
    default: undefined,
  },
}

const preProps = {}
const BaseProFormField = defineComponent({
  name: 'ProFormField',
  inheritAttrs: false,
  props: proFormFieldProps,
  setup(props, { slots }) {
    const fieldProps = shallowRef({
      autoFocus: props.autoFocus,
      ...props.fieldProps,
    })
    watch(
      () => props.fieldProps,
      (newValue, oldValue) => {
        if (!isDeepEqual(newValue, oldValue, ['onChange', 'onBlur'])) {
          fieldProps.value = {
            autoFocus: props.autoFocus,
            ...newValue,
          }
        }
      },
    )

    return () => (
      <ProField
        text={props.fieldProps?.value}
        render={props.render as any}
        renderFormItem={props.renderFormItem as any}
        valueType={(props.valueType as 'text') || 'text'}
        valueEnum={runFunction(props.valueEnum)}
        fieldProps={fieldProps.value}
        {...omit(props ?? {}, [
          'text',
          'mode',
          'readonly',
          'fieldProps',
          'labelCol',
          'label',
          'autoFocus',
          'render',
          'proFieldProps',
          'renderFormItem',
          'valueType',
          'initialValue',
          'onChange',
          'valueEnum',
          'params',
          'name',
        ])}
        {...props.proFieldProps}
        v-slots={slots}
      />
    )
  },
})

const ProFormField = createField<ProFormFieldProps>(BaseProFormField)

export default ProFormField
