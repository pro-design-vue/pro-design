/*
 * @Author: shen
 * @Date: 2025-12-05 15:58:31
 * @LastEditors: shen
 * @LastEditTime: 2026-01-19 11:17:27
 * @Description:
 */
import type { ProFieldProps } from '../../type'

import {
  computed,
  defineComponent,
  onMounted,
  ref,
  toRefs,
  unref,
  type PropType,
  type VNode,
} from 'vue'
import { baseFieldProps } from '../../props'
import { useIntl } from '@pro-design-vue/components/config-provider'
import { Input, type InputProps } from 'ant-design-vue'
import { usePrefixCls, useVNodeJSX } from '@pro-design-vue/hooks'
import { omit } from '@pro-design-vue/utils'

export default defineComponent({
  name: 'FieldText',
  inheritAttrs: false,
  props: {
    ...baseFieldProps,
    text: {
      type: String,
      default: undefined,
    },
    emptyText: {
      type: [Object, String, Number, null, Boolean, Array] as PropType<ProFieldProps['emptyText']>,
      default: '-',
    },
    fieldProps: {
      type: Object as PropType<
        InputProps & {
          autoFocus?: boolean
          onChange?: (...args: any[]) => void
        }
      >,
      default: undefined,
    },
  },
  setup(props, { slots, attrs, expose }) {
    const intl = useIntl()
    const prefixCls = usePrefixCls('field-text')
    const fieldRef = ref<HTMLInputElement>()
    const renderVNodeJSX = useVNodeJSX()
    const { mode, text, emptyText, fieldProps } = toRefs(props)
    const prefixNode = computed<VNode>(() => {
      const prefix = renderVNodeJSX('prefix', {
        slotFirst: true,
        props: fieldProps.value,
      })
      if (prefix) return prefix
      return null
    })

    const suffixNode = computed<VNode>(() => {
      const suffix = renderVNodeJSX('suffix', {
        slotFirst: true,
        props: fieldProps.value,
      })
      if (suffix) return suffix
      return null
    })

    const onChange: InputProps['onChange'] = (e) => {
      fieldProps.value?.onChange?.(e.target.value, e)
    }

    onMounted(() => {
      if (fieldProps.value?.autoFocus) {
        fieldRef.value?.focus()
      }
    })

    expose({
      fieldRef: computed(() => {
        return unref(fieldRef)
      }),
    })
    return () => {
      if (mode.value === 'read') {
        const dom = (
          <>
            {prefixNode.value}
            {text.value || emptyText.value}
            {suffixNode.value}
          </>
        )

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
          <Input
            ref={fieldRef}
            placeholder={placeholder}
            allowClear={fieldProps.value?.allowClear ?? true}
            class={prefixCls}
            style={{ minWidth: '100px' }}
            {...attrs}
            {...omit(fieldProps.value ?? {}, [
              'onChange',
              'suffix',
              'prefix',
              'placeholder',
              'allowClear',
            ])}
            v-slots={{
              ...slots,
              prefix: () => prefixNode.value,
              suffix: () => suffixNode.value,
            }}
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
