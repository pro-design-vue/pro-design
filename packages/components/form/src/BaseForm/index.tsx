/*
 * @Author: shen
 * @Date: 2023-08-09 10:36:49
 * @LastEditors: shen
 * @LastEditTime: 2026-01-21 09:20:51
 * @Description:
 */
import type { PropType } from 'vue'
import type { SubmitterProps } from '../type'

import { Form, Spin, type FormInstance } from 'ant-design-vue'
import { computed, defineComponent, onMounted, ref, shallowRef } from 'vue'
import { useContent, useMergedState, usePrefixCls } from '@pro-design-vue/hooks'
import { baseFormProps } from '../props'
import { useFetchData } from '../hooks/useFetchData'
import { useProvideFormEditOrReadOnly } from '../context/EditOrReadOnlyContext'
import {
  cloneElement,
  isValidElement,
  set,
  type ProFieldValueType,
  type SearchTransformKeyFn,
} from '@pro-design-vue/utils'
import type { NamePath } from 'ant-design-vue/es/form/interface'
import { transformKeySubmitValue } from '../utils/transformKeySubmitValue'
import { conversionMomentValue } from '../utils/conversionMomentValue'
import { useFormStore } from '../hooks/useFormStore'
import { useProvideField } from '../context/FieldContext'
import { useFormInstance } from '../hooks/useFormInstance'
import { useProvideGrid } from '../context/GridContext'
import { useProvideForm } from '../context/FormContext'
import RowWrapper from '../components/Grid/RowWrapper'
import Submitter from '../components/Submitter'

let requestFormCacheId = 0
export default defineComponent({
  name: 'BaseForm',
  inheritAttrs: false,
  props: baseFormProps,
  setup(props, { slots, attrs, expose }) {
    const prefixCls = usePrefixCls('form')
    const formRef = ref<FormInstance>({} as any)
    const renderContent = useContent()
    const [loading, setLoading] = useMergedState<boolean>(false, {
      onChange: props.onLoadingChange,
      value: computed(() => props.loading!),
    })

    const [initialData] = useFetchData({
      request: computed(() => props.request!),
      params: computed(() => props.params!),
      proFieldKey: computed(() => props.formKey || requestFormCacheId),
    })

    const onValuesChange = (changedValues, values) => {
      props?.onValuesChange?.(
        transformKey(changedValues, !!props.omitNil),
        transformKey(values, !!props.omitNil),
      )
    }

    const formStore = useFormStore({
      initialData,
      initialValues: props.initialValues,
      onValuesChange,
    })
    const transformKeyRef = shallowRef<Record<string, SearchTransformKeyFn | undefined>>({})

    const fieldsValueType = shallowRef<
      Record<
        string,
        {
          valueType: ProFieldValueType
          dateFormat: string
        }
      >
    >({})

    const transformKey = (values: any, paramsOmitNil?: boolean, parentKey?: NamePath) => {
      return transformKeySubmitValue(
        conversionMomentValue(
          values,
          props.dateFormatter,
          fieldsValueType.value,
          paramsOmitNil,
          parentKey,
        ),
        transformKeyRef.value,
        paramsOmitNil,
      )
    }

    const onFinish = async () => {
      // 没设置 onFinish 就不执行
      if (!props.onFinish) return
      // 防止重复提交
      if (loading.value) return
      try {
        const finalValues = formInstace.getFieldsFormatValue?.()
        const response = props.onFinish(finalValues)
        if (response instanceof Promise) {
          setLoading(true)
        }
        await response
        setLoading(false)
      } catch (error) {
        console.log(error)
        setLoading(false)
      }
    }

    const formInstace = useFormInstance({
      props,
      formRef,
      transformKey,
      store: formStore,
      onFinish,
    })

    const getPopupContainer = computed(() => {
      if (typeof window === 'undefined') return undefined
      // 如果在 drawerForm 和  modalForm 里就渲染dom到父节点里
      // modalForm 可能高度太小不适合
      if (props.formComponentType && ['DrawerForm'].includes(props.formComponentType)) {
        return (e: HTMLElement) => e.parentNode || document.body
      }
      return undefined
    })

    const items = computed(() => {
      const children = renderContent('default', 'content')
      return children?.map((item, index) => {
        if (index === 0 && isValidElement(item) && props.autoFocusFirstInput) {
          return cloneElement(item, {
            ...item.props,
            autoFocus: props.autoFocusFirstInput,
          })
        }
        return item
      })
    })

    /** 计算 props 的对象 */
    const submitterProps = computed<SubmitterProps>(() =>
      typeof props.submitter === 'boolean' || !props.submitter ? {} : props.submitter,
    )

    /** 渲染提交按钮与重置按钮 */
    const submitterNode = computed(() => {
      if (props.submitter === false) return undefined
      return (
        <Submitter
          key="submitter"
          {...submitterProps}
          onReset={() => {
            const finalValues = transformKey(formInstace?.getFieldsValue(), props.omitNil)
            submitterProps.value?.onReset?.(finalValues)
            props.onReset?.(finalValues)
          }}
          submitButtonProps={{
            loading: loading.value,
            ...submitterProps.value.submitButtonProps,
          }}
          v-slots={{
            render: slots.submitter,
          }}
        />
      )
    })

    const content = computed(() => {
      const wrapItems = props.grid ? (
        <RowWrapper grid={props.grid} rowProps={props.rowProps}>
          {items.value}
        </RowWrapper>
      ) : (
        items.value
      )
      if (props.contentRender) {
        return props.contentRender(wrapItems as any, submitterNode.value, formInstace)
      }
      return wrapItems
    })

    useProvideFormEditOrReadOnly({
      mode: computed(() => (props.readonly ? 'read' : 'edit')),
    })
    useProvideGrid({
      grid: computed(() => props.grid!),
      colProps: computed(() => props.colProps!),
      rowProps: computed(() => props.rowProps!),
    })

    useProvideField({
      fieldProps: computed(() => props.fieldProps!),
      proFieldProps: computed(() => props.proFieldProps!),
      groupProps: computed(() => props.groupProps!),
      formItemProps: computed(() => props.formItemProps!),
      formComponentType: computed(() => props.formComponentType!),
      formKey: computed(() => props.formKey!),

      getPopupContainer,
      setFieldValueType: (name, { valueType = 'text', dateFormat, transform }) => {
        if (!Array.isArray(name)) return
        transformKeyRef.value = set(transformKeyRef.value, name, transform)
        fieldsValueType.value = set(fieldsValueType.value, name, {
          valueType,
          dateFormat,
        })
      },
    })

    useProvideForm({
      store: formStore,
      form: formInstace,
      formProps: props,
    })

    onMounted(() => {
      requestFormCacheId += 0
      const finalValues = transformKey(formInstace?.getFieldsValue?.(true), props.omitNil)
      props.onInit?.(finalValues, formInstace)
    })
    return () => {
      if (!initialData.value && props.request) {
        return (
          <div style={{ paddingTop: 50, paddingBottom: 50, textAlign: 'center' }}>
            <Spin />
          </div>
        )
      }
      return (
        <Form
          {...attrs}
          model={formStore.formValues.value}
          ref={formRef}
          class={prefixCls}
          onFinish={onFinish}
        >
          {content.value}
        </Form>
      )
    }
  },
})
