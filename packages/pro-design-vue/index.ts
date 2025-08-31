/*
 * @Author: shen
 * @Date: 2025-08-26 21:22:00
 * @LastEditors: shen
 * @LastEditTime: 2025-08-31 17:47:05
 * @Description:
 */
import installer from './defaults'

export * from '@pro-design-vue/components'
export * from '@pro-design-vue/constants'
export * from '@pro-design-vue/directives'
export * from '@pro-design-vue/hooks'
export * from './make-installer'

export const install = installer.install
export const version = installer.version
export default installer

export { default as dayjs } from 'dayjs'
