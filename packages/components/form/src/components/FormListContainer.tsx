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
import { Button, Form } from 'ant-design-vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import { useInjectForm } from '../context/FormContext'
import { useFieldValue } from '../hooks/useFieldValue'
import { RenderVNode, cloneDeep, omit, runFunction } from '@pro-design-vue/utils'

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
    const { prefixCls } = useInjectForm()
    const formItemContext = Form.useInjectFormItemContext()
    const keyRef = shallowRef<{ keys: number[]; id: number }>({
      keys: [],
      id: 0,
    })
    // action 操作（add/remove）会手动维护 keyRef，通过版本号让 watcher 跳过
    let lastActionVersion = 0
    let watchedActionVersion = 0
    const { fieldValue, onValueChange } = useFieldValue<any>({
      namePath: computed(() => props.name!),
      initialValue: props.initialValue,
      convertValue: props.convertValue,
      transform: props.transform,
    })
    const count = computed(() => fieldValue.value?.length ?? 0)

    const action: ListOperations = {
      add: async (defaultValue: Entity, index?: number) => {
        if (props.actionGuard?.beforeAddRow) {
          const success = await props.actionGuard?.beforeAddRow(defaultValue, index, count.value)
          if (!success) {
            return false
          }
        }
        const newValue: Entity[] = fieldValue.value ? [...fieldValue.value] : []
        if (index !== undefined && index >= 0 && index <= newValue.length) {
          keyRef.value = {
            keys: [
              ...keyRef.value.keys.slice(0, index),
              keyRef.value.id,
              ...keyRef.value.keys.slice(index),
            ],
            id: keyRef.value.id + 1,
          }
          onValueChange([...newValue.slice(0, index), defaultValue, ...newValue.slice(index)])
        } else {
          keyRef.value = {
            keys: [...keyRef.value.keys, keyRef.value.id],
            id: keyRef.value.id + 1,
          }
          onValueChange([...newValue, defaultValue])
        }
        lastActionVersion++
        formItemContext.onFieldChange()
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
        const newValue: Entity[] = fieldValue.value ? [...fieldValue.value] : []
        const indexSet = new Set(Array.isArray(index) ? index : [index])

        if (indexSet.size <= 0) {
          return false
        }
        keyRef.value = {
          keys: keyRef.value.keys.filter((_, keysIndex) => !indexSet.has(keysIndex)),
          id: keyRef.value.id,
        }
        onValueChange(newValue.filter((_, valueIndex) => !indexSet.has(valueIndex)))
        lastActionVersion++
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

    // add/remove 操作会手动维护 keyRef，此 watcher 只处理外部数据变化（如 reset、initialValues 变化）
    watch(
      fieldValue,
      (newVal, oldVal) => {
        // add/remove 已经同步更新了 keyRef 和 lastActionVersion
        // watcher 异步触发时检查版本号，如果变了说明是 action 操作，跳过
        if (lastActionVersion !== watchedActionVersion) {
          watchedActionVersion = lastActionVersion
          return
        }
        const len = newVal?.length ?? 0
        const keysLen = keyRef.value.keys.length
        if (keysLen !== len) {
          const newKeys: number[] = []
          for (let i = 0; i < len; i++) {
            newKeys.push(keyRef.value.keys[i] ?? keyRef.value.id++)
          }
          keyRef.value = { keys: newKeys, id: keyRef.value.id }
        } else if (newVal !== oldVal) {
          // 长度相同但引用变了（reset 场景）：强制生成全新 key，销毁重建子组件
          const newKeys: number[] = []
          for (let i = 0; i < len; i++) {
            newKeys.push(keyRef.value.id++)
          }
          keyRef.value = { keys: newKeys, id: keyRef.value.id }
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
      const listData = props.readonly && !fieldValue.value?.length
        ? [{}]
        : (fieldValue.value ?? [])
      return (
        <div
          style="width: max-content; max-width: 100%; min-width: 100%; "
          class={{
            [`${prefixCls}-list-container`]: true,
            [`${prefixCls}-list-empty`]: listData.length === 0,
          }}
        >
          {props.creatorButtonProps !== false &&
            props.creatorButtonProps?.position === 'top' &&
            creatorButton.value}
          {listData.map((record, index) => {
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
