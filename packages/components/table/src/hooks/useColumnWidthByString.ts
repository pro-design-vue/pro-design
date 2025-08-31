/*
 * @Author: shen
 * @Date: 2022-11-04 19:59:32
 * @LastEditors: shen
 * @LastEditTime: 2023-11-03 15:50:53
 * @Description:
 */

export default function useColumnWidthByString() {
  const cacheWidthMap = {}
  return (container: HTMLDivElement, bodyScrollWidth: number, width?: string | number) => {
    if (width === undefined || container === undefined) {
      return 0
    }
    const dom = ((container as any).$el || container) as HTMLDivElement

    if (typeof width == 'number') {
      return width as number
    }

    if (cacheWidthMap[bodyScrollWidth]?.[width]) {
      return cacheWidthMap[bodyScrollWidth][width] as number
    }
    const widthMatch = width.match(/^(.*)px$/)
    let parseWidth = Number(widthMatch === null ? undefined : widthMatch[1])
    cacheWidthMap[bodyScrollWidth] = cacheWidthMap[bodyScrollWidth] || {}
    if (Number.isNaN(parseWidth)) {
      const divEl = document.createElement('div')
      divEl.style.width = width
      divEl.style.height = '0px'
      dom.style.width = `${bodyScrollWidth}px`
      dom.appendChild(divEl)
      parseWidth = Math.floor(divEl.offsetWidth)
      dom.removeChild(divEl)
    }
    cacheWidthMap[bodyScrollWidth][width] = parseWidth
    return cacheWidthMap[bodyScrollWidth][width] as number
  }
}
