/*
 * @Author: shen
 * @Date: 2023-08-08 14:51:29
 * @LastEditors: shen
 * @LastEditTime: 2026-01-19 17:22:46
 * @Description:
 */
import type { PropType } from 'vue'
import type { ProFormItemProps } from '../FormItem'
import type { ProFormGridConfig } from '../../type'

import { defineComponent, computed } from 'vue'
import { Space, type SpaceProps } from 'ant-design-vue'
import { Form } from 'ant-design-vue'
import { cloneElement, isValidElement, omit } from '@pro-design-vue/utils'
import { useInjectGrid, useProvideGrid } from '../../context/GridContext'
import { createField } from '../../BaseForm/createField'
import { formItemProps } from 'ant-design-vue/es/form'
import RowWrapper from '../Grid/RowWrapper'

export type ProFormFieldSetProps<T = any> = ProFormItemProps & {
  value?: T[]
  initialValue?: any
  onChange?: (value: T[]) => void
  fieldProps?: any
  spaceProps?: SpaceProps
  convertValue?: ProFormItemProps['convertValue']
  transform?: ProFormItemProps['transform']
} & ProFormGridConfig

const BaseProFormFieldSet = defineComponent({
  name: 'ProFormFieldSet',
  inheritAttrs: false,
  props: {
    ...formItemProps(),
    value: {
      type: Array as PropType<ProFormFieldSetProps['value']>,
      default: () => [],
    },
    grid: {
      type: Boolean as PropType<ProFormFieldSetProps['grid']>,
      default: undefined,
    },
    fieldProps: {
      type: Object as PropType<ProFormFieldSetProps['fieldProps']>,
    },
    spaceProps: {
      type: Object as PropType<ProFormFieldSetProps['spaceProps']>,
    },
    colProps: {
      type: Object as PropType<ProFormFieldSetProps['colProps']>,
    },
    rowProps: {
      type: Object as PropType<ProFormFieldSetProps['rowProps']>,
    },
    ignoreFormItem: Boolean,
    proFormFieldKey: [String, Number],
    mode: {
      type: String as PropType<ProFormFieldSetProps['mode']>,
      default: undefined,
    },
    dataFormat: {
      type: String,
      default: undefined,
    },
    initialValue: {
      type: [Object, String, Number, null, Boolean, Array] as PropType<
        ProFormFieldSetProps['initialValue']
      >,
      default: undefined,
    },
    transform: {
      type: Function as PropType<ProFormItemProps['transform']>,
    },
    convertValue: {
      type: Function as PropType<ProFormFieldSetProps['transform']>,
    },
    addonBefore: {
      type: [Object, String, Number, null, Boolean, Array] as PropType<
        ProFormFieldSetProps['addonBefore']
      >,
    },
    addonAfter: {
      type: [Object, String, Number, null, Boolean, Array] as PropType<
        ProFormFieldSetProps['addonAfter']
      >,
    },
    onChange: {
      type: Function as PropType<ProFormFieldSetProps['onChange']>,
    },
  },
  setup(props, { slots }) {
    const { grid, colProps, rowProps } = useInjectGrid()
    const mergeGrid = computed(() => props.grid ?? grid?.value)
    const formItemContext = Form.useInjectFormItemContext()
    const fieldSetOnChange = (fileValue: any, index: number) => {
      const newValues = [...props.value]
      newValues[index] = fileValue
      props.onChange?.(newValues)
      props.fieldProps?.onChange?.(newValues)
      formItemContext.onFieldChange()
    }

    useProvideGrid({
      grid: computed(() => mergeGrid.value!),
      colProps,
      rowProps,
    })

    return () => {
      console.log(props)
      const list = slots.default?.()?.map((item: any, index) => {
        if (isValidElement(item)) {
          const forkProps = {
            key: index,
            name: undefined,
            ignoreFormItem: true,
            ...((item.props as any) || {}),
            // 如果不是我们自定义的组件 fieldProps 无法识别
            fieldProps: {
              ...(item?.props as any)?.fieldProps,
              onChange: (...restParams: any) => {
                fieldSetOnChange(restParams[0], index)
              },
            },
            value: props.value?.[index],
            onChange: undefined,
          }
          return cloneElement(item, forkProps)
        }
        return item
      })

      return mergeGrid.value ? (
        <RowWrapper grid={props.grid} rowProps={props.rowProps}>
          {list}
        </RowWrapper>
      ) : (
        <Space {...omit(props.spaceProps ?? {}, ['align', 'wrap'])} align="start" wrap>
          {list}
        </Space>
      )
    }
  },
})

const ProFormFieldSet = createField<ProFormItemProps>(BaseProFormFieldSet)

export default ProFormFieldSet as typeof BaseProFormFieldSet
