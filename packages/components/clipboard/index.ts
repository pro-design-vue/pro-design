/*
 * @Author: shen
 * @Date: 2023-12-25 11:04:14
 * @LastEditors: shen
 * @LastEditTime: 2025-08-27 10:05:03
 * @Description:
 */
import { withInstall } from '@pro-design-vue/utils'
import Clipboard from './src/Clipboard'

export const ProClipboard = withInstall(Clipboard)

export default ProClipboard

export type ProClipboardInstance = InstanceType<typeof ProClipboard>
