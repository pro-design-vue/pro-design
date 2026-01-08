/*
 * @Author: shen
 * @Date: 2023-08-10 14:34:03
 * @LastEditors: shen
 * @LastEditTime: 2025-11-25 15:29:56
 * @Description:
 */
import { computed, defineComponent } from 'vue'
import { Input } from 'ant-design-vue'
import { useInjectSlots } from '../context/FormSlotsContext'
import { commonFieldProps } from '../props'
import { useIntl } from '@pro-design-vue/components/config-provider'
import { RenderVNode } from '@pro-design-vue/utils'
import getSlot from '../utils/getSlot'
import { useInjectForm } from '../context/FormContext'
import { useInjectFormList } from '../context/FormListContext'

const SLOT_NAMES = ['addonAfter', 'addonBefore', 'suffix', 'prefix']

export default defineComponent({
  name: 'FieldPassword',
  props: {
    ...commonFieldProps(),
    addonAfter: {
      type: String,
      default: '',
    },
    addonBefore: {
      type: String,
      default: '',
    },
    suffix: {
      type: String,
      default: '',
    },
    prefix: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
    },
  },
  setup(props, { attrs }) {
    const intl = useIntl()
    const formSlotsContext = useInjectSlots()
    const { formData } = useInjectForm()
    const { rowData } = useInjectFormList()

    const internalValue = computed({
      get: () => props.value,
      set: (val) => {
        props.onChange?.(val)
      },
    })

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

    return () => (
      <Input.Password
        v-model:value={internalValue.value}
        {...attrs}
        placeholder={props.placeholder || intl.getMessage('form.inputPlaceholder', '请输入')}
        v-slots={slotsGetter.value}
      />
    )
  },
})
