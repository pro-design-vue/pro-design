/*
 * @Author: shen
 * @Date: 2023-08-27 12:25:01
 * @LastEditors: shen
 * @LastEditTime: 2026-01-12 09:53:24
 * @Description:
 */
import type { CSSProperties, PropType, VNode } from 'vue'

import { computed, defineComponent } from 'vue'
import { Button, theme } from 'ant-design-vue'
import { omit } from '@pro-design-vue/utils'
import type { SubmitterProps } from '../../type'
import { useInjectForm } from '../../context/FormContext'
import { useIntl } from '@pro-design-vue/components/config-provider'
import { useVNodeJSX } from '@pro-design-vue/hooks'

export default defineComponent({
  name: 'Submitter',
  inheritAttrs: false,
  props: {
    loading: {
      type: Boolean,
      default: undefined,
    },
    reverse: {
      type: Boolean,
      default: undefined,
    },
    onSubmit: {
      type: Function as PropType<SubmitterProps['onSubmit']>,
      default: undefined,
    },
    onReset: {
      type: Function as PropType<SubmitterProps['onReset']>,
      default: undefined,
    },
    searchConfig: {
      type: Object as PropType<SubmitterProps['searchConfig']>,
      default: undefined,
    },
    submitButtonProps: {
      type: [Object, Boolean] as PropType<SubmitterProps['submitButtonProps']>,
      default: undefined,
    },
    resetButtonProps: {
      type: [Object, Boolean] as PropType<SubmitterProps['resetButtonProps']>,
      default: undefined,
    },
    render: {
      type: [Function, Boolean] as PropType<SubmitterProps['render']>,
      default: undefined,
    },
  },
  setup(props) {
    const intl = useIntl()
    const { form } = useInjectForm()
    const { token } = theme.useToken()
    const renderContent = useVNodeJSX()
    const submit = () => {
      form.submit()
      props.onSubmit?.()
    }

    const reset = () => {
      form.resetFields()
      props.onReset?.()
    }

    const resetButton = computed(() => {
      const { searchConfig = {}, resetButtonProps = {} } = props
      if (resetButtonProps === false) {
        return null
      }
      const { resetText = intl.getMessage('tableForm.reset', '重置') } = searchConfig
      return (
        <Button
          {...omit(resetButtonProps, ['preventDefault', 'onClick'])}
          key="reset"
          onClick={(e) => {
            if (!resetButtonProps.preventDefault) {
              reset()
            }
            ;(resetButtonProps as any).onClick?.(e)
          }}
        >
          {resetText}
        </Button>
      )
    })

    const submitButton = computed(() => {
      const { searchConfig = {}, submitButtonProps = {} } = props
      if (submitButtonProps === false) {
        return null
      }
      const { submitText = intl.getMessage('tableForm.submit', '提交') } = searchConfig
      return (
        <Button
          type="primary"
          {...omit(submitButtonProps || {}, ['preventDefault', 'onClick'])}
          key="submit"
          onClick={(e) => {
            if (!submitButtonProps.preventDefault) {
              submit()
            }
            ;(submitButtonProps as any).onClick?.(e)
          }}
        >
          {submitText}
        </Button>
      )
    })

    return () => {
      if (props.render === false) {
        return null
      }

      const dom = [resetButton.value, submitButton.value].filter((btn) => !!btn)

      const render = renderContent('render', {
        slotFirst: true,
        params: { props: { ...props, form, submit, reset }, dom },
      })

      const renderDom = render ?? dom

      if (Array.isArray(renderDom)) {
        if (renderDom?.length < 1) {
          return null
        }
        if (renderDom?.length === 1) {
          return renderDom[0]
        }
        return (
          <div
            style={{
              display: 'flex',
              gap: token.value.marginXS + 'px',
              alignItems: 'center',
            }}
          >
            {renderDom}
          </div>
        )
      }

      return renderDom
    }
  },
})
