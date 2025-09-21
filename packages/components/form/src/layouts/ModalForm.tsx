/*
 * @Author: shen
 * @Date: 2023-08-28 13:01:45
 * @LastEditors: shen
 * @LastEditTime: 2025-09-21 23:53:22
 * @Description:
 */
import { ref, computed, watch, defineComponent } from 'vue'
import { ProModal, type ProModalProps } from '@pro-design-vue/components/modal'
import { Modal } from 'ant-design-vue'
import { drawerOrModalFormProps } from '../props'
import { useIntl } from '@pro-design-vue/components/config-provider'
import {
  cloneElement,
  filterEmpty,
  merge,
  omit,
  omitUndefined,
  pickKeys,
} from '@pro-design-vue/utils'
import BaseForm from '../base/BaseForm'

import type { PropType } from 'vue'
import type { ProFormActionType } from '../type'

export default defineComponent({
  name: 'ProModalForm',
  inheritAttrs: false,
  props: {
    ...drawerOrModalFormProps(),
    modalProps: {
      type: Object as PropType<ProModalProps>,
      default: undefined,
    },
  },
  emits: ['update:open'],
  setup(props, { slots, emit }) {
    const _open = ref(false)
    const loading = ref(false)
    const valuesChanged = ref(false)
    const intl = useIntl()
    const formRef = ref<ProFormActionType>()
    const footerRef = ref<HTMLDivElement | null>(null)
    const open = computed({
      get: () => {
        return props.open ?? _open.value
      },
      set: (val) => {
        if (typeof props.open === 'undefined') {
          _open.value = val
        } else {
          emit('update:open', val)
        }
      },
    })

    watch(open, () => {
      props.onOpenChange?.(open.value)
    })

    const formProps = computed(() => {
      return {
        ...omitUndefined(
          omit(props, [
            'onInit',
            'onOpenChange',
            'closeOnFinish',
            'modalProps',
            'title',
            'width',
            'confirmOnValuesChange',
            'submitTimeout',
            'onFinish',
            'submitter',
          ]),
        ),
        layout: props.layout ?? 'vertical',
      }
    })

    const formSlots = computed(() => {
      return {
        ...omitUndefined(omit(slots, ['trigger', 'closeIcon', 'extra', 'footer', 'title'])),
      }
    })

    const modalProps = computed<ProModalProps>(() =>
      omitUndefined({
        ...omit(props.modalProps ?? {}, ['title', 'width', 'footer']),
        width: props.width,
        title: props.title,
        footer: props.submitter === false ? null : undefined,
      }),
    )

    const modalSlots = computed(() => {
      return {
        ...omitUndefined(pickKeys(slots, ['closeIcon', 'title'])),
      }
    })

    const submitterConfig = computed(() => {
      if (props.submitter === false) {
        return false
      }

      return merge(
        {
          teleport: footerRef.value,
          reverse: true,
          searchConfig: {
            submitText: modalProps.value?.okText ?? intl.getMessage('confirm.okText', '确认'),
            resetText:
              modalProps.value?.cancelText ?? intl.getMessage('confirm.cancelText', '取消'),
          },
          resetButtonProps: {
            preventDefault: true,
            disabled: props.submitTimeout ? loading.value : undefined,
            onClick: (e: any) => {
              closeConfirm(e)
            },
          },
        },
        props.submitter,
      )
    })

    const triggerDom = computed(() => {
      if (!slots.trigger) {
        return null
      }
      const trigger: any = filterEmpty(slots.trigger())[0]
      return cloneElement(trigger, {
        key: 'trigger',
        ...trigger?.props,
        onClick: async (e: any) => {
          open.value = !open.value
          trigger?.props?.onClick?.(e)
        },
      })
    })

    const closeConfirm = (e) => {
      if (props.confirmOnValuesChange && valuesChanged.value) {
        Modal.confirm({
          title: intl.getMessage('confirm.title', '提示'),
          content: intl.getMessage(
            'confirm.formModalCloseContent',
            '您的表单还没有保存，您确定关闭吗？',
          ),
          onOk() {
            open.value = false
            modalProps.value?.onCancel?.(e)
          },
          onCancel() {},
        })
      } else {
        open.value = false
        modalProps.value?.onCancel?.(e)
      }
    }

    const resetFields = () => {
      if (formRef.value && !modalProps.value?.destroyOnClose) {
        formRef.value?.reset?.()
      }
    }

    const onFinishHandle = async (values: any) => {
      const response = props.onFinish?.(values)
      if (props.submitTimeout && response instanceof Promise) {
        loading.value = true
        const timer = setTimeout(() => {
          loading.value = false
        }, props.submitTimeout)
        response.finally(() => {
          clearTimeout(timer)
          loading.value = false
        })
      }
      const result = await response
      if (result) {
        if (props.closeOnFinish) {
          open.value = false
        } else {
          valuesChanged.value = false
        }
      }
      return result
    }

    return () => (
      <>
        <ProModal
          {...modalProps.value}
          open={open.value}
          afterClose={() => {
            resetFields()
            valuesChanged.value = false
            modalProps.value?.afterClose?.()
          }}
          onCancel={(e) => {
            if (props.submitTimeout && loading.value) return
            closeConfirm(e)
          }}
          v-slots={{
            ...modalSlots.value,
            footer:
              props.submitter !== false
                ? () => (
                    <div style="display: flex; justify-content: flex-end;" ref={footerRef}></div>
                  )
                : undefined,
          }}
        >
          <BaseForm
            {...formProps.value}
            submitter={submitterConfig.value}
            v-slots={formSlots.value}
            onFinish={async (values) => {
              const result = await onFinishHandle(values)
              return result
            }}
            onValuesChange={(values) => {
              if (props.confirmOnValuesChange) {
                valuesChanged.value = true
              }
              props.onValuesChange?.(values)
            }}
            onReset={() => {
              if (props.confirmOnValuesChange) {
                valuesChanged.value = false
              }
              props.onReset?.()
            }}
            onInit={(values, action) => {
              formRef.value = action
              props.onInit?.(values, action)
            }}
          />
        </ProModal>
        {triggerDom.value}
      </>
    )
  },
})
