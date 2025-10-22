/*
 * @Author: shen
 * @Date: 2023-08-09 10:36:49
 * @LastEditors: shen
 * @LastEditTime: 2025-10-22 11:06:31
 * @Description:
 */
import type { CSSProperties, PropType, VNode } from 'vue'
import type { Entity, ProFormItemType } from '../type'
import type { ButtonProps } from 'ant-design-vue'

import { computed, defineComponent } from 'vue'
import { Form } from 'ant-design-vue'
import { useInjectForm } from '../context/FormContext'
import { useInjectFormList } from '../context/FormListContext'
import FormColWrapper from './FormColWrapper'
import FormTitle from './FormTitle'
import FormListContainer from './FormListContainer'
import { omitUndefined, pickKeys, runFunction } from '@pro-design-vue/utils'

export interface ListOperations {
  add: (defaultValue: Entity, index?: number) => Promise<boolean>
  remove: (index: number | number[]) => Promise<boolean>
}

const ALL_ANTD_PROP_KEYS = [
  'autoLink',
  'colon',
  'hasFeedback',
  'labelAlign',
  'labelCol',
  'required',
  'validateFirst',
  'validateStatus',
  'validateTrigger',
  'wrapperCol',
  'required',
]

export default defineComponent({
  name: 'FormList',
  inheritAttrs: false,
  props: {
    name: {
      type: [String, Array] as PropType<ProFormItemType['name']>,
      default: undefined,
    },
    originName: {
      type: [String, Array] as PropType<ProFormItemType['name']>,
      default: undefined,
    },
    initialValue: {
      type: Object as PropType<ProFormItemType['initialValue']>,
      default: undefined,
    },
    title: {
      type: [String, Object, Function] as PropType<ProFormItemType['title']>,
      default: undefined,
    },
    tooltip: {
      type: [String, Boolean],
      default: undefined,
    },
    colProps: {
      type: Object as PropType<ProFormItemType['colProps']>,
      default: undefined,
    },
    rowProps: {
      type: Object as PropType<ProFormItemType['rowProps']>,
      default: undefined,
    },
    formItemProps: {
      type: [Object, Function] as PropType<ProFormItemType['formItemProps']>,
      default: undefined,
    },
    convertValue: {
      type: Function as PropType<ProFormItemType['convertValue']>,
      default: undefined,
    },
    transform: {
      type: Function as PropType<ProFormItemType['transform']>,
      default: undefined,
    },
    readonly: {
      type: Boolean,
      default: undefined,
    },
    items: {
      type: [Array, Function] as PropType<ProFormItemType['children']>,
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
    alwaysShowRowTitle: {
      type: Boolean,
      default: true,
    },
    rowTitle: {
      type: String,
      default: undefined,
    },
    rowTitleStyle: {
      type: Object as PropType<CSSProperties>,
      default: undefined,
    },
    creatorRecord: {
      type: [Object, Function] as PropType<Entity | (() => Entity)>,
      default: undefined,
    },
    creatorButtonProps: {
      type: [Object, Boolean] as PropType<
        | false
        | (ButtonProps & {
            creatorButtonText?: string
            position?: 'top' | 'bottom'
          })
      >,
      default: undefined,
    },
    rules: {
      type: [Object, Array, Function] as PropType<ProFormItemType['rules']>,
      default: undefined,
    },
    copyIconProps: {
      type: [Object, String, Boolean] as PropType<
        false | { icon?: string | VNode; tooltipText?: string }
      >,
      default: undefined,
    },
    deleteIconProps: {
      type: [Object, String, Boolean] as PropType<
        false | { icon?: string | VNode; tooltipText?: string }
      >,
      default: undefined,
    },
    actionGuard: {
      type: Object as PropType<{
        beforeAddRow?: (
          creatorRecord: Entity,
          index?: number,
          count?: number,
        ) => boolean | Promise<boolean>
        beforeRemoveRow?: (index: number | number[], count: number) => boolean | Promise<boolean>
      }>,
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
    onAfterAdd: {
      type: Function as PropType<
        (creatorRecord: Entity, insertIndex: number, count: number) => void
      >,
      default: undefined,
    },
    onAfterRemove: {
      type: Function as PropType<(deleteIndex: number | number[], count: number) => void>,
      default: undefined,
    },
  },
  emits: ['after-add', 'after-remvoe'],
  setup(props, { slots }) {
    const { formatItems, formData, prefixCls, readonly } = useInjectForm()
    const listContext = useInjectFormList()
    const mergeReadonly = computed(() =>
      runFunction(props.readonly ?? readonly?.value, formData.value),
    )

    const name = computed(() => {
      if (listContext.listName?.value === undefined) {
        return [props.originName!].flat(1)
      }
      return [listContext.listName.value, props.originName].flat(1)
    })

    const formItemProps = computed(() => runFunction(props.formItemProps, formData.value) ?? {})
    const restItemProps = computed(() =>
      omitUndefined({
        rules: mergeReadonly.value
          ? []
          : runFunction(props.rules ?? formItemProps.value.rules, formData.value),
        ...pickKeys(formItemProps.value, ALL_ANTD_PROP_KEYS),
      }),
    )

    const items = computed(
      () => formatItems?.(runFunction(props.items ?? [], formData.value)) ?? [],
    )

    const slotsGetter = computed(() => {
      const temp = {}
      if (props.title) {
        temp['label'] = () => <FormTitle title={props.title} tooltip={props.tooltip} />
      }
      return temp
    })

    const onAfterAdd = (...args: [Entity, number, number]) => {
      props.onAfterAdd?.(...args)
    }

    const onAfterRemove = (...args: [number | number[], number]) => {
      props.onAfterRemove?.(...args)
    }

    return () => {
      if (!props.name?.length || !items.value.length) return null
      const rules = props.isValidateList
        ? [
            {
              validator: (rule, value) => {
                if (!value || value.length === 0) {
                  return Promise.reject(new Error(props.emptyListMessage))
                }
                return Promise.resolve()
              },
              required: true,
            },
          ]
        : runFunction(props.rules, formData.value)
      return (
        <FormColWrapper colProps={props.colProps}>
          <div class={`${prefixCls}-list`}>
            <Form.Item
              required={
                mergeReadonly.value
                  ? false
                  : restItemProps.value?.rules?.some((rule) => rule.required)
              }
              name={rules?.length ? (name.value as any) : undefined}
              rules={!mergeReadonly.value ? rules : undefined}
              {...restItemProps.value}
              v-slots={slotsGetter.value}
            >
              <FormListContainer
                name={props.name}
                originName={props.originName}
                title={props.title}
                rowTitle={props.rowTitle}
                rowTitleStyle={props.rowTitleStyle}
                tooltip={props.tooltip}
                rowProps={props.rowProps}
                initialValue={props.initialValue}
                convertValue={props.convertValue}
                transform={props.transform}
                items={items.value}
                min={props.min}
                max={props.max}
                readonly={mergeReadonly.value}
                alwaysShowItemLabel={props.alwaysShowItemLabel}
                alwaysShowRowTitle={props.alwaysShowRowTitle}
                creatorRecord={props.creatorRecord}
                creatorButtonProps={props.creatorButtonProps}
                copyIconProps={props.copyIconProps}
                deleteIconProps={props.deleteIconProps}
                actionGuard={props.actionGuard}
                onAfterAdd={onAfterAdd}
                onAfterRemove={onAfterRemove}
                v-slots={{
                  ...slots,
                }}
              />
            </Form.Item>
          </div>
        </FormColWrapper>
      )
    }
  },
})
