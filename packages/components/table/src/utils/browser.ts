/*
 * @Author: shen
 * @Date: 2023-11-07 15:30:53
 * @LastEditors: shen
 * @LastEditTime: 2025-08-29 14:29:54
 * @Description:
 */
// export declare function isBrowserIE(): boolean
// export declare function isBrowserEdge(): boolean
// export declare function isBrowserSafari(): boolean
// export declare function isBrowserChrome(): boolean
// export declare function isBrowserFirefox(): boolean

let isMacOsUserAgentCache: boolean
export function isMacOsUserAgent(): boolean {
  if (!isMacOsUserAgentCache) {
    isMacOsUserAgentCache = /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform)
  }
  return isMacOsUserAgentCache
}

let isIOSUserAgentCache: boolean
export function isIOSUserAgent(): boolean {
  if (!isIOSUserAgentCache) {
    isIOSUserAgentCache =
      (/iPad|iPhone|iPod/.test(navigator.platform) ||
        ('MacIntel' === navigator.platform && navigator.maxTouchPoints > 1)) &&
      !(window as any).MSStream
  }
  return isIOSUserAgentCache
}
export const chrome: RegExpExecArray | null = /Chrome\/(\d+)/.exec(navigator.userAgent)
export const chromeVersion: number | null = chrome && +chrome[1]!
