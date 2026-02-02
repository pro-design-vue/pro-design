/*
 * @Author: shen
 * @Date: 2023-08-08 14:51:29
 * @LastEditors: shen
 * @LastEditTime: 2026-01-27 09:00:13
 * @Description:
 */
import type { CSSProperties, PropType } from 'vue'
import type { FormListOperation } from '../../type'
import type { FormListActionGuard, ProFormListItemProps, ProFromListCommonProps } from './ListItem'
import { computed, defineComponent, watchEffect } from 'vue'
import { Form, Tooltip, type ButtonProps, type ColProps, type TooltipProps } from 'ant-design-vue'
import { useInjectField } from '../../context/FieldContext'
import { useContent, usePrefixCls, useVNodeJSX } from '@pro-design-vue/hooks'
import { useInjectForm } from '../../context/FormContext'
import { isDeepEqual, isString, type Entity, type ProVNode } from '@pro-design-vue/utils'
import { useIntl } from '@pro-design-vue/components/config-provider'
import { useInjectFormList } from '../../context/FormListContext'

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
    alwaysShowItemLabel: {
      type: Boolean,
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
  setup(props, { slots, attrs, expose }) {
    const { store, form } = useInjectForm()
    const formListField = useInjectFormList()
    const intl = useIntl()
    const prefixCls = usePrefixCls('form-list-container')
    const renderVNodeJSX = useVNodeJSX()
    const renderContent = useContent()

    return () => {
      return <div>aa</div>
    }
  },
})
