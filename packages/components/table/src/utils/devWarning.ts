/*
 * @Author: shen
 * @Date: 2022-04-10 14:17:15
 * @LastEditors: shen
 * @LastEditTime: 2023-11-11 12:42:46
 * @Description:
 */
import devWarning, { resetWarned } from './warning'

export { resetWarned }

export default (valid: boolean, component: string, message: string): void => {
  devWarning(valid, `[table: ${component}] ${message}`)
}
