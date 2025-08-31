/*
 * @Author: shen
 * @Date: 2022-11-03 18:11:21
 * @LastEditors: shen
 * @LastEditTime: 2023-11-07 15:49:12
 * @Description:
 */
export function hasClass(node: HTMLElement, className: string) {
  if (node.classList) {
    return node.classList.contains(className)
  }
  const originClass = node.className
  return ` ${originClass} `.indexOf(` ${className} `) > -1
}

export function addClass(node: HTMLElement, className: string | string[]) {
  if (node?.classList && className) {
    const clases = Array.isArray(className) ? className : className.split(' ')
    node.classList.add(...clases)
  }
}

export function removeClass(node: HTMLElement, className: string | string[]) {
  if (node?.classList && className) {
    const clases = Array.isArray(className) ? className : className.split(' ')
    node.classList.remove(...clases)
  }
}
