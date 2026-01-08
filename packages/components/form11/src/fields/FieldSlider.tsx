/*
 * @Author: shen
 * @Date: 2023-08-10 14:34:03
 * @LastEditors: shen
 * @LastEditTime: 2025-11-25 15:30:41
 * @Description:
 */
import { computed, defineComponent } from 'vue'
import { Slider } from 'ant-design-vue'
import { useInjectSlots } from '../context/FormSlotsContext'
import { commonFieldProps } from '../props'
import getSlot from '../utils/getSlot'
import FieldReadonly from './FieldReadonly'
import { RenderVNode } from '@pro-design-vue/utils'
import { useInjectForm } from '../context/FormContext'
import { useInjectFormList } from '../context/FormListContext'

const SLOT_NAMES = ['mark']

export default defineComponent({
  name: 'FieldSlider',
  props: {
    ...commonFieldProps(),
    mark: {
      type: String,
      default: '',
    },
  },
  setup(props, { attrs }) {
    const formSlotsContext = useInjectSlots()
    const { formData } = useInjectForm()
    const { rowData } = useInjectFormList()

    const slotsGetter = computed(() => {
      const temp = {}
      SLOT_NAMES.forEach((name) => {
        const slot = getSlot(props[name], formSlotsContext)
        if (slot) {
          temp[name] = (props) => (
            <RenderVNode
              vnode={slot}
              props={{ formData: formData.value, rowData: rowData?.value, ...(props ?? {}) }}
            />
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
        <Slider
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
