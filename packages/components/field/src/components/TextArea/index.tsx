/*
 * @Author: shen
 * @Date: 2025-12-05 15:58:31
 * @LastEditors: shen
 * @LastEditTime: 2026-01-19 15:51:31
 * @Description:
 */
import type { ProFieldProps } from '../../type'

import { computed, defineComponent, ref, toRefs, unref, type PropType, type VNode } from 'vue'
import { baseFieldProps } from '../../props'
import { useIntl } from '@pro-design-vue/components/config-provider'
import { Input, type TextAreaProps } from 'ant-design-vue'
import { usePrefixCls, useVNodeJSX } from '@pro-design-vue/hooks'
import { omit } from '@pro-design-vue/utils'
import FieldTextAreaReadonly from './Readonly'

export default defineComponent({
  name: 'FieldTextArea',
  inheritAttrs: false,
  props: {
    ...baseFieldProps,
    text: {
      type: String,
      default: undefined,
    },
    fieldProps: {
      type: Object as PropType<
        TextAreaProps & {
          onChange?: (...args: any[]) => void
        }
      >,
      default: undefined,
    },
  },
  setup(props, { slots, attrs, expose }) {
    const intl = useIntl()
    const prefixCls = usePrefixCls('field-textarea')
    const fieldRef = ref<HTMLInputElement>()
    const renderVNodeJSX = useVNodeJSX()
    const { mode, text, fieldProps } = toRefs(props)
    const onChange: TextAreaProps['onChange'] = (e) => {
      fieldProps.value?.onChange?.(e.target.value, e)
    }

    expose({
      fieldRef: computed(() => {
        return unref(fieldRef)
      }),
    })

    return () => {
      if (mode.value === 'read') {
        const dom = <FieldTextAreaReadonly text={text.value} />
        const render = renderVNodeJSX('render', {
          params: { text: text.value, mode: mode.value, ...fieldProps.value, dom },
          slotFirst: true,
        })
        if (render) {
          return render
        }
        return dom
      }

      if (mode.value === 'edit' || mode.value === 'update') {
        const placeholder =
          fieldProps.value?.placeholder || intl.getMessage('tableForm.inputPlaceholder', '请输入')
        const dom = (
          <Input.TextArea
            ref={fieldRef}
            rows={fieldProps.value?.rows ?? 3}
            placeholder={placeholder}
            class={prefixCls}
            {...attrs}
            {...omit(fieldProps.value ?? {}, ['placeholder', 'rows', 'onChange'])}
            v-slots={slots}
            onChange={onChange}
          />
        )

        const renderFormItem = renderVNodeJSX('renderFormItem', {
          params: { text: text.value, mode: mode.value, ...fieldProps.value, dom },
          slotFirst: true,
        })
        if (renderFormItem) {
          return renderFormItem
        }
        return dom
      }

      return null
    }
  },
})
