/*
 * @Author: shen
 * @Date: 2023-08-10 14:34:03
 * @LastEditors: shen
 * @LastEditTime: 2025-08-31 16:42:01
 * @Description:
 */
import { defineComponent, computed } from 'vue'
import { Checkbox } from 'ant-design-vue'
import { commonFieldProps } from '../props'
import FieldReadonly from './FieldReadonly'

export default defineComponent({
  name: 'FieldCheckbox',
  props: {
    ...commonFieldProps(),
  },
  emits: ['change'],
  setup(props, { attrs }) {
    const readValue = computed(() => {
      if (!props.value) {
        return '否'
      }
      return '是'
    })

    const onChange = (e) => {
      props.onChange?.(e.target.checked)
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
      return <Checkbox checked={props.value} {...attrs} onChange={onChange} />
    }
  },
})
