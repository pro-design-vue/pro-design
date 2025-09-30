/*
 * @Author: shen
 * @Date: 2025-09-29 09:54:05
 * @LastEditors: shen
 * @LastEditTime: 2025-09-29 09:55:32
 * @Description:
 */
import { postcssIsolateStyles } from 'vitepress'

export default {
  plugins: [
    postcssIsolateStyles({
      includeFiles: [/vp-doc\.css/],
    }),
  ],
}
