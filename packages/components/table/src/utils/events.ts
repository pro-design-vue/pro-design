/*
 * @Author: shen
 * @Date: 2023-11-09 22:17:05
 * @LastEditors: shen
 * @LastEditTime: 2023-11-09 22:19:43
 * @Description:
 */
const eventCache = {}
const eventMap = {
  select: 'input',
  change: 'input',
  submit: 'form',
  reset: 'form',
  error: 'img',
  load: 'img',
  abort: 'img',
}

export const isEventSupported = (eventName: any) => {
  if ('boolean' == typeof eventCache[eventName]) return eventCache[eventName]
  const dom = document.createElement(eventMap[eventName] || 'div')
  return (eventCache[(eventName = 'on' + eventName)] = eventName in dom)
}
