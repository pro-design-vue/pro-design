/*
 * @Author: shen
 * @Date: 2023-08-10 14:34:03
 * @LastEditors: shen
 * @LastEditTime: 2025-08-29 13:41:53
 * @Description:
 */
import { defineComponent, cloneVNode } from 'vue'
import { Tooltip } from 'ant-design-vue'
import { CheckCircleFilled } from '@ant-design/icons-vue'
import { useClipboard } from '@vueuse/core'
import { useIntl } from '@pro-design-vue/components/config-provider'

export default defineComponent({
  name: 'ProClipboard',
  props: {
    text: {
      type: String,
      default: undefined,
    },
    copyTip: {
      type: String,
    },
    copiedTip: {
      type: String,
    },
  },
  setup(props, { slots }) {
    const intl = useIntl()
    const { isSupported, copied, copy } = useClipboard({
      navigator: window.parent ? window.parent.navigator : window.navigator,
    })

    const onCopy = () => {
      copy(props.text!)
    }

    return () => {
      const dom = slots.default?.()
      if (!dom) {
        return null
      }
      if (props.text && isSupported) {
        return (
          <Tooltip
            placement={'top'}
            v-slots={{
              title: () =>
                copied.value ? (
                  <span>
                    <CheckCircleFilled style="margin-right:5px; font-size:12px" />
                    {props.copiedTip || intl.getMessage('clipboard.copiedTip', '已复制到剪切板')}
                  </span>
                ) : (
                  <span>{props.copyTip || intl.getMessage('clipboard.copyTip', '点击复制')}</span>
                ),
            }}
          >
            {cloneVNode(dom[0]!, {
              style: { cursor: 'pointer' },
              onClick: onCopy,
            })}
          </Tooltip>
        )
      }

      return dom
    }
  },
})
