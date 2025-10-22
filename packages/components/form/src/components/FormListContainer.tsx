/*
 * @Author: shen
 * @Date: 2023-08-09 10:36:49
 * @LastEditors: shen
 * @LastEditTime: 2025-10-22 11:05:56
 * @Description:
 */
import type { ButtonProps } from 'ant-design-vue'
import type { CSSProperties, PropType, VNode } from 'vue'
import type { Entity, ProFormItemType } from '../type'

import { computed, defineComponent, ref, shallowRef, watch } from 'vue'
import { Form, Button } from 'ant-design-vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import { useInjectForm } from '../context/FormContext'
import { useFieldValue } from '../hooks/useFieldValue'
import { RenderVNode, cloneDeep, isEqual, omit, runFunction } from '@pro-design-vue/utils'

import FormListItem from './FormListItem'

export interface ListOperations {
  add: (defaultValue: Entity, index?: number) => Promise<boolean>
  remove: (index: number | number[]) => Promise<boolean>
}
export default defineComponent({
  name: 'FormListContainer',
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
    readonly: {
      type: Boolean,
      default: undefined,
    },
    rowProps: {
      type: Object as PropType<ProFormItemType['rowProps']>,
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
      default: undefined,
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
    const loading = ref(false)
    const listValues = ref<Entity[]>([])
    const { prefixCls } = useInjectForm()
    const keyRef = shallowRef<{ keys: number[]; id: number }>({
      keys: [],
      id: 0,
    })
    const { fieldValue, onValueChange } = useFieldValue<any>({
      namePath: computed(() => props.name!),
      initialValue: props.initialValue,
      convertValue: props.convertValue,
      transform: props.transform,
    })
    const formItemContext = Form.useInjectFormItemContext()
    const count = computed(() => fieldValue.value?.length ?? 0)

    const action: ListOperations = {
      add: async (defaultValue: Entity, index?: number) => {
        if (props.actionGuard?.beforeAddRow) {
          const success = await props.actionGuard?.beforeAddRow(defaultValue, index, count.value)
          if (!success) {
            return false
          }
        }
        const newValue: Entity[] = cloneDeep(fieldValue.value ?? [])
        if (index !== undefined && index >= 0 && index <= newValue.length) {
          keyRef.value.keys = [
            ...keyRef.value.keys.slice(0, index),
            keyRef.value.id,
            ...keyRef.value.keys.slice(index),
          ]
          onValueChange(
            cloneDeep([...newValue.slice(0, index), defaultValue, ...newValue.slice(index)]),
          )
          formItemContext.onFieldChange()
        } else {
          keyRef.value.keys = [...keyRef.value.keys, keyRef.value.id]
          onValueChange(cloneDeep([...newValue, defaultValue]))
          formItemContext.onFieldChange()
        }
        keyRef.value.id += 1
        Promise.resolve().then(() => {
          props.onAfterAdd?.(defaultValue, index!, count.value)
        })
        return true
      },
      remove: async (index: number | number[]) => {
        if (props.actionGuard?.beforeRemoveRow) {
          const success = await props.actionGuard?.beforeRemoveRow(index, count.value)
          if (!success) {
            return false
          }
        }
        const newValue: Entity[] = cloneDeep(fieldValue.value ?? [])
        const indexSet = new Set(Array.isArray(index) ? index : [index])

        if (indexSet.size <= 0) {
          return false
        }
        keyRef.value.keys = keyRef.value.keys.filter((_, keysIndex) => !indexSet.has(keysIndex))
        const value = newValue.filter((_, valueIndex) => !indexSet.has(valueIndex))
        onValueChange(value)
        formItemContext.onFieldChange()
        Promise.resolve().then(() => {
          props.onAfterRemove?.(index, count.value)
        })
        return true
      },
    }

    const onAdd = async () => {
      if (props.creatorButtonProps !== false) {
        loading.value = true
        let index = count.value
        if (props.creatorButtonProps?.position === 'top') index = 0
        await action.add(cloneDeep(runFunction(props.creatorRecord) || {}), index)
        loading.value = false
      }
    }

    const onRemove = async (index: number) => {
      await action.remove(index)
    }

    const onCopy = async (index: number) => {
      await action.add(cloneDeep(fieldValue.value[index]), count.value + 1)
    }

    watch(
      fieldValue,
      () => {
        if (!isEqual(listValues.value, fieldValue.value)) {
          listValues.value = cloneDeep(fieldValue.value ?? [])
        }
      },
      {
        immediate: true,
      },
    )
    const creatorButton = computed(() => {
      if (props.readonly || props.creatorButtonProps === false || count.value === props.max)
        return null
      const { position = 'bottom', creatorButtonText = '添加一行数据' } =
        props.creatorButtonProps ?? {}
      const {
        block = true,
        type = 'dashed',
        ...restProps
      } = omit(props.creatorButtonProps ?? {}, ['position', 'creatorButtonText'])
      const defaultDom = (
        <Button
          class={`${prefixCls}-list-creator-button-${position}`}
          type={type}
          block={block}
          icon={<PlusOutlined />}
          {...restProps}
          loading={loading.value}
          onClick={onAdd}
        >
          {creatorButtonText}
        </Button>
      )
      if (slots.creator) {
        return (
          <RenderVNode
            vnode={slots.creator}
            props={{ defaultDom, add: action.add, count: count.value }}
          />
        )
      }
      return defaultDom
    })

    return () => {
      if (props.readonly && !listValues.value?.length) {
        listValues.value = [{}]
      }
      return (
        <div
          style="width: max-content; max-width: 100%; min-width: 100%; "
          class={{
            [`${prefixCls}-list-container`]: true,
            [`${prefixCls}-list-empty`]: (fieldValue.value ?? [])?.length == 0,
          }}
        >
          {props.creatorButtonProps !== false &&
            props.creatorButtonProps?.position === 'top' &&
            creatorButton.value}
          {(listValues.value ?? []).map((record, index) => {
            let key = keyRef.value.keys[index]
            if (key === undefined) {
              keyRef.value.keys[index] = keyRef.value.id
              key = keyRef.value.keys[index]
              keyRef.value.id += 1
            }
            return (
              <FormListItem
                key={key}
                fieldKey={key}
                originName={props.originName}
                index={index}
                items={props.items as any}
                rowProps={props.rowProps}
                min={props.min}
                max={props.max}
                count={count.value}
                record={record}
                title={props.title}
                rowTitle={props.rowTitle}
                rowTitleStyle={props.rowTitleStyle}
                alwaysShowItemLabel={props.alwaysShowItemLabel}
                alwaysShowRowTitle={props.alwaysShowRowTitle}
                copyIconProps={props.copyIconProps}
                deleteIconProps={props.deleteIconProps}
                action={action}
                readonly={props.readonly}
                v-slots={{
                  action: slots.action,
                  item: slots.item,
                }}
                onRemove={onRemove}
                onCopy={onCopy}
              />
            )
          })}
          {props.creatorButtonProps !== false &&
            (props.creatorButtonProps?.position === 'bottom' ||
              props.creatorButtonProps?.position === undefined) &&
            creatorButton.value}
        </div>
      )
    }
  },
})
