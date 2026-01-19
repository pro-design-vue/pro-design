/*
 * @Author: shen
 * @Date: 2023-08-08 14:51:29
 * @LastEditors: shen
 * @LastEditTime: 2026-01-19 17:33:00
 * @Description:
 */
import type { PropType } from 'vue'
import type { ProFormGroupProps } from '../../type'

import { defineComponent, computed } from 'vue'
import { Space } from 'ant-design-vue'
import { useInjectField } from '../../context/FieldContext'
import { useMergedState, usePrefixCls, useVNodeJSX } from '@pro-design-vue/hooks'
import { useInjectForm } from '../../context/FormContext'
import { cloneDeep, cloneElement, isValidElement, omit, type ProVNode } from '@pro-design-vue/utils'
import { RightOutlined } from '@ant-design/icons-vue'
import { useInjectGrid, useProvideGrid } from '../../context/GridContext'

import ColWrapper from '../Grid/ColWrapper'
import ProLabelTip from '@pro-design-vue/components/label-tip'
import RowWrapper from '../Grid/RowWrapper'

export default defineComponent({
  name: 'ProFormGroup',
  inheritAttrs: false,
  props: {
    title: {
      type: [Object, String, Number, null, Boolean] as PropType<ProFormGroupProps['title']>,
    },
    label: {
      type: [Object, String, Number, null, Boolean] as PropType<ProFormGroupProps['label']>,
    },
    extra: {
      type: [Object, String, Number, null, Boolean] as PropType<ProFormGroupProps['extra']>,
    },
    autoFocus: {
      type: Boolean as PropType<ProFormGroupProps['autoFocus']>,
      default: undefined,
    },
    collapsible: {
      type: Boolean as PropType<ProFormGroupProps['collapsible']>,
      default: undefined,
    },
    collapsed: {
      type: Boolean as PropType<ProFormGroupProps['collapsed']>,
      default: undefined,
    },
    defaultCollapsed: {
      type: Boolean as PropType<ProFormGroupProps['defaultCollapsed']>,
      default: undefined,
    },
    labelLayout: {
      type: String as PropType<ProFormGroupProps['labelLayout']>,
      default: undefined,
    },
    tooltip: {
      type: [String, Object] as PropType<ProFormGroupProps['tooltip']>,
      default: undefined,
    },
    align: {
      type: String as PropType<ProFormGroupProps['align']>,
      default: 'start',
    },
    direction: {
      type: String as PropType<ProFormGroupProps['direction']>,
      default: undefined,
    },
    grid: {
      type: Boolean as PropType<ProFormGroupProps['grid']>,
      default: undefined,
    },
    size: {
      type: [String, Number, Array] as PropType<ProFormGroupProps['size']>,
      default: 32,
    },
    titleStyle: {
      type: Object as PropType<ProFormGroupProps['titleStyle']>,
    },
    spaceProps: {
      type: Object as PropType<ProFormGroupProps['spaceProps']>,
    },
    colProps: {
      type: Object as PropType<ProFormGroupProps['colProps']>,
    },
    rowProps: {
      type: Object as PropType<ProFormGroupProps['rowProps']>,
    },
    onCollapse: {
      type: Function as PropType<ProFormGroupProps['onCollapse']>,
    },
  },
  setup(props, { slots, attrs }) {
    const { store } = useInjectForm()
    const { groupProps } = useInjectField()
    const { grid, colProps, rowProps } = useInjectGrid()
    const prefixCls = usePrefixCls('form-group')
    const renderContent = useVNodeJSX()
    const [collapsed, setCollapsed] = useMergedState(() => props.defaultCollapsed || false, {
      value: computed(() => props.collapsed!),
      onChange: props.onCollapse,
    })

    const mergeProps = computed(() => ({
      ...groupProps?.value,
      ...props,
      title: props.title || props.label,
    }))
    const mergeGrid = computed(() => mergeProps.value.grid ?? grid?.value)
    const childrens = computed(() => {
      const hiddenChildren: ProVNode[] = []
      const childrenList = slots.default?.()?.map((element, index) => {
        if (
          isValidElement(element) &&
          (element?.props?.hidden === true || element?.props?.hidden === '')
        ) {
          hiddenChildren.push(element)
          return null
        }
        if (index === 0 && isValidElement(element) && mergeProps.value?.autoFocus) {
          return cloneElement(element, {
            ...(element.props as any),
            autoFocus: mergeProps.value?.autoFocus,
          })
        }
        return element
      })

      return [childrenList, hiddenChildren]
    })

    useProvideGrid({
      grid: computed(() => mergeGrid.value!),
      colProps,
      rowProps,
    })

    return () => {
      const collapsibleButton = props.collapsible && (
        <RightOutlined
          style={{
            marginInlineEnd: '8px',
          }}
          rotate={!collapsed.value ? 90 : undefined}
        />
      )

      const label = (
        <ProLabelTip
          label={
            collapsibleButton ? (
              <div>
                {collapsibleButton}
                {mergeProps.value.title}
              </div>
            ) : (
              mergeProps.value.title
            )
          }
          tooltip={mergeProps.value.tooltip}
        />
      )

      const titleDom = renderContent('title', {
        slotFirst: true,
        props: {
          ...mergeProps.value,
          title: label,
        },
        slots: {
          title: slots.title || slots.label,
        },
        params: {
          props: mergeProps.value,
          dom: label,
          formValues: cloneDeep(store.formValues.value),
        },
      })

      const extraDom = renderContent('extra', {
        slotFirst: true,
        props: mergeProps.value,
        params: { props: mergeProps.value, formValues: cloneDeep(store.formValues.value) },
      })

      const [childrenDoms, hiddenDoms] = childrens.value

      return (
        <ColWrapper grid={grid?.value} colProps={mergeProps.value.colProps}>
          <div
            {...attrs}
            class={{
              [prefixCls]: true,
              [`${prefixCls}-twoLine`]: props.labelLayout === 'twoLine',
            }}
          >
            {(hiddenDoms ?? []).length > 0 ? (
              <div
                style={{
                  display: 'none',
                }}
              >
                {hiddenDoms}
              </div>
            ) : null}
            {(titleDom || mergeProps.value?.tooltip || extraDom) && (
              <div
                class={`${prefixCls}-title`}
                style={mergeProps.value?.titleStyle}
                onClick={() => {
                  setCollapsed(!collapsed.value)
                }}
              >
                {extraDom ? (
                  <div
                    style={{
                      display: 'flex',
                      width: '100%',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    {titleDom}
                    <span onClick={(e) => e.stopPropagation()}>{extraDom}</span>
                  </div>
                ) : (
                  titleDom
                )}
              </div>
            )}
            <div
              style={{
                display: mergeProps.value?.collapsible && collapsed.value ? 'none' : undefined,
              }}
            >
              {mergeGrid.value ? (
                <RowWrapper
                  key="children"
                  grid={mergeProps.value.grid}
                  rowProps={mergeProps.value.rowProps}
                >
                  {childrenDoms}
                </RowWrapper>
              ) : (
                <Space
                  {...omit(mergeProps.value.spaceProps ?? {}, ['size', 'align', 'direction'])}
                  class={`${prefixCls}-container`}
                  style={{ rowGap: '0px' }}
                  size={mergeProps.value.size}
                  align={mergeProps.value.align}
                  direction={mergeProps.value.direction}
                >
                  {childrenDoms}
                </Space>
              )}
            </div>
          </div>
        </ColWrapper>
      )
    }
  },
})
