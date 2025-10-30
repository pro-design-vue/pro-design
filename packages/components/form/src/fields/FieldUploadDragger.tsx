/*
 * @Author: shen
 * @Date: 2023-08-10 14:34:03
 * @LastEditors: shen
 * @LastEditTime: 2025-10-30 14:38:58
 * @Description:
 */
import { computed, defineComponent, ref, watch, type PropType } from 'vue'
import { Form, Upload, type UploadChangeParam, type UploadProps } from 'ant-design-vue'
import { InboxOutlined } from '@ant-design/icons-vue'
import { useInjectForm } from '../context/FormContext'
import { useInjectSlots } from '../context/FormSlotsContext'
import { commonFieldProps } from '../props'
import { useIntl } from '@pro-design-vue/components/config-provider'
import { isFunction, RenderVNode } from '@pro-design-vue/utils'
import getSlot from '../utils/getSlot'
const SLOT_NAMES = ['downloadIcon', 'itemRender', 'previewIcon', 'removeIcon']

export default defineComponent({
  name: 'FieldUploadDragger',
  props: {
    ...commonFieldProps(),
    iconRender: {
      type: String,
      default: '',
    },
    downloadIcon: {
      type: String,
      default: '',
    },
    itemRender: {
      type: String,
      default: '',
    },
    previewIcon: {
      type: String,
      default: '',
    },
    removeIcon: {
      type: String,
      default: '',
    },
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    name: {
      type: String,
      default: 'file',
    },
    max: {
      type: Number,
      default: undefined,
    },
    disabled: {
      type: Boolean,
      default: undefined,
    },
    buttonProps: {
      type: Object,
      default: undefined,
    },
    fileList: {
      type: Array,
      default: undefined,
    },
    listIgnore: {
      type: Boolean,
      default: true,
    },
    showUploadList: {
      type: [Boolean, Object] as PropType<UploadProps['showUploadList']>,
      default: true,
    },
    customRequest: Function,
    beforeUpload: Function,
  },
  setup(props, { attrs }) {
    const { prefixCls, formData } = useInjectForm()
    const intl = useIntl()
    const formSlotsContext = useInjectSlots()
    const fileList = ref<any[]>([])
    const formItemContext = Form.useInjectFormItemContext()
    const baseClassName = computed(() => `${prefixCls}-upload`)
    const slotsGetter = computed(() => {
      const temp = {}
      SLOT_NAMES.forEach((name) => {
        const slot = getSlot(props[name], formSlotsContext)
        if (slot) {
          temp[name] = () => <RenderVNode vnode={slot} />
        }
      })
      return temp
    })

    const icon = computed(() => {
      const render = getSlot(props.iconRender, formSlotsContext)
      if (isFunction(render)) {
        return <RenderVNode vnode={render} props={{ formData: formData.value }} />
      }
      return <InboxOutlined />
    })

    const title = computed(() => {
      const render = getSlot(props.title, formSlotsContext)
      if (isFunction(render)) {
        return <RenderVNode vnode={render} props={{ formData: formData.value }} />
      }
      return props.title || intl.getMessage('upload.dragger.text', '单击或拖动文件到此区域进行上传')
    })

    const description = computed(() => {
      const render = getSlot(props.description, formSlotsContext)
      if (isFunction(render)) {
        return <RenderVNode vnode={render} props={{ formData: formData.value }} />
      }
      return props.description || intl.getMessage('upload.dragger.hint', '支持单次或批量上传')
    })

    const beforeUpload: UploadProps['beforeUpload'] = async (file, fileList) => {
      const result = await props.beforeUpload?.(file, fileList)
      if (!result && props.listIgnore) {
        return Upload.LIST_IGNORE
      }
      return result
    }

    const customRequest: UploadProps['customRequest'] = async (option) => {
      const formData = new FormData()
      formData.append(props.name, option.file)
      const onUploadProgress = (e) => {
        if (e.total > 0) {
          e.percent = (e.loaded / e.total) * 100
        }
        option?.onProgress?.(e)
      }
      const { success, error, data } =
        (await props.customRequest!(formData, onUploadProgress)) ?? {}
      if (success) {
        option.onSuccess?.(data)
        formItemContext.onFieldChange()
      } else {
        option.onError?.(error, data)
      }
    }

    const uploadProps = computed(() => {
      const newProps = { ...attrs }
      if (props.customRequest) {
        newProps.customRequest = customRequest
      }
      if (props.beforeUpload) {
        newProps.beforeUpload = beforeUpload
      }
      return newProps
    })

    watch(
      () => props.value,
      (newValue) => {
        if (newValue) {
          fileList.value = [...newValue?.map((item) => ({ ...item, name: item.name || item.url }))]
          if (!fileList.value?.length) {
            formItemContext.onFieldChange()
          }
        } else {
          fileList.value = []
        }
      },
      {
        immediate: true,
      },
    )

    const onUploadChange = (info: UploadChangeParam) => {
      props.onChange?.(
        info.fileList.map((item) => ({
          ...item,
          name: item.name || item.response?.name || item.url || item.response?.url,
          url: item.response?.url || item.url,
        })),
        info.file,
      )
    }

    return () => (
      <Upload.Dragger
        {...uploadProps.value}
        class={{ [`${baseClassName.value}-readonly`]: props.readonly }}
        v-model:fileList={fileList.value}
        name={props.name}
        showUploadList={props.readonly || props.showUploadList}
        disabled={props.readonly || props.disabled}
        style={(attrs as any)?.style}
        v-slots={slotsGetter.value}
        onChange={onUploadChange}
      >
        <p class={`${baseClassName.value}-drag-icon`} style={{ color: 'hsl(var(--pro-primary))' }}>
          {icon.value}
        </p>
        <p class={`${baseClassName.value}-text`}>{title.value}</p>
        <p class={`${baseClassName.value}-hint`}>{description.value}</p>
      </Upload.Dragger>
    )
  },
})
