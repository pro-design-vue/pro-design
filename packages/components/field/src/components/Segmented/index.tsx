/*
 * @Author: shen
 * @Date: 2025-12-05 15:58:31
 * @LastEditors: shen
 * @LastEditTime: 2026-01-04 09:35:04
 * @Description:
 */
import type { ProFieldProps } from '../../type'

import { computed, defineComponent, ref, toRefs, unref, type PropType, type VNode } from 'vue'
import { selectFieldProps } from '../../props'
import { Spin, Segmented, type SegmentedProps } from 'ant-design-vue'
import { useMergedState, usePrefixCls, useVNodeJSX } from '@pro-design-vue/hooks'
import { useFieldFetchData } from '../../hooks/useFieldFetchData'
import { objectToMap } from '../../utils/objectToMap'
import { proFieldParsingText } from '../../utils/proFieldParsingText'
import { omit } from '@pro-design-vue/utils'

export default defineComponent({
  name: 'FieldSegmented',
  inheritAttrs: false,
  props: {
    ...selectFieldProps,
    fieldProps: {
      type: Object as PropType<
        SegmentedProps & {
          onChange?: (...args: any[]) => void
        }
      >,
      default: undefined,
    },
  },
  setup(props, { slots, attrs, expose }) {
    const { mode, text, fieldProps } = toRefs(props)
    const prefixCls = usePrefixCls('field-segmented')
    const renderVNodeJSX = useVNodeJSX()
    const fieldRef = ref<HTMLInputElement>()

    const [innerValue, setInnerValue] = useMergedState('', {
      value: computed(() => fieldProps.value?.value),
      onChange: (value) => {
        fieldProps.value?.onChange?.(value)
      },
    })

    const { loading, options, fetchData, resetData } = useFieldFetchData(props)

    const onChange: SegmentedProps['onChange'] = (value) => {
      setInnerValue(value)
    }

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
          params: { text: text.value, mode: mode.value, ...fieldProps.value, dom },
          slotFirst: true,
        })
        if (render) {
          return render
        }
        return dom
      }

      if (mode.value === 'edit' || mode.value === 'update') {
        const dom = (
          <Segmented
            ref={fieldRef}
            class={prefixCls}
            value={innerValue.value}
            options={options.value as SegmentedProps['options']}
            {...attrs}
            {...omit(fieldProps.value ?? {}, ['onChange', 'options', 'value'])}
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
