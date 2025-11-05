/*
 * @Author: shen
 * @Date: 2023-08-10 14:34:03
 * @LastEditors: shen
 * @LastEditTime: 2025-11-05 09:59:50
 * @Description:
 */
import type { PropType } from 'vue'

import { computed, defineComponent, ref, watch } from 'vue'
import { Form, Button, Upload, type UploadChangeParam, type UploadProps } from 'ant-design-vue'
import { UploadOutlined } from '@ant-design/icons-vue'
import { useInjectSlots } from '../context/FormSlotsContext'
import { commonFieldProps } from '../props'
import { useIntl } from '@pro-design-vue/components/config-provider'
import { isFunction, RenderVNode } from '@pro-design-vue/utils'
import { useInjectForm } from '../context/FormContext'
import getSlot from '../utils/getSlot'

const SLOT_NAMES = [
  'downloadIcon',
  'itemRender',
  'previewIcon',
  'removeIcon',
  'description',
  'title',
]

export default defineComponent({
  name: 'FieldUploadButton',
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
    maxCount: {
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
    listType: {
      type: String as PropType<'text' | 'picture' | 'picture-card'>,
      default: 'text',
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
    const intl = useIntl()
    const { prefixCls, formData } = useInjectForm()
    const formSlotsContext = useInjectSlots()
    const fileList = ref<any[]>([])
    const formItemContext = Form.useInjectFormItemContext()
    const baseClassName = computed(() => `${prefixCls}-upload`)
    const isPictureCard = computed(() => props.listType === 'picture-card')
    const slotsGetter = computed(() => {
      const temp = {}
      SLOT_NAMES.forEach((name) => {
        const slot = getSlot(props[name], formSlotsContext)
        if (slot) {
          temp[name] = (props) => (
            <RenderVNode vnode={slot} props={{ formData: formData.value, ...(props ?? {}) }} />
          )
        }
      })
      return temp
    })

    const icon = computed(() => {
      const render = getSlot(props.iconRender, formSlotsContext)
      if (isFunction(render)) {
        return <RenderVNode vnode={render} props={{ formData: formData.value }} />
      }
      return <UploadOutlined />
    })

    const title = computed(() => {
      const render = getSlot(props.title, formSlotsContext)
      if (isFunction(render)) {
        return <RenderVNode vnode={render} props={{ formData: formData.value }} />
      }
      return props.title || intl.getMessage('upload.button', '单击上传')
    })

    const description = computed(() => {
      const render = getSlot(props.description, formSlotsContext)
      if (isFunction(render)) {
        return <RenderVNode vnode={render} props={{ formData: formData.value }} />
      }
      return props.description
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
        (await props.customRequest!(formData, onUploadProgress, option)) ?? {}
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
      formItemContext.onFieldChange()
    }

    return () => (
      <Upload
        {...uploadProps.value}
        class={{ [`${baseClassName.value}-readonly`]: props.readonly }}
        fileList={fileList.value}
        name={props.name}
        maxCount={props.maxCount}
        listType={props.listType}
        showUploadList={props.readonly || props.showUploadList}
        disabled={props.readonly || props.disabled}
        style={(attrs as any)?.style}
        v-slots={slotsGetter.value}
        onChange={onUploadChange}
      >
        {isPictureCard.value ? (
          props.maxCount !== undefined &&
          fileList.value?.length < props.maxCount && (
            <div>
              {icon.value}
              <div style="margin-top: 8px"> {title.value}</div>
            </div>
          )
        ) : (
          <>
            <Button disabled={props.disabled} {...props.buttonProps}>
              {icon.value}
              {title.value}
            </Button>
            {description.value && (
              <span style={{ marginInlineStart: '10px' }}>{description.value}</span>
            )}
          </>
        )}
      </Upload>
    )
  },
})
