/*
 * @Author: shen
 * @Date: 2023-08-10 14:34:03
 * @LastEditors: shen
 * @LastEditTime: 2025-10-24 16:27:19
 * @Description:
 */
import type { PropType } from 'vue'

import { computed, defineComponent } from 'vue'
import { Upload, Button } from 'ant-design-vue'
import { UploadOutlined } from '@ant-design/icons-vue'
import { useInjectSlots } from '../context/FormSlotsContext'
import { commonFieldProps } from '../props'
import { useIntl } from '@pro-design-vue/components/config-provider'
import { isFunction, RenderVNode } from '@pro-design-vue/utils'
import getSlot from '../utils/getSlot'
import { useInjectForm } from '../context/FormContext'
const SLOT_NAMES = ['downloadIcon', 'itemRender', 'previewIcon', 'removeIcon']

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
    listType: {
      type: String as PropType<'text' | 'picture' | 'picture-card'>,
      default: 'picture',
    },
  },
  setup(props, { attrs }) {
    const intl = useIntl()
    const { formData } = useInjectForm()
    const formSlotsContext = useInjectSlots()
    const value = computed(() => {
      return props.fileList ?? props.value
    })

    const showUploadButton = computed(
      () => props.max === undefined || !value.value || value.value?.length < props.max,
    )
    const isPictureCard = computed(() => props.listType === 'picture-card')
    const slotsGetter = computed(() => {
      const temp = {}
      SLOT_NAMES.forEach((name) => {
        const slot = getSlot(props[name], formSlotsContext)
        if (slot) {
          temp[name] = () => <RenderVNode vnode={slot} props={{ formData: formData.value }} />
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

    const onChange = (info) => {
      props.onChange?.(info.fileList, info)
    }

    return () => (
      <Upload
        fileList={value.value}
        {...attrs}
        listType={props.listType}
        name={props.name}
        v-slots={slotsGetter.value}
        onChange={onChange}
      >
        {showUploadButton.value &&
          (isPictureCard.value ? (
            <span>
              {icon.value}
              {title.value}
            </span>
          ) : (
            <Button disabled={props.disabled} {...props.buttonProps}>
              {icon.value}
              {title.value}
            </Button>
          ))}
      </Upload>
    )
  },
})
