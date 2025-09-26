/*
 * @Author: shen
 * @Date: 2023-08-09 16:56:49
 * @LastEditors: shen
 * @LastEditTime: 2025-09-26 13:59:00
 * @Description:
 */
import type { PropType } from 'vue'
import type { ProFormItemType } from '../type'

import { defineComponent, computed, watch, ref } from 'vue'
import { Form } from 'ant-design-vue'
import { useInjectSlots } from '../context/FormSlotsContext'
import { useInjectForm } from '../context/FormContext'
import { useFieldValue } from '../hooks/useFieldValue'
import { useInjectFormList } from '../context/FormListContext'
import { fieldComponentMap } from '../fieldMap'
import {
  get,
  isEqual,
  isNumber,
  merge,
  omitUndefined,
  pickKeys,
  RenderVNode,
  runFunction,
  set,
} from '@pro-design-vue/utils'
import getSlot from '../utils/getSlot'
import FormColWrapper from './FormColWrapper'
import FormTitle from './FormTitle'
import covertFormName from '../utils/namePath'
import fieldPropsMap from '../utils/fieldPropsMap'
import fieldWidthSizeMap from '../utils/fieldWidthSizeMap'

const ALL_ANTD_PROP_KEYS = [
  'autoLink',
  'colon',
  'hasFeedback',
  'labelAlign',
  'labelCol',
  'htmlFor',
  'required',
  'validateFirst',
  'validateStatus',
  'validateTrigger',
  'wrapperCol',
  'rules',
  'style',
  'class',
]

const IGNORE_WIDTH_VALUE_TYPE = ['switch', 'radioButton', 'radio', 'rate']
const SLOT_NAMES = ['extra', 'help']

export default defineComponent({
  name: 'FormItem',
  inheritAttrs: false,
  props: {
    item: {
      type: Object as PropType<ProFormItemType>,
      default: () => ({}),
    },
    grid: {
      type: Boolean,
      default: undefined,
    },
  },
  setup(props) {
    const {
      grid,
      action,
      formKey,
      prefixCls,
      formData,
      readonly,
      readonlyProps,
      disabledKeys,
      hiddenKeys,
      allDisabledKeys,
      updateHiddenKeys,
      updateDisabledKeys,
    } = useInjectForm()
    const { isList, listKey, listName, rowData } = useInjectFormList()
    const formSlotsContext = useInjectSlots()
    const { fieldValue, onValueChange } = useFieldValue<any>({
      isList,
      namePath: computed(() => props.item.name!),
      initialValue: props.item.initialValue,
      convertValue: props.item.convertValue,
      transform: props.item.transform,
    })
    const fieldRef = ref()
    const mergeGrid = computed(() => props.grid ?? grid?.value)
    const fieldType = computed(() => props.item.fieldType ?? 'text')
    const mergeReadonly = computed(() =>
      runFunction(props.item.readonly ?? readonly?.value, formData.value, rowData?.value),
    )
    const mergeReadonlyProps = computed(() =>
      merge({}, readonlyProps?.value, props.item.readonlyProps),
    )
    const linkageDisabledKeys = computed(() => disabledKeys.value.map((key) => key.split(':')[1]))
    const linkageHiddenKeys = computed(() => hiddenKeys.value.map((key) => key.split(':')[1]))
    const isIgnoreWidth = computed(
      () => props.item.ignoreWidth ?? IGNORE_WIDTH_VALUE_TYPE.includes(fieldType.value),
    )
    const formItemProps = computed(
      () => runFunction(props.item.formItemProps, formData.value) ?? {},
    )
    const restItemProps = computed(() =>
      omitUndefined({
        ...pickKeys(formItemProps.value, ALL_ANTD_PROP_KEYS),
        name: mergeReadonly.value ? undefined : props.item.name,
        htmlFor: mergeReadonly.value
          ? undefined
          : (formItemProps.value?.htmlFor ?? `form-${formKey.value ?? ''}-${props.item.key}`),
        rules: mergeReadonly.value
          ? undefined
          : runFunction(props.item.rules ?? formItemProps.value.rules, formData.value, action),
      }),
    )

    const clearOnChange = (newValue: any) => {
      const { clear } = props.item.linkage ?? {}
      if (clear) {
        const clearNamePaths = runFunction(clear, newValue, formData.value) ?? []
        if (clearNamePaths.length > 0) {
          clearNamePaths.forEach((namePath) => {
            const path = isList
              ? [...(listName?.value ?? [])!, ...covertFormName(namePath)!]
                  .filter((item) => item !== undefined)
                  .flat(1)
              : covertFormName(namePath)
            const value = get(formData.value, path!)
            if (typeof value !== 'undefined') {
              set(formData.value, path!, undefined)
            }
          })
        }
      }
    }

    const fieldProps = computed(() => {
      const baseProps = runFunction(props.item.fieldProps ?? {}, formData.value)
      const mergeProps = {
        ...baseProps,
        id: baseProps?.id ?? `form-${formKey.value ?? ''}-${props.item.key}`,
        disabled:
          (runFunction(
            props.item.disabled ?? baseProps?.disabled,
            formData.value,
            rowData?.value,
          ) ?? allDisabledKeys.value.includes(props.item.key as string))
            ? true
            : undefined,
        placeholder: props.item.placeholder ?? baseProps?.placeholder,
        options: props.item.options ?? baseProps?.options ?? baseProps?.treeData,
        allowClear: props.item.allowClear ?? baseProps?.allowClear ?? true,
      }

      return omitUndefined({
        valueEnum: props.item.valueEnum,
        dependencies: props.item.dependencies,
        readonly: mergeReadonly.value,
        readonlyProps: mergeReadonlyProps.value,
        request: props.item.request,
        params: props.item.params,
        onChange: (value: any, ...args) => {
          clearOnChange(value)
          onValueChange(value)
          props.item.onChange?.(value, ...args, action)
        },
        ...(fieldPropsMap[fieldType.value]
          ? pickKeys(mergeProps, fieldPropsMap[fieldType.value]!)
          : mergeProps),
      })
    })

    const fieldStyle = computed(() => {
      const baseProps = runFunction(props.item.fieldProps ?? {}, formData.value)
      const newStyle = {
        ...baseProps?.style,
      }

      if (props.item.width && !fieldWidthSizeMap[props.item.width]) {
        newStyle.width = isNumber(props.item.width) ? props.item.width + 'px' : props.item.width
      } else if (mergeGrid?.value) {
        newStyle.maxWidth = '100%'
        newStyle.width = '100%'
      }

      if (isIgnoreWidth.value) Reflect.deleteProperty(newStyle, 'width')

      return omitUndefined(newStyle)
    })

    const fieldClassName = computed(() => {
      const isSizeEnum = props.item.width && fieldWidthSizeMap[props.item.width]
      const className = {
        [`${prefixCls}-field`]: !!isSizeEnum,
        [`${prefixCls}-field-${props.item.width}`]: isSizeEnum && !isIgnoreWidth.value,
      }
      if (props.item.className) {
        className[props.item.className] = true
      }
      return className
    })

    const slotsGetter = computed(() => {
      const temp = {}
      SLOT_NAMES.forEach((name) => {
        const slot = getSlot(formItemProps.value[name], formSlotsContext)
        if (slot) {
          temp[name] = () => <RenderVNode vnode={slot} props={{ formData: formData.value }} />
        }
      })
      if (props.item.title) {
        const extraRender = getSlot(props.item.extra?.label, formSlotsContext)
        temp['label'] = () => (
          <>
            <div class={`${prefixCls}-item-title`} style={formItemProps.value.titleStyles}>
              <FormTitle title={props.item.title} tooltip={props.item.tooltip} />
            </div>
            <div class={`${prefixCls}-item-title-extra`}>
              <RenderVNode vnode={extraRender} props={{ formData: formData.value }} />
            </div>
          </>
        )
      }
      return temp
    })

    watch(
      fieldValue,
      (newValue) => {
        const { linkage } = props.item
        if (linkage) {
          const { hidden, disabled } = linkage
          if (hidden) {
            const hiddenKeys = runFunction(hidden, newValue, formData.value) ?? []
            if (!isEqual(hiddenKeys, linkageHiddenKeys.value)) {
              updateHiddenKeys(
                props.item.key as string,
                isList ? hiddenKeys.map((key) => `${listKey}_${key}`) : hiddenKeys,
              )
            }
          }

          if (disabled) {
            const disabledKeys = runFunction(disabled, newValue, formData.value) ?? []
            if (!isEqual(disabledKeys, linkageDisabledKeys.value)) {
              updateDisabledKeys(
                props.item.key as string,
                isList ? disabledKeys.map((key) => `${listKey}_${key}`) : disabledKeys,
              )
            }
          }
        }
      },
      {
        immediate: true,
      },
    )

    watch(fieldRef, () => {
      props.item.onInit?.(fieldRef.value)
    })

    watch(mergeReadonly, () => {
      if (mergeReadonly.value) {
        action.clearValidate(props.item.name)
      }
    })

    watch(
      () => restItemProps.value?.rules,
      () => {
        action.clearValidate(props.item.name)
      },
    )

    return () => {
      const renderFormItem = getSlot(props.item.renderFormItem, formSlotsContext)
      const extraRender = getSlot(props.item.extra?.item, formSlotsContext)
      const FieldComponent = fieldComponentMap[fieldType.value] ?? fieldComponentMap['text']
      let defaultDom = (
        <FieldComponent
          ref={fieldRef}
          value={fieldValue.value}
          {...fieldProps.value}
          style={fieldStyle.value}
          class={fieldClassName.value}
        />
      )
      if (renderFormItem) {
        defaultDom = (
          <RenderVNode
            vnode={renderFormItem}
            props={{
              value: fieldValue.value,
              onChange: fieldProps.value.onChange,
              defaultDom,
              formData: formData.value,
              action,
              listName: listName?.value,
              name: props.item.name,
            }}
          />
        )
      }

      if (extraRender) {
        defaultDom = (
          <div style="display: flex; flex-direction: row; justify-content: flex-start; align-items: center;">
            {defaultDom}
            <div style="margin-inline-start: 5px; flex-shrink: 0;">
              <RenderVNode
                vnode={extraRender}
                props={{
                  formData: formData.value,
                  listName: listName?.value,
                  name: props.item.name,
                }}
              />
            </div>
          </div>
        )
      }

      const formItemDom = (
        <Form.Item {...restItemProps.value} v-slots={slotsGetter.value}>
          {defaultDom}
        </Form.Item>
      )

      const render = getSlot(props.item.render, formSlotsContext)
      return (
        <FormColWrapper colProps={props.item.colProps} grid={mergeGrid.value}>
          {render ? (
            <RenderVNode
              vnode={render}
              props={{
                formData: formData.value,
                defaultDom: formItemDom,
              }}
            />
          ) : (
            formItemDom
          )}
        </FormColWrapper>
      )
    }
  },
})
