/*
 * @Author: shen
 * @Date: 2023-11-08 13:04:54
 * @LastEditors: shen
 * @LastEditTime: 2023-11-08 13:05:01
 * @Description:
 */
export type FocusEventHandler = (e: FocusEvent) => void
export type MouseEventHandler = (e: MouseEvent) => void
export type KeyboardEventHandler = (e: KeyboardEvent) => void
export type ChangeEvent = Event & {
  target: {
    value?: string | undefined
  }
}
export type EventHandler = (...args: any[]) => void
