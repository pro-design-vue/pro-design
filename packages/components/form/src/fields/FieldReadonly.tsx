/*
 * @Author: shen
 * @Date: 2023-08-10 14:34:03
 * @LastEditors: shen
 * @LastEditTime: 2025-08-27 11:19:32
 * @Description:
 */
import type { Theme } from '../type'
import type { PropType } from 'vue'

import { computed, defineComponent } from 'vue'
import { Tooltip } from 'ant-design-vue'
import { CopyOutlined } from '@ant-design/icons-vue'
import { useInjectForm } from '../context/FormContext'
import { ProClipboard } from '@pro-design-vue/components/clipboard'

export default defineComponent({
  name: 'FieldReadonly',
  inheritAttrs: false,
  props: {
    text: {
      type: [String, Number],
      default: undefined,
    },
    theme: {
      type: String as PropType<Theme>,
      default: undefined,
    },
    customUi: {
      type: Boolean as PropType<any>,
      default: undefined,
    },
    tooltip: {
      type: [Boolean, String],
      default: undefined,
    },
    copy: {
      type: Boolean,
      default: undefined,
    },
    emptyText: {
      type: String,
      default: '-',
    },
    ellipsis: {
      type: Boolean,
      default: true,
    },
    autoLine: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { attrs }) {
    const { prefixCls, customUi } = useInjectForm()
    const mergeCustomUi = computed(() => props.customUi ?? customUi.value ?? true)
    const cls = computed(() => ({
      [`${prefixCls}-readonly`]: true,
      [`${prefixCls}-readonly-custom-ui`]: mergeCustomUi.value,
      [`${prefixCls}-readonly-ellipsis`]: props.ellipsis,
      [`${prefixCls}-readonly-autoline`]: props.autoLine,
      [`${attrs.class}`]: true,
    }))

    const value = computed(() => {
      if (props.text === undefined || props.text === null || props.text === '') {
        return props.emptyText
      }
      return props.text
    })

    return () => {
      const dom = (
        <div class={cls.value} style={attrs?.style as any}>
          <span class={`${prefixCls}-readonly-text`}>{value.value}</span>
          {mergeCustomUi.value && props.copy && (
            <span>
              <CopyOutlined style="color: rgb(134, 144, 156); font-size:12px" />
            </span>
          )}
        </div>
      )
      if (props.copy && props.text) {
        return <ProClipboard text={props.text as any}>{dom}</ProClipboard>
      }

      if (props.tooltip) {
        const title = typeof props.tooltip === 'string' ? props.tooltip : props.text
        if (title) {
          return (
            <Tooltip placement="topLeft" title={title}>
              {dom}
            </Tooltip>
          )
        }
      }

      return dom
    }
  },
})
