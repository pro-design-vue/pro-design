/*
 * @Author: shen
 * @Date: 2023-08-10 13:00:22
 * @LastEditors: shen
 * @LastEditTime: 2025-10-25 15:01:48
 * @Description:
 */
import type { PropType } from 'vue'
import type { ProFormItemType } from '../type'

import { defineComponent, computed } from 'vue'
import { Tooltip } from 'ant-design-vue'
import { QuestionCircleOutlined } from '@ant-design/icons-vue'
import { useInjectSlots } from '../context/FormSlotsContext'
import { useInjectForm } from '../context/FormContext'
import { RenderVNode } from '@pro-design-vue/utils'

import getSlot from '../utils/getSlot'

export default defineComponent({
  name: 'FormTitle',
  inheritAttrs: false,
  props: {
    title: {
      type: [String, Object, Function] as PropType<ProFormItemType['title']>,
      default: undefined,
    },
    tooltip: {
      type: [String, Boolean],
      default: '',
    },
    readonly: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const formSlotsContext = useInjectSlots()
    const { prefixCls, formData } = useInjectForm()
    const title = computed(() => getSlot(props.title, formSlotsContext))
    return () => (
      <>
        {title.value && (
          <span class={`${prefixCls}-item-title-text`}>
            <RenderVNode
              vnode={title.value}
              props={{ formData: formData.value, readonly: props.readonly }}
            />
          </span>
        )}
        {props.tooltip && (
          <Tooltip
            v-slots={{
              title: () =>
                props.tooltip === true ? (
                  <RenderVNode
                    vnode={title.value}
                    props={{ formData: formData.value, readonly: props.readonly }}
                  />
                ) : (
                  props.tooltip
                ),
            }}
          >
            <QuestionCircleOutlined class={`${prefixCls}-item-tooltip`} style="margin-right: 3px" />
          </Tooltip>
        )}
      </>
    )
  },
})
