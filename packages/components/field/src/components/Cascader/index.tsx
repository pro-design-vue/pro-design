/*
 * @Author: shen
 * @Date: 2025-12-05 15:58:31
 * @LastEditors: shen
 * @LastEditTime: 2025-12-31 09:37:54
 * @Description:
 */
import type { ProFieldProps } from '../../type'

import { computed, defineComponent, ref, toRefs, unref, type PropType, type VNode } from 'vue'
import { selectFieldProps } from '../../props'
import { useIntl } from '@pro-design-vue/components/config-provider'
import { Cascader, Spin, type CascaderProps } from 'ant-design-vue'
import { usePrefixCls, useVNodeJSX } from '@pro-design-vue/hooks'
import { LoadingOutlined } from '@ant-design/icons-vue'
import { useFieldFetchData } from '../../hooks/useFieldFetchData'
import { objectToMap } from '../../utils/objectToMap'
import { proFieldParsingText } from '../../utils/proFieldParsingText'
import { omit, type ProSchemaValueEnumObj } from '@pro-design-vue/utils'
import type { DefaultOptionType } from 'ant-design-vue/es/select'

export default defineComponent({
  name: 'FieldCascader',
  inheritAttrs: false,
  props: {
    ...selectFieldProps,
    fieldProps: {
      type: Object as PropType<
        CascaderProps & {
          onChange?: (...args: any[]) => void
        }
      >,
      default: undefined,
    },
  },
  setup(props, { slots, attrs, expose }) {
    const { mode, text, fieldProps } = toRefs(props)
    const intl = useIntl()
    const prefixCls = usePrefixCls('field-cascader')
    const renderContent = useVNodeJSX()
    const fieldRef = ref<HTMLInputElement>()
    const { loading, options, fetchData, resetData } = useFieldFetchData(props)

    const optionsValueEnum = computed(() => {
      if (mode.value !== 'read') return

      const {
        label: labelPropsName = 'label',
        value: valuePropsName = 'value',
        children: optionsPropsName = 'children',
      } = fieldProps?.value?.fieldNames || {}

      const valuesMap = new Map()

      const traverseOptions = (_options: typeof options.value) => {
        if (!_options?.length) {
          return valuesMap
        }
        const length = _options.length
        let i = 0
        while (i < length) {
          const cur = _options[i++]
          valuesMap.set(cur?.[valuePropsName], cur?.[labelPropsName])
          traverseOptions(cur?.[optionsPropsName])
        }
        return valuesMap
      }

      return traverseOptions(options.value)
    })

    expose({
      fieldRef: computed(() => {
        return unref(fieldRef)
      }),
      fetchData,
      resetData,
    })
    return () => {
      if (mode.value === 'read') {
        if (loading.value) {
          return <Spin size="small" />
        }
        const dom = proFieldParsingText(
          text.value!,
          objectToMap(
            props.valueEnum || optionsValueEnum.value,
          ) as unknown as ProSchemaValueEnumObj,
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
          fieldProps.value?.placeholder || intl.getMessage('tableForm.selectPlaceholder', '请选择')
        const dom = (
          <Cascader
            ref={fieldRef}
            class={prefixCls}
            allowClear={fieldProps.value?.allowClear ?? true}
            suffixIcon={loading.value ? <LoadingOutlined /> : undefined}
            placeholder={placeholder}
            loading={loading.value}
            style={{ minWidth: '100px' }}
            {...attrs}
            {...omit(fieldProps.value ?? {}, ['options', 'allowClear', 'loading', 'placeholder'])}
            options={options.value as CascaderProps['options']}
            v-slots={slots}
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
