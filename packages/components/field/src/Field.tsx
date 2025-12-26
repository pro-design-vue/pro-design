/*
 * @Author: shen
 * @Date: 2025-12-05 15:58:31
 * @LastEditors: shen
 * @LastEditTime: 2025-12-26 16:26:14
 * @Description:
 */
import type { ProFieldRenderProps } from './type'

import { computed, defineComponent, ref, toRefs, type VNode } from 'vue'
import { proFieldProps } from './props'
import {
  omit,
  cloneElement,
  isValidElement,
  omitKeysAndUndefined,
  omitUndefined,
  pickProProps,
} from '@pro-design-vue/utils'
import { usePrefixCls } from '@pro-design-vue/hooks'
import { Avatar } from 'ant-design-vue'
import FieldText from './components/Text'
import FieldDigit from './components/Digit'
import FieldSelect from './components/Select'
import FieldMoney from './components/Money'
import FieldImage from './components/Image'
import FieldColorPicker from './components/ColorPicker'

export default defineComponent({
  name: 'ProField',
  inheritAttrs: false,
  props: proFieldProps,
  setup(props, { slots, attrs, emit }) {
    const fieldRef = ref(null)
    const prefixCls = usePrefixCls('field')
    const { mode, text, emptyText, fieldProps: restFieldProps, valueType, readonly } = toRefs(props)
    const onChangeCallBack = (...restParams: any[]) => {
      restFieldProps.value?.onChange?.(...restParams)
      props?.onChange?.(...restParams)
      emit('update:value', ...restParams)
    }

    const fieldProps = computed(() => {
      return (
        (props.value !== undefined || restFieldProps.value) && {
          value: props.value,
          ...omitUndefined(restFieldProps.value),
          onChange: onChangeCallBack,
        }
      )
    })

    const proFieldProps = computed(() => {
      const rest = omitKeysAndUndefined(props, [
        'mode',
        'text',
        'valueType',
        'placeholder',
        'onChange',
        'renderFormItem',
        'value',
        'readonly',
        'fieldProps',
      ])
      const renderFormItem = props.renderFormItem
      return omitUndefined({
        ...rest,
        ref: fieldRef,
        mode: readonly.value ? 'read' : mode.value,
        renderFormItem: renderFormItem
          ? (curText: any, props: ProFieldRenderProps, dom: VNode) => {
              const { placeholder: _placeholder, ...restProps } = props
              const newDom = renderFormItem({ text: curText, props: restProps, dom }) as any
              if (isValidElement(newDom))
                return cloneElement(newDom, {
                  ...fieldProps.value,
                  ...((newDom.props as any) || {}),
                })
              return newDom
            }
          : undefined,

        placeholder: renderFormItem
          ? undefined
          : (props.placeholder ?? fieldProps.value?.placeholder),
        fieldProps: pickProProps(
          omitUndefined({
            ...fieldProps.value,
            placeholder: renderFormItem
              ? undefined
              : (props.placeholder ?? fieldProps.value?.placeholder),
          }),
        ),
      })
    })

    return () => {
      const dataValue =
        mode.value === 'edit'
          ? (fieldProps.value?.value ?? text.value)
          : (text.value ?? fieldProps.value?.value)
      if (
        emptyText.value !== false &&
        mode.value === 'read' &&
        valueType.value !== 'option' &&
        valueType.value !== 'switch'
      ) {
        if (typeof dataValue !== 'boolean' && typeof dataValue !== 'number' && !dataValue) {
          if (props.render) {
            return props.render({
              text: dataValue,
              props: { ...proFieldProps.value } as ProFieldRenderProps,
              dom: <>{emptyText.value}</>,
            })
          }
          return <>{emptyText.value}</>
        }
      }

      if (valueType.value === 'avatar' && typeof dataValue === 'string' && props.mode === 'read') {
        return <Avatar src={dataValue as string} size={22} shape="circle" />
      }

      if (valueType.value === 'image') {
        return (
          <FieldImage
            v-slots={slots}
            class={prefixCls}
            text={dataValue as string}
            {...attrs}
            {...(omit(proFieldProps.value, ['text']) as any)}
          />
        )
      }

      if (valueType.value === 'color') {
        return (
          <FieldColorPicker
            v-slots={slots}
            class={prefixCls}
            text={dataValue as string}
            {...attrs}
            {...(omit(proFieldProps.value, ['text']) as any)}
          />
        )
      }

      if (valueType.value === 'money') {
        return (
          <FieldMoney
            v-slots={slots}
            class={prefixCls}
            text={dataValue as number}
            {...attrs}
            {...(omit(proFieldProps.value, ['text']) as any)}
          />
        )
      }

      if (valueType.value === 'digit') {
        return (
          <FieldDigit
            v-slots={slots}
            class={prefixCls}
            text={dataValue as number}
            {...attrs}
            {...(omit(proFieldProps.value, ['text']) as any)}
          />
        )
      }

      if (
        valueType.value === 'select' ||
        (valueType.value === 'text' && (props.valueEnum || props.request))
      ) {
        return (
          <FieldSelect
            text={dataValue as string}
            v-slots={slots}
            class={prefixCls}
            {...attrs}
            {...(omit(proFieldProps.value, ['text']) as any)}
          />
        )
      }

      return (
        <FieldText
          text={dataValue as string}
          v-slots={slots}
          class={prefixCls}
          {...attrs}
          {...(omit(proFieldProps.value, ['text']) as any)}
        />
      )
    }
  },
})
