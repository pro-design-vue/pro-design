/*
 * @Author: shen
 * @Date: 2022-11-03 20:23:10
 * @LastEditors: shen
 * @LastEditTime: 2022-11-03 20:24:54
 * @Description:
 */
import { ref } from 'vue'

const licenseKey = ref('')

export const setLicenseKey = (key: string) => {
  licenseKey.value = key
}

export const getLicenseKey = () => {
  return licenseKey.value
}
