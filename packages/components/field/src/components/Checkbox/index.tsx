/*
 * @Author: shen
 * @Date: 2025-12-05 15:58:31
 * @LastEditors: shen
 * @LastEditTime: 2026-01-19 15:43:51
 * @Description:
 */
import type { ProFieldProps } from '../../type'

import { computed, defineComponent, ref, toRefs, unref, type PropType, type VNode } from 'vue'
import { selectFieldProps } from '../../props'
import { Spin, theme, Checkbox, type CheckboxGroupProps } from 'ant-design-vue'
import { usePrefixCls, useVNodeJSX } from '@pro-design-vue/hooks'
import { useFieldFetchData } from '../../hooks/useFieldFetchData'
import { objectToMap } from '../../utils/objectToMap'
import { proFieldParsingText } from '../../utils/proFieldParsingText'
import { omit } from '@pro-design-vue/utils'

export default defineComponent({
  name: 'FieldCheckbox',
  inheritAttrs: false,
  props: {
    ...selectFieldProps,
    fieldProps: {
      type: Object as PropType<
        CheckboxGroupProps & {
          layout?: 'horizontal' | 'vertical'
          options?: CheckboxGroupProps['options']
          onChange?: (...args: any[]) => void
        }
      >,
      default: undefined,
    },
  },
  setup(props, { slots, attrs, expose }) {
    const { token } = theme.useToken()
    const { mode, text, fieldProps } = toRefs(props)
    const prefixCls = usePrefixCls('field-checkbox')
    const renderVNodeJSX = useVNodeJSX()
    const fieldRef = ref<HTMLInputElement>()

    const { loading, options, fetchData, resetData } = useFieldFetchData(props)

    expose({
      fieldRef: computed(() => {
        return unref(fieldRef)
      }),
      fetchData,
      resetData,
    })
    return () => {
      if (loading.value) {
        return <Spin size="small" />
      }

      if (mode.value === 'read') {
        const optionsValueEnum = options.value?.length
          ? options.value?.reduce((pre: any, cur) => {
              return { ...pre, [(cur.value as any) ?? '']: cur.label }
            }, {})
          : undefined

        const dom = proFieldParsingText(
          text.value!,
          objectToMap(props.valueEnum || optionsValueEnum),
        )

        const render = renderVNodeJSX('render', {
          params: { mode: mode.value, ...fieldProps.value, text: text.value, dom },
          slotFirst: true,
        })
        if (render) {
          return render
        }
        return (
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: token.value.marginSM + 'px',
            }}
          >
            {dom}
          </div>
        )
      }

      if (mode.value === 'edit' || mode.value === 'update') {
        const layout = fieldProps.value?.layout ?? 'horizontal'
        const dom = (
          <Checkbox.Group
            ref={fieldRef}
            class={{ [prefixCls]: true, [`${prefixCls}-${layout}`]: true }}
            options={options.value as CheckboxGroupProps['options']}
            {...attrs}
            {...omit(fieldProps.value ?? {}, ['options', 'layout'])}
            v-slots={slots}
          />
        )

        const renderFormItem = renderVNodeJSX('renderFormItem', {
          params: { mode: mode.value, ...fieldProps.value, text: text.value, dom },
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
