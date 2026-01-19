/*
 * @Author: shen
 * @Date: 2022-11-07 09:39:00
 * @LastEditors: shen
 * @LastEditTime: 2026-01-16 11:06:11
 * @Description:
 */
import type { FunctionalComponent } from 'vue'
import { cloneElement, get, isValidElement, omit, omitUndefined } from '@pro-design-vue/utils'
import { useInjectForm } from '../../context/FormContext'

const WithValueFomField: FunctionalComponent<Record<string, any>> = (props, { slots }) => {
  const { onChange, onBlur, name, ...restProps } = props
  const { store } = useInjectForm()
  const fieldChildren = slots.default?.()?.[0]?.children?.[0]
  const isValidElementForFieldChildren = !isValidElement(fieldChildren)
  const fieldValue = get(store.formValues.value, name)
  const onChangeMemo = function (...restParams: any[]): void {
    if (isValidElementForFieldChildren) return undefined
    ;(fieldChildren?.props as Record<string, any>)?.fieldProps?.onChange?.(...restParams)
  }

  const onBlurMemo = function (...restParams: any[]): void {
    if (isValidElementForFieldChildren) return
    onBlur?.(...restParams)
    ;(fieldChildren?.props as Record<string, any>)?.fieldProps?.onBlur?.(...restParams)
  }

  const omitOnBlurAndOnChangeProps = omit(
    // @ts-ignore
    fieldChildren?.props?.fieldProps || {},
    ['onBlur', 'onChange'],
  )

  const fieldProps = !isValidElementForFieldChildren
    ? omitUndefined({
        id: restProps.id,
        value: fieldValue,
        ...omitOnBlurAndOnChangeProps,
        onBlur: onBlurMemo,
        onChange: onChangeMemo,
      })
    : undefined

  const finalChange = () => {
    if (fieldProps) return undefined
    if (!isValidElement(fieldChildren)) return undefined
    return (...restParams: any[]) => {
      onChange?.(...restParams)
      fieldChildren?.props?.onChange?.(...restParams)
    }
  }
  if (!isValidElement(fieldChildren)) return fieldChildren

  return cloneElement(
    fieldChildren,
    omitUndefined({
      ...restProps,
      ...fieldChildren.props,
      onChange: finalChange,
      fieldProps,
      onBlur: !isValidElementForFieldChildren && onBlur,
    }),
  )
}

WithValueFomField.displayName = 'WithValueFomField'

export default WithValueFomField
