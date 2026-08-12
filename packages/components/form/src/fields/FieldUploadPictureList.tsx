/*
 * @Author: shen
 * @Date: 2023-08-10 14:34:03
 * @LastEditors: shen
 * @LastEditTime: 2026-08-12 16:57:05
 * @Description:
 */
import type { PropType } from 'vue'
import type { UploadProps } from 'ant-design-vue'

import { computed, defineComponent, ref, watch } from 'vue'
import { Form, Upload, Image, ImagePreviewGroup } from 'ant-design-vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import { commonFieldProps } from '../props'
import { useInjectForm } from '../context/FormContext'
import { isEqual } from '@pro-design-vue/utils'

export default defineComponent({
  name: 'FieldUploadPictureList',
  inheritAttrs: false,
  props: {
    ...commonFieldProps(),
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
    const previewCurrent = ref(0)
    const { prefixCls, disabled } = useInjectForm()
    const formItemContext = Form.useInjectFormItemContext()
    const mergeDisabled = computed(() => {
      return props.readonly || (props.disabled ?? disabled?.value)
    })

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

    // const getBase64 = (file: File) => {
    //   return new Promise((resolve, reject) => {
    //     const reader = new FileReader()
    //     reader.readAsDataURL(file)
    //     reader.onload = () => resolve(reader.result)
    //     reader.onerror = (error) => reject(error)
    //   })
    // }

    const handlePreview = async (file) => {
      previewCurrent.value = fileList.value.findIndex((item) => item.uid === file.uid)
      previewVisible.value = true
    }

    const showPlusIcon = computed(() => {
      const maxCount = props.maxCount || 0
      return !(mergeDisabled.value || (!!maxCount && fileList.value.length >= maxCount))
    })

    watch(
      () => props.value,
      (newValue) => {
        if (newValue) {
          if (!isEqual(newValue, fileList.value)) {
            fileList.value = newValue.map((item) => ({ ...item, crossOrigin: props.crossOrigin }))
          }
        } else {
          fileList.value = []
        }
      },
      {
        immediate: true,
      },
    )

    watch(fileList, () => {
      props.onChange?.(fileList.value)
      console.log(fileList.value)
      formItemContext.onFieldChange()
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
            '--pro-upload-picture-list-width': props.width + 'px',
            '--pro-upload-picture-list-height': props.height + 'px',
          }}
          showUploadList={{
            showPreviewIcon: true,
            showRemoveIcon: !mergeDisabled.value,
          }}
          onPreview={handlePreview}
        >
          {showPlusIcon.value && <PlusOutlined />}
        </Upload>
        <div style="display: none" key={fileList.value?.length}>
          <ImagePreviewGroup
            preview={{
              current: previewCurrent.value,
              getContainer: () => document.body,
              visible: previewVisible.value,
              onVisibleChange: (vis) => (previewVisible.value = vis),
            }}
          >
            {fileList.value?.map((item) => (
              <Image key={item.uid} src={item.url || item.thumbUrl} />
            ))}
          </ImagePreviewGroup>
        </div>
      </>
    )
  },
})
