/*
 * @Author: shen
 * @Date: 2023-08-10 15:53:17
 * @LastEditors: shen
 * @LastEditTime: 2025-07-24 17:22:14
 * @Description:
 */
import { defineComponent, computed } from 'vue'
import { CheckboxGroup } from 'ant-design-vue'
import { LoadingOutlined } from '@ant-design/icons-vue'
import { useFieldOptions } from '../hooks/useFieldOptions'
import { commonFieldProps } from '../props'
import { useInjectForm } from '../context/FormContext'
import FieldReadonly from './FieldReadonly'

export default defineComponent({
  name: 'FieldCheckboxGroup',
  props: {
    ...commonFieldProps(),
  },
  setup(props, { attrs }) {
    const { disabled } = useInjectForm()
    const { mergeOptions, loading } = useFieldOptions({
      request: props.request,
      options: props.options,
      valueEnum: props.valueEnum,
      dependencies: props.dependencies,
      params: props.params,
    })

    const readValue = computed(() => {
      if (!props.value) {
        return undefined
      }
      if (Array.isArray(props.value)) {
        if (!props.value.length) {
          return undefined
        }
        return mergeOptions.value
          .filter((op) => props.value.includes(op.value))
          .map((op) => op.label ?? op.text)
          .join('，')
      }
      const option = mergeOptions.value.find((op) => op.value === props.value)
      return option?.label ?? option?.text
    })

    const onChange: any = (value: any) => {
      props.onChange?.(value)
    }
    return () => {
      if (props.readonly) {
        return (
          <FieldReadonly
            text={readValue.value}
            class={attrs.class}
            style={attrs.style}
            {...props.readonlyProps}
          />
        )
      }
      return (
        <CheckboxGroup
          value={props.value}
          {...attrs}
          // 这块无法直接接收form的disabled状态，所以手动处理一下，等待修复
          disabled={(attrs as any).disabled ?? disabled?.value}
          options={mergeOptions.value as any}
          onChange={onChange}
        >
          {loading.value && <LoadingOutlined style="color: rgba(0, 0, 0, 0.25);" />}
        </CheckboxGroup>
      )
    }
  },
})
