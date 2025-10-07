/*
 * @Author: shen
 * @Date: 2023-08-09 10:36:49
 * @LastEditors: shen
 * @LastEditTime: 2025-10-07 13:16:45
 * @Description:
 */
import type { PropType } from 'vue'
import type { ProFormItemType } from '../type'

import { computed, defineComponent } from 'vue'
import { useInjectForm } from '../context/FormContext'
import { useInjectSlots } from '../context/FormSlotsContext'
import { isString, RenderVNode, runFunction } from '@pro-design-vue/utils'

import FormRowWrapper from './FormRowWrapper'
import FormColWrapper from './FormColWrapper'
import FormItems from './FormItems'
import FormTitle from './FormTitle'
import getSlot from '../utils/getSlot'

export default defineComponent({
  name: 'FormGroup',
  inheritAttrs: false,
  props: {
    title: {
      type: [String, Object, Function] as PropType<ProFormItemType['title']>,
      default: undefined,
    },
    tooltip: {
      type: [String, Boolean],
      default: undefined,
    },
    colProps: {
      type: Object as PropType<ProFormItemType['colProps']>,
      default: undefined,
    },
    rowProps: {
      type: Object as PropType<ProFormItemType['rowProps']>,
      default: undefined,
    },
    spaceProps: {
      type: Object as PropType<ProFormItemType['spaceProps']>,
      default: undefined,
    },
    items: {
      type: [Array, Function] as PropType<ProFormItemType['children']>,
      default: undefined,
    },
    grid: {
      type: Boolean,
      default: undefined,
    },
    formItemProps: {
      type: [Object, Function] as PropType<ProFormItemType['formItemProps']>,
      default: undefined,
    },
    item: {
      type: Object as PropType<ProFormItemType>,
      default: () => ({}),
    },
  },
  setup(props) {
    const formSlotsContext = useInjectSlots()
    const { formatItems, prefixCls, formData } = useInjectForm()
    const items = computed(
      () => formatItems?.(runFunction(props.items ?? [], formData.value)) ?? [],
    )
    const formItemProps = computed(() => runFunction(props.formItemProps, formData.value) ?? {})
    const isExistTitle = computed(() => {
      if (!props.title) {
        return false
      }
      if (isString(props.title) && props.title.startsWith('::')) {
        return !!formSlotsContext[props.title.substring(2)]
      }
      return true
    })
    return () => {
      const renderFormItem = getSlot(props.item.renderFormItem, formSlotsContext)
      if (!items.value.length && !renderFormItem) return null
      let defaultDom = (
        <FormItems
          spaceProps={props.spaceProps}
          list={items.value}
          type="space"
          grid={props.grid}
        ></FormItems>
      )

      if (renderFormItem) {
        defaultDom = (
          <RenderVNode
            vnode={renderFormItem}
            props={{
              defaultDom,
              formData: formData.value,
            }}
          />
        )
      }
      return (
        <FormColWrapper colProps={props.colProps}>
          <div class={`${prefixCls}-group`}>
            {isExistTitle.value && (
              <div class={`${prefixCls}-group-title`} style={formItemProps.value.titleStyles}>
                <FormTitle title={props.title} tooltip={props.tooltip} />
              </div>
            )}

            <div>
              <FormRowWrapper rowProps={props.rowProps} grid={props.grid}>
                {defaultDom}
              </FormRowWrapper>
            </div>
          </div>
        </FormColWrapper>
      )
    }
  },
})
