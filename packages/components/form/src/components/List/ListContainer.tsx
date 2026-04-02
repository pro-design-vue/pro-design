/*
 * @Author: shen
 * @Date: 2023-08-08 14:51:29
 * @LastEditors: shen
 * @LastEditTime: 2026-02-26 09:45:04
 * @Description:
 */
import type { CSSProperties, PropType } from 'vue'
import type { FormListFieldData, FormListOperation } from '../../type'
import type { ProFormListItemProps } from './ListItem'
import {
  computed,
  defineComponent,
  onMounted,
  onRenderTriggered,
  ref,
  shallowRef,
  watch,
  withMemo,
} from 'vue'
import { Button } from 'ant-design-vue'
import { useContent, useVNodeJSX } from '@pro-design-vue/hooks'
import { differenceBy, omit, runFunction, type ProVNode } from '@pro-design-vue/utils'
import { useIntl } from '@pro-design-vue/components/config-provider'
import { useInjectFormEditOrReadOnly } from '../../context/EditOrReadOnlyContext'
import { PlusOutlined } from '@ant-design/icons-vue'
import ProFormListItem from './ListItem'

export default defineComponent({
  name: 'ProFormListContainer',
  inheritAttrs: false,
  props: {
    name: {
      type: [String, Number, Array] as PropType<ProFormListItemProps['name']>,
      default: undefined,
    },
    originName: {
      type: [String, Number, Array] as PropType<ProFormListItemProps['originName']>,
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
    prefixCls: {
      type: String,
      default: undefined,
    },
    fields: {
      type: Array as PropType<FormListFieldData[]>,
      default: undefined,
    },
    alwaysShowItemLabel: {
      type: Boolean,
      default: undefined,
    },
    action: {
      type: Object as PropType<FormListOperation>,
      default: undefined,
    },
    creatorRecord: {
      type: [Object, Function] as PropType<ProFormListItemProps['creatorRecord']>,
      default: undefined,
    },
    creatorButtonProps: {
      type: [Object, Boolean] as PropType<ProFormListItemProps['creatorButtonProps']>,
      default: undefined,
    },
    copyIconProps: {
      type: [Object, String, Boolean] as PropType<ProFormListItemProps['copyIconProps']>,
      default: undefined,
    },
    deleteIconProps: {
      type: [Object, String, Boolean] as PropType<ProFormListItemProps['deleteIconProps']>,
      default: undefined,
    },
    actionGuard: {
      type: Object as PropType<ProFormListItemProps['actionGuard']>,
      default: undefined,
    },
    containerClassName: {
      type: String,
      default: undefined,
    },
    actionRender: {
      type: Function as PropType<ProFormListItemProps['actionRender']>,
      default: undefined,
    },
    containerStyle: {
      type: Object as PropType<ProFormListItemProps['containerStyle']>,
      default: undefined,
    },
    actionStyle: {
      type: Object as PropType<ProFormListItemProps['actionStyle']>,
      default: undefined,
    },
    hideDeleteIcon: {
      type: Boolean,
      default: undefined,
    },
    hideCopyIcon: {
      type: Boolean,
      default: undefined,
    },
    itemContainerRender: {
      type: Function as PropType<ProFormListItemProps['itemContainerRender']>,
      default: undefined,
    },
    itemRender: {
      type: Function as PropType<ProFormListItemProps['itemRender']>,
      default: undefined,
    },
    fieldExtraRender: {
      type: Function as PropType<ProFormListItemProps['fieldExtraRender']>,
      default: undefined,
    },
    onAfterAdd: {
      type: Function as PropType<ProFormListItemProps['onAfterAdd']>,
      default: undefined,
    },
    onAfterRemove: {
      type: Function as PropType<ProFormListItemProps['onAfterRemove']>,
      default: undefined,
    },
  },
  setup(props, { slots }) {
    const loading = ref(false)
    const intl = useIntl()
    // const itemList = ref<any[]>([])
    // const fieldKeyMap = shallowRef(new Map<string, string>())
    const renderVNodeJSX = useVNodeJSX()
    const renderContent = useContent()
    const { mode } = useInjectFormEditOrReadOnly()
    const wrapperAction = shallowRef<FormListOperation>()
    // const uuidFields = computed(() => {
    //   return (
    //     props.fields?.map((field) => {
    //       if (!fieldKeyMap.value?.has(field.key.toString())) {
    //         fieldKeyMap.value?.set(field.key.toString(), buildShortUUID())
    //       }
    //       const uuid = fieldKeyMap.value?.get(field.key.toString())
    //       return {
    //         ...field,
    //         uuid,
    //       }
    //     }) ?? []
    //   )
    // })

    /**
     * 根据行为守卫包装action函数
     */
    const getWrapperAction = () => {
      const wrapAction = { ...props.action }
      const count = props.fields?.length || 0

      if (props.actionGuard?.beforeAddRow) {
        wrapAction.add = async (...rest) => {
          const success = await props.actionGuard?.beforeAddRow!(...rest, count)
          if (success) {
            const res = props.action?.add(...rest)
            props.onAfterAdd?.(...rest, count + 1)
            return res
          }
          return false
        }
      } else {
        wrapAction.add = async (...rest) => {
          const res = props.action?.add(...rest)
          props.onAfterAdd?.(...rest, count + 1)
          return res
        }
      }

      if (props.actionGuard?.beforeRemoveRow) {
        wrapAction.remove = async (...rest) => {
          const success = await props.actionGuard?.beforeRemoveRow!(...rest, count)
          if (success) {
            const res = props.action?.remove(...rest)
            props.onAfterRemove?.(...rest, count - 1)
            return res
          }
          return false
        }
      } else {
        wrapAction.remove = async (...rest) => {
          const res = props.action?.remove(...rest)
          props.onAfterRemove?.(...rest, count - 1)
          return res
        }
      }

      return wrapAction
    }

    const creatorButton = computed(() => {
      if (props.creatorButtonProps === false || props.fields?.length === props.max) return null
      const {
        position = 'bottom',
        creatorButtonText = intl.getMessage('editableTable.action.add', '添加一行数据'),
      } = props.creatorButtonProps || {}
      return (
        <Button
          class={`${props.prefixCls}-creator-button-${position}`}
          type="dashed"
          loading={loading.value}
          block
          icon={<PlusOutlined />}
          {...omit(props.creatorButtonProps || {}, ['position', 'creatorButtonText'])}
          onClick={async () => {
            loading.value = true
            // 如果不是从顶部开始添加，则插入的索引为当前行数
            let index = props.fields?.length
            // 如果是顶部，加到第一个，如果不是，为空就是最后一个
            if (position === 'top') index = 0
            await wrapperAction.value?.add?.(runFunction(props.creatorRecord) ?? {}, index)
            loading.value = false
          }}
        >
          {creatorButtonText}
        </Button>
      )
    })

    const defaultStyle = computed<CSSProperties>(() => ({
      width: 'max-content',
      maxWidth: '100%',
      minWidth: '100%',
      ...props.containerStyle,
    }))

    const genFieldItem = (field) => {
      const children = renderContent('default', 'content')
      return (
        <ProFormListItem
          {...omit(props, ['action', 'fields', 'fieldExtraRender', 'onAfterAdd', 'onAfterRemove'])}
          key={field.key}
          fieldName={field.name}
          fieldKey={field.key}
          index={field.name}
          action={wrapperAction.value as FormListOperation}
          v-slots={slots}
        >
          {children}
        </ProFormListItem>
      )
    }

    // watch(
    //   () => props.fields,
    //   (newFields, oldFields) => {
    //     console.log('🚀 ~ watch ~ oldFields:', oldFields)
    //     console.log('🚀 ~ watch ~ newFields:', newFields)
    //     const deleted = differenceBy(oldFields ?? [], newFields ?? [], 'key')
    //     const added = differenceBy(newFields ?? [], oldFields ?? [], 'key')
    //     console.log('🚀 ~ setup ~ deleted:', deleted)
    //     console.log('🚀 ~ setup ~ deleted:', added)
    //     if (!!added?.length) {
    //       added.forEach((add) => {
    //         itemList.value.splice(add.name + 1, 0, genFieldItem(add))
    //       })
    //     }
    //   },
    // )

    const itemList = computed(() => {
      const children = renderContent('default', 'content')
      return props.fields?.map((field, index) =>
        withMemo(
          [field.key],
          () => (
            <ProFormListItem
              {...omit(props, [
                'action',
                'fields',
                'fieldExtraRender',
                'onAfterAdd',
                'onAfterRemove',
              ])}
              key={field.key}
              fieldName={field.name}
              fieldKey={field.key}
              index={index}
              action={wrapperAction.value as FormListOperation}
              v-slots={slots}
            >
              {children}
            </ProFormListItem>
          ),
          [],
          0,
        ),
      )
    })

    watch(
      () => props.actionGuard,
      () => {
        wrapperAction.value = getWrapperAction() as any
      },
    )

    onMounted(() => {
      wrapperAction.value = getWrapperAction() as any
    })

    // 调试哪些属性触发了更新
    // onRenderTriggered((e) => {
    //   console.log('组件更新被触发:', e)
    //   // 在此处使用 debugger，可以查看 e.key, e.target, e.type
    //   // debugger
    // })

    return () => {
      // console.log('ListContainer')
      if (mode?.value === 'read' || props.readonly === true) {
        return <>{itemList.value}</>
      }
      const fieldExtraRender = renderVNodeJSX('fieldExtraRender', {
        slotFirst: true,
        props,
        params: wrapperAction.value as FormListOperation,
      })
      return (
        <div style={defaultStyle.value} class={props.containerClassName}>
          {props.creatorButtonProps !== false &&
            props.creatorButtonProps?.position === 'top' &&
            creatorButton.value}
          {itemList.value}
          {fieldExtraRender}
          {props.creatorButtonProps !== false &&
            props.creatorButtonProps?.position !== 'top' &&
            creatorButton.value}
        </div>
      )
    }
  },
})
