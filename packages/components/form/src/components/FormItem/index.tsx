/*
 * @Author: shen
 * @Date: 2023-08-09 10:36:49
 * @LastEditors: shen
 * @LastEditTime: 2026-01-16 14:57:51
 * @Description:
 */
import type { PropType } from 'vue'

import { computed, defineComponent, watchEffect } from 'vue'
import { type FormItemProps } from 'ant-design-vue'
import {
  merge,
  omit,
  type ProFieldMode,
  type ProFieldValueType,
  type ProVNode,
  type SearchConvertKeyFn,
  type SearchTransformKeyFn,
} from '@pro-design-vue/utils'
import { useInjectFormList } from '../../context/FormListContext'
import { formItemProps } from 'ant-design-vue/es/form'
import { useInjectField } from '../../context/FieldContext'
import { getNamePath } from '../../utils/getNamePath'
import WrapFormItem from './WrapFormItem'
import WithValueFomField from './WithValueFomField'
export type ProFormItemProps = FormItemProps & {
  ignoreFormItem?: boolean
  mode?: ProFieldMode
  valueType?: ProFieldValueType
  /**
   * @name 提交时转化值，一般用于将值转化为提交的数据
   * @param value 字段的值
   * @param namePath 字段的name
   * @param allValues 所有的字段
   * @returns 字段新的值，如果返回对象，会和所有值 merge 一次
   *
   * @example {name:[a,b] => {name:a,b }    transform: (value,namePath,allValues)=> value.join(",")
   * @example {name: string => { newName:string }    transform: (value,namePath,allValues)=> { newName:value }
   * @example {name:dayjs} => {name:string transform: (value,namePath,allValues)=> value.format("YYYY-MM-DD")
   * @example {name:dayjs}=> {name:时间戳} transform: (value,namePath,allValues)=> value.valueOf()
   * @example {name:{value,label}} => { name:string} transform: (value,namePath,allValues)=> value.value
   * @example {name:{value,label}} => { valueName,labelName  } transform: (value,namePath,allValues)=> { valueName:value.value, labelName:value.name }
   */
  transform?: SearchTransformKeyFn
  dataFormat?: string
  proFormFieldKey?: any

  /** @name 前置的dom * */
  addonBefore?: ProVNode
  /** @name 后置的dom * */
  addonAfter?: ProVNode
  /**
   * @name 获取时转化值，一般用于将数据格式化为组件接收的格式
   * @param value 字段的值
   * @param namePath 字段的name
   * @returns 字段新的值
   *
   *
   * @example a,b => [a,b]     convertValue: (value,namePath)=> value.split(",")
   * @example string => json   convertValue: (value,namePath)=> JSON.parse(value)
   * @example number => date   convertValue: (value,namePath)=> Dayjs(value)
   * @example YYYY-MM-DD => date   convertValue: (value,namePath)=> Dayjs(value,"YYYY-MM-DD")
   * @example  string => object   convertValue: (value,namePath)=> { return {value,label:value} }
   */
  convertValue?: SearchConvertKeyFn
  help?: ProVNode | ((params: { errors: ProVNode[]; warnings: ProVNode[] }) => ProVNode)
}

export default defineComponent({
  name: 'ProFormItem',
  inheritAttrs: false,
  props: {
    ...formItemProps(),
    ignoreFormItem: Boolean,
    proFormFieldKey: [String, Number],
    mode: {
      type: String as PropType<ProFormItemProps['mode']>,
      default: undefined,
    },
    dataFormat: {
      type: String,
      default: undefined,
    },
    valueType: {
      type: [Object, String] as PropType<ProFormItemProps['valueType']>,
      default: 'text',
    },
    transform: {
      type: Function as PropType<ProFormItemProps['transform']>,
    },
    convertValue: {
      type: Function as PropType<ProFormItemProps['transform']>,
    },
    addonBefore: {
      type: [Object, String, Number, null, Boolean, Array] as PropType<
        ProFormItemProps['addonBefore']
      >,
    },
    addonAfter: {
      type: [Object, String, Number, null, Boolean, Array] as PropType<
        ProFormItemProps['addonAfter']
      >,
    },
  },
  setup(props, { attrs, slots }) {
    const formListField = useInjectFormList()
    const { setFieldValueType, formItemProps } = useInjectField()
    const namePath = computed(() => getNamePath(props.name))
    const name = computed(() => {
      if (!namePath?.value?.length) return props.name
      if (formListField.name?.value !== undefined) {
        return [formListField.name?.value, namePath.value].flat(1) as string[]
      }
      return namePath.value
    })

    const mergeFormItemProps = computed(() =>
      omit(merge({}, formItemProps?.value, props), [
        'name',
        'valueType',
        'ignoreFormItem',
        'convertValue',
        'rules',
        'dataFormat',
      ]),
    )

    watchEffect(() => {
      if (!setFieldValueType || !namePath.value?.length) {
        return
      }
      // Field.type === 'ProField' 时 props 里面是有 valueType 的，所以要设置一下
      setFieldValueType(
        [formListField.listName?.value, namePath.value]
          .flat(1)
          .filter((itemName) => itemName !== undefined),
        {
          valueType: props.valueType || 'text',
          dateFormat: props.dataFormat,
          transform: props.transform,
        },
      )
    })

    return () => {
      const formField = (
        <WithValueFomField key={props.proFormFieldKey || props.name?.toString()} name={name.value}>
          {slots.default?.()}
        </WithValueFomField>
      )
      // const formField = slots.default?.()
      if (props.ignoreFormItem) {
        return <>{formField}</>
      }
      return (
        <WrapFormItem
          key={props.proFormFieldKey || props.name?.toString()}
          class={attrs.class}
          style={attrs.style}
          name={name.value}
          rules={props.mode === 'read' ? undefined : props.rules}
          v-slots={{ ...omit(slots, ['default']) }}
          {...mergeFormItemProps.value}
        >
          {formField}
        </WrapFormItem>
      )
    }
  },
})
