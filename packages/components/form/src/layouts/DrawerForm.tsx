/*
 * @Author: shen
 * @Date: 2023-08-28 13:01:45
 * @LastEditors: shen
 * @LastEditTime: 2025-09-21 18:43:22
 * @Description:
 */
import type { PropType } from 'vue'
import type { ProFormActionType } from '../type'
import type { ProDrawerProps } from '@pro-design-vue/components/drawer'

import { ref, computed, watch, defineComponent } from 'vue'
import { Modal } from 'ant-design-vue'
import { ProDrawer } from '@pro-design-vue/components/drawer'
import { drawerOrModalFormProps } from '../props'
import { useFormExpose } from '../hooks/useFormExpose'
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

export default defineComponent({
  name: 'ProDrawerForm',
  inheritAttrs: false,
  props: {
    ...drawerOrModalFormProps(),
    drawerProps: {
      type: Object as PropType<ProDrawerProps & { okText?: string; cancelText?: string }>,
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
            'onOpenChange',
            'closeOnFinish',
            'drawerProps',
            'title',
            'width',
            'onInit',
            'confirmOnValuesChange',
            'submitTimeout',
            'onFinish',
            'submitter',
          ]),
        ),
        layout: 'vertical',
      }
    })

    const formSlots = computed(() => {
      return {
        ...omitUndefined(omit(slots, ['trigger', 'closeIcon', 'extra', 'footer', 'title'])),
      }
    })

    const drawerProps = computed(() =>
      omitUndefined({
        ...omit(props.drawerProps ?? {}, [
          'title',
          'width',
          'open',
          'footer',
          'okText',
          'cancelText',
        ]),
        width: props.width,
        title: props.title,
      }),
    )

    const drawerSlots = computed(() => {
      return {
        ...omitUndefined(pickKeys(slots, ['closeIcon', 'extra', 'title'])),
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
            submitText: props.drawerProps?.okText ?? intl.getMessage('confirm.okText', '确认'),
            resetText:
              props.drawerProps?.cancelText ?? intl.getMessage('confirm.cancelText', '取消'),
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
            drawerProps.value?.onClose?.(e)
          },
          onCancel() {},
        })
      } else {
        open.value = false
        drawerProps.value?.onClose?.(e)
      }
    }

    const resetFields = () => {
      if (formRef.value && !drawerProps.value?.destroyOnClose) {
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
      // 返回真值，关闭弹框
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
        <ProDrawer
          {...drawerProps.value}
          open={open.value}
          onAfterOpenChange={(e) => {
            if (!e) resetFields()
            valuesChanged.value = false
            drawerProps.value?.onAfterOpenChange?.(e)
          }}
          onClose={(e) => {
            if (props.submitTimeout && loading.value) return
            closeConfirm(e)
          }}
          v-slots={{
            ...drawerSlots.value,
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
        </ProDrawer>
        {triggerDom.value}
      </>
    )
  },
})
