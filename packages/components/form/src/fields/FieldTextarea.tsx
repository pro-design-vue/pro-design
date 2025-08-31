/*
 * @Author: shen
 * @Date: 2023-08-10 14:34:03
 * @LastEditors: shen
 * @LastEditTime: 2025-07-26 23:44:13
 * @Description:
 */
import { computed, defineComponent } from 'vue'
import { Textarea } from 'ant-design-vue'
import { commonFieldProps } from '../props'
import { useIntl } from '@pro-design-vue/components/config-provider'
import FieldReadonly from './FieldReadonly'

export default defineComponent({
  name: 'FieldTextarea',
  props: {
    ...commonFieldProps,
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
    const internalValue = computed({
      get: () => props.value,
      set: (val) => {
        props.onChange?.(val)
      },
    })

    return () => {
      if (props.readonly) {
        return (
          <FieldReadonly
            text={internalValue.value}
            class={attrs.class}
            style={attrs.style}
            {...props.readonlyProps}
          />
        )
      }
      return (
        <Textarea
          v-model:value={internalValue.value}
          {...attrs}
          placeholder={props.placeholder || intl.getMessage('form.inputPlaceholder', '请输入')}
        />
      )
    }
  },
})
