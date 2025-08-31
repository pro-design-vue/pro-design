/*
 * @Author: shen
 * @Date: 2023-08-27 12:25:01
 * @LastEditors: shen
 * @LastEditTime: 2025-07-26 11:52:40
 * @Description:
 */
import type { CSSProperties, PropType } from 'vue'
import type { SubmitterProps } from '../type'

import { computed, defineComponent } from 'vue'
import { Button } from 'ant-design-vue'
import { useInjectForm } from '../context/FormContext'
import { useInjectSlots } from '../context/FormSlotsContext'
import { omit } from '@pro-design-vue/utils'

export default defineComponent({
  name: 'FormSubmitter',
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
  setup(props, { attrs }) {
    const { action } = useInjectForm()
    const formSlotsContext = useInjectSlots()

    const submit = () => {
      action.submit()
      props.onSubmit?.()
    }

    const reset = () => {
      action.reset?.()
      props.onReset?.()
    }
    const resetButton = computed(() => {
      const { searchConfig = {}, resetButtonProps = {} } = props
      if (resetButtonProps === false) {
        return null
      }
      const { resetText = '重置' } = searchConfig
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
      const { submitText = '提交' } = searchConfig
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
      const { render = formSlotsContext['submitter'] } = props
      const dom = props.reverse ? (
        <>
          {resetButton.value}
          {submitButton.value}
        </>
      ) : (
        <>
          {submitButton.value}
          {resetButton.value}
        </>
      )

      const renderDom = render
        ? render({ props: { ...props, submit, reset }, action, defaultDoms: dom })
        : dom

      return (
        <div
          style={{
            display: 'flex',
            gap: '8px',
            alignItems: 'center',
            ...(attrs.style as CSSProperties),
          }}
          class={attrs.class}
        >
          {renderDom}
        </div>
      )
    }
  },
})
