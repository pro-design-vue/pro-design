/*
 * @Author: shen
 * @Date: 2025-12-05 15:58:31
 * @LastEditors: shen
 * @LastEditTime: 2025-12-30 17:32:46
 * @Description:
 */
import type { ProFieldProps } from '../../type'

import { computed, defineComponent, ref, toRefs, unref, type PropType, type VNode } from 'vue'
import { baseFieldProps } from '../../props'
import { useIntl } from '@pro-design-vue/components/config-provider'
import { Switch, type SwitchProps } from 'ant-design-vue'
import { useMergedState, usePrefixCls, useVNodeJSX } from '@pro-design-vue/hooks'
import { omit } from '@pro-design-vue/utils'

export default defineComponent({
  name: 'FieldSwitch',
  inheritAttrs: false,
  props: {
    ...baseFieldProps,
    text: {
      type: Boolean,
      default: undefined,
    },
    fieldProps: {
      type: Object as PropType<
        SwitchProps & {
          value?: boolean
          onChange?: (...args: any[]) => void
        }
      >,
      default: undefined,
    },
  },
  setup(props, { slots, attrs, expose }) {
    const intl = useIntl()
    const prefixCls = usePrefixCls('field-switch')
    const fieldRef = ref<HTMLInputElement>()
    const renderContent = useVNodeJSX()
    const { mode, text, fieldProps } = toRefs(props)

    const dom = computed(() => {
      if (text.value === undefined || text.value === null || `${text.value}`.length < 1) return '-'
      return text.value
        ? (fieldProps.value?.checkedChildren ?? intl.getMessage('switch.open', '打开'))
        : (fieldProps.value?.unCheckedChildren ?? intl.getMessage('switch.close', '关闭'))
    })

    const [innerValue, setInnerValue] = useMergedState(undefined, {
      value: computed(() => fieldProps.value?.checked ?? fieldProps.value?.value),
      onChange: (value) => {
        fieldProps.value?.onChange?.(value)
      },
    })

    expose({
      fieldRef: computed(() => {
        return unref(fieldRef)
      }),
    })
    return () => {
      if (mode.value === 'read') {
        const render = renderContent('render', {
          params: { text: text.value, mode: mode.value, ...fieldProps.value, dom },
          slotFirst: true,
        })
        if (render) {
          return render
        }
        return dom.value
      }

      if (mode.value === 'edit' || mode.value === 'update') {
        const dom = (
          <Switch
            ref={fieldRef}
            class={prefixCls}
            {...attrs}
            {...omit(fieldProps.value ?? {}, ['value', 'checked', 'onChange'])}
            checked={innerValue.value}
            v-slots={slots}
            onChange={setInnerValue}
          />
        )

        const renderFormItem = renderContent('renderFormItem', {
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
