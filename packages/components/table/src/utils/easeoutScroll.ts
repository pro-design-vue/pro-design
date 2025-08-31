/*
 * @Author: shen
 * @Date: 2022-11-03 18:07:01
 * @LastEditors: shen
 * @LastEditTime: 2022-11-03 18:07:03
 * @Description:
 */
import raf from './raf'

const easeoutScroll: (
  start: number,
  end: number,
  callback: (current: number, isEnding: boolean) => void,
  rate?: number,
) => {
  id: number
} = (start, end, callback, rate = 4) => {
  if (start == end) {
    return raf(() => ({}))
  }
  const loop = () => {
    start += (end - start) / rate
    if (Math.abs(start - end) < 1) {
      callback(end, true)
      return raf(() => ({}))
    } else {
      callback(start, false)
      return raf(loop)
    }
  }
  return loop()
}
export default easeoutScroll
