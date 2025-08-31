/*
 * @Author: shen
 * @Date: 2025-06-23 16:43:18
 * @LastEditors: shen
 * @LastEditTime: 2025-08-27 11:22:04
 * @Description:
 */

import type { SFCWithInstall } from '@pro-design-vue/utils'
import type { Props } from './src/modal.vue'

import { withInstall } from '@pro-design-vue/utils'
import Modal from './src/modal.vue'

export const ProModal: SFCWithInstall<typeof Modal> = withInstall(Modal)
export type { Props as ProModalProps }
export default ProModal
