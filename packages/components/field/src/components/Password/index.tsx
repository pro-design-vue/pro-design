/*
 * @Author: shen
 * @Date: 2025-12-05 15:58:31
 * @LastEditors: shen
 * @LastEditTime: 2025-12-30 16:02:38
 * @Description:
 */
import type { ProFieldProps } from '../../type'

import { computed, defineComponent, ref, toRefs, unref, type PropType, type VNode } from 'vue'
import { baseFieldProps } from '../../props'
import { useIntl } from '@pro-design-vue/components/config-provider'
import { Input, Space, type InputProps } from 'ant-design-vue'
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons-vue'
import { useMergedState, usePrefixCls, useVNodeJSX } from '@pro-design-vue/hooks'
import { omit } from '@pro-design-vue/utils'

export default defineComponent({
  name: 'FieldPassword',
  inheritAttrs: false,
  props: {
    ...baseFieldProps,
    text: {
      type: String,
      default: undefined,
    },
    fieldProps: {
      type: Object as PropType<
        InputProps & {
          onChange?: (...args: any[]) => void
          open?: boolean
          onOpenChange?: (visible: boolean) => void
        }
      >,
      default: undefined,
    },
  },
  setup(props, { slots, attrs, expose }) {
    const intl = useIntl()
    const prefixCls = usePrefixCls('field-password')
    const fieldRef = ref<HTMLInputElement>()
    const renderVNodeJSX = useVNodeJSX()
    const { mode, text, fieldProps } = toRefs(props)

    const [open, setOpen] = useMergedState<boolean>(() => fieldProps.value?.open || false, {
      value: computed(() => fieldProps.value?.open as any),
      onChange: fieldProps.value?.onOpenChange,
    })

    const onChange: InputProps['onChange'] = (e) => {
      fieldProps.value?.onChange?.(e.target.value, e)
    }

    expose({
      fieldRef: computed(() => {
        return unref(fieldRef)
      }),
    })
    return () => {
      if (mode.value === 'read') {
        let dom = <>-</>
        if (text.value) {
          dom = (
            <Space>
              <span ref={ref}>{open.value ? text.value : '********'}</span>
              <a onClick={() => setOpen(!open.value)}>
                {open.value ? <EyeOutlined /> : <EyeInvisibleOutlined />}
              </a>
            </Space>
          )
        }
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
          <Input.Password
            ref={fieldRef}
            placeholder={placeholder}
            class={prefixCls}
            {...attrs}
            {...omit(fieldProps.value ?? {}, ['placeholder', 'onChange'])}
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
