/*
 * @Author: shen
 * @Date: 2025-12-05 15:58:31
 * @LastEditors: shen
 * @LastEditTime: 2026-01-19 17:09:36
 * @Description:
 */
import type { ProFieldRenderProps } from './type'

import { computed, defineComponent, ref, toRefs, watch, type VNode } from 'vue'
import { proFieldProps } from './props'
import {
  omit,
  cloneElement,
  isValidElement,
  omitKeysAndUndefined,
  omitUndefined,
  pickProProps,
  type ProVNode,
} from '@pro-design-vue/utils'
import { usePrefixCls, useVNodeJSX } from '@pro-design-vue/hooks'
import { Avatar } from 'ant-design-vue'
import FieldText from './components/Text'
import FieldPassword from './components/Password'
import FieldTextArea from './components/TextArea'
import FieldCode from './components/Code'
import FieldDigit from './components/Digit'
import FieldSelect from './components/Select'
import FieldTreeSelect from './components/TreeSelect'
import FieldMoney from './components/Money'
import FieldImage from './components/Image'
import FieldColorPicker from './components/ColorPicker'
import FieldDigitRange from './components/DigitRange'
import FieldSecond from './components/Second'
import FieldPercent from './components/Percent'
import FieldRate from './components/Rate'
import FieldCheckbox from './components/Checkbox'
import FieldRadio from './components/Radio'
import FieldCascader from './components/Cascader'
import FieldProgress from './components/Progress'
import FieldSlider from './components/Slider'
import FieldFromNow from './components/FromNow'
import FieldDatePicker from './components/DatePicker'
import FieldRangePicker from './components/RangePicker'
import FieldTimePicker from './components/TimePicker'
import FieldTimeRangePicker from './components/TimeRangePicker'
import FieldIndexColumn from './components/IndexColumn'
import FieldSwitch from './components/Switch'
import FieldSegmented from './components/Segmented'
import FieldOptions from './components/Options'

import advancedFormat from 'dayjs/plugin/advancedFormat.js'
import isoWeek from 'dayjs/plugin/isoWeek.js'
import localeData from 'dayjs/plugin/localeData.js'
import localizedFormat from 'dayjs/plugin/localizedFormat.js'
import weekday from 'dayjs/plugin/weekday.js'
import weekOfYear from 'dayjs/plugin/weekOfYear.js'

import dayjs from 'dayjs'

dayjs.extend(localeData)
dayjs.extend(advancedFormat)
dayjs.extend(isoWeek)
dayjs.extend(weekOfYear)
dayjs.extend(weekday)
dayjs.extend(localizedFormat)

export default defineComponent({
  name: 'ProField',
  inheritAttrs: false,
  props: proFieldProps,
  setup(props, { slots, attrs, emit }) {
    const fieldRef = ref(null)
    const prefixCls = usePrefixCls('field')
    const renderContent = useVNodeJSX()
    const { mode, text, emptyText, fieldProps: restFieldProps, valueType, readonly } = toRefs(props)
    const onChangeCallBack = (...restParams: any[]) => {
      restFieldProps.value?.onChange?.(...restParams)
      props?.onChange?.(...restParams)
      emit('update:value', ...restParams)
    }

    const fieldProps = computed(() => {
      return (
        (props.value !== undefined || restFieldProps.value) && {
          value: props.value,
          ...omitUndefined(restFieldProps.value),
          onChange: onChangeCallBack,
        }
      )
    })
    const proFieldProps = computed(() => {
      const rest = omitKeysAndUndefined(props, [
        'mode',
        'text',
        'valueType',
        'placeholder',
        'onChange',
        'renderFormItem',
        'value',
        'readonly',
        'fieldProps',
      ])
      const renderFormItem = props.renderFormItem
      return omitUndefined({
        ...rest,
        ref: fieldRef,
        mode: readonly.value ? 'read' : mode.value,
        renderFormItem: renderFormItem
          ? (curText: any, props: ProFieldRenderProps, dom: VNode) => {
              const { placeholder: _placeholder, ...restProps } = props
              const newDom = renderFormItem({ text: curText, props: restProps, dom }) as any
              if (isValidElement(newDom))
                return cloneElement(newDom, {
                  ...fieldProps.value,
                  ...((newDom.props as any) || {}),
                })
              return newDom
            }
          : undefined,
        placeholder: renderFormItem
          ? undefined
          : (props.placeholder ?? fieldProps.value?.placeholder),
        fieldProps: pickProProps(
          omitUndefined({
            ...fieldProps.value,
            placeholder: renderFormItem
              ? undefined
              : (props.placeholder ?? fieldProps.value?.placeholder),
          }),
        ),
      })
    })

    return () => {
      console.log('🚀 ~ return ~ valueType.value:', valueType.value)

      const dataValue =
        mode.value === 'edit'
          ? (fieldProps.value?.value ?? text.value)
          : (text.value ?? fieldProps.value?.value)
      if (
        emptyText.value !== false &&
        mode.value === 'read' &&
        valueType.value !== 'option' &&
        valueType.value !== 'switch'
      ) {
        if (typeof dataValue !== 'boolean' && typeof dataValue !== 'number' && !dataValue) {
          const render = renderContent('render', {
            params: { ...proFieldProps.value, text: dataValue, dom: <>{emptyText.value}</> },
            slotFirst: true,
          })
          if (render) {
            return render
          }
          return <>{emptyText.value}</>
        }
      }

      if (valueType.value === 'index') {
        return <FieldIndexColumn text={(dataValue as number) + 1} />
      }

      if (valueType.value === 'indexBorder') {
        return <FieldIndexColumn text={(dataValue as number) + 1} border />
      }
      /** 如果是日期的值 */
      if (valueType.value === 'date') {
        return (
          <FieldDatePicker
            text={dataValue as number}
            v-slots={slots}
            format="YYYY-MM-DD"
            class={[prefixCls, attrs.class]}
            style={attrs.style}
            {...(omit(proFieldProps.value, ['text']) as any)}
          />
        )
      }
      /** 如果是周的值 */
      if (valueType.value === 'dateWeek') {
        return (
          <FieldDatePicker
            text={dataValue as number}
            v-slots={slots}
            format="YYYY-wo"
            picker="week"
            class={[prefixCls, attrs.class]}
            style={attrs.style}
            {...(omit(proFieldProps.value, ['text']) as any)}
          />
        )
      }

      /** 如果是月的值 */
      if (valueType.value === 'dateMonth') {
        return (
          <FieldDatePicker
            text={dataValue as number}
            v-slots={slots}
            format="YYYY-MM"
            picker="month"
            class={[prefixCls, attrs.class]}
            style={attrs.style}
            {...(omit(proFieldProps.value, ['text']) as any)}
          />
        )
      }

      /** 如果是季度的值 */
      if (valueType.value === 'dateQuarter') {
        return (
          <FieldDatePicker
            text={dataValue as number}
            v-slots={slots}
            format="YYYY-[Q]Q"
            picker="quarter"
            class={[prefixCls, attrs.class]}
            style={attrs.style}
            {...(omit(proFieldProps.value, ['text']) as any)}
          />
        )
      }

      /** 如果是年的值 */
      if (valueType.value === 'dateYear') {
        return (
          <FieldDatePicker
            text={dataValue as number}
            v-slots={slots}
            format="YYYY"
            picker="year"
            class={[prefixCls, attrs.class]}
            style={attrs.style}
            {...(omit(proFieldProps.value, ['text']) as any)}
          />
        )
      }

      if (valueType.value === 'dateTime') {
        return (
          <FieldDatePicker
            text={dataValue as number}
            v-slots={slots}
            format="YYYY-MM-DD HH:mm:ss"
            showTime
            class={[prefixCls, attrs.class]}
            style={attrs.style}
            {...(omit(proFieldProps.value, ['text']) as any)}
          />
        )
      }

      if (valueType.value === 'fromNow') {
        return (
          <FieldFromNow
            text={dataValue as string}
            v-slots={slots}
            class={[prefixCls, attrs.class]}
            style={attrs.style}
            {...(omit(proFieldProps.value, ['text']) as any)}
          />
        )
      }

      /** 如果是日期范围的值 */
      if (valueType.value === 'dateRange') {
        return (
          <FieldRangePicker
            text={dataValue as string[]}
            v-slots={slots}
            format="YYYY-MM-DD"
            class={[prefixCls, attrs.class]}
            style={attrs.style}
            {...(omit(proFieldProps.value, ['text']) as any)}
          />
        )
      }

      /** 如果是日期加时间类型的值的值 */
      if (valueType.value === 'dateTimeRange') {
        return (
          <FieldRangePicker
            text={dataValue as string[]}
            v-slots={slots}
            format="YYYY-MM-DD HH:mm:ss"
            showTime
            class={[prefixCls, attrs.class]}
            style={attrs.style}
            {...(omit(proFieldProps.value, ['text']) as any)}
          />
        )
      }

      /** 如果是周范围的值 */
      if (valueType.value === 'dateWeekRange') {
        return (
          <FieldRangePicker
            text={dataValue as string[]}
            v-slots={slots}
            picker="week"
            class={[prefixCls, attrs.class]}
            style={attrs.style}
            {...(omit(proFieldProps.value, ['text']) as any)}
          />
        )
      }

      /** 如果是月范围的值 */
      if (valueType.value === 'dateMonthRange') {
        return (
          <FieldRangePicker
            text={dataValue as string[]}
            v-slots={slots}
            format="YYYY-MM"
            picker="month"
            class={[prefixCls, attrs.class]}
            style={attrs.style}
            {...(omit(proFieldProps.value, ['text']) as any)}
          />
        )
      }

      /** 如果是季范围的值 */
      if (valueType.value === 'dateQuarterRange') {
        return (
          <FieldRangePicker
            text={dataValue as string[]}
            v-slots={slots}
            format="YYYY-Q"
            picker="quarter"
            class={[prefixCls, attrs.class]}
            style={attrs.style}
            {...(omit(proFieldProps.value, ['text']) as any)}
          />
        )
      }

      /** 如果是年范围的值 */
      if (valueType.value === 'dateYearRange') {
        return (
          <FieldRangePicker
            text={dataValue as string[]}
            v-slots={slots}
            format="YYYY"
            picker="year"
            class={[prefixCls, attrs.class]}
            style={attrs.style}
            {...(omit(proFieldProps.value, ['text']) as any)}
          />
        )
      }

      /** 如果是时间类型的值 */
      if (valueType.value === 'time') {
        return (
          <FieldTimePicker
            text={dataValue as string}
            v-slots={slots}
            format="HH:mm:ss"
            class={[prefixCls, attrs.class]}
            style={attrs.style}
            {...(omit(proFieldProps.value, ['text']) as any)}
          />
        )
      }

      /** 如果是时间类型的值 */
      if (valueType.value === 'timeRange') {
        return (
          <FieldTimeRangePicker
            text={dataValue as string[]}
            v-slots={slots}
            format="HH:mm:ss"
            class={[prefixCls, attrs.class]}
            style={attrs.style}
            {...(omit(proFieldProps.value, ['text']) as any)}
          />
        )
      }

      if (valueType.value === 'option') {
        return (
          <FieldOptions
            v-slots={slots}
            text={dataValue as string}
            class={[prefixCls, attrs.class]}
            style={attrs.style}
            {...(omit(proFieldProps.value, ['text']) as any)}
          />
        )
      }

      if (valueType.value === 'avatar' && typeof dataValue === 'string' && props.mode === 'read') {
        return <Avatar src={dataValue as string} size={22} shape="circle" />
      }

      if (valueType.value === 'image') {
        return (
          <FieldImage
            v-slots={slots}
            text={dataValue as string}
            class={[prefixCls, attrs.class]}
            style={attrs.style}
            {...(omit(proFieldProps.value, ['text']) as any)}
          />
        )
      }

      if (valueType.value === 'color') {
        return (
          <FieldColorPicker
            v-slots={slots}
            text={dataValue as string}
            class={[prefixCls, attrs.class]}
            style={attrs.style}
            {...(omit(proFieldProps.value, ['text']) as any)}
          />
        )
      }

      if (valueType.value === 'money') {
        return (
          <FieldMoney
            v-slots={slots}
            text={dataValue as number}
            class={[prefixCls, attrs.class]}
            style={attrs.style}
            {...(omit(proFieldProps.value, ['text']) as any)}
          />
        )
      }

      if (valueType.value === 'digit') {
        return (
          <FieldDigit
            v-slots={slots}
            text={dataValue as number}
            class={[prefixCls, attrs.class]}
            style={attrs.style}
            {...(omit(proFieldProps.value, ['text']) as any)}
          />
        )
      }

      if (valueType.value === 'digitRange') {
        return (
          <FieldDigitRange
            v-slots={slots}
            text={dataValue as number[]}
            class={[prefixCls, attrs.class]}
            style={attrs.style}
            {...(omit(proFieldProps.value, ['text']) as any)}
          />
        )
      }

      if (valueType.value === 'second') {
        return (
          <FieldSecond
            v-slots={slots}
            text={dataValue as number}
            class={[prefixCls, attrs.class]}
            style={attrs.style}
            {...(omit(proFieldProps.value, ['text']) as any)}
          />
        )
      }

      if (valueType.value === 'percent') {
        return (
          <FieldPercent
            v-slots={slots}
            text={dataValue as number}
            class={[prefixCls, attrs.class]}
            style={attrs.style}
            {...(omit(proFieldProps.value, ['text']) as any)}
          />
        )
      }

      if (valueType.value === 'rate') {
        return (
          <FieldRate
            v-slots={slots}
            text={dataValue as number}
            class={[prefixCls, attrs.class]}
            style={attrs.style}
            {...(omit(proFieldProps.value, ['text']) as any)}
          />
        )
      }

      if (valueType.value === 'checkbox') {
        return (
          <FieldCheckbox
            text={dataValue as string[]}
            v-slots={slots}
            class={[prefixCls, attrs.class]}
            style={attrs.style}
            {...(omit(proFieldProps.value, ['text']) as any)}
          />
        )
      }

      if (valueType.value === 'radio') {
        return (
          <FieldRadio
            text={dataValue as string}
            v-slots={slots}
            class={[prefixCls, attrs.class]}
            style={attrs.style}
            {...(omit(proFieldProps.value, ['text']) as any)}
          />
        )
      }

      if (valueType.value === 'radioButton') {
        return (
          <FieldRadio
            text={dataValue as string}
            v-slots={slots}
            optionType="button"
            class={[prefixCls, attrs.class]}
            style={attrs.style}
            {...(omit(proFieldProps.value, ['text']) as any)}
          />
        )
      }

      if (valueType.value === 'segmented') {
        return (
          <FieldSegmented
            text={dataValue as string}
            v-slots={slots}
            class={[prefixCls, attrs.class]}
            style={attrs.style}
            {...(omit(proFieldProps.value, ['text']) as any)}
          />
        )
      }

      if (valueType.value === 'switch') {
        return (
          <FieldSwitch
            text={dataValue as boolean}
            v-slots={slots}
            class={[prefixCls, attrs.class]}
            style={attrs.style}
            {...(omit(proFieldProps.value, ['text']) as any)}
          />
        )
      }

      if (valueType.value === 'cascader') {
        return (
          <FieldCascader
            text={dataValue as string}
            v-slots={slots}
            class={[prefixCls, attrs.class]}
            style={attrs.style}
            {...(omit(proFieldProps.value, ['text']) as any)}
          />
        )
      }

      if (valueType.value === 'progress') {
        return (
          <FieldProgress
            text={dataValue as number}
            v-slots={slots}
            class={[prefixCls, attrs.class]}
            style={attrs.style}
            {...(omit(proFieldProps.value, ['text']) as any)}
          />
        )
      }

      if (valueType.value === 'slider') {
        return (
          <FieldSlider
            text={dataValue as number}
            v-slots={slots}
            class={[prefixCls, attrs.class]}
            style={attrs.style}
            {...(omit(proFieldProps.value, ['text']) as any)}
          />
        )
      }

      if (
        valueType.value === 'select' ||
        (valueType.value === 'text' && (props.valueEnum || props.request))
      ) {
        return (
          <FieldSelect
            text={dataValue as string}
            v-slots={slots}
            class={[prefixCls, attrs.class]}
            style={attrs.style}
            {...(omit(proFieldProps.value, ['text']) as any)}
          />
        )
      }

      if (valueType.value === 'treeSelect') {
        return (
          <FieldTreeSelect
            text={dataValue as string}
            v-slots={slots}
            class={[prefixCls, attrs.class]}
            style={attrs.style}
            {...(omit(proFieldProps.value, ['text']) as any)}
          />
        )
      }

      if (valueType.value === 'code') {
        return (
          <FieldCode
            text={dataValue as string}
            v-slots={slots}
            class={[prefixCls, attrs.class]}
            style={attrs.style}
            {...(omit(proFieldProps.value, ['text']) as any)}
          />
        )
      }

      if (valueType.value === 'jsonCode') {
        return (
          <FieldCode
            text={dataValue as string}
            v-slots={slots}
            language="json"
            class={[prefixCls, attrs.class]}
            style={attrs.style}
            {...(omit(proFieldProps.value, ['text']) as any)}
          />
        )
      }

      if (valueType.value === 'password') {
        return (
          <FieldPassword
            text={dataValue as string}
            v-slots={slots}
            class={[prefixCls, attrs.class]}
            style={attrs.style}
            {...(omit(proFieldProps.value, ['text']) as any)}
          />
        )
      }

      if (valueType.value === 'textarea') {
        return (
          <FieldTextArea
            text={dataValue as string}
            v-slots={slots}
            class={[prefixCls, attrs.class]}
            style={attrs.style}
            {...(omit(proFieldProps.value, ['text']) as any)}
          />
        )
      }

      return (
        <FieldText
          text={dataValue as string}
          v-slots={slots}
          class={[prefixCls, attrs.class]}
          style={attrs.style}
          {...(omit(proFieldProps.value, ['text']) as any)}
        />
      )
    }
  },
})
