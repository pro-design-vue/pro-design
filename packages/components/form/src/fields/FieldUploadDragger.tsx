/*
 * @Author: shen
 * @Date: 2023-08-10 14:34:03
 * @LastEditors: shen
 * @LastEditTime: 2025-10-24 16:17:22
 * @Description:
 */
import { computed, defineComponent } from 'vue'
import { Upload, theme } from 'ant-design-vue'
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
  },
  setup(props, { attrs }) {
    const { token } = theme.useToken()
    const { prefixCls, formData } = useInjectForm()
    const intl = useIntl()
    const formSlotsContext = useInjectSlots()
    const value = computed(() => {
      return props.fileList ?? props.value
    })
    const baseClassName = computed(() => `${prefixCls}-upload`)
    const showUploadButton = computed(
      () => props.max === undefined || !value.value || value.value?.length < props.max,
    )
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

    const onChange = (info) => {
      props.onChange?.(info.fileList, info)
    }

    return () => (
      <Upload.Dragger
        fileList={value.value}
        {...attrs}
        name={props.name}
        style={{
          ...(attrs as any)?.style,
          display: !showUploadButton.value ? 'none' : undefined,
        }}
        v-slots={slotsGetter.value}
        onChange={onChange}
      >
        <p class={`${baseClassName.value}-drag-icon`} style={{ color: token.value.colorPrimary }}>
          {icon.value}
        </p>
        <p class={`${baseClassName.value}-text`}>{title.value}</p>
        <p class={`${baseClassName.value}-hint`}>{description.value}</p>
      </Upload.Dragger>
    )
  },
})
