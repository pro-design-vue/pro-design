/*
 * @Author: shen
 * @Date: 2025-12-05 15:58:31
 * @LastEditors: shen
 * @LastEditTime: 2026-01-19 15:48:00
 * @Description:
 */
import type { ProFieldProps } from '../../type'

import { computed, defineComponent, ref, toRefs, unref, type PropType, type VNode } from 'vue'
import { baseFieldProps } from '../../props'
import { useIntl } from '@pro-design-vue/components/config-provider'
import { InputNumber, type InputNumberProps } from 'ant-design-vue'
import { usePrefixCls, useVNodeJSX } from '@pro-design-vue/hooks'
import { omit } from '@pro-design-vue/utils'

const defaultMoneyIntl = new Intl.NumberFormat('zh-Hans-CN', {
  currency: 'CNY',
  style: 'currency',
})

const enMoneyIntl = {
  style: 'currency',
  currency: 'USD',
}

const ruMoneyIntl = {
  style: 'currency',
  currency: 'RUB',
}

const rsMoneyIntl = {
  style: 'currency',
  currency: 'RSD',
}

const msMoneyIntl = {
  style: 'currency',
  currency: 'MYR',
}

const ptMoneyIntl = {
  style: 'currency',
  currency: 'BRL',
}

const intlMap = {
  default: defaultMoneyIntl,
  'zh-Hans-CN': {
    currency: 'CNY',
    style: 'currency',
  },
  'en-US': enMoneyIntl,
  'ru-RU': ruMoneyIntl,
  'ms-MY': msMoneyIntl,
  'sr-RS': rsMoneyIntl,
  'pt-BR': ptMoneyIntl,
}

/**
 * A function that formats the number.
 * @param {string | false} locale - The currency symbol, which is the first parameter of the
 * formatMoney function.
 * @param {number | string | undefined} paramsText - The text to be formatted
 * @param {number} precision - number, // decimal places
 * @param {any} [config] - the configuration of the number format, which is the same as the
 * configuration of the number format in the Intl.NumberFormat method.
 * @returns A function that takes in 4 parameters and returns a string.
 */
const getTextByLocale = (
  locale: string | false,
  paramsText: number | string | undefined,
  precision: number,
  config?: any,
  moneySymbol: string = '',
) => {
  let moneyText: number | string | undefined = paramsText?.toString().replaceAll(',', '')
  if (typeof moneyText === 'string') {
    const parsedNum = Number(moneyText)
    // 转换数字为NaN时，返回原始值展示
    if (Number.isNaN(parsedNum)) return moneyText
    moneyText = parsedNum
  }
  if (!moneyText && moneyText !== 0) return ''

  let supportFormat = false

  try {
    supportFormat =
      locale !== false &&
      Intl.NumberFormat.supportedLocalesOf([locale.replace('_', '-')], {
        localeMatcher: 'lookup',
      }).length > 0
  } catch (error) {}

  try {
    // Formatting the number, when readonly moneySymbol = false, unused currency.
    const initNumberFormatter = new Intl.NumberFormat(
      supportFormat && locale !== false ? locale?.replace('_', '-') || 'zh-Hans-CN' : 'zh-Hans-CN',
      {
        ...(intlMap[(locale as 'zh-Hans-CN') || 'zh-Hans-CN'] || defaultMoneyIntl),
        maximumFractionDigits: precision,
        ...config,
      },
    )

    const finalMoneyText = initNumberFormatter.format(moneyText)

    // 同时出现两个符号的情况需要处理
    const doubleSymbolFormat = (Text: string) => {
      const match = Text.match(/\d+/)
      if (match) {
        const number = match[0]
        return Text.slice(Text.indexOf(number))
      } else {
        return Text
      }
    }
    // 过滤一下，只留下数字
    const pureMoneyText = doubleSymbolFormat(finalMoneyText)

    /**
     * 首字母判断是否是正负符号
     */
    const [operatorSymbol] = finalMoneyText || ''

    // 兼容正负号
    if (['+', '-'].includes(operatorSymbol!)) {
      return `${moneySymbol || ''}${operatorSymbol}${pureMoneyText}`
    }
    return `${moneySymbol || ''}${pureMoneyText}`
  } catch (error) {
    return moneyText
  }
}

// 默认的代码类型
const DefaultPrecisionCont = 2

export default defineComponent({
  name: 'FieldMoney',
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
          moneySymbol?: boolean
          locale?: string
          customSymbol?: string
          numberFormatOptions?: {
            /**
             * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat
             */
            localeMatcher?: string
            /**
             * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat
             */
            style?: string
            /**
             * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat
             */
            currency?: string
            /**
             * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat
             */
            currencyDisplay?: string
            /**
             * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat
             */
            currencySign?: string
            /**
             * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat
             */
            useGrouping?: boolean
            /**
             * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat
             */
            minimumIntegerDigits?: number
            /**
             * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat
             */
            minimumFractionDigits?: number
            /**
             * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat
             */
            maximumFractionDigits?: number
            /**
             * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat
             */
            minimumSignificantDigits?: number

            /**
             * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat
             */
            maximumSignificantDigits?: number
          }
          onChange?: (...args: any[]) => void
        }
      >,
      default: undefined,
    },
  },
  setup(props, { slots, attrs, expose }) {
    const intl = useIntl()
    const prefixCls = usePrefixCls('field-money')
    const fieldRef = ref<HTMLInputElement>()
    const renderVNodeJSX = useVNodeJSX()
    const { mode, text, fieldProps } = toRefs(props)
    const precision = computed(() => fieldProps?.value?.precision ?? DefaultPrecisionCont)
    /**
     * 获取货币的符号
     * 如果 customSymbol 存在直接使用 customSymbol
     * 如果 moneySymbol 为 false，返回空
     * 如果没有配置使用默认的
     */
    const moneySymbol = computed((): string | undefined => {
      if (fieldProps?.value?.customSymbol) {
        return fieldProps?.value?.customSymbol
      }

      if (fieldProps?.value?.moneySymbol === false) {
        return undefined
      }
      return intl.getMessage('moneySymbol', '¥')
    })

    const getFormateValue = (value?: string | number) => {
      // 新建数字正则，需要配置小数点
      const reg = new RegExp(
        `\\B(?=(\\d{${3 + Math.max(precision.value - DefaultPrecisionCont, 0)}})+(?!\\d))`,
        'g',
      )
      // 切分为 整数 和 小数 不同
      const [intStr, floatStr] = String(value).split('.')

      // 最终的数据string，需要去掉 , 号。
      const resultInt = intStr?.replace(reg, ',')

      // 计算最终的小数点
      let resultFloat = ''

      /* Taking the floatStr and slicing it to the precision. */
      if (floatStr && precision.value > 0) {
        resultFloat = `.${floatStr.slice(
          0,
          precision.value === undefined ? DefaultPrecisionCont : precision.value,
        )}`
      }

      return `${resultInt}${resultFloat}`
    }

    expose({
      fieldRef: computed(() => {
        return unref(fieldRef)
      }),
    })
    return () => {
      if (mode.value === 'read') {
        const dom = (
          <span>
            {getTextByLocale(
              fieldProps?.value?.locale || false,
              text.value,
              precision.value,
              fieldProps?.value?.numberFormatOptions,
              moneySymbol.value,
            )}
          </span>
        )

        const render = renderVNodeJSX('render', {
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
            {...attrs}
            ref={fieldRef}
            precision={precision.value}
            placeholder={placeholder}
            class={prefixCls}
            // 删除默认min={0}，允许输入一个负数的金额，用户可自行配置min来限制是否允许小于0的金额
            formatter={(value) => {
              if (value && moneySymbol.value) {
                return `${moneySymbol.value} ${getFormateValue(value)}`
              }
              return value?.toString()
            }}
            parser={(value) => {
              if (moneySymbol.value && value) {
                return value.replace(new RegExp(`\\${moneySymbol.value}\\s?|(,*)`, 'g'), '')
              }
              return value!
            }}
            {...omit(fieldProps.value ?? {}, [
              'precision',
              'parser',
              'placeholder',
              'formatter',
              'locale',
              'numberFormatOptions',
              'customSymbol',
              'moneySymbol',
              'onBlur',
            ])}
            v-slots={slots}
            onBlur={
              fieldProps?.value?.onBlur
                ? (e: any) => {
                    let value = e.target?.value
                    if (moneySymbol.value && value) {
                      value = value.replace(new RegExp(`\\${moneySymbol.value}\\s?|(,*)`, 'g'), '')
                    }
                    fieldProps?.value?.onBlur?.(value)
                  }
                : undefined
            }
          />
        )

        const renderFormItem = renderVNodeJSX('renderFormItem', {
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
