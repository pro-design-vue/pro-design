/*
 * @Author: shen
 * @Date: 2025-12-05 15:58:31
 * @LastEditors: shen
 * @LastEditTime: 2025-12-30 16:14:40
 * @Description:
 */
import type { ProFieldProps } from '../../type'

import { computed, defineComponent, ref, toRefs, unref, type PropType, type VNode } from 'vue'
import { baseFieldProps } from '../../props'
import { useIntl } from '@pro-design-vue/components/config-provider'
import { Input, theme, type TextAreaProps } from 'ant-design-vue'
import { usePrefixCls, useVNodeJSX } from '@pro-design-vue/hooks'
import { omit } from '@pro-design-vue/utils'

const languageFormat = (text: string, language: string) => {
  if (typeof text !== 'string') {
    return text
  }
  try {
    if (language === 'json') {
      return JSON.stringify(JSON.parse(text), null, 2)
    }
  } catch (error) {
    // console.log(error)
  }
  return text
}

export default defineComponent({
  name: 'FieldCode',
  inheritAttrs: false,
  props: {
    ...baseFieldProps,
    text: {
      type: String,
      default: undefined,
    },
    language: {
      type: String as PropType<'json' | 'text'>,
      default: undefined,
    },
    fieldProps: {
      type: Object as PropType<
        TextAreaProps & {
          language?: 'json' | 'text'
          onChange?: (...args: any[]) => void
        }
      >,
      default: undefined,
    },
  },
  setup(props, { slots, attrs, expose }) {
    const intl = useIntl()
    const prefixCls = usePrefixCls('field-code')
    const fieldRef = ref<HTMLInputElement>()
    const renderContent = useVNodeJSX()
    const { token } = theme.useToken()
    const { mode, text, fieldProps } = toRefs(props)
    const code = computed(() =>
      languageFormat(text.value!, props.language ?? fieldProps.value?.language ?? 'text'),
    )

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
        const dom = (
          <pre
            ref={ref}
            {...attrs}
            style={{
              padding: '16px',
              overflow: 'auto',
              fontSize: '85%',
              lineHeight: 1.45,
              color: token.value.colorTextSecondary,
              backgroundColor: 'rgba(150, 150, 150, 0.1)',
              borderRadius: '3px',
              width: 'min-content',
            }}
          >
            <code>{code.value}</code>
          </pre>
        )
        const render = renderContent('render', {
          params: { text, mode, ...fieldProps.value, dom },
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
            value={code.value}
            rows={fieldProps.value?.rows ?? 5}
            placeholder={placeholder}
            class={prefixCls}
            {...attrs}
            {...omit(fieldProps.value ?? {}, [
              'placeholder',
              'rows',
              'value',
              'language',
              'onChange',
            ])}
            v-slots={slots}
            onChange={onChange}
          />
        )

        const renderFormItem = renderContent('renderFormItem', {
          params: { text, props: { mode, ...fieldProps.value }, dom },
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
