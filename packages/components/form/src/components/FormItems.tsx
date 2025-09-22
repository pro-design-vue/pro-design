/*
 * @Author: shen
 * @Date: 2023-08-09 16:52:17
 * @LastEditors: shen
 * @LastEditTime: 2025-09-22 13:41:34
 * @Description:
 */
import type { PropType } from 'vue'
import type { ProFormItemType } from '../type'

import { computed, defineAsyncComponent, defineComponent } from 'vue'
import { Space } from 'ant-design-vue'
import { useInjectForm } from '../context/FormContext'
import { ProFieldType } from '../fieldType'
import { useInjectSlots } from '../context/FormSlotsContext'
import { omitUndefined, pickKeys, RenderVNode } from '@pro-design-vue/utils'

import getSlot from '../utils/getSlot'
// import FormGroup from './FormGroup'
// import FormSet from './FormSet'
// import FormList from './FormList'
// import FormItem from './FormItem'

const FormGroup = defineAsyncComponent(() => import('./FormGroup'))
const FormSet = defineAsyncComponent(() => import('./FormSet'))
const FormList = defineAsyncComponent(() => import('./FormList'))
const FormItem = defineAsyncComponent(() => import('./FormItem'))

const LIST_PROP_KEYS = [
  'min',
  'max',
  'isValidateList',
  'emptyListMessage',
  'creatorRecord',
  'creatorButtonProps',
  'alwaysShowItemLabel',
  'actionGuard',
  'copyIconProps',
  'deleteIconProps',
  'onAfterAdd',
  'onAfterRemove',
]

const LIST_SLOT_NAMES = ['action', 'creator', 'item']

export default defineComponent({
  name: 'FormItems',
  inheritAttrs: false,
  props: {
    list: {
      type: Array as PropType<ProFormItemType[]>,
      default: () => [],
    },
    type: {
      type: String as PropType<'space' | ''>,
      default: '',
    },
    grid: {
      type: Boolean,
      default: undefined,
    },
    spaceProps: {
      type: Object as PropType<ProFormItemType['spaceProps']>,
      default: () => {
        return { size: [32, 0], wrap: true }
      },
    },
  },
  setup(props) {
    const { grid, allHiddenKeys } = useInjectForm()
    const formSlotsContext = useInjectSlots()
    const mergeGrid = computed(() => props.grid ?? grid?.value)
    const getItemsDom = computed(() => {
      return props.list
        .filter((item) => !allHiddenKeys.value.includes(item.key as string))
        .map((item) => {
          if (item.fieldType === ProFieldType.GROUP) {
            return (
              <FormGroup
                key={item.key}
                items={item.children}
                title={item.title}
                tooltip={item.tooltip}
                colProps={item.colProps}
                rowProps={item.rowProps}
                spaceProps={item.spaceProps}
                grid={item.grid}
                item={item}
                formItemProps={item.formItemProps}
              />
            )
          }
          if (item.fieldType === ProFieldType.FORM_SET) {
            return (
              <FormSet
                key={item.key}
                name={item.name}
                items={item.children}
                title={item.title}
                tooltip={item.tooltip}
                colProps={item.colProps}
                rowProps={item.rowProps}
                spaceProps={item.spaceProps}
                formItemProps={item.formItemProps}
                initialValue={item.initialValue}
                convertValue={item.convertValue}
                transform={item.transform}
              />
            )
          }
          if (item.fieldType === ProFieldType.FORM_LIST) {
            const fieldProps = omitUndefined(pickKeys(item.fieldProps ?? {}, LIST_PROP_KEYS))
            const slotsGetter = {}
            LIST_SLOT_NAMES.forEach((name) => {
              const slot = getSlot(item.fieldProps?.[`${name}Render`], formSlotsContext)
              if (slot) {
                slotsGetter[name] = (args) => <RenderVNode vnode={slot} props={args} />
              }
            })
            return (
              <FormList
                key={item.key}
                name={item.name}
                originName={item.originName}
                items={item.children}
                title={item.title}
                tooltip={item.tooltip}
                rules={item.rules}
                colProps={item.colProps}
                rowProps={item.rowProps}
                formItemProps={item.formItemProps}
                initialValue={item.initialValue}
                convertValue={item.convertValue}
                transform={item.transform}
                {...fieldProps}
                v-slots={{ ...slotsGetter }}
              />
            )
          }
          return <FormItem key={item.key} item={item} grid={mergeGrid.value} />
        })
    })

    return () => {
      if (props.type === 'space' && !mergeGrid?.value) {
        return (
          <Space {...props.spaceProps} align="start">
            {getItemsDom.value}
          </Space>
        )
      }
      return getItemsDom.value
    }
  },
})
