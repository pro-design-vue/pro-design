/*
 * @Author: shen
 * @Date: 2023-08-10 13:00:22
 * @LastEditors: shen
 * @LastEditTime: 2025-07-31 10:05:29
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
      type: String,
      default: '',
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
            <RenderVNode vnode={title.value} props={{ formData: formData.value }} />
          </span>
        )}
        {props.tooltip && (
          <Tooltip title={props.tooltip}>
            <QuestionCircleOutlined class={`${prefixCls}-item-tooltip`} />
          </Tooltip>
        )}
      </>
    )
  },
})
