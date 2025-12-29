/*
 * @Author: shen
 * @Date: 2025-12-05 15:58:31
 * @LastEditors: shen
 * @LastEditTime: 2025-12-29 16:00:25
 * @Description:
 */
import type { ProFieldProps } from '../../type'

import { computed, defineComponent, ref, toRefs, unref, type PropType, type VNode } from 'vue'
import { baseFieldProps } from '../../props'
import { useIntl } from '@pro-design-vue/components/config-provider'
import { InputNumber, Progress, type InputNumberProps, type ProgressProps } from 'ant-design-vue'
import { usePrefixCls, useVNodeJSX } from '@pro-design-vue/hooks'
import { omit } from '@pro-design-vue/utils'
import { toNumber } from '../Percent/util'

export function getProgressStatus(text: number): 'success' | 'exception' | 'normal' | 'active' {
  if (text === 100) {
    return 'success'
  }
  if (text < 0) {
    return 'exception'
  }
  if (text < 100) {
    return 'active'
  }

  return 'normal'
}

export default defineComponent({
  name: 'FieldProgress',
  inheritAttrs: false,
  props: {
    ...baseFieldProps,
    text: {
      type: [Number, String],
      default: undefined,
    },
    fieldProps: {
      type: Object as PropType<
        InputNumberProps & {
          progressProps?: ProgressProps
          onChange?: (...args: any[]) => void
        }
      >,
      default: undefined,
    },
  },
  setup(props, { slots, attrs, expose }) {
    const intl = useIntl()
    const prefixCls = usePrefixCls('field-progress')
    const fieldRef = ref<HTMLInputElement>()
    const renderContent = useVNodeJSX()
    const { mode, text, fieldProps } = toRefs(props)

    const realValue = computed(() =>
      typeof text.value === 'string' && (text.value as string).includes('%')
        ? toNumber((text.value as string).replace('%', ''))
        : toNumber(text.value),
    )

    const onChange: InputNumberProps['onChange'] = (value) => {
      fieldProps.value?.onChange?.(value)
      props.onChange?.(value)
    }

    expose({
      fieldRef: computed(() => {
        return unref(fieldRef)
      }),
    })
    return () => {
      if (mode.value === 'read') {
        const size = fieldProps.value?.progressProps?.size ?? 'small'
        const dom = (
          <Progress
            ref={ref}
            size={size}
            style={{ minWidth: 100, maxWidth: 320 }}
            percent={realValue.value}
            status={getProgressStatus(realValue.value as number)}
            {...omit({ ...(fieldProps.value?.progressProps ?? {}) }, ['size', 'percent', 'status'])}
          />
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
          <InputNumber
            ref={fieldRef}
            placeholder={placeholder}
            class={prefixCls}
            {...attrs}
            {...omit(fieldProps.value ?? {}, ['onChange', 'placeholder', 'progressProps'])}
            v-slots={slots}
            onChange={onChange}
          />
        )

        const renderFormItem = renderContent('renderFormItem', {
          params: { text, props: { mode, ...fieldProps.value, onChange }, dom },
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
