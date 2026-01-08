/*
 * @Author: shen
 * @Date: 2023-08-09 10:36:49
 * @LastEditors: shen
 * @LastEditTime: 2025-10-22 11:06:14
 * @Description:
 */
import type { CSSProperties, PropType, VNode } from 'vue'
import type { Entity, NamePath, ProFormItemType } from '../type'
import type { ListOperations } from './FormList'

import { computed, defineComponent, ref } from 'vue'
import { CopyOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import { Spin, Tooltip } from 'ant-design-vue'
import { useInjectForm } from '../context/FormContext'
import { useInjectSlots } from '../context/FormSlotsContext'
import { useInjectFormList, useProvideFormList } from '../context/FormListContext'
import { ProFieldType } from '../fieldType'
import { cloneDeep, RenderVNode, runFunction } from '@pro-design-vue/utils'

import getSlot from '../utils/getSlot'
import covertFormName from '../utils/namePath'
import FormRowWrapper from './FormRowWrapper'
import FormItems from './FormItems'

const NOT_ALLOW_FIELD_TYPES = ['formSet', 'divider']

export default defineComponent({
  name: 'FormListItem',
  inheritAttrs: false,
  props: {
    index: {
      type: Number,
      default: 0,
    },
    originName: {
      type: [String, Array] as PropType<ProFormItemType['name']>,
      default: () => [],
    },
    fieldKey: {
      type: Number,
      default: 0,
    },
    title: {
      type: [String, Object, Function] as PropType<ProFormItemType['title']>,
      default: undefined,
    },
    items: {
      type: Array as PropType<ProFormItemType[]>,
      default: () => [],
    },
    readonly: {
      type: Boolean,
      default: undefined,
    },
    rowProps: {
      type: Object as PropType<ProFormItemType['rowProps']>,
      default: undefined,
    },
    copyIconProps: {
      type: [Object, Boolean] as PropType<false | { icon?: string | VNode; tooltipText?: string }>,
      default: undefined,
    },
    deleteIconProps: {
      type: [Object, Boolean] as PropType<false | { icon?: string | VNode; tooltipText?: string }>,
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
    count: {
      type: Number,
      default: 0,
    },
    min: {
      type: Number,
      default: undefined,
    },
    max: {
      type: Number,
      default: undefined,
    },
    record: {
      type: Object as PropType<Entity>,
      default: undefined,
    },
    action: {
      type: Object as PropType<ListOperations>,
      required: true,
    },
    onRemove: {
      type: Function as PropType<(index: number) => Promise<void>>,
      required: true,
    },
    onCopy: {
      type: Function as PropType<(index: number) => Promise<void>>,
      required: true,
    },
  },
  emits: ['remove', 'copy'],
  setup(props, { slots }) {
    const { formatItems, prefixCls, formData, grid } = useInjectForm()
    const listContext = useInjectFormList()
    const formSlotsContext = useInjectSlots()
    const loadingRemove = ref(false)
    const loadingCopy = ref(false)
    const index = computed(() => props.index)
    const listName = computed<Array<string | number>>(
      () =>
        [listContext.listName?.value, props.originName, index.value]
          .filter((item) => item !== undefined)
          .flat(1) as Array<string | number>,
    )

    const listKey = computed(() =>
      [listContext.listKey, covertFormName(props.originName), props.fieldKey]
        .filter((item) => item !== undefined)
        .flat(1)
        .join('_'),
    )

    const formatDependencies = (item: ProFormItemType): NamePath[] => {
      const newDependencies: NamePath[] = []
      item.dependencies?.forEach((dep) => {
        const namePath = covertFormName(dep)
        if (namePath) {
          newDependencies.push(
            [...listName.value, namePath].filter((item) => item !== undefined).flat(1) as NamePath,
          )
        }
      })
      return newDependencies
    }

    const genListItems = (fields: ProFormItemType[]): ProFormItemType[] => {
      return cloneDeep(fields)
        .filter((item) => !NOT_ALLOW_FIELD_TYPES.includes(item.fieldType ?? ''))
        .map((field) => {
          if (field.fieldType === ProFieldType.GROUP) {
            field.children = genListItems(runFunction(field.children ?? [], formData.value) ?? [])
            return field
          }
          const originName = field.originName ?? field.name
          const originKey = field.originKey ?? field.key
          const namePath = covertFormName(field.name)
          const title = index.value === 0 || props.alwaysShowItemLabel ? field.title : undefined
          const item = {
            ...field,
            title,
            originKey,
            key: `${listKey.value}_${field.key ?? namePath?.join('_')}`,
            originName,
            name: [...(listName?.value ?? []), namePath]
              .filter((item) => item !== undefined)
              .flat(1),
          } as ProFormItemType

          if (Array.isArray(field.dependencies) && field.dependencies.length > 0 && field.name) {
            item.dependencies = formatDependencies(item)
          }
          return item
        }) as ProFormItemType[]
    }

    const items = computed(() => {
      const fields = runFunction(props.items ?? [], formData.value) ?? []
      return formatItems?.(genListItems(fields)) ?? []
    })

    const showRowTitle = computed(() => props.alwaysShowRowTitle && props.rowTitle)

    const deleteIcon = computed(() => {
      if (props.readonly || props.deleteIconProps === false || props.min === props.count)
        return null
      const { icon, tooltipText } = props.deleteIconProps ?? {}
      let dom = <DeleteOutlined />
      if (icon) {
        const vnode = getSlot(icon, formSlotsContext)
        dom = <RenderVNode vnode={vnode} props={{ defaultDom: dom }} />
      }
      return (
        <Spin size="small" spinning={loadingRemove.value}>
          <Tooltip title={tooltipText ?? '删除此行'} key="delete">
            <div
              class={`${prefixCls}-list-action-icon ${prefixCls}-list-action-remove`}
              onClick={onRemove}
            >
              {dom}
            </div>
          </Tooltip>
        </Spin>
      )
    })

    const copyIcon = computed(() => {
      if (props.readonly || props.copyIconProps === false || props.max === props.count) return null
      const { icon, tooltipText } = props.copyIconProps ?? {}
      let dom = <CopyOutlined />
      if (icon) {
        const vnode = getSlot(icon, formSlotsContext)
        dom = <RenderVNode vnode={vnode} props={{ defaultDom: dom }} />
      }
      return (
        <Spin size="small" spinning={loadingCopy.value}>
          <Tooltip title={tooltipText ?? '复制此行'} key="copy">
            <div
              class={`${prefixCls}-list-action-icon ${prefixCls}-list-action-copy`}
              onClick={onCopy}
            >
              {dom}
            </div>
          </Tooltip>
        </Spin>
      )
    })

    const onRemove = async () => {
      loadingRemove.value = true
      await props.onRemove(index.value)
      loadingRemove.value = false
    }

    const onCopy = async () => {
      loadingCopy.value = true
      await props.onCopy(index.value)
      loadingCopy.value = false
    }

    useProvideFormList({
      isList: true,
      originName: props.originName,
      index,
      fieldKey: props.fieldKey,
      listName: listName,
      listKey: listKey.value,
      rowData: computed(() => props.record!),
    })
    return () => {
      if (!items.value.length) return null

      const defaultActionDom = (
        <div class={`${prefixCls}-list-action`}>
          {copyIcon.value}
          {deleteIcon.value}
        </div>
      )

      const actionDom = slots.action ? (
        <RenderVNode
          vnode={slots.action}
          props={{
            index: index.value,
            action: props.action,
            defaultDom: defaultActionDom,
            record: props.record ?? {},
          }}
        />
      ) : (
        defaultActionDom
      )

      const itemDom = (
        <div
          class={`${prefixCls}-list-item-container`}
          style={{ width: grid?.value ? '100%' : undefined }}
        >
          <FormRowWrapper rowProps={props.rowProps}>
            <FormItems list={items.value}></FormItems>
          </FormRowWrapper>
        </div>
      )

      if (slots.item) {
        return (
          <RenderVNode
            vnode={slots.item}
            props={{ listDom: itemDom, actionDom, record: props.record ?? {} }}
          />
        )
      }
      return (
        <div class={`${prefixCls}-list-item-wrapper`}>
          {showRowTitle.value && (
            <div class={`${prefixCls}-list-item-title`}>
              <div style={props.rowTitleStyle}>
                {props.rowTitle}
                {props.index + 1}
              </div>
              {actionDom}
            </div>
          )}
          <div class={`${prefixCls}-list-item`} style="display: flex; align-items: flex-end;">
            {itemDom}
            {!showRowTitle.value && actionDom}
          </div>
        </div>
      )
    }
  },
})
