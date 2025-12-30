/*
 * @Author: shen
 * @Date: 2025-12-05 15:58:31
 * @LastEditors: shen
 * @LastEditTime: 2025-12-30 09:35:32
 * @Description:
 */
import type { ProFieldProps } from '../../type'

import { computed, defineComponent, ref, toRefs, watch, type PropType, type VNode } from 'vue'
import { baseFieldProps } from '../../props'
import { usePrefixCls, useVNodeJSX } from '@pro-design-vue/hooks'
import { Popover, theme, type PopoverProps } from 'ant-design-vue'
import { SketchPicker, tinycolor } from 'vue-color'
import 'vue-color/style.css'

export const DEFAULT_COLORS = [
  '#F5222D',
  '#FA8C16',
  '#FADB14',
  '#8BBB11',
  '#52C41A',
  '#13A8A8',
  '#1677FF',
  '#2F54EB',
  '#722ED1',
  '#EB2F96',
  '#F5222D4D',
  '#FA8C164D',
  '#FADB144D',
  '#8BBB114D',
  '#52C41A4D',
  '#13A8A84D',
  '#1677FF4D',
  '#2F54EB4D',
  '#722ED14D',
  '#EB2F964D',
]

export default defineComponent({
  name: 'FieldColorPicker',
  inheritAttrs: false,
  props: {
    ...baseFieldProps,
    text: {
      type: String,
      default: undefined,
    },
    fieldProps: {
      type: Object as PropType<{
        disabled?: boolean
        value?: string
        popoverProps?: PopoverProps
        disableAlpha?: boolean
        disableFields?: boolean
        presetColors?: string[]
        onChange?: (...args: any[]) => void
      }>,
      default: undefined,
    },
  },
  setup(props, { attrs }) {
    const { token } = theme.useToken()
    const prefixCls = usePrefixCls('field-color-picker')
    const renderContent = useVNodeJSX()
    const { mode, text, fieldProps } = toRefs(props)
    const color = ref(fieldProps?.value?.value ? tinycolor(fieldProps?.value?.value) : null)

    const popoverProps = computed(() => {
      const { popoverProps = {} } = fieldProps?.value || {}
      return {
        ...popoverProps,
        trigger: popoverProps.trigger || 'click',
        placement: popoverProps.placement || 'right',
      }
    })
    const sketchPickerProps = computed(() => {
      const { disableAlpha, disableFields, presetColors } = fieldProps?.value || {}
      return {
        disableAlpha: disableAlpha ?? false,
        disableFields,
        presetColors: presetColors || DEFAULT_COLORS,
      }
    })

    const colorText = computed(() =>
      mode.value === 'read' ? text.value : color.value?.toRgbString(),
    )

    watch(color, (newColor, oldColor) => {
      const value = newColor?.toRgbString()
      const oldValue = oldColor?.toRgbString()
      if (value !== oldValue) {
        fieldProps.value?.onChange?.(value)
      }
    })
    return () => {
      const readDom = (
        <div
          {...attrs}
          class={{
            [prefixCls]: true,
            [`${prefixCls}-disabled`]: fieldProps?.value?.disabled && mode.value !== 'read',
          }}
          style={{
            cursor:
              fieldProps?.value?.disabled && mode.value !== 'read' ? 'not-allowed' : 'pointer',
            backgroundColor:
              fieldProps?.value?.disabled && mode.value !== 'read'
                ? token.value.colorBgContainerDisabled
                : token.value.colorBgContainer,
          }}
        >
          {colorText.value ? (
            <div
              class={`${prefixCls}-inner`}
              style={{
                backgroundColor: colorText.value,
              }}
            />
          ) : (
            <div class={`${prefixCls}-empty`}></div>
          )}
        </div>
      )
      if (mode.value === 'read' || fieldProps?.value?.disabled) {
        const render = renderContent('render', {
          params: { text: text.value, mode: mode.value, ...fieldProps.value, dom: readDom },
          slotFirst: true,
        })
        if (render) {
          return render
        }
        return readDom
      }

      if (mode.value === 'edit' || mode.value === 'update') {
        const dom = (
          <Popover
            {...popoverProps.value}
            v-slots={{
              content: () => (
                <SketchPicker
                  v-model:tinyColor={color.value}
                  {...sketchPickerProps.value}
                  style={{ padding: '0', boxShadow: 'none' }}
                />
              ),
            }}
          >
            {readDom}
          </Popover>
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
