/*
 * @Author: shen
 * @Date: 2023-08-09 10:36:49
 * @LastEditors: shen
 * @LastEditTime: 2026-01-12 17:01:44
 * @Description:
 */
import type { PropType } from 'vue'
import type { ProFormFieldItemProps } from '../../type'

import { computed, defineComponent } from 'vue'
import { get, omit, omitUndefined, pick, runFunction, type ProSchema } from '@pro-design-vue/utils'
import { useInjectField } from '../../context/FieldContext'
import { getNamePath } from '../../utils/getNamePath'
import { formItemProps } from 'ant-design-vue/es/form'
import { useInjectFormEditOrReadOnly } from '../../context/EditOrReadOnlyContext'
import ProField from '@pro-design-vue/components/field'
import ProFormItem from '../FormItem'
import { usePrefixCls } from '@pro-design-vue/hooks'
import { pickProFormItemProps } from '../../utils/pickProFormItemProps'
import ColWrapper from '../Grid/ColWrapper'
import { useInjectForm } from '../../context/FormContext'
const ITEM_SLOTS_KEYS = ['extra', 'help', 'label', 'extra', 'addonAfter', 'tooltip', 'addonBefore']
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

const WIDTH_SIZE_ENUM = {
  // 适用于短数字，短文本或者选项
  xs: 104,
  s: 216,
  // 适用于较短字段录入、如姓名、电话、ID 等。
  sm: 216,
  m: 328,
  // 标准宽度，适用于大部分字段长度。
  md: 328,
  l: 440,
  // 适用于较长字段录入，如长网址、标签组、文件路径等。
  lg: 440,
  // 适用于长文本录入，如长链接、描述、备注等，通常搭配自适应多行输入框或定高文本域使用。
  xl: 552,
}

const ignoreWidthValueType = ['switch', 'radioButton', 'radio', 'rate']

export default defineComponent({
  name: 'ProFormField',
  inheritAttrs: false,
  props: proFormFieldProps,
  setup(props, { slots, attrs }) {
    const { store, form } = useInjectForm()
    const { grid, proFieldProps, formKey, fieldProps, formItemProps } = useInjectField()
    const { mode } = useInjectFormEditOrReadOnly()
    const prefixCls = usePrefixCls('form-field')
    const namePath = computed(() => getNamePath(props.name!))
    if (namePath.value?.length) {
      store.initEntityValue(namePath.value, props.initialValue)
    }

    const fieldValue = computed(() => get(store.formValues.value, namePath.value))

    const proFieldKey = computed(() => {
      let name = props.name
      if (Array.isArray(name)) name = name.join('_')
      const key = name && `form-${formKey?.value ?? ''}-field-${name}`
      return key
    })

    const isIgnoreWidth = computed(
      () => props.ignoreWidth || ignoreWidthValueType.includes(props.valueType),
    )

    const className = computed(() => {
      const isSizeEnum = props.width && WIDTH_SIZE_ENUM[props.width as 'xs']
      return {
        [prefixCls]: isSizeEnum,
        [`${prefixCls}-${props.width}`]: isSizeEnum && !isIgnoreWidth.value,
      }
    })

    const style = computed(() => {
      const newStyle = {
        width:
          props.width && !WIDTH_SIZE_ENUM[props.width as 'xs']
            ? props.width
            : grid?.value
              ? '100%'
              : undefined,
        ...props.fieldProps?.style,
      }

      if (isIgnoreWidth.value) Reflect.deleteProperty(newStyle, 'width')

      return omitUndefined(newStyle)
    })

    const otherFormItemProps = computed(() => {
      const restFormItemProps = pickProFormItemProps(props)
      return {
        ...formItemProps,
        ...restFormItemProps,
      }
    })

    const fieldProFieldProps = computed(() => {
      return omitUndefined({
        ...proFieldProps?.value,
        mode: props.mode,
        readonly: props.readonly,
        params: props.params,
        proFieldKey: proFieldKey.value,
        ...props.proFieldProps,
        onChange: (value: any, ...args: any[]) => {
          store.updateValue(namePath.value, value)
          props.fieldProps?.onChange?.(value, form, ...args)
          props.onChange?.(value, form, ...args)
        },
      })
    })

    const fieldFieldProps = computed(() => {
      return {
        allowClear: props.allowClear,
        ...fieldProps?.value,
        ...props.fieldProps,
        style: style.value,
        autoFocus: props.autoFocus,
        placeholder: props.placeholder,
        disabled: props.disabled,
        class: className.value,
      }
    })

    return () => {
      const formItem = (
        <ProFormItem
          {...attrs}
          tooltip={props.tooltip}
          key={props.proFormFieldKey || props.name?.toString()}
          {...otherFormItemProps.value}
          ignoreFormItem={props.ignoreFormItem}
          transform={props.transform}
          valueType={props.valueType}
          convertValue={props.convertValue}
          dataFormat={fieldFieldProps.value?.format}
          v-slots={{
            ...pick(slots, ITEM_SLOTS_KEYS),
          }}
        >
          <ProField
            text={props.fieldProps?.value}
            render={props.render as any}
            renderFormItem={props.renderFormItem as any}
            valueType={(props.valueType as 'text') || 'text'}
            valueEnum={runFunction(props.valueEnum)}
            fieldProps={fieldFieldProps.value}
            {...omit(fieldProFieldProps.value ?? {}, ['mode'])}
            mode={props.proFieldProps?.mode || props.mode || mode?.value || 'edit'}
            value={fieldValue.value}
            v-slots={{
              ...omit(slots, ITEM_SLOTS_KEYS),
            }}
          />
        </ProFormItem>
      )
      return (
        <ColWrapper grid={props.grid} colProps={props.colProps}>
          {formItem}
        </ColWrapper>
      )
    }
  },
})
