/*
 * @Author: shen
 * @Date: 2023-08-10 14:34:03
 * @LastEditors: shen
 * @LastEditTime: 2025-08-27 11:22:38
 * @Description:
 */
import type { PropType } from 'vue'
import type { UploadProps, UploadChangeParam } from 'ant-design-vue'
import type { ProCropperInstance } from '../../../cropper'
import { computed, defineComponent, ref } from 'vue'
import { Upload, Spin, message, FormItemRest, Form } from 'ant-design-vue'
import { CloseOutlined, LoadingOutlined, PlusOutlined } from '@ant-design/icons-vue'
import { ProModal } from '@pro-design-vue/components/modal'
import { commonFieldProps } from '../props'
import { useInjectForm } from '../context/FormContext'
import { ProCropper } from '../../../cropper'
import { omit } from '@pro-design-vue/utils'
import { useIntl } from '@pro-design-vue/components/config-provider'

const defaultCropperProps = {
  aspectRatio: 1,
  cropBoxMovable: false,
  cropBoxResizable: false,
  dragMode: 'move',
  viewMode: 1,
}

export default defineComponent({
  name: 'FieldUploadPicture',
  inheritAttrs: false,
  props: {
    ...commonFieldProps,
    title: {
      type: String,
    },
    showTitle: {
      type: Boolean,
      default: undefined,
    },
    name: {
      type: String,
      default: 'file',
    },
    disabled: {
      type: Boolean,
      default: undefined,
    },
    allowClear: {
      type: Boolean,
      default: undefined,
    },
    isCropper: {
      type: Boolean,
      default: true,
    },
    cropperModalTitle: {
      type: String,
    },
    cropperModalWidth: {
      type: Number,
      default: 520,
    },
    cropperWidth: {
      type: Number,
      default: 100,
    },
    cropperHeight: {
      type: Number,
      default: 100,
    },
    cropperProps: {
      type: Object as PropType<Record<string, any>>,
      default: () => ({}),
    },
    width: {
      type: Number,
      default: 50,
    },
    height: {
      type: Number,
      default: 50,
    },
    customRequest: Function,
  },
  setup(props, { attrs }) {
    const open = ref(false)
    const loading = ref(false)
    const imgSrc = ref('')
    const originFile = ref<File>()
    const cropperRef = ref<ProCropperInstance>()
    const intl = useIntl()
    const { prefixCls, disabled } = useInjectForm()
    const formItemContext = Form.useInjectFormItemContext()

    const mergeCropperProps = computed(() => ({ ...defaultCropperProps, ...props.cropperProps }))

    const beforeUpload: UploadProps['beforeUpload'] = async (file, fileList) => {
      const custom = await (attrs as any)?.beforeUpload?.(file, fileList)

      if (props.isCropper) {
        const isImage = file.type.indexOf('image') >= 0
        if (!isImage) {
          message.error(`${file.name} ${intl.getMessage('upload.picture.required', '必须是图片')}`)
        }
        return isImage || Upload.LIST_IGNORE
      }

      return custom
    }

    const dataURLtoFile = (dataurl: any) => {
      const arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1])
      let n = bstr.length
      const u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      return new File([u8arr], originFile.value?.name ?? '', { type: mime })
    }

    const customRequest = async ({ file }) => {
      const formData = new FormData()
      formData.append(props.name, file)
      loading.value = true
      try {
        if (props.customRequest) {
          const { url } = await props.customRequest(formData)
          if (url) {
            props.onChange?.(url)
            formItemContext.onFieldChange()
          }
        }
      } catch (error) {
        console.log('🚀 ~ customRequest ~ error:', error)
      }
      loading.value = false
    }

    const uploadProps = computed(() => {
      const newProps = omit(attrs, ['beforeUpload'])
      if (props.isCropper) {
        newProps.customRequest = function () {}
      } else {
        if (props.customRequest) {
          newProps.customRequest = customRequest
        }
      }
      return newProps
    })

    const onUploadChange = (info: UploadChangeParam) => {
      originFile.value = info.file.originFileObj!
      if (props.isCropper) {
        const reader = new FileReader()
        reader.onload = function (e: any) {
          open.value = true
          imgSrc.value = e.target.result
        }
        reader.readAsDataURL(info.file.originFileObj!)
      }
    }

    const onConfirm = () => {
      const base64 = cropperRef.value?.getCroppedCanvas(originFile.value!, {
        width: props.cropperWidth,
        height: props.cropperHeight,
      })
      if (base64) {
        const file = dataURLtoFile(base64)
        open.value = false
        if (props.customRequest) {
          customRequest({ file } as any)
        } else {
          props.onChange?.(base64, file)
          formItemContext.onFieldChange()
        }
      }
    }

    const onClear = (e: MouseEvent) => {
      e.stopPropagation()
      props.onChange?.('')
      formItemContext.onFieldChange()
    }

    return () => {
      if (props.readonly) {
        return (
          <div
            class={`${prefixCls}-upload-picture`}
            style={{ width: props.width + 'px', height: props.height + 'px', display: 'block' }}
          >
            <div
              class={`${prefixCls}-upload-picture-button`}
              style={{
                width: props.width + 'px',
                height: props.height + 'px',
                cursor: 'auto',
              }}
            >
              {props.value ? (
                <div
                  style={`width: 100%; height: 100%; background-size: contain; background-repeat: no-repeat; background-position: center center; background-image: url("${props.value}");`}
                ></div>
              ) : (
                <div class={`${prefixCls}-upload-picture-button-empty`}></div>
              )}
            </div>
          </div>
        )
      }
      return (
        <FormItemRest>
          <Upload
            {...uploadProps.value}
            before-upload={beforeUpload}
            show-upload-list={false}
            name={props.name}
            multiple={false}
            class={`${prefixCls}-upload-picture`}
            style={{ width: props.width + 'px', height: props.height + 'px', display: 'block' }}
            onChange={onUploadChange}
          >
            <Spin spinning={loading.value} indicator={<LoadingOutlined />} delay={300}>
              <div
                class={`${prefixCls}-upload-picture-button`}
                style={{
                  width: props.width + 'px',
                  height: props.height + 'px',
                  cursor: !(props.disabled ?? disabled?.value) ? 'pointer' : 'not-allowed',
                }}
              >
                {props.value ? (
                  <div
                    style={`width: 100%; height: 100%; background-size: contain; background-repeat: no-repeat; background-position: center center; background-image: url("${props.value}");`}
                  ></div>
                ) : (
                  <div class={`${prefixCls}-upload-picture-button-empty`}>
                    <PlusOutlined />
                  </div>
                )}
                {props.showTitle && !(props.disabled ?? disabled?.value) && (
                  <div class={`${prefixCls}-upload-picture-button-mask`}>
                    {props.title || intl.getMessage('upload.picture.title', '修改图片')}
                  </div>
                )}
                {props.allowClear && props.value && !(props.disabled ?? disabled?.value) && (
                  <div class={`${prefixCls}-upload-picture-button-clear`} onClick={onClear}>
                    <CloseOutlined />
                  </div>
                )}
              </div>
            </Spin>
          </Upload>
          {props.isCropper && (
            <ProModal
              v-model:open={open.value}
              width={props.cropperModalWidth}
              title={
                props.cropperModalTitle ||
                intl.getMessage('upload.picture.cropperModalTitle', '裁剪图片')
              }
              destroy-on-close
              show-fullscreen={false}
              onOk={onConfirm}
            >
              <ProCropper
                ref={cropperRef}
                img-src={imgSrc.value}
                cropper-props={mergeCropperProps.value}
                cropper-width={props.cropperWidth}
                cropper-height={props.cropperHeight}
              />
            </ProModal>
          )}
        </FormItemRest>
      )
    }
  },
})
