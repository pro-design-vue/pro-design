/*
 * @Author: shen
 * @Date: 2023-08-27 12:04:01
 * @LastEditors: shen
 * @LastEditTime: 2025-09-21 18:08:35
 * @Description:
 */
import type { ColProps, FormInstance } from 'ant-design-vue'
import type { Entity, ProFormItemType, ProFormPropsType, SubmitterProps } from '../type'

import { ref, computed, watch, onMounted, defineComponent, Teleport } from 'vue'
import { Col, Form, FormItem, Spin } from 'ant-design-vue'
import { cloneDeep, debounce, isEqual, isObject, omit, omitUndefined } from '@pro-design-vue/utils'
import { baseFormProps } from '../props'
import { useProvideForm } from '../context/FormContext'
import { useMergedState, usePrefixCls } from '@pro-design-vue/hooks'
import { useInitialValues } from '../hooks/useInitialValues'
import { useLinkage } from '../hooks/useLinkage'
import { transformKeySubmitValue, useAction } from '../hooks/useAction'
import covertFormName from '../utils/namePath'
import FormSlotsContextProvider from '../context/FormSlotsContext'
import FormRowWrapper from '../components/FormRowWrapper'
import FormItems from '../components/FormItems'
import FormSubmitter from '../components/FormSubmitter'

let requestFormCacheId = 0

export default defineComponent({
  name: 'BaseForm',
  inheritAttrs: false,
  props: {
    ...baseFormProps(),
  },
  setup(props, { slots, expose, attrs }) {
    // const loading = ref(false)
    const mountedRef = ref(false)
    const formRef = ref<FormInstance>()
    const prefixCls = usePrefixCls('form')
    const formData = ref<Entity>({})
    const formItems = ref<ProFormItemType[]>([])
    const formKey = computed(() => {
      return props.formKey ?? requestFormCacheId.toString()
    })

    const [loading, setloading] = useMergedState<boolean | undefined>(false, {
      value: computed(() => props.loading),
      onChange: (val) => {
        props.onLoadingChange?.(val!)
      },
    })

    const formClass = computed(() => ({
      [prefixCls]: true,
      [`${attrs.class ?? ''}`]: true,
    }))
    const formProps = computed(() => {
      return {
        ...omitUndefined(
          omit(props, [
            'colProps',
            'submitter',
            'loading',
            'showLoading',
            'omitNil',
            'grid',
            'theme',
            'customUi',
            'gridSubmitter',
            'requestAbort',
            'isKeyPressSubmit',
            'formKey',
            'initialValues',
            'rowProps',
            'dateFormatter',
            'params',
            'readonly',
            'readonlyProps',
            'items',
            'request',
            'submitOnLoading',
            'onLoadingChange',
            'onFinish',
            'onValuesChange',
          ]),
        ),
        layout: props.layout ?? 'vertical',
      }
    })

    const formatItems = (items: ProFormItemType[]): ProFormItemType[] => {
      return items
        .filter((originItem) => {
          return !originItem.hidden
        })
        .sort((a, b) => {
          if (b.order || a.order) {
            return (b.order ?? 0) - (a.order ?? 0)
          }
          return 0
        })
        .map((originItem, index) => {
          const name = covertFormName(originItem.name)
          const key = originItem.key ?? (name ? (name ?? []).join('_') : index)
          return omitUndefined<ProFormItemType>({
            ...originItem,
            originName: originItem.originName ?? originItem.name,
            name,
            key,
          })
        })
        .filter((field) => {
          return Boolean(field)
        })
    }

    watch(
      () => props.items,
      () => {
        formItems.value = formatItems(props.items ?? [])
      },
      {
        immediate: true,
      },
    )

    // watch(loading, () => {
    //   props.onLoadingChange?.(loading.value)
    // })

    // watch(
    //   () => props.loading,
    //   (newVal) => {
    //     loading.value = newVal
    //   },
    // )

    const { initialValues, hasInitial, requestLoading } = useInitialValues(
      props as ProFormPropsType,
    )

    watch(
      initialValues,
      (newValues, oldValues) => {
        if (!isEqual(newValues, oldValues)) {
          formData.value = cloneDeep(newValues)
          if (!props.request || props.requestAbort) {
            Promise.resolve().then(() => {
              hasInitial.value = false
            })
          }
        }
      },
      {
        immediate: true,
      },
    )
    const onValuesChange = debounce(() => {
      props.onValuesChange?.(transformKeySubmitValue(cloneDeep(formData.value), props.omitNil))
    }, 200)

    const onFinish = async () => {
      if (!props.onFinish) return
      if (props.submitOnLoading) {
        if (loading.value) return
        setloading(true)
      }

      try {
        const finalValues = transformKeySubmitValue(cloneDeep(formData.value), props.omitNil)
        await props.onFinish(finalValues)
      } catch (error) {
        console.log('🚀 ~ onFinish ~ error:', error)
      } finally {
        if (props.submitOnLoading) {
          setloading(false)
        }
      }
    }

    watch(
      formData,
      () => {
        if (!hasInitial.value) {
          onValuesChange()
        }
      },
      {
        deep: true,
      },
    )

    const linkage = useLinkage()
    const action = useAction({
      props,
      formRef,
      formData,
      initialValues,
      hasInitial,
      onFinish,
      onReset: props.onReset,
      onFinishFailed: props.onFinishFailed,
    })

    const submitterProps = computed<SubmitterProps>(() =>
      typeof props.submitter === 'boolean' || !props.submitter
        ? {}
        : omit(props.submitter, ['colProps']),
    )

    const submitterColProps = computed<ColProps>(() => {
      if (props.submitter === false || props.readonly) return {}
      if (props.gridSubmitter) {
        if (isObject(props.submitter) && isObject(props.submitter.colProps)) {
          return { ...props.submitter.colProps }
        }
      }
      return { span: 24 } as ColProps
    })

    const submitterNode = computed(() => {
      if (props.submitter === false || props.readonly) return undefined
      const submitButtonProps =
        submitterProps.value.submitButtonProps === false
          ? false
          : {
              loading: loading.value,
              ...submitterProps.value.submitButtonProps,
            }
      const resetButtonProps =
        submitterProps.value.resetButtonProps === false
          ? false
          : {
              disabled: loading.value,
              ...submitterProps.value.resetButtonProps,
            }
      const dom = (
        <FormSubmitter
          key="submitter"
          {...submitterProps.value}
          submitButtonProps={submitButtonProps}
          resetButtonProps={resetButtonProps}
        />
      )
      if (submitterProps.value.teleport) {
        return <Teleport to={submitterProps.value.teleport}>{dom}</Teleport>
      }
      return dom
    })

    onMounted(() => {
      mountedRef.value = true
      requestFormCacheId += 1
      const finalValues = formRef.value?.getFieldsValue?.(true) ?? {}
      Promise.resolve().then(() => {
        props.onInit?.(transformKeySubmitValue(finalValues, props.omitNil), action)
      })
    })

    useProvideForm({
      ...linkage,
      action,
      formKey,
      mountedRef,
      prefixCls,
      initialValues,
      formData,
      hasInitial,
      theme: computed(() => props.theme),
      customUi: computed(() => props.customUi),
      grid: computed(() => props.grid),
      disabled: computed(() => props.disabled),
      readonly: computed(() => props.readonly),
      readonlyProps: computed(() => props.readonlyProps),
      rowProps: computed(() => props.rowProps ?? { gutter: 16 }),
      colProps: computed(() => props.colProps ?? { xs: 24 }),
      formatItems,
    })

    expose({
      ...action,
    })
    return () => (
      <FormSlotsContextProvider value={{ ...slots }}>
        <Form
          ref={formRef}
          {...formProps.value}
          class={formClass.value}
          model={formData.value}
          style={attrs.style}
        >
          <Spin spinning={props.showLoading && (requestLoading.value || loading.value)}>
            <FormRowWrapper>
              <FormItems list={formItems.value} />
              {props.gridSubmitter && props.submitter !== false && (
                <Col {...submitterColProps.value}>
                  <FormItem label=" " colon={false} class={`${prefixCls}-submitter-form-item`}>
                    {submitterNode.value}
                  </FormItem>
                </Col>
              )}
            </FormRowWrapper>
            {!props.gridSubmitter && submitterNode.value}
          </Spin>
        </Form>
      </FormSlotsContextProvider>
    )
  },
})
