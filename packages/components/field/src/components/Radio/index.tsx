/*
 * @Author: shen
 * @Date: 2025-12-05 15:58:31
 * @LastEditors: shen
 * @LastEditTime: 2026-01-04 09:34:58
 * @Description:
 */
import type { ProFieldProps } from '../../type'

import { computed, defineComponent, ref, toRefs, unref, type PropType, type VNode } from 'vue'
import { selectFieldProps } from '../../props'
import { Spin, Radio, type RadioGroupProps } from 'ant-design-vue'
import { useMergedState, usePrefixCls, useVNodeJSX } from '@pro-design-vue/hooks'
import { useFieldFetchData } from '../../hooks/useFieldFetchData'
import { objectToMap } from '../../utils/objectToMap'
import { proFieldParsingText } from '../../utils/proFieldParsingText'
import { omit } from '@pro-design-vue/utils'

export default defineComponent({
  name: 'FieldRadio',
  inheritAttrs: false,
  props: {
    ...selectFieldProps,
    optionType: {
      type: String as PropType<RadioGroupProps['optionType']>,
    },
    fieldProps: {
      type: Object as PropType<
        RadioGroupProps & {
          onChange?: (...args: any[]) => void
        }
      >,
      default: undefined,
    },
  },
  setup(props, { slots, attrs, expose }) {
    const { mode, text, fieldProps } = toRefs(props)
    const prefixCls = usePrefixCls('field-radio')
    const renderContent = useVNodeJSX()
    const fieldRef = ref<HTMLInputElement>()

    const [innerValue, setInnerValue] = useMergedState(undefined, {
      value: computed(() => fieldProps.value?.value),
      onChange: (value) => {
        fieldProps.value?.onChange?.(value)
      },
    })

    const { loading, options, fetchData, resetData } = useFieldFetchData(props)

    const onChange: RadioGroupProps['onChange'] = (e) => {
      setInnerValue(e.target.value)
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
        const dom = (
          <Radio.Group
            ref={fieldRef}
            class={prefixCls}
            optionType={props.optionType ?? fieldProps.value?.optionType}
            value={innerValue.value}
            options={options.value as RadioGroupProps['options']}
            {...attrs}
            {...omit(fieldProps.value ?? {}, ['onChange', 'options', 'value', 'optionType'])}
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
