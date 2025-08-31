/*
 * @Author: shen
 * @Date: 2022-04-09 18:33:16
 * @LastEditors: shen
 * @LastEditTime: 2023-11-05 11:19:47
 * @Description:
 */
import { isArray, isString, isObject } from './util'

function classNames(...args: any[]): string {
  const classes: string[] = []
  for (let i = 0; i < args.length; i++) {
    const value: any = args[i]
    if (!value) continue
    if (isString(value)) {
      classes.push(value)
    } else if (isArray(value)) {
      for (let i = 0; i < value.length; i++) {
        const inner = classNames(value[i])
        if (inner) {
          classes.push(inner)
        }
      }
    } else if (isObject(value)) {
      for (const name in value) {
        if (value[name]) {
          classes.push(name)
        }
      }
    }
  }
  return classes.join(' ')
}

export default classNames
