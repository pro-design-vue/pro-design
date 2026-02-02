/*
 * @Author: shen
 * @Date: 2023-08-08 14:51:29
 * @LastEditors: shen
 * @LastEditTime: 2026-01-27 10:11:42
 * @Description:
 */
import type { CSSProperties, PropType } from 'vue'
import type { FormListOperation, ProFormGridConfig } from '../../type'
import type { Rule } from 'ant-design-vue/es/form'
import type { NamePath } from 'ant-design-vue/es/form/interface'
import type { FormListActionGuard, ProFromListCommonProps } from './ListItem'

import { computed, defineComponent, onMounted, shallowRef, watchEffect } from 'vue'
import { Form, Tooltip, type ButtonProps, type ColProps, type TooltipProps } from 'ant-design-vue'
import { useInjectField } from '../../context/FieldContext'
import { useContent, usePrefixCls, useVNodeJSX } from '@pro-design-vue/hooks'
import { useInjectForm } from '../../context/FormContext'
import { isDeepEqual, isNil, isString, type Entity, type ProVNode } from '@pro-design-vue/utils'
import { useInjectGrid } from '../../context/GridContext'

import ColWrapper from '../Grid/ColWrapper'
import RowWrapper from '../Grid/RowWrapper'
import { useIntl } from '@pro-design-vue/components/config-provider'
import { useInjectFormList } from '../../context/FormListContext'
import { getNamePath } from '../../utils/getNamePath'
import { QuestionCircleOutlined } from '@ant-design/icons-vue'

export type FormListActionType<T = any> = FormListOperation & {
  get: (index: number) => T | undefined
  getList: () => T[] | undefined
}

export type ProFormListProps = ProFromListCommonProps &
  ProFormGridConfig & {
    name: NamePath
    rules?: Rule[]
    initialValue?: any[]
    /**
     * @name 列表的标签
     */
    label?: ProVNode
    /**
     * @name 标题旁边的？号提示展示的信息
     *
     * @example 自定义提示信息
     * <ProForm.Group title="标题"  tooltip="自定义提示信息">
     *  @example 自定义Icon
     * <ProForm.Group title="标题"  tooltip={{icon:<Info/>,title:自定义提示信息}}>
     */
    tooltip?:
      | (TooltipProps & {
          icon?: ProVNode
        })
      | string
    /**
     * @name 行操作的钩子配置
     *
     * @example 阻止删除 actionGuard={{beforeAddRow:()=> return false}}
     * @example 阻止新增 actionGuard={{beforeAddRow:()=> return false}}
     */
    actionGuard?: FormListActionGuard

    /**
     * @name 在最后增加一个 dom
     *
     * @example 自定义新增按钮
     * fieldExtraRender={(fieldAction) => {<a onClick={()=>fieldAction.add({id:"xx"})}>新增</a>}}
     */
    fieldExtraRender?: (fieldAction: FormListOperation) => ProVNode
    /**
     * @name 获取到 list 操作实例
     * @description 可用删除，新增，移动等操作
     *
     * @example  actionRef?.current.add?.({},1);
     * @example  actionRef?.current.remove?.(1);
     * @example  actionRef?.current.move?.(1,2);
     * @example  actionRef?.current.get?.(1);
     * @example  actionRef?.current.getList?.();
     */
    actionRef?: FormListActionType
    /** 放在div上面的属性 */
    style?: CSSProperties
    /**
     * 数据新增成功回调
     */
    onAfterAdd?: (...params: [...Parameters<FormListOperation['add']>, number]) => void
    /**
     * 数据移除成功回调
     */
    onAfterRemove?: (...params: [...Parameters<FormListOperation['remove']>, number]) => void
    /** 是否同时校验列表是否为空 */
    isValidateList?: boolean
    /** 当 isValidateList 为 true 时执行为空提示 */
    emptyListMessage?: string
    required?: boolean
    wrapperCol?: ColProps
    className?: string
    readonly?: boolean
  }

let prevProps = {}

export default defineComponent({
  name: 'ProFormList',
  inheritAttrs: false,
  props: {
    name: {
      type: [String, Number, Array] as PropType<ProFormListProps['name']>,
      default: undefined,
    },
    label: {
      type: [Object, String, Number, null, Boolean, Array, Function] as PropType<
        ProFormListProps['label']
      >,
      default: undefined,
    },
    initialValue: {
      type: Object as PropType<ProFormListProps['initialValue']>,
      default: undefined,
    },
    tooltip: {
      type: [String, Object] as PropType<ProFormListProps['tooltip']>,
      default: undefined,
    },
    colProps: {
      type: Object as PropType<ProFormListProps['colProps']>,
      default: undefined,
    },
    rowProps: {
      type: Object as PropType<ProFormListProps['rowProps']>,
      default: undefined,
    },
    transform: {
      type: Function as PropType<ProFormListProps['transform']>,
      default: undefined,
    },
    readonly: {
      type: Boolean,
      default: undefined,
    },
    min: {
      type: Number,
      default: undefined,
    },
    max: {
      type: Number,
      default: undefined,
    },
    alwaysShowItemLabel: {
      type: Boolean,
      default: undefined,
    },
    creatorRecord: {
      type: [Object, Function] as PropType<ProFormListProps['creatorRecord']>,
      default: undefined,
    },
    creatorButtonProps: {
      type: [Object, Boolean] as PropType<ProFormListProps['creatorButtonProps']>,
      default: undefined,
    },
    rules: {
      type: [Object, Array, Function] as PropType<ProFormListProps['rules']>,
      default: undefined,
    },
    copyIconProps: {
      type: [Object, String, Boolean] as PropType<ProFormListProps['copyIconProps']>,
      default: undefined,
    },
    deleteIconProps: {
      type: [Object, String, Boolean] as PropType<ProFormListProps['deleteIconProps']>,
      default: undefined,
    },
    actionGuard: {
      type: Object as PropType<ProFormListProps['actionGuard']>,
      default: undefined,
    },
    isValidateList: {
      type: Boolean,
      default: undefined,
    },
    emptyListMessage: {
      type: String,
      default: '列表不能为空',
    },
    required: {
      type: Boolean,
      default: undefined,
    },
    wrapperCol: {
      type: Object as PropType<ProFormListProps['wrapperCol']>,
      default: undefined,
    },
    containerClassName: {
      type: String,
      default: undefined,
    },
    actionRender: {
      type: Function as PropType<ProFormListProps['actionRender']>,
      default: undefined,
    },
    containerStyle: {
      type: Object as PropType<ProFormListProps['containerStyle']>,
      default: undefined,
    },
    itemContainerRender: {
      type: Function as PropType<ProFormListProps['itemContainerRender']>,
      default: undefined,
    },
    itemRender: {
      type: Function as PropType<ProFormListProps['itemRender']>,
      default: undefined,
    },
    fieldExtraRender: {
      type: Function as PropType<ProFormListProps['fieldExtraRender']>,
      default: undefined,
    },
    onAfterAdd: {
      type: Function as PropType<ProFormListProps['onAfterAdd']>,
      default: undefined,
    },
    onAfterRemove: {
      type: Function as PropType<ProFormListProps['onAfterRemove']>,
      default: undefined,
    },
  },
  setup(props, { slots, attrs, expose }) {
    const { store, form } = useInjectForm()
    const { groupProps, setFieldValueType } = useInjectField()
    const { grid, colProps, rowProps } = useInjectGrid()
    const formListField = useInjectFormList()
    const intl = useIntl()
    const formItemContext = Form.useInjectFormItemContext()
    const prefixCls = usePrefixCls('form-list')
    const renderVNodeJSX = useVNodeJSX()
    const renderContent = useContent()
    const keyRef = shallowRef<{ keys: number[]; id: number }>({
      keys: [],
      id: 0,
    })
    // 处理 list 的嵌套
    const name = computed(() => {
      const namePath = getNamePath(props.name)
      if (formListField.name?.value === undefined) {
        return [namePath].flat(1)
      }
      return [formListField.name?.value, namePath].flat(1)
    })

    const tooltip = computed(() => {
      if (isString(props.tooltip)) {
        return { title: props.tooltip }
      }
      return props.tooltip
    })

    watchEffect(() => {
      const namePath = getNamePath(props.name) as string[]
      if (!setFieldValueType || !namePath?.length) {
        return
      }
      setFieldValueType(
        [namePath].flat(1).filter((itemName) => itemName !== undefined),
        {
          valueType: 'formList',
          transform: props.transform,
        },
      )
    })

    const onChange = (value: any[]) => {
      store.updateValue(name.value, value)
      // props.onChange?.(value, form)
      formItemContext.onFieldChange()
    }

    const operations: FormListOperation = {
      add: (defaultValue, index?: number) => {
        // Mapping keys
        const newValue = store.getFieldValue(name.value)
        if (index! >= 0 && index! <= newValue.length) {
          keyRef.value.keys = [
            ...keyRef.value.keys.slice(0, index),
            keyRef.value.id,
            ...keyRef.value.keys.slice(index),
          ]
          onChange([...newValue.slice(0, index), defaultValue, ...newValue.slice(index)])
        } else {
          keyRef.value.keys = [...keyRef.value.keys, keyRef.value.id]
          onChange([...newValue, defaultValue])
        }
        keyRef.value.id += 1
        return true
      },
      remove: (index: number | number[]) => {
        const newValue = store.getFieldValue(name.value)
        const indexSet = new Set(Array.isArray(index) ? index : [index])
        if (indexSet.size <= 0) {
          return
        }
        keyRef.value.keys = keyRef.value.keys.filter((_, keysIndex) => !indexSet.has(keysIndex))
        // Trigger store change
        onChange(newValue.filter((_, valueIndex) => !indexSet.has(valueIndex)))
      },
      move(from: number, to: number) {
        // if (from === to) {
        //   return
        // }
        // const newValue = getNewValue()
        // // Do not handle out of range
        // if (from < 0 || from >= newValue.length || to < 0 || to >= newValue.length) {
        //   return
        // }
        // keyManager.keys = move(keyManager.keys, from, to)
        // // Trigger store change
        // onChange(move(newValue, from, to))
      },
    }

    expose({
      ...operations,
      get: (index: number) => {
        return form.getFieldValue([...name.value, index])
      },
      getList: () => form.getFieldValue([...name.value]),
    })

    onMounted(() => {
      if (name.value?.length && !isNil(props.initialValue)) {
        store.initEntityValue(name.value, props.initialValue)
      }
    })

    return () => {
      if (!form) {
        return null
      }
      isDeepEqual(prevProps, { ...props }, [], true)
      prevProps = { ...props }
      const listContent = renderContent('default', 'content')
      console.log('🚀 ~ return ~ listContent:', listContent)
      const label = renderVNodeJSX('label', {
        slotFirst: true,
      })
      return (
        <ColWrapper grid={grid?.value} colProps={props.colProps}>
          <div class={[prefixCls, attrs.class]} style={attrs.style as any}>
            <Form.Item
              wrapperCol={props.wrapperCol}
              required={props.required ?? props.rules?.some((rule) => rule.required)}
              name={props.isValidateList ? name.value : undefined}
              rules={
                props.isValidateList
                  ? [
                      {
                        validator: (_, value) => {
                          if (!value || value.length === 0) {
                            return Promise.reject(new Error(props.emptyListMessage))
                          }
                          return Promise.resolve()
                        },
                        required: true,
                      },
                    ]
                  : undefined
              }
              {...attrs}
              v-slots={{
                label: () => label,
                tooltip: tooltip.value
                  ? () => {
                      return (
                        <Tooltip getPopupContainer={() => document.body} {...tooltip.value}>
                          <QuestionCircleOutlined
                            class={`${prefixCls}-tooltip-icon`}
                            style="margin-inline-start: 3px"
                          />
                        </Tooltip>
                      )
                    }
                  : undefined,
              }}
            >
              {listContent}
            </Form.Item>
          </div>
        </ColWrapper>
      )
    }
  },
})
