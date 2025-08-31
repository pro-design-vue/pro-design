/*
 * @Author: shen
 * @Date: 2023-06-03 12:24:33
 * @LastEditors: shen
 * @LastEditTime: 2025-08-26 17:18:19
 * @Description:
 */
import { withInstall } from '@pro-design-vue/utils'
import Button from './src/Button'

export const ProButton = withInstall(Button)

export default ProButton

export type ProButtonInstance = InstanceType<typeof ProButton>
