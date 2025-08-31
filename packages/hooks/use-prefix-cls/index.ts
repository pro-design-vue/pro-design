/*
 * @Author: shen
 * @Date: 2025-05-30 09:20:20
 * @LastEditors: shen
 * @LastEditTime: 2025-08-27 15:02:45
 * @Description:
 */
import { useProConfigInject } from '@pro-design-vue/components/config-provider'

function usePrefixCls(name: string) {
  const { proPrefixCls } = useProConfigInject()
  return `${proPrefixCls?.value || 'pro'}-${name}`
}

export { usePrefixCls }
