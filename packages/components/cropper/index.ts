/*
 * @Author: shen
 * @Date: 2023-12-25 11:04:14
 * @LastEditors: shen
 * @LastEditTime: 2025-08-27 10:25:08
 * @Description:
 */
import { withInstall } from '@pro-design-vue/utils'
import Cropper from './src/cropper.vue'

export const ProCropper = withInstall(Cropper)

export default ProCropper

export type ProCropperInstance = InstanceType<typeof ProCropper>
