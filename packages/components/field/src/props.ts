/*
 * @Author: shen
 * @Date: 2025-12-08 09:15:45
 * @LastEditors: shen
 * @LastEditTime: 2026-01-08 09:27:35
 * @Description:
 */
import type { PropType } from 'vue'
import type { ProFieldProps } from './type'

export const baseFieldProps = {
  text: {
    type: [Object, String, Number, null, Boolean, Array] as PropType<ProFieldProps['text']>,
    default: undefined,
  },
  value: {
    type: [Object, String, Number, null, Boolean, Array] as PropType<ProFieldProps['value']>,
    default: undefined,
  },
  mode: {
    type: String as PropType<ProFieldProps['mode']>,
    default: 'read',
  },
  readonly: {
    type: Boolean as PropType<ProFieldProps['readonly']>,
    default: undefined,
  },
  plain: {
    type: Boolean as PropType<ProFieldProps['plain']>,
    default: undefined,
  },
  light: {
    type: Boolean as PropType<ProFieldProps['light']>,
    default: undefined,
  },
  proFieldKey: {
    type: [String, Number, BigInt] as PropType<ProFieldProps['proFieldKey']>,
    default: undefined,
  },
  fieldProps: {
    type: Object as PropType<ProFieldProps['fieldProps']>,
    default: undefined,
  },
  placeholder: {
    type: [Array, String] as PropType<ProFieldProps['placeholder']>,
    default: undefined,
  },
  valueEnum: {
    type: Object as PropType<ProFieldProps['valueEnum']>,
    default: undefined,
  },
  render: {
    type: Function as PropType<ProFieldProps['render']>,
    default: undefined,
  },
  renderFormItem: {
    type: Function as PropType<ProFieldProps['renderFormItem']>,
    default: undefined,
  },
  onChange: {
    type: Function as PropType<ProFieldProps['onChange']>,
    default: undefined,
  },
}

export const selectFieldProps = {
  ...baseFieldProps,
  text: {
    type: [Array, String, Number] as PropType<string | number | (string | number)[]>,
    default: undefined,
  },
  valueEnum: {
    type: Object as PropType<ProFieldProps['valueEnum']>,
    default: undefined,
  },
  debounceTime: {
    type: Number,
    default: undefined,
  },
  request: {
    type: Function as PropType<ProFieldProps['request']>,
    default: undefined,
  },
  params: {
    type: Object as PropType<ProFieldProps['params']>,
    default: undefined,
  },
  defaultKeyWords: {
    type: String,
    default: undefined,
  },
  bordered: {
    type: Boolean,
    default: undefined,
  },
  cacheForSwr: {
    type: Boolean,
    default: undefined,
  },
  id: {
    type: String,
    default: undefined,
  },
}

export const proFieldProps = {
  ...baseFieldProps,
  valueType: {
    type: [Object, String] as PropType<ProFieldProps['valueType']>,
    default: 'text',
  },
  emptyText: {
    type: [Object, String, Number, null, Boolean, Array, Function] as PropType<
      ProFieldProps['emptyText']
    >,
    default: '-',
  },
  open: {
    type: Boolean as PropType<ProFieldProps['open']>,
    default: undefined,
  },
  params: {
    type: Object as PropType<ProFieldProps['params']>,
    default: undefined,
  },
  request: {
    type: Function as PropType<ProFieldProps['request']>,
    default: undefined,
  },
  onOpenChange: {
    type: Function as PropType<ProFieldProps['onOpenChange']>,
    default: undefined,
  },
}
