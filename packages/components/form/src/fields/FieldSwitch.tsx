/*
 * @Author: shen
 * @Date: 2023-08-10 14:34:03
 * @LastEditors: shen
 * @LastEditTime: 2025-07-26 23:42:21
 * @Description:
 */
import { computed, defineComponent } from 'vue'
import { Switch } from 'ant-design-vue'
import { useInjectSlots } from '../context/FormSlotsContext'
import { commonFieldProps } from '../props'
import { useIntl } from '@pro-design-vue/components/config-provider'
import { RenderVNode } from '@pro-design-vue/utils'
import getSlot from '../utils/getSlot'
import FieldReadonly from './FieldReadonly'

const SLOT_NAMES = ['checkedChildren', 'unCheckedChildren']

export default defineComponent({
  name: 'FieldSwitch',
  props: {
    ...commonFieldProps,
    checkedChildren: {
      type: String,
    },
    unCheckedChildren: {
      type: String,
    },
  },
  setup(props, { attrs }) {
    const intl = useIntl()
    const formSlotsContext = useInjectSlots()

    const readValue = computed(() => {
      if (!props.value || props.value === attrs.unCheckedValue) {
        return props.unCheckedChildren || intl.getMessage('switch.open', '打开')
      }

      if (props.value || props.value === attrs.checkedValue) {
        return props.checkedChildren || intl.getMessage('switch.close', '关闭')
      }
      return ''
    })

    const slotsGetter = computed(() => {
      const temp = {}
      SLOT_NAMES.forEach((name) => {
        const slot = getSlot(props[name], formSlotsContext)
        if (slot) {
          temp[name] = (props) => <RenderVNode vnode={slot} props={props} />
        }
      })
      return temp
    })
    const onChange = (checked: boolean | string | number, event: Event) => {
      props.onChange?.(checked, event)
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
        <Switch checked={props.value} {...attrs} v-slots={slotsGetter.value} onChange={onChange} />
      )
    }
  },
})
