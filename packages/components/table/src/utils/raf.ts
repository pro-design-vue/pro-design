/*
 * @Author: shen
 * @Date: 2022-04-11 10:25:17
 * @LastEditors: shen
 * @LastEditTime: 2022-11-03 18:01:24
 * @Description:
 */
import getRequestAnimationFrame, { cancelRequestAnimationFrame } from './getRequestAnimationFrame'

export type RafFrame = {
  id: number
}

const requestAnimationFrame = getRequestAnimationFrame()

function raf(
  callback: () => void,
  delayFrames = 1,
): {
  id: number
} {
  let df = delayFrames
  const frame = {
    id: requestAnimationFrame(function cb() {
      df -= 1
      if (df <= 0) {
        callback()
      } else {
        frame.id = requestAnimationFrame(cb)
      }
    }),
  }
  return frame
}
raf.cancel = (frame?: { id: number }) => {
  frame && cancelRequestAnimationFrame(frame.id)
}

export default raf
