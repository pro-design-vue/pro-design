import { computed, defineComponent, ref } from 'vue'
import { Form } from 'ant-design-vue'
import { FormItemInputContext } from 'ant-design-vue/es/form/FormItemContext'
import { useInjectForm } from '../context/FormContext'
import { commonFieldProps } from '../props'
import { CloseCircleFilled } from '@ant-design/icons-vue'
import { TinyColor } from '@ctrl/tinycolor'

function normalizeToHex(color: string): string {
  if (!color) return ''
  const tc = new TinyColor(color)
  return tc.isValid ? tc.toHexString().toUpperCase() : color
}

export default defineComponent({
  name: 'FieldColor',
  inheritAttrs: false,
  props: {
    ...commonFieldProps(),
    disabled: { type: Boolean, default: false },
    allowClear: { type: Boolean, default: true },
    placeholder: { type: String },
  },
  setup(props, { attrs }) {
    const { prefixCls } = useInjectForm()
    const formItemContext = Form.useInjectFormItemContext()
    const formItemInputContext = FormItemInputContext.useInject()
    const colorInputRef = ref<HTMLInputElement>()

    const isDisabled = computed(() => props.disabled)

    const internalValue = computed({
      get: () => {
        const v = props.value
        if (!v) return ''
        return normalizeToHex(String(v))
      },
      set: (val: any) => {
        const hex = val ? normalizeToHex(String(val)) : undefined
        props.onChange?.(hex as any)
      },
    })

    const colorStyle = computed(() => ({
      backgroundColor: internalValue.value || 'transparent',
    }))

    const showClear = computed(() => props.allowClear && !!internalValue.value && !isDisabled.value)

    const handleClear = (e: Event) => {
      if (isDisabled.value) return
      e.stopPropagation()
      internalValue.value = ''
      formItemContext.onFieldChange()
    }

    const handleChange = (e: Event) => {
      internalValue.value = (e.target as HTMLInputElement).value
      formItemContext.onFieldChange()
    }

    return () => {
      if (props.readonly) {
        const val = internalValue.value
        return (
          <div
            class={[attrs.class, `${prefixCls}-field-color-readonly`]}
            style={attrs.style as any}
          >
            <span
              class={`${prefixCls}-field-color-readonly-swatch`}
              style={{
                backgroundColor: val || 'transparent',
                borderStyle: val ? 'solid' : 'dashed',
              }}
            />
            <span class={`${prefixCls}-field-color-readonly-text`}>{val || '-'}</span>
          </div>
        )
      }

      const isError = formItemInputContext.status === 'error'

      return (
        <div
          id={formItemContext.id.value}
          class={[
            attrs.class,
            `${prefixCls}-field-color`,
            { [`${prefixCls}-field-color-has-value`]: !!internalValue.value },
            { [`${prefixCls}-field-color-error`]: isError },
            { [`${prefixCls}-field-color-disabled`]: isDisabled.value },
          ]}
          style={attrs.style as any}
          onClick={() => {
            if (isDisabled.value) return
            colorInputRef.value?.click()
          }}
        >
          <div class={`${prefixCls}-field-color-trigger`}>
            <div class={`${prefixCls}-field-color-swatch`} style={colorStyle.value}>
              {!internalValue.value && (
                <span class={`${prefixCls}-field-color-empty`}>
                  <svg
                    viewBox="0 0 1024 1024"
                    width="1em"
                    height="1em"
                    fill="currentColor"
                    style="opacity: 0.3"
                  >
                    <path d="M481.7 138h60.6v445.3l196.4-196.4 42.9 42.9L511.9 699.6 242.2 429.8l42.9-42.9 196.6 196.6V138zM780 691v47H244v-47H170v121h684V691h-74z" />
                  </svg>
                </span>
              )}
            </div>
            {internalValue.value ? (
              <span class={`${prefixCls}-field-color-value`}>{internalValue.value}</span>
            ) : (
              <span class={`${prefixCls}-field-color-placeholder`}>
                {props.placeholder ?? '选择颜色'}
              </span>
            )}
          </div>
          {showClear.value && (
            <CloseCircleFilled class={`${prefixCls}-clear-icon`} onClick={handleClear} />
          )}
          <input
            ref={colorInputRef}
            type="color"
            autocomplete="off"
            disabled={isDisabled.value}
            value={internalValue.value || '#000000'}
            onInput={handleChange}
            style="position: absolute; width: 0; height: 0; padding: 0; border: 0; overflow: hidden; opacity: 0; pointer-events: none;"
          />
        </div>
      )
    }
  },
})
