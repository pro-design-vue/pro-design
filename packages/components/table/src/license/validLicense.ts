/*
 * @Author: shen
 * @Date: 2022-11-03 20:23:10
 * @LastEditors: shen
 * @LastEditTime: 2025-08-29 14:29:26
 * @Description:
 */
import md5 from './md5'
import { base64Decode } from './decode'

export const INVAILD = 1
export const EXPIRY = 2
export const NO_LICENSE = 3
export const SUCCESS = 4
export interface LicenseInfo {
  orderNumber: string
  expiredTime: Date
  authUrl: string
}

function md5Sign(e3: string) {
  return md5(unescape(encodeURIComponent(e3)))
}

export const getReleaseDate = () => new Date(parseInt(base64Decode('MTY3MjQxNjAwMDAwMA=='), 10))

export function validLicense(licenseKey: string):
  | {
      code: number
      expiredTime?: undefined
      isTrial?: undefined
    }
  | {
      code: number
      expiredTime: Date
      isTrial?: undefined
    }
  | {
      code: number
      isTrial: boolean
      expiredTime: Date
    } {
  if (!licenseKey) return { code: NO_LICENSE }
  const sign = licenseKey.substring(0, 32)
  const authBase64 = licenseKey.substring(32)
  if (sign !== md5Sign(authBase64)) return { code: INVAILD }
  const authInfoStr = base64Decode(authBase64) || ''
  const parseAuth: any = {}
  authInfoStr.split(',').forEach((keyValue) => {
    const [key, value] = keyValue.split('=')
    parseAuth[key!] = value
  })
  const domain = parseAuth.DOMAIN
  const ultimate = Number(parseAuth.ULTIMATE || 0) //终极版
  const isTrial = 'EXPERIENCE' in parseAuth // 体验版
  if (isTrial) {
    const expire = parseInt(parseAuth.EXPIRY, 10)
    const expiredTime = new Date(expire)
    if (expiredTime < new Date()) return { code: EXPIRY, expiredTime, isTrial }
  }
  if (!ultimate && window?.location) {
    if (!domain) {
      return { code: INVAILD }
    }
    const hostname = window.location.hostname
    const domainSplit = domain.split('.')
    const hostnameSplit = hostname.split('.')
    const hostnameSplitLast = hostnameSplit[hostnameSplit.length - 1]
    if (
      hostnameSplitLast &&
      hostname !== 'localhost' &&
      hostname !== '127.0.0.1' &&
      isNaN(+hostnameSplitLast)
    ) {
      for (let i = domainSplit.length - 1; i >= 0; i--) {
        const currentDomain = domainSplit[i]
        const currentHostname = hostnameSplit[hostnameSplit.length - (domainSplit.length - i)]
        if (currentHostname && currentDomain !== currentHostname) {
          return { code: INVAILD }
        }
      }
    }
  }
  let expiredTime = 0
  try {
    expiredTime = parseInt(parseAuth.EXPIRY, 10)
    if (!expiredTime || Number.isNaN(expiredTime)) {
      return { code: INVAILD }
    }
  } catch (_) {
    return { code: INVAILD }
  }
  const updateExpiredTime = new Date(expiredTime + 6048e5) //当前发布版本后7天=604800000毫秒
  return updateExpiredTime < getReleaseDate()
    ? { code: EXPIRY, expiredTime: updateExpiredTime }
    : { code: SUCCESS, isTrial, expiredTime: updateExpiredTime }
}
