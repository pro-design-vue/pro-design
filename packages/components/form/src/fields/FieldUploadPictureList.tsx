/*
 * @Author: shen
 * @Date: 2023-08-10 14:34:03
 * @LastEditors: shen
 * @LastEditTime: 2025-07-27 12:03:22
 * @Description:
 */
import type { PropType } from 'vue'
import type { UploadProps } from 'ant-design-vue'

import { computed, defineComponent, ref, watch } from 'vue'
import { Upload, Modal } from 'ant-design-vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import { commonFieldProps } from '../props'
import { useInjectForm } from '../context/FormContext'
import { isEqual } from '@pro-design-vue/utils'
import { useIntl } from '@pro-design-vue/components/config-provider'

export default defineComponent({
  name: 'FieldUploadPictureList',
  inheritAttrs: false,
  props: {
    ...commonFieldProps,
    name: {
      type: String,
      default: 'file',
    },
    disabled: {
      type: Boolean,
      default: undefined,
    },
    width: {
      type: Number,
      default: 80,
    },
    height: {
      type: Number,
      default: 80,
    },
    crossOrigin: {
      type: String as PropType<'anonymous' | 'use-credentials'>,
      default: '',
    },
    maxCount: {
      type: Number,
    },
    customRequest: Function,
  },
  setup(props, { attrs }) {
    const fileList = ref<any[]>([])
    const previewVisible = ref(false)
    const previewImage = ref('')
    const intl = useIntl()
    const { prefixCls, disabled } = useInjectForm()

    const mergeDisabled = computed(() => props.readonly || disabled?.value)

    const customRequest: UploadProps['customRequest'] = async (option) => {
      const formData = new FormData()
      formData.append(props.name, option.file)
      const onUploadProgress = (e) => {
        if (e.total > 0) {
          e.percent = (e.loaded / e.total) * 100
        }
        option?.onProgress?.(e)
      }
      const { success, error, data } = await props.customRequest!(formData, onUploadProgress)
      if (success) {
        option.onSuccess?.(data)
      } else {
        option.onError?.(error, data)
      }
    }

    const uploadProps = computed(() => {
      const newProps = { ...attrs }
      if (props.customRequest) {
        newProps.customRequest = customRequest
      }
      return newProps
    })

    const getBase64 = (file: File) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result)
        reader.onerror = (error) => reject(error)
      })
    }

    const handlePreview = async (file) => {
      if (!file.url && !file.preview) {
        file.preview = (await getBase64(file.originFileObj)) as string
      }
      previewImage.value = file.url || file.preview
      previewVisible.value = true
    }

    watch(
      () => props.value,
      (newValue) => {
        if (!isEqual(newValue, fileList.value)) {
          fileList.value = newValue.map((item) => ({ ...item, crossOrigin: props.crossOrigin }))
        }
      },
    )

    watch(fileList, () => {
      props.onChange?.(fileList.value)
    })

    return () => (
      <>
        <Upload
          {...uploadProps.value}
          v-model:fileList={fileList.value}
          name={props.name}
          disabled={mergeDisabled.value}
          list-type="picture-card"
          maxCount={props.maxCount}
          class={`${prefixCls}-upload-picture-list`}
          style={{
            '--s-upload-picture-list-width': props.width + 'px',
            '--s-upload-picture-list-height': props.height + 'px',
          }}
          onPreview={handlePreview}
        >
          {(!mergeDisabled.value || !props.maxCount || fileList.value.length < props.maxCount) && (
            <PlusOutlined />
          )}
        </Upload>
        <Modal
          v-model:open={previewVisible.value}
          width={800}
          title={intl.getMessage('upload.picture.viewModalTitle', '查看图片')}
          footer={null}
        >
          <img
            alt="preview"
            style="width: 100%"
            crossorigin={props.crossOrigin}
            src={previewImage.value}
          />
        </Modal>
      </>
    )
  },
})
