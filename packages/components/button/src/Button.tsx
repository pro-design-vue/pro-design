/*
 * @Author: shen
 * @Date: 2024-03-09 11:41:13
 * @LastEditors: shen
 * @LastEditTime: 2025-09-07 18:42:58
 * @Description:
 */
import { type PropType, defineComponent, type CSSProperties, type VNode, computed } from 'vue'
import {
  Button,
  Tooltip,
  type TooltipProps,
  Popconfirm,
  type PopconfirmProps,
  Dropdown,
  type DropdownProps,
  Menu,
  type MenuProps,
  type ItemType,
  type ModalFuncProps,
  type ButtonProps,
} from 'ant-design-vue'
import { usePrefixCls } from '@pro-design-vue/hooks'
import { confirm, ensureValidVNode, omit } from '@pro-design-vue/utils'
import { ProIcon } from '@pro-design-vue/components/icon'
type ConfirmType = 'danger' | 'warning'
export default defineComponent({
  name: 'ProButton',
  inheritAttrs: false,
  props: {
    type: String as PropType<ButtonProps['type']>,
    htmlType: { type: String as PropType<ButtonProps['htmlType']>, default: 'button' },
    shape: { type: String as PropType<ButtonProps['shape']> },
    size: {
      type: String as PropType<ButtonProps['size']>,
    },
    loading: {
      type: [Boolean, Object] as PropType<boolean | { delay?: number }>,
      default: (): boolean | { delay?: number } => false,
    },
    disabled: { type: Boolean, default: undefined },
    ghost: { type: Boolean, default: undefined },
    block: { type: Boolean, default: undefined },
    danger: { type: Boolean, default: undefined },
    href: String,
    target: String,
    title: String,
    mode: {
      type: String as PropType<'default' | 'popconfirm' | 'confirm' | 'dropdown'>,
      default: 'default',
    },
    tooltip: {
      type: String,
      default: '',
    },
    tooltipProps: {
      type: Object as PropType<TooltipProps>,
    },
    dropdownProps: {
      type: Object as PropType<DropdownProps>,
    },
    menuProps: {
      type: Object as PropType<Omit<MenuProps, 'onClick' | 'items'>>,
    },
    popconfirmProps: {
      type: Object as PropType<Omit<PopconfirmProps, 'onConfirm' | 'onCancel'>>,
    },
    confirmProps: {
      type: Object as PropType<
        Omit<ModalFuncProps, 'type' | 'onCancel' | 'onOk'> & { type?: ConfirmType }
      >,
    },
    icon: {
      type: String,
      default: '',
    },
    iconStyle: {
      type: Object as PropType<CSSProperties>,
    },
    permission: {
      type: String,
      default: '',
    },
    items: {
      type: Array as PropType<ItemType[]>,
      default: () => [],
    },
    onClick: Function as PropType<(e: MouseEvent) => void>,
    onMousedown: Function as PropType<(e: MouseEvent) => void>,
    onConfirm: Function as PropType<(e: MouseEvent) => void>,
    onCancel: Function as PropType<(e: MouseEvent) => void>,
    onMenuClick: Function as PropType<MenuProps['onClick']>,
  },
  emits: ['confirm', 'click', 'cancel', 'menu-click', 'mousedown'],
  setup(props, { attrs, slots }) {
    const prefixCls = usePrefixCls('button')
    const renderConfirmContent = (key: string) => {
      if (slots[key]) {
        const vnodes = slots[key]?.()
        if (ensureValidVNode(vnodes)) {
          return vnodes
        }
      }
      return undefined
    }

    const buttonProps = computed(() =>
      omit(props, [
        'items',
        'permission',
        'iconStyle',
        'icon',
        'confirmProps',
        'popconfirmProps',
        'menuProps',
        'dropdownProps',
        'tooltipProps',
        'tooltip',
        'mode',
        'onConfirm',
        'onClick',
        'onCancel',
        'onMenuClick',
      ]),
    )

    const onClick = (e: MouseEvent) => {
      if (props.mode === 'default') {
        props.onClick?.(e)
        return
      }

      if (props.mode === 'confirm') {
        confirm({
          ...props.confirmProps,
          content:
            renderConfirmContent(props.confirmProps?.content as string) ||
            props.confirmProps?.content,
          title:
            renderConfirmContent(props.confirmProps?.title as string) || props.confirmProps?.title,
          onCancel() {
            return props.onCancel?.()
          },
          onOk() {
            return props.onConfirm?.()
          },
        })
      }
    }

    return () => {
      let icon: VNode | null = null
      if (slots.icon || props.icon) {
        icon = (
          <span class="anticon" style={props.iconStyle}>
            {slots.icon ? slots.icon() : <ProIcon icon={props.icon} />}
          </span>
        )
      }
      let defaultDom = (
        <Button
          {...attrs}
          {...buttonProps.value}
          class={prefixCls}
          v-slots={{
            icon: () => icon,
          }}
          onClick={props.mode === 'popconfirm' || props.mode === 'dropdown' ? undefined : onClick}
        >
          {slots.default?.()}
        </Button>
      )

      if (props.disabled) {
        return defaultDom
      }

      if (props.tooltip) {
        defaultDom = (
          <Tooltip {...props.tooltipProps} title={props.tooltip}>
            {defaultDom}
          </Tooltip>
        )
      }

      if (props.mode === 'popconfirm') {
        return (
          <Popconfirm
            {...props.popconfirmProps}
            onConfirm={props.onConfirm}
            onCancel={props.onCancel}
          >
            {defaultDom}
          </Popconfirm>
        )
      }

      if (props.mode === 'dropdown') {
        return (
          <Dropdown
            {...props.dropdownProps}
            v-slots={{
              overlay: () => (
                <Menu {...props.menuProps} items={props.items} onClick={props.onMenuClick} />
              ),
            }}
          >
            {defaultDom}
          </Dropdown>
        )
      }

      return defaultDom
    }
  },
})
