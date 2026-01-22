/*
 * @Author: shen
 * @Date: 2026-01-15 11:15:09
 * @LastEditors: shen
 * @LastEditTime: 2026-01-20 09:46:57
 * @Description:
 */
import type { ProFormFieldItemProps, ProFormItemCreateConfig } from '../type'

import { computed, defineComponent } from 'vue'
import { useInjectField } from '../context/FieldContext'
import { omit, omitUndefined, pick } from '@pro-design-vue/utils'
import { pickProFormItemProps } from '../utils/pickProFormItemProps'
import { usePrefixCls } from '@pro-design-vue/hooks'
import { useInjectGrid } from '../context/GridContext'
import { useInjectForm } from '../context/FormContext'
import { getNamePath } from '../utils/getNamePath'
import { useInjectFormEditOrReadOnly } from '../context/EditOrReadOnlyContext'
import ColWrapper from '../components/Grid/ColWrapper'
import ProFormItem from '../components/FormItem'
export const TYPE = Symbol('ProFormComponent')

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
const ITEM_SLOTS_KEYS = ['extra', 'help', 'label', 'extra', 'addonAfter', 'tooltip', 'addonBefore']

const ignoreWidthValueType = ['switch', 'radioButton', 'radio', 'rate']

function createField<P extends ProFormFieldItemProps = any>(
  Field: any,
  config?: ProFormItemCreateConfig,
) {
  Field.displayName = 'ProFormComponent'
  return defineComponent<P>({
    props: Field.props,
    setup(props: any, { attrs, slots }) {
      const {
        valueType: tmpValueType,
        ignoreWidth,
        defaultProps,
        ...defaultFormItemProps
      } = config ?? {}
      const prefixCls = usePrefixCls('form-field')
      const mergeProps = computed(() => ({ ...defaultProps, ...props }))
      const contextValue = useInjectField()
      const { grid } = useInjectGrid()
      const { store, form, formProps } = useInjectForm()
      const { mode } = useInjectFormEditOrReadOnly()
      const namePath = computed(() => getNamePath(props.name!))
      if (namePath.value?.length) {
        store.initEntityValue(namePath.value, props.initialValue)
      }

      const valueType = computed(() => tmpValueType || props.valueType)
      // 有些 valueType 不需要宽度
      const isIgnoreWidth = computed(
        () => ignoreWidth || ignoreWidthValueType.includes(valueType.value),
      )

      const fieldProps = computed(() => {
        const newFieldProps: any = {
          ...(mergeProps.value.ignoreFormItem
            ? omitUndefined({ value: mergeProps.value.value })
            : {}),
          placeholder: mergeProps.value.placeholder,
          disabled: mergeProps.value.disabled,
          ...contextValue.fieldProps?.value,
          // 支持未传递getFieldProps的情况
          // 某些特殊hack情况下覆盖原来设置的fieldProps参数
          ...mergeProps.value.fieldProps,
        }

        newFieldProps.style = omitUndefined(newFieldProps?.style)
        return newFieldProps
      })

      const restFieldProps = computed(() =>
        omit(mergeProps.value, [
          'label',
          'tooltip',
          'placeholder',
          'width',
          'bordered',
          'messageVariables',
          'ignoreFormItem',
          'transform',
          'convertValue',
          'readonly',
          'allowClear',
          'colSize',
          'value',
          'getFormItemProps',
          'getFieldProps',
          'filedConfig',
          'cacheForSwr',
          'proFieldProps',
        ]),
      )

      const restFormItemProps = computed(() => pickProFormItemProps(restFieldProps.value))

      const formItemProps = computed(() => ({
        ...contextValue.formItemProps?.value,
        ...restFormItemProps.value,
        // 支持未传递getFormItemProps的情况
        // 某些特殊hack情况下覆盖原来设置的formItemProps参数
        ...mergeProps.value.formItemProps,
      }))

      const otherProps = computed(() => ({
        messageVariables: mergeProps.value.messageVariables,
        mode: mergeProps.value?.mode ?? mode?.value ?? 'edit',
        ...defaultFormItemProps,
        ...formItemProps.value,
      }))

      const proFieldKey = computed(() => {
        let name = otherProps.value?.name
        if (Array.isArray(name)) name = name.join('_')
        const key = name && `form-${contextValue.formKey?.value ?? ''}-field-${name}`
        return key
      })

      const className = computed(() => {
        const isSizeEnum = mergeProps.value.width && WIDTH_SIZE_ENUM[mergeProps.value.width as 'xs']
        return {
          [prefixCls]: isSizeEnum,
          [`${prefixCls}-${mergeProps.value.width}`]: isSizeEnum && !isIgnoreWidth.value,
        }
      })

      const style = computed(() => {
        const newStyle = {
          width:
            mergeProps.value.width && !WIDTH_SIZE_ENUM[mergeProps.value.width as 'xs']
              ? mergeProps.value.width
              : grid?.value
                ? '100% !important'
                : undefined,
          ...fieldProps.value?.style,
        }

        if (isIgnoreWidth.value) Reflect.deleteProperty(newStyle, 'width')

        return omitUndefined(newStyle)
      })

      const fieldProFieldProps = computed(() => {
        return omitUndefined({
          ...contextValue.proFieldProps?.value,
          mode: mergeProps.value?.mode ?? mode?.value ?? 'edit',
          readonly: mergeProps.value.readonly,
          params: mergeProps.value.params,
          proFieldKey: proFieldKey.value,
          ...mergeProps.value.proFieldProps,
        })
      })

      const onChange = (value: any, ...args: any[]) => {
        store.updateValue(namePath.value, value)
        props.fieldProps?.onChange?.(value, form, ...args)
        props.onChange?.(value, form, ...args)
      }

      const onPressEnter = (event) => {
        props.fieldProps?.onPressEnter?.(event)
        if (!formProps.isKeyPressSubmit) return
        if (event.key === 'Enter') {
          form.submit()
        }
      }

      const fieldFieldProps = computed(() => {
        return {
          onChange,
          onPressEnter,
          allowClear: mergeProps.value.allowClear,
          ...fieldProps.value,
          style: style.value,
          class: className.value,
        }
      })

      return () => {
        const formItem = (
          <ProFormItem
            style={attrs.style}
            class={attrs.class}
            label={mergeProps.value.label}
            tooltip={mergeProps.value.tooltip}
            key={props.proFormFieldKey || otherProps.value.name?.toString()}
            {...otherProps.value}
            ignoreFormItem={mergeProps.value.ignoreFormItem}
            transform={mergeProps.value.transform}
            valueType={valueType.value}
            convertValue={mergeProps.value.convertValue}
            dataFormat={fieldProps.value?.format}
            v-slots={{
              ...pick(slots, ITEM_SLOTS_KEYS),
            }}
          >
            <Field
              key={props.proFormFieldKey || props.name}
              {...restFieldProps.value}
              fieldProps={fieldFieldProps.value}
              proFieldProps={fieldProFieldProps.value}
              v-slots={{
                ...omit(slots, ITEM_SLOTS_KEYS),
              }}
            />
          </ProFormItem>
        )

        return (
          <ColWrapper grid={mergeProps.value.grid} colProps={mergeProps.value.colProps}>
            {formItem}
          </ColWrapper>
        )
      }
    },
  })
}

export { createField }
