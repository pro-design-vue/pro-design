/*
 * @Author: shen
 * @Date: 2025-12-05 15:58:31
 * @LastEditors: shen
 * @LastEditTime: 2026-01-01 14:07:32
 * @Description:
 */
import type { ProFieldProps } from '../../type'

import { defineComponent, Fragment, toRefs, type PropType, type VNode } from 'vue'
import { baseFieldProps } from '../../props'
import { usePrefixCls, useVNodeJSX } from '@pro-design-vue/hooks'
import { theme } from 'ant-design-vue'
import { cloneElement, isObject, isValidElement } from '@pro-design-vue/utils'

const addArrayKeys = (doms: VNode[]) =>
  doms.map((dom, index) => {
    if (!isValidElement(dom)) {
      return <Fragment key={index}>{dom}</Fragment>
    }
    return cloneElement(dom, {
      key: index,
      ...dom?.props,
      style: {
        ...dom?.props?.style,
      },
    })
  })

export default defineComponent({
  name: 'FieldOptions',
  inheritAttrs: false,
  props: {
    ...baseFieldProps,
  },
  setup(props) {
    const prefixCls = usePrefixCls('field-option')
    const renderContent = useVNodeJSX()
    const { token } = theme.useToken()
    const { mode, text, fieldProps } = toRefs(props)

    return () => {
      let doms = renderContent('render', {
        params: { text, mode, ...fieldProps.value },
        slotFirst: true,
      })
      if (isObject(doms) && doms.type === Fragment) {
        doms = doms.children
      }
      if (!doms || doms?.length < 1 || !Array.isArray(doms)) {
        return null
      }
      return (
        <div
          style={{
            display: 'flex',
            gap: token.value.marginXS + 'px',
            alignItems: 'center',
          }}
          class={prefixCls}
        >
          {addArrayKeys(doms)}
        </div>
      )
    }
  },
})
