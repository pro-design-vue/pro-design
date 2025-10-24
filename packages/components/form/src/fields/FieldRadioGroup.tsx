/*
 * @Author: shen
 * @Date: 2023-08-10 15:53:17
 * @LastEditors: shen
 * @LastEditTime: 2025-10-24 15:47:59
 * @Description:
 */
import { defineComponent, computed, type PropType } from 'vue'
import { RadioGroup, Radio } from 'ant-design-vue'
import { LoadingOutlined } from '@ant-design/icons-vue'
import { useFieldOptions } from '../hooks/useFieldOptions'
import { useInjectSlots } from '../context/FormSlotsContext'
import { commonFieldProps } from '../props'
import FieldReadonly from './FieldReadonly'
import getSlot from '../utils/getSlot'
import { useInjectForm } from '../context/FormContext'
import { RenderVNode } from '@pro-design-vue/utils'

export default defineComponent({
  name: 'FieldRadioGroup',
  props: {
    ...commonFieldProps(),
    radioLabel: {
      type: String,
      default: '',
    },
    fieldNames: Object as PropType<{ label?: string; value?: string }>,
  },
  setup(props, { attrs }) {
    const { formData } = useInjectForm()
    const formSlotsContext = useInjectSlots()
    const { mergeOptions, loading } = useFieldOptions({
      request: props.request,
      options: props.options,
      valueEnum: props.valueEnum,
      dependencies: props.dependencies,
      fieldNames: props.fieldNames,
      params: props.params,
    })
    const readValue = computed(() => {
      if (!props.value) {
        return undefined
      }
      const option = mergeOptions.value.find((op) => op.value === props.value)
      return option?.label ?? option?.text
    })

    const defaultSlot = computed(() => {
      return getSlot(props['radioLabel'], formSlotsContext)
    })

    const onChange: any = (e: any) => {
      props.onChange?.(e.target.value)
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
      if (mergeOptions.value?.length > 0) {
        return (
          <RadioGroup value={props.value} {...attrs} onChange={onChange}>
            {mergeOptions.value.map((option) => (
              <Radio value={option.value} key={option.value?.toString()} disabled={option.disabled}>
                {defaultSlot.value ? (
                  <RenderVNode
                    vnode={defaultSlot.value}
                    props={{ option, value: props.value, formData: formData.value }}
                  />
                ) : (
                  option.label
                )}
              </Radio>
            ))}
          </RadioGroup>
        )
      } else {
        return loading.value ? <LoadingOutlined style="color: rgba(0, 0, 0, 0.25);" /> : null
      }
    }
  },
})
