/*
 * @Author: shen
 * @Date: 2023-08-10 14:34:03
 * @LastEditors: shen
 * @LastEditTime: 2025-10-24 16:35:26
 * @Description:
 */
import { computed, defineComponent } from 'vue'
import { Rate } from 'ant-design-vue'
import { useInjectSlots } from '../context/FormSlotsContext'
import { commonFieldProps } from '../props'
import getSlot from '../utils/getSlot'
import FieldReadonly from './FieldReadonly'
import { RenderVNode } from '@pro-design-vue/utils'
import { useInjectForm } from '../context/FormContext'

const SLOT_NAMES = ['character']

export default defineComponent({
  name: 'FieldRate',
  props: {
    ...commonFieldProps(),
    character: {
      type: String,
      default: '',
    },
  },
  setup(props, { attrs }) {
    const formSlotsContext = useInjectSlots()
    const { formData } = useInjectForm()
    const slotsGetter = computed(() => {
      const temp = {}
      SLOT_NAMES.forEach((name) => {
        const slot = getSlot(props[name], formSlotsContext)
        if (slot) {
          temp[name] = (props) => (
            <RenderVNode vnode={slot} props={{ formData: formData.value, ...(props ?? {}) }} />
          )
        }
      })
      return temp
    })

    const onChange = (value: any) => {
      props.onChange?.(value)
    }

    return () => {
      if (props.readonly) {
        return (
          <FieldReadonly
            text={props.value}
            class={attrs.class}
            style={attrs.style}
            {...props.readonlyProps}
          />
        )
      }
      return (
        <Rate
          value={props.value}
          {...attrs}
          style={{
            minWidth: '120px',
          }}
          v-slots={slotsGetter.value}
          onChange={onChange}
        />
      )
    }
  },
})
