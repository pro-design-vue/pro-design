/*
 * @Author: shen
 * @Date: 2023-08-28 13:01:45
 * @LastEditors: shen
 * @LastEditTime: 2025-08-31 22:28:53
 * @Description:
 */
import type { Ref, VNode } from 'vue'
import type { FormInstance } from '../base/StepForm'

import { computed, defineComponent, ref } from 'vue'
import { stepsFormProps } from '../props'
import { useMergedState, usePrefixCls, useState } from '@pro-design-vue/hooks'
import { Col, Row, Steps, Space, type StepProps } from 'ant-design-vue'
import { cloneElement, merge, omit, omitUndefined } from '@pro-design-vue/utils'
import { useProvideStepsForm } from '../context/StepsFormContext'
import { useIntl } from '@pro-design-vue/components/config-provider'
import StepForm from '../base/StepForm'
import ProButton from '@pro-design-vue/components/button'

interface LayoutRenderDom {
  stepsDom: VNode
  formDom: VNode
}

const StepsLayoutStrategy: Record<string, (dom: LayoutRenderDom) => VNode> = {
  horizontal({ stepsDom, formDom }) {
    return (
      <>
        <Row gutter={{ xs: 8, sm: 16, md: 24 }}>
          <Col span={24}>{stepsDom}</Col>
        </Row>
        <Row gutter={{ xs: 8, sm: 16, md: 24 }}>
          <Col span={24}>{formDom}</Col>
        </Row>
      </>
    )
  },
  vertical({ stepsDom, formDom }) {
    return (
      <Row align="stretch" wrap={true} gutter={{ xs: 8, sm: 16, md: 24 }}>
        <Col xxl={4} xl={6} lg={7} md={8} sm={10} xs={12}>
          {cloneElement(stepsDom, {
            style: {
              height: '100%',
            },
          })}
        </Col>
        <Col>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              height: '100%',
            }}
          >
            {formDom}
          </div>
        </Col>
      </Row>
    )
  },
}

export default defineComponent({
  name: 'ProStepsForm',
  inheritAttrs: false,
  props: {
    ...stepsFormProps(),
  },
  emits: [],
  setup(props, { slots }) {
    const intl = useIntl()
    const prefixCls = usePrefixCls('steps-form')
    const formArrayRef = ref<Array<Ref<FormInstance | undefined>>>([])
    const formDataRef = new Map<string, Record<string, any>>()
    const [loading, setLoading] = useState<boolean>(false)
    const formProps = computed(() =>
      omitUndefined(
        omit(props, [
          'name',
          'current',
          'stepsProps',
          'containerStyle',
          'onCurrentChange',
          'steps',
          'items',
          'submitter',
          'onFinish',
        ]),
      ),
    )

    const stepItems = computed<StepProps[]>(() =>
      props.steps?.map((item) => omit(item, ['formProps'])),
    )

    const [step, setStep] = useMergedState<number>(0, {
      value: computed(() => props.current!),
      onChange: props.onCurrentChange,
    })

    const regForm = (formRef: Ref<FormInstance | undefined>, index: number) => {
      formArrayRef.value[index] = formRef
    }

    const lastStep = computed(() => step.value === props.steps.length - 1)

    const onFormFinish = async (name: string, formData: any) => {
      formDataRef.set(name, formData)
      // 如果不是最后一步
      if (!lastStep.value || !props.onFinish) {
        return
      }
      setLoading(true)
      const values: any = merge({}, ...Array.from(formDataRef.values()))
      try {
        const success = await props.onFinish(values)
        if (success) {
          setStep(0)
          formArrayRef.value.forEach((form) => form.value?.reset())
        }
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }

    const onSubmit = () => {
      const from = formArrayRef.value[step.value]
      if (from) {
        from.value?.submit()
      }
    }

    /** 上一页功能 */
    const prePage = () => {
      if (step.value < 1) return
      setStep(step.value - 1)
    }

    const next = computed(() => {
      return (
        props.submitter !== false && (
          <ProButton
            key="next"
            type="primary"
            loading={loading.value}
            {...props.submitter?.submitButtonProps}
            onClick={() => {
              onSubmit()
            }}
          >
            {intl.getMessage('stepsForm.next', '下一步')}
          </ProButton>
        )
      )
    })

    const pre = computed(() => {
      return (
        props.submitter !== false && (
          <ProButton
            key="pre"
            {...props.submitter?.resetButtonProps}
            onClick={() => {
              prePage()
            }}
          >
            {intl.getMessage('stepsForm.prev', '上一步')}
          </ProButton>
        )
      )
    })

    const submit = computed(() => {
      return (
        props.submitter !== false && (
          <ProButton
            key="submit"
            type="primary"
            loading={loading.value}
            {...props.submitter?.submitButtonProps}
            onClick={() => {
              onSubmit()
            }}
          >
            {intl.getMessage('stepsForm.submit', '提交')}
          </ProButton>
        )
      )
    })

    const nextPage = () => {
      if (step.value > props.steps.length - 2) return
      setStep(step.value + 1)
    }

    const submitterDom = computed(() => {
      const buttons: any[] = []
      const index = step.value || 0
      if (index < 1) {
        // 如果有且只有一个 StepForm 第一步就应该是提交按钮
        if (props.steps?.length === 1) {
          buttons.push(submit.value)
        } else {
          buttons.push(next.value)
        }
      } else if (index + 1 === props.steps?.length) {
        buttons.push(pre.value, submit.value)
      } else {
        buttons.push(pre.value, next.value)
      }
      return buttons
    })

    const layoutRender = computed(
      () => StepsLayoutStrategy[props.stepsProps?.direction || 'horizontal'],
    )

    const stepContainer = computed<VNode>(() => {
      return (
        <div
          class={`${prefixCls}-steps-container`}
          style={{
            maxWidth: Math.min(props.steps.length * 320, 1160) + 'px',
          }}
        >
          <Steps
            {...props.stepsProps}
            items={stepItems.value}
            current={step.value}
            onChange={undefined}
          />
        </div>
      )
    })

    const formContainer = computed<VNode>(() => (
      <div class={`${prefixCls}-container`} style={props.containerStyle}>
        {props.items.map((item, index) => {
          const stepFormProps = omit(omitUndefined(props.steps[index]?.formProps || {}), ['items'])
          const name = stepFormProps.name || `${index}`
          const mergeFormProps = merge({}, formProps.value, stepFormProps)
          return (
            <StepForm items={item} name={name} index={index} {...mergeFormProps} v-slots={slots} />
          )
        })}
        <Space>{submitterDom.value}</Space>
      </div>
    ))

    const stepsFormDom = computed(() => {
      const doms = {
        stepsDom: stepContainer.value,
        formDom: formContainer.value,
      }
      return layoutRender.value?.(doms)
    })

    useProvideStepsForm({
      step,
      loading,
      setLoading,
      lastStep,
      next: nextPage,
      regForm,
      onFormFinish,
    })
    return () => <div class={prefixCls}>{stepsFormDom.value}</div>
  },
})
