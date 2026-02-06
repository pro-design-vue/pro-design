import {
  cloneDeep,
  cloneElement,
  isValidElement,
  type ProFormInstance,
  type ProVNode,
  type SearchTransformKeyFn,
} from '@pro-design-vue/utils'
import type { NamePath } from 'ant-design-vue/es/form/interface'
import type { FormListFieldData, FormListOperation } from '../../type'
import { Tooltip, type ButtonProps } from 'ant-design-vue'
import { computed, defineComponent, onUnmounted, ref, type CSSProperties, type PropType } from 'vue'
import { useContent, useVNodeJSX } from '@pro-design-vue/hooks'
import { useInjectFormList, useProvideFormList } from '../../context/FormListContext'
import { useInjectFormEditOrReadOnly } from '../../context/EditOrReadOnlyContext'
import { useInjectForm } from '../../context/FormContext'
import { CopyOutlined, DeleteOutlined, LoadingOutlined } from '@ant-design/icons-vue'
import { useIntl } from '@pro-design-vue/components/config-provider'
import { useInjectGrid } from '../../context/GridContext'

export type IconConfig = {
  /**
   * 新的icon的组件，我们会将其实例化
   */
  icon?: ProVNode
  /**
   * tooltip 的提示文案
   */
  tooltipText?: string
}

export type FormListListListMete = {
  name: NamePath
  field: FormListFieldData
  fields: FormListFieldData[]
  index: number
  operation: FormListOperation
  record: Record<string, any>
}

export type FormListActionGuard = {
  /**
   * @name 添加行之前的钩子，返回false，会阻止这个行为
   *
   * @example 阻止新增 beforeAddRow={()=> return false}
   */
  beforeAddRow?: (
    ...params: [...Parameters<FormListOperation['add']>, number]
  ) => boolean | Promise<boolean>
  /**
   * @name 删除行之前的钩子，返回false，会阻止这个行为
   *
   * @example 阻止删除 beforeAddRow={()=> return false}
   */
  beforeRemoveRow?: (
    ...params: [...Parameters<FormListOperation['remove']>, number]
  ) => boolean | Promise<boolean>
}

export type ProFromListCommonProps = {
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
  /**
   * @name 自定义新增按钮的配置
   * @example 设置按钮到顶部
   * creatorButtonProps={{position:"top"}}
   * @example 不显示按钮
   * creatorButtonProps={false}
   * @example 自定义按钮文案
   * creatorButtonProps={{creatorButtonText:"新增一行到底部"}}
   * @example 设置按钮类型
   * creatorButtonProps={{type:"primary"}}
   */
  creatorButtonProps?:
    | false
    | (ButtonProps & {
        creatorButtonText?: ProVNode
        position?: 'top' | 'bottom'
      })
  /**
   * @name 复制按钮的配置
   * @description 可以自定义复制按钮的文案，图标，tooltip，设置为 false 就会消失
   * @type {IconConfig|false}
   */
  copyIconProps?: IconConfig | false
  /**
   * @name 删除按钮的配置
   * @description 可以自定义删除按钮的文案，图标，tooltip，设置为 false 就会消失
   * @type {IconConfig|false}
   */
  deleteIconProps?: IconConfig | false

  /**
   * @name 新建增加的默认数据
   * @description 如果是个每次新增数据都会调用这个函数，返回一个默认的数据
   *
   * @example 新建的时候自动生成默认值
   * creatorRecord={{ age: 18}}
   * @example 每次生成新的数据都会生成 id
   * creatorRecord={()=>{ id: crypto.randomUUID()}}
   */
  creatorRecord?: Record<string, any> | (() => Record<string, any>)

  /**
   * @name 自定义操作按钮
   *
   * @example 删除按钮
   * actionRender:(field,action)=><a onClick={()=>action.remove(field.name)}>删除</a>
   * @example 最多只能新增三行
   * actionRender:(f,action,_,count)=><a onClick={()=>
   *   count>2?alert("最多三行！"):action.add({id:"xx"})}>删除
   * </a>
   */
  actionRender?: (params: {
    field: FormListFieldData
    /**
     * 操作能力
     * @example  action.add(data) 新增一行
     * @example  action.remove(index) 删除一行
     * @example  action.move(formIndex,targetIndex) 移动一行
     */
    action: FormListOperation
    /**
     * 默认的操作dom
     * [复制，删除]
     */
    defaultActionDom: ProVNode[]
    /**
     * 当前共有几个列表项
     */
    count: number
  }) => ProVNode[]
  /**
   * @name list 的内容的渲染函数
   *
   * @example 全部包再一个卡片里面
   * itemContainerRender: (doms,listMeta) => <Card title={listMeta.field.name}>{doms}</Card>
   */
  itemContainerRender?: (params: FormListListListMete & { doms: ProVNode }) => ProVNode
  /**
   * @name 自定义Item，可以用来将 action 放到别的地方
   *
   * @example 将每个item放到一个卡片里
   * itemRender: (dom,listMeta) => <Card extra={dom.action}  title={listMeta?.record?.name}>{dom.listDom}</Card>
   */
  itemRender?: (
    params: FormListListListMete & {
      listDom: ProVNode
      actionDom: ProVNode
    },
  ) => ProVNode
  /**
   * @name 总是展示每一行的label
   * @default:false
   */
  alwaysShowItemLabel?: boolean
  /**
   * @name 允许增加的最大条数
   */
  max?: number
  /**
   * @name 允许增加的最少条数，删除时校验
   */
  min?: number
  /**
   * @name 盒子的类名称
   */
  containerClassName?: string
  /**
   * @name 盒子的样式
   */
  containerStyle?: CSSProperties
  /**
   * @name 操作的样式
   */
  actionStyle?: CSSProperties
}

export type ProFormListItemProps = ProFromListCommonProps & {
  formInstance: ProFormInstance
  action: FormListOperation
  actionGuard?: FormListActionGuard
  fields: FormListFieldData[]
  name: NamePath
  originName: NamePath
  fieldExtraRender?: (fieldAction: FormListOperation) => ProVNode
  /** 列表当前条目数量 */
  hideDeleteIcon: boolean
  hideCopyIcon: boolean
  /**
   * 数据新增成功回调
   */
  onAfterAdd?: (...params: [...Parameters<FormListOperation['add']>, number]) => void
  /**
   * 数据移除成功回调
   */
  onAfterRemove?: (...params: [...Parameters<FormListOperation['remove']>, number]) => void

  /** 是否只读模式 */
  readonly: boolean
}

export default defineComponent({
  name: 'ProFormListItem',
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
    min: {
      type: Number,
      default: undefined,
    },
    max: {
      type: Number,
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
    index: {
      type: Number,
      default: undefined,
    },
    fieldName: {
      type: [Number, String],
      default: undefined,
    },
    fieldKey: {
      type: [Number, String],
      default: undefined,
    },
    field: {
      type: Object as PropType<FormListFieldData>,
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
    itemContainerRender: {
      type: Function as PropType<ProFormListItemProps['itemContainerRender']>,
      default: undefined,
    },
    itemRender: {
      type: Function as PropType<ProFormListItemProps['itemRender']>,
      default: undefined,
    },
  },
  setup(props) {
    const { form } = useInjectForm()
    const intl = useIntl()
    const unmountedRef = ref(false)
    const loadingRemove = ref(false)
    const loadingCopy = ref(false)
    const formListField = useInjectFormList()
    const renderContent = useContent()
    const renderVNodeJSX = useVNodeJSX()
    const { grid } = useInjectGrid()
    const { mode } = useInjectFormEditOrReadOnly()

    // const getCurrentRowData = () => {
    //   return form.getFieldValue(
    //     [formListField.listName.value, props.originName, props.index?.toString()]
    //       .flat(1)
    //       .filter((item) => item !== null && item !== undefined),
    //   )
    // }

    // const formListAction = {
    //   getCurrentRowData,
    //   setCurrentRowData: (data: Record<string, any>) => {
    //     const oldTableDate = form?.getFieldsValue?.() || {}
    //     const rowKeyName = [formListField.listName.value, props.originName, props.index?.toString()]
    //       .flat(1)
    //       .filter((item) => item !== null && item !== undefined)
    //     const updateValues = set(oldTableDate, rowKeyName, {
    //       // 只是简单的覆盖，如果很复杂的话，需要自己处理
    //       ...getCurrentRowData(),
    //       ...(data || {}),
    //     })
    //     return form.setFieldsValue(updateValues)
    //   },
    // }

    const childrenArray = computed(() => {
      const children = renderContent('default', 'content')
      return children.map((childrenItem, itemIndex) => {
        if (isValidElement(childrenItem)) {
          return cloneElement(childrenItem, {
            key: childrenItem.key || childrenItem?.props?.name || itemIndex,
            ...(childrenItem?.props || {}),
          })
        }
        return childrenItem
      })
    })

    const copyIcon = computed(() => {
      if (mode?.value === 'read') return null
      /** 复制按钮的配置 */
      if (props.copyIconProps === false || props.hideCopyIcon) return null
      const { tooltipText = intl.getMessage('copyThisLine', '复制此项') } =
        (props.copyIconProps as IconConfig) ?? {}
      return (
        <Tooltip title={tooltipText} key="copy">
          {loadingCopy.value ? (
            <LoadingOutlined />
          ) : (
            <CopyOutlined
              class={`${props.prefixCls}-action-icon action-copy`}
              onClick={async () => {
                loadingCopy.value = true
                const row = form?.getFieldValue(
                  [formListField.listName?.value, props.originName, props.fieldName]
                    .filter((item) => item !== undefined)
                    .flat(1),
                )
                await props.action?.add(cloneDeep(row))
                loadingCopy.value = false
              }}
            />
          )}
        </Tooltip>
      )
    })

    const deleteIcon = computed(() => {
      if (mode?.value === 'read') return null
      if (props.deleteIconProps === false || props.hideDeleteIcon) return null
      const { tooltipText = intl.getMessage('deleteThisLine', '删除此项') } =
        props.deleteIconProps ?? {}
      return (
        <Tooltip title={tooltipText} key="delete">
          {loadingRemove.value ? (
            <LoadingOutlined />
          ) : (
            <DeleteOutlined
              class={`${props.prefixCls}-action-icon action-remove`}
              onClick={async () => {
                loadingRemove.value = true
                await props.action?.remove(props.fieldName as any)
                if (!unmountedRef.value) {
                  loadingRemove.value = false
                }
              }}
            />
          )}
        </Tooltip>
      )
    })

    const defaultActionDom = computed(() =>
      [copyIcon.value, deleteIcon.value].filter((item) => item !== null && item !== undefined),
    )

    const options = computed(() => ({
      name: props.name,
      field: {
        name: props.fieldName,
        key: props.fieldKey,
      },
      index: props.index,
      record: form?.getFieldValue?.(
        [formListField.listName?.value, props.originName, props.fieldName]
          .filter((item) => item !== undefined)
          .flat(1),
      ),
      fields: props.fields,
      operation: props.action,
    }))

    useProvideFormList({
      listName: computed(() =>
        [formListField.listName?.value, props.originName, props.fieldName]
          .filter((item) => item !== undefined)
          .flat(1),
      ),
      name: computed(() => props.fieldName),
      key: computed(() => props.fieldKey),
    })

    onUnmounted(() => {
      unmountedRef.value = true
    })

    return () => {
      const actions =
        renderVNodeJSX('actionRender', {
          slotFirst: true,
          props,
          params: {
            field: {
              name: props.fieldName,
              key: props.fieldKey,
            },
            action: props.action,
            defaultActionDom: defaultActionDom.value,
            // count: props.count,
          },
        }) ?? defaultActionDom.value
      const dom =
        actions.length > 0 && mode?.value !== 'read' ? (
          <div class={`${props.prefixCls}-action`} style={props.actionStyle}>
            {actions}
          </div>
        ) : null

      const itemContainer =
        renderVNodeJSX('itemContainerRender', {
          slotFirst: true,
          props,
          params: {
            ...options.value,
            doms: childrenArray.value,
          },
        }) ?? childrenArray.value

      const contentDom = renderVNodeJSX('itemRender', {
        slotFirst: true,
        props,
        params: {
          ...options.value,
          actionDom: dom,
          listDom: (
            <div
              class={[`${props.prefixCls}-container`, props.containerClassName]}
              style={{
                width: grid?.value ? '100%' : undefined,
                ...props.containerStyle,
              }}
            >
              {itemContainer}
            </div>
          ),
        },
      })
      if (contentDom) {
        return contentDom
      }
      return (
        <div
          class={[
            `${props.prefixCls}-item`,
            {
              [`${props.prefixCls}-item-default`]: props.alwaysShowItemLabel === undefined,
              [`${props.prefixCls}-item-show-label`]: !!props.alwaysShowItemLabel,
            },
          ]}
          style={{
            display: 'flex',
            alignItems: 'flex-end',
          }}
        >
          <div
            class={[`${props.prefixCls}-container`, props.containerClassName]}
            style={{
              width: grid?.value ? '100%' : undefined,
              ...props.containerStyle,
            }}
          >
            {itemContainer}
          </div>
          {dom}
        </div>
      )
    }
  },
})
