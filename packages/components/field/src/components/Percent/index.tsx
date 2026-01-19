/*
 * @Author: shen
 * @Date: 2025-12-05 15:58:31
 * @LastEditors: shen
 * @LastEditTime: 2026-01-19 15:48:55
 * @Description:
 */
import type { ProFieldProps } from '../../type'

import {
  computed,
  defineComponent,
  Fragment,
  ref,
  toRefs,
  unref,
  type PropType,
  type VNode,
} from 'vue'
import { baseFieldProps } from '../../props'
import { useIntl } from '@pro-design-vue/components/config-provider'
import { InputNumber, type InputNumberProps } from 'ant-design-vue'
import { usePrefixCls, useVNodeJSX } from '@pro-design-vue/hooks'
import { omit, type ProVNode } from '@pro-design-vue/utils'
import {
  getColorByRealValue,
  getRealTextWithPrecision,
  getSymbolByRealValue,
  toNumber,
} from './util'

export default defineComponent({
  name: 'FieldPercent',
  inheritAttrs: false,
  props: {
    ...baseFieldProps,
    text: {
      type: [Number, String],
      default: undefined,
    },
    fieldProps: {
      type: Object as PropType<
        InputNumberProps & {
          prefix?: ProVNode
          suffix?: ProVNode
          precision?: number
          showColor?: boolean
          showSymbol?: boolean | ((value: any) => boolean)
          placeholder?: string
          onChange?: (...args: any[]) => void
        }
      >,
      default: undefined,
    },
  },
  setup(props, { slots, attrs, expose }) {
    const intl = useIntl()
    const prefixCls = usePrefixCls('field-percent')
    const fieldRef = ref<HTMLInputElement>()
    const renderContent = useVNodeJSX()
    const { mode, text, fieldProps } = toRefs(props)

    const realValue = computed(() =>
      typeof text.value === 'string' && (text.value as string).includes('%')
        ? toNumber((text.value as string).replace('%', ''))
        : toNumber(text.value),
    )

    const showSymbol = computed(() => {
      if (typeof fieldProps.value?.showSymbol === 'function') {
        return fieldProps.value?.showSymbol?.(text)
      }
      return fieldProps.value?.showSymbol
    })

    expose({
      fieldRef: computed(() => {
        return unref(fieldRef)
      }),
    })
    return () => {
      if (mode.value === 'read') {
        /** 颜色有待确定, 根据提供 colors: ['正', '负'] | boolean */
        const style = fieldProps.value?.showColor
          ? { color: getColorByRealValue(realValue.value) }
          : {}
        const dom = (
          <span style={style}>
            {fieldProps.value?.prefix && <span>{fieldProps.value?.prefix}</span>}
            {showSymbol.value && <Fragment>{getSymbolByRealValue(realValue.value)} </Fragment>}
            {getRealTextWithPrecision(Math.abs(realValue.value), fieldProps.value?.precision)}
            {fieldProps.value?.suffix ?? '%'}
          </span>
        )

        const render = renderContent('render', {
          params: { text: text.value, mode: mode.value, ...fieldProps.value, dom },
          slotFirst: true,
        })
        if (render) {
          return render
        }
        return dom
      }

      if (mode.value === 'edit' || mode.value === 'update') {
        const placeholder =
          fieldProps.value?.placeholder || intl.getMessage('tableForm.inputPlaceholder', '请输入')
        const dom = (
          <InputNumber
            ref={fieldRef}
            placeholder={placeholder}
            class={prefixCls}
            formatter={(value) => {
              if (value && fieldProps.value?.prefix) {
                return `${fieldProps.value?.prefix} ${value}`.replace(
                  /\B(?=(\d{3})+(?!\d)$)/g,
                  ',',
                ) as any
              }
              return value
            }}
            parser={(value) => (value ? value.replace(/.*\s|,/g, '') : '')}
            {...attrs}
            {...omit(fieldProps.value ?? {}, [
              'placeholder',
              'formatter',
              'parser',
              'showColor',
              'showSymbol',
              'prefix',
              'suffix',
            ])}
            v-slots={slots}
          />
        )

        const renderFormItem = renderContent('renderFormItem', {
          params: { text: text.value, mode: mode.value, ...fieldProps.value, dom },
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
