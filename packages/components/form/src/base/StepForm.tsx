/*
 * @Author: shen
 * @Date: 2023-08-28 13:01:45
 * @LastEditors: shen
 * @LastEditTime: 2025-08-31 16:28:27
 * @Description:
 */
import type { ProFormActionType } from '../type'

import { ref, computed, defineComponent, onMounted } from 'vue'
import { usePrefixCls } from '@pro-design-vue/hooks'
import { baseFormProps } from '../props'
import { omit, omitUndefined } from '@pro-design-vue/utils'
import { useInjectStepsForm } from '../context/StepsFormContext'
import BaseForm from './BaseForm'
export type FormInstance = InstanceType<typeof BaseForm> & ProFormActionType

export default defineComponent({
  name: 'StepForm',
  inheritAttrs: false,
  props: {
    index: Number,
    ...baseFormProps,
  },
  emits: [],
  setup(props, { slots }) {
    const prefixCls = usePrefixCls('steps-form')
    const formRef = ref<FormInstance>()
    const { step, regForm, onFormFinish, setLoading, next, lastStep } = useInjectStepsForm()
    const isShow = computed(() => props.index === step.value)

    const formProps = computed(() => omitUndefined(omit(props, ['index', 'onFinish'])))

    const onFinish = async (values) => {
      if (props.name) {
        onFormFinish(props.name, values)
      }
      if (props.onFinish) {
        setLoading(true)
        // 如果报错，直接抛出
        const success = await props.onFinish?.(values)

        if (success) {
          next()
        }
        setLoading(false)
        return
      }

      if (!lastStep.value) next()
    }

    onMounted(() => {
      regForm(formRef, props.index!)
    })

    return () => (
      <div class={{ [`${prefixCls}-step`]: true, [`${prefixCls}-step-active`]: isShow.value }}>
        <BaseForm
          ref={formRef}
          {...formProps.value}
          submitter={false}
          v-slots={slots}
          onFinish={onFinish}
        />
      </div>
    )
  },
})
