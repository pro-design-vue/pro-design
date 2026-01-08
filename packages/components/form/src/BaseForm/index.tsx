/*
 * @Author: shen
 * @Date: 2023-08-09 10:36:49
 * @LastEditors: shen
 * @LastEditTime: 2026-01-08 17:14:21
 * @Description:
 */
import type { PropType } from 'vue'
import { Form, Spin, type FormInstance } from 'ant-design-vue'
import { computed, defineComponent, onMounted, ref, shallowRef } from 'vue'
import { useMergedState, usePrefixCls } from '@pro-design-vue/hooks'
import { baseFormProps } from '../props'
import { useFetchData } from '../hooks/useFetchData'
import { useProvideFormEditOrReadOnly } from '../context/EditOrReadOnlyContext'
import { set, type ProFieldValueType, type SearchTransformKeyFn } from '@pro-design-vue/utils'
import type { NamePath } from 'ant-design-vue/es/form/interface'
import { transformKeySubmitValue } from '../utils/transformKeySubmitValue'
import { conversionMomentValue } from '../utils/conversionMomentValue'
import { useFormStore } from '../hooks/useFormStore'
import { useProvideField } from '../context/FieldContext'
import { useFormInstance } from '../hooks/useFormInstance'

let requestFormCacheId = 0
export default defineComponent({
  name: 'BaseForm',
  inheritAttrs: false,
  props: baseFormProps,
  setup(props, { slots, attrs, expose }) {
    const prefixCls = usePrefixCls('form')
    const formRef = ref<FormInstance>({} as any)
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
    const formInstace = useFormInstance()
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

    const transformKey = (values: any, paramsOmitNil: boolean, parentKey?: NamePath) => {
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

    const getPopupContainer = computed(() => {
      if (typeof window === 'undefined') return undefined
      // 如果在 drawerForm 和  modalForm 里就渲染dom到父节点里
      // modalForm 可能高度太小不适合
      if (props.formComponentType && ['DrawerForm'].includes(props.formComponentType)) {
        return (e: HTMLElement) => e.parentNode || document.body
      }
      return undefined
    })

    const onFinish = async (finalValues) => {
      // 没设置 onFinish 就不执行
      if (!props.onFinish) return
      // 防止重复提交
      if (loading) return
      try {
        // const finalValues = formRef?.value?.getFieldsFormatValue?.()
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

    useProvideFormEditOrReadOnly({
      mode: computed(() => (props.readonly ? 'read' : 'edit')),
    })

    useProvideField({
      store: formStore,
      form: formInstace,
      fieldProps: computed(() => props.fieldProps!),
      proFieldProps: computed(() => props.proFieldProps!),
      groupProps: computed(() => props.groupProps!),
      formItemProps: computed(() => props.formItemProps!),
      formComponentType: computed(() => props.formComponentType!),
      formKey: computed(() => props.formKey!),
      grid: computed(() => props.grid!),
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

    onMounted(() => {
      requestFormCacheId += 0
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
          {slots.default?.()}
        </Form>
      )
    }
  },
})
