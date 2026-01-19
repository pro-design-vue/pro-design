/*
 * @Author: shen
 * @Date: 2023-08-08 14:51:29
 * @LastEditors: shen
 * @LastEditTime: 2026-01-14 15:19:34
 * @Description:
 */
import type { PropType } from 'vue'
import type { ProVNode } from '@pro-design-vue/utils'
import { defineComponent, computed } from 'vue'
import { usePrefixCls, useVNodeJSX } from '@pro-design-vue/hooks'
import { InfoCircleOutlined } from '@ant-design/icons-vue'
import { Tooltip, type TooltipProps } from 'ant-design-vue'

export default defineComponent({
  name: 'ProLabelTip',
  inheritAttrs: false,
  props: {
    label: {
      type: [Object, String, Number, null, Boolean] as PropType<ProVNode>,
    },
    subTitle: {
      type: [Object, String, Number, null, Boolean] as PropType<ProVNode>,
    },
    tooltip: {
      type: [String, Object] as PropType<
        | (TooltipProps & {
            icon?: ProVNode
          })
        | string
      >,
      default: undefined,
    },
    ellipsis: {
      type: [Boolean, Object] as PropType<{
        showTitle?: boolean
      }>,
      default: undefined,
    },
  },
  setup(props, { attrs }) {
    const prefixCls = usePrefixCls('label-tip')
    const renderContent = useVNodeJSX()

    const tooltipProps = computed(() =>
      typeof props.tooltip === 'string' ? { title: props.tooltip } : props.tooltip,
    )

    return () => {
      const labelDom = renderContent('label', {
        slotFirst: true,
        props,
      })

      const subTitleDom = renderContent('subTitle', {
        slotFirst: true,
        props,
      })
      if (!subTitleDom && !props.tooltip) {
        return <>{labelDom}</>
      }
      const icon = tooltipProps.value?.icon || <InfoCircleOutlined />
      return (
        <div
          {...attrs}
          class={prefixCls}
          onMousedown={(e) => e.stopPropagation()}
          onMouseleave={(e) => e.stopPropagation()}
          onMousemove={(e) => e.stopPropagation()}
        >
          <div
            class={{
              [`${prefixCls}-title`]: true,
              [`${prefixCls}-title-ellipsis`]: props.ellipsis,
            }}
          >
            {labelDom}
          </div>
          {subTitleDom && (
            <div
              class={{
                [`${prefixCls}-subtitle`]: true,
              }}
            >
              {subTitleDom}
            </div>
          )}
          {props.tooltip && (
            <Tooltip {...tooltipProps.value}>
              <span
                class={{
                  [`${prefixCls}-icon`]: true,
                }}
              >
                {icon}
              </span>
            </Tooltip>
          )}
        </div>
      )
    }
  },
})
