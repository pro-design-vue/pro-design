/*
 * @Author: shen
 * @Date: 2023-08-09 10:36:49
 * @LastEditors: shen
 * @LastEditTime: 2026-01-12 17:01:57
 * @Description:
 */
import type { CSSProperties, PropType, VNode } from 'vue'

import { computed, defineComponent, watchEffect } from 'vue'
import { Form, Tooltip, type FormItemProps } from 'ant-design-vue'
import {
  cloneDeep,
  get,
  merge,
  omit,
  omitUndefined,
  type ProFieldValueType,
  type ProVNode,
  type SearchConvertKeyFn,
  type SearchTransformKeyFn,
} from '@pro-design-vue/utils'
import { useInjectFormList } from '../../context/FormListContext'
import { formItemProps } from 'ant-design-vue/es/form'
import { useInjectField } from '../../context/FieldContext'
import { getNamePath } from '../../utils/getNamePath'
import { useProvideFormItem } from '../../context/FormItemContext'
import { usePrefixCls, useVNodeJSX } from '@pro-design-vue/hooks'
import { QuestionCircleOutlined } from '@ant-design/icons-vue'
import { useInjectForm } from '../../context/FormContext'
import { useInjectFormEditOrReadOnly } from '../../context/EditOrReadOnlyContext'
export type ProFormItemProps = FormItemProps & {
  ignoreFormItem?: boolean
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
   * 包裹的样式，一般没用
   */
  addonWarpStyle?: CSSProperties
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
const SLOT_KEYS: any[] = ['extra', 'help', 'label']

export default defineComponent({
  name: 'ProFormItem',
  inheritAttrs: false,
  props: {
    ...formItemProps(),
    ignoreFormItem: Boolean,
    isProFormComponent: Boolean,
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
    addonWarpStyle: {
      type: Object as PropType<ProFormItemProps['addonWarpStyle']>,
    },
  },
  setup(props, { attrs }) {
    const formListField = useInjectFormList()
    const prefixCls = usePrefixCls('form-item')
    const { store, form } = useInjectForm()
    const { mode } = useInjectFormEditOrReadOnly()
    const { setFieldValueType, formItemProps } = useInjectField()
    const renderContent = useVNodeJSX()
    const namePath = computed(() => getNamePath(props.name))
    const name = computed(() => {
      if (!namePath?.value?.length) return props.name
      if (formListField.name?.value !== undefined) {
        return [formListField.name?.value, namePath.value].flat(1) as string[]
      }
      return namePath.value
    })

    const fieldValue = computed(() => get(store.formValues.value, namePath.value))

    const renderParams = computed(() => ({
      form,
      mode: mode?.value,
      value: fieldValue.value,
      formValues: cloneDeep(store.formValues.value),
    }))

    const mergeFormItemProps = computed(() =>
      omit(merge({}, formItemProps, props), [
        ...SLOT_KEYS,
        'name',
        'addonAfter',
        'valueType',
        'ignoreFormItem',
        'addonBefore',
        'addonWarpStyle',
        'convertValue',
        'dataFormat',
        'tooltip',
      ]),
    )

    const mergeFormItemSlots = computed(() => {
      const tooltipRender = renderContent('tooltip', {
        slotFirst: true,
        props,
        params: renderParams.value,
      })
      const slots: any = {
        tooltip: tooltipRender
          ? () => {
              return (
                <Tooltip
                  getPopupContainer={() => document.body}
                  v-slots={{ title: () => tooltipRender }}
                >
                  <QuestionCircleOutlined
                    class={`${prefixCls}-tooltip-icon`}
                    style="margin-inline-start: 3px"
                  />
                </Tooltip>
              )
            }
          : undefined,
      }
      SLOT_KEYS.forEach((key) => {
        const render = renderContent(key, {
          slotFirst: true,
          props,
          params: renderParams.value,
        })
        slots[key] = render ? () => render : undefined
      })
      return omitUndefined(slots)
    })

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

    const addonAfterNode = computed<VNode>(() => {
      const addonAfter = renderContent('addonAfter', {
        slotFirst: true,
        props,
        params: renderParams.value,
      })
      if (addonAfter) return addonAfter
      return null
    })

    const addonBeforeNode = computed<VNode>(() => {
      const addonBefore = renderContent('addonBefore', {
        slotFirst: true,
        props,
        params: renderParams.value,
      })
      if (addonBefore) return addonBefore
      return null
    })

    const childrenNode = computed<VNode>(() => {
      const children = renderContent('default', {
        slotFirst: true,
        props,
        params: {
          ...renderParams.value,
          onChange: (value: any) => {
            store.updateValue(namePath.value, value)
          },
        },
      })
      if (children) return children
      return null
    })

    useProvideFormItem({
      name: computed(() => props.name as any),
      label: computed(() => props.label as any),
    })

    return () => {
      if (props.ignoreFormItem) {
        return childrenNode.value
      }
      if (!addonAfterNode.value && !addonBeforeNode.value) {
        return (
          <Form.Item
            {...attrs}
            {...mergeFormItemProps.value}
            name={name.value}
            v-slots={{ ...mergeFormItemSlots.value }}
          >
            {childrenNode.value}
          </Form.Item>
        )
      }
      return (
        <Form.Item
          {...attrs}
          {...mergeFormItemProps.value}
          name={name.value}
          v-slots={{
            ...mergeFormItemSlots.value,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              ...props.addonWarpStyle,
            }}
          >
            {addonBeforeNode.value ? (
              <div style={{ marginInlineEnd: '8px' }}>{addonBeforeNode.value}</div>
            ) : null}
            {childrenNode.value}
            {addonAfterNode.value ? (
              <div style={{ marginInlineStart: '8px' }}>{addonAfterNode.value}</div>
            ) : null}
          </div>
        </Form.Item>
      )
    }
  },
})
