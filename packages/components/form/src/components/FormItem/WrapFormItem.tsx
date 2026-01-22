/*
 * @Author: shen
 * @Date: 2023-08-09 10:36:49
 * @LastEditors: shen
 * @LastEditTime: 2026-01-21 11:07:04
 * @Description:
 */
import type { PropType } from 'vue'

import { computed, defineComponent } from 'vue'
import { Form, Tooltip } from 'ant-design-vue'
import {
  isString,
  merge,
  omit,
  omitUndefined,
  type ProFieldMode,
  type ProVNode,
} from '@pro-design-vue/utils'
import { formItemProps } from 'ant-design-vue/es/form'
import { useProvideFormItem } from '../../context/FormItemContext'
import { useContent, usePrefixCls, useVNodeJSX } from '@pro-design-vue/hooks'
import { QuestionCircleOutlined } from '@ant-design/icons-vue'
import { useInjectForm } from '../../context/FormContext'
type WrapFormItemProps = {
  mode?: ProFieldMode
  /** @name 前置的dom * */
  addonBefore?: ProVNode
  /** @name 后置的dom * */
  addonAfter?: ProVNode
  /**
   * 包裹的样式，一般没用
   */
  help?: ProVNode | ((params: { errors: ProVNode[]; warnings: ProVNode[] }) => ProVNode)
}
const SLOT_KEYS: any[] = ['extra', 'help', 'label']

export default defineComponent({
  name: 'WrapFormItem',
  inheritAttrs: false,
  props: {
    ...formItemProps(),
    mode: {
      type: String as PropType<WrapFormItemProps['mode']>,
      default: undefined,
    },
    addonBefore: {
      type: [Object, String, Number, null, Boolean, Array] as PropType<
        WrapFormItemProps['addonBefore']
      >,
    },
    addonAfter: {
      type: [Object, String, Number, null, Boolean, Array] as PropType<
        WrapFormItemProps['addonAfter']
      >,
    },
  },
  setup(props, { attrs }) {
    const prefixCls = usePrefixCls('form-item')
    const { form } = useInjectForm()
    const renderVNodeJSX = useVNodeJSX()
    const renderContent = useContent()
    const renderParams = computed(() => ({
      form,
      mode: props.mode,
      // formValues: cloneDeep(store.formValues.value),
    }))

    const mergeFormItemProps = computed(() =>
      omit(merge({}, props), [...SLOT_KEYS, 'addonAfter', 'mode', 'addonBefore', 'tooltip']),
    )

    const tooltip = computed(() => {
      if (isString(props.tooltip)) {
        return { title: props.tooltip }
      }
      return props.tooltip
    })

    const mergeFormItemSlots = computed(() => {
      const slots: any = {
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
      }
      SLOT_KEYS.forEach((key) => {
        const render = renderVNodeJSX(key, {
          slotFirst: true,
          props,
          params: renderParams.value,
        })
        slots[key] = render ? () => render : undefined
      })
      return omitUndefined(slots)
    })

    useProvideFormItem({
      name: computed(() => props.name as any),
      label: computed(() => props.label as any),
    })

    return () => {
      // console.log('namePath', props.name)
      const children = renderContent('default', 'content')
      const addonAfterNode = renderVNodeJSX('addonAfter', {
        slotFirst: true,
        props,
        params: renderParams.value,
      })

      const addonBeforeNode = renderVNodeJSX('addonBefore', {
        slotFirst: true,
        props,
        params: renderParams.value,
      })

      if (!addonAfterNode && !addonBeforeNode) {
        return (
          <Form.Item
            class={prefixCls}
            {...attrs}
            {...mergeFormItemProps.value}
            v-slots={{ ...mergeFormItemSlots.value }}
          >
            {children}
          </Form.Item>
        )
      }
      return (
        <Form.Item
          class={prefixCls}
          {...attrs}
          {...mergeFormItemProps.value}
          v-slots={{ ...mergeFormItemSlots.value }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'nowrap',
            }}
          >
            {addonBeforeNode?.length ? (
              <div style={{ marginInlineEnd: '8px', flexShrink: 0 }}>{addonBeforeNode}</div>
            ) : null}
            {children}
            {addonAfterNode ? (
              <div style={{ marginInlineStart: '8px', flexShrink: 0 }}>{addonAfterNode}</div>
            ) : null}
          </div>
        </Form.Item>
      )
    }
  },
})
