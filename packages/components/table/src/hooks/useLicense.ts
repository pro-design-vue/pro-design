import { ref, computed } from 'vue'
import { getLicenseKey } from '../license/licenseInfo'
import { validLicense } from '../license/validLicense'

import type { ComputedRef, Ref } from 'vue'

type LicenseRes = {
  status: ComputedRef<
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
      }
  >
  watermarkMsg: Ref<string>
}

function useLicense(): LicenseRes {
  const watermarkMsg = ref('')
  const licenseKey = computed(() => getLicenseKey())
  const status = computed(() => validLicense(licenseKey.value))

  // const formatDate = (date: Date) => {
  // 	if (!date) {
  // 		return ''
  // 	}
  // 	const day = date.getDate()
  // 	const month = date.getMonth()
  // 	const year = date.getFullYear()
  // 	const monthName = [
  // 		'January',
  // 		'February',
  // 		'March',
  // 		'April',
  // 		'May',
  // 		'June',
  // 		'July',
  // 		'August',
  // 		'September',
  // 		'October',
  // 		'November',
  // 		'December'
  // 	][month]
  // 	return `${day} ${monthName} ${year}`
  // }
  // watchEffect(() => {
  // 	switch (status.value.code) {
  // 		case 1: {
  // 			console.error(
  // 				'*****************************************************************************************************************'
  // 			)
  // 			console.error('***************************************** Enterprise License ********************************************')
  // 			console.error(
  // 				'********************************************* Invalid License ***************************************************'
  // 			)
  // 			console.error(
  // 				'*****************************************************************************************************************'
  // 			)
  // 			console.error(
  // 				'*****************************************************************************************************************'
  // 			)
  // 			watermarkMsg.value = 'Invalid License'
  // 			break
  // 		}
  // 		case 3: {
  // 			console.error('***************************************** Enterprise License *******************************************')
  // 			console.error(
  // 				'****************************************** License Key Not Found ***********************************************'
  // 			)
  // 			console.error('* All Enterprise features are unlocked.                                                                *')
  // 			console.error(
  // 				'* This is an evaluation only version, it is not licensed for development projects intended for production.     *'
  // 			)
  // 			console.error(
  // 				'****************************************************************************************************************'
  // 			),
  // 				console.error(
  // 					'****************************************************************************************************************'
  // 				)
  // 			watermarkMsg.value = 'Unlicensed Product'
  // 			break
  // 		}
  // 		case 2: {
  // 			const expiredDate = formatDate(status.value.expiredTime!)
  // 			const releaseDate = formatDate(getReleaseDate())
  // 			console.error(
  // 				'****************************************************************************************************************************'
  // 			)
  // 			console.error(
  // 				'****************************************************************************************************************************'
  // 			)
  // 			console.error(
  // 				'*                                             Enterprise License                                                   *'
  // 			)
  // 			console.error(
  // 				'*                           License not compatible with installed version of Enterprise.                           *'
  // 			)
  // 			console.error(
  // 				'*                                                                                                                          *'
  // 			)
  // 			console.error(
  // 				'* Your License entitles you to all versions of that we release within the time covered by your license     *'
  // 			)
  // 			console.error(
  // 				'* - typically we provide one year licenses which entitles you to all releases / updates of within that year.       *'
  // 			)
  // 			console.error(
  // 				'* Your license has an end (expiry) date which stops the license key working with versions of released after the    *'
  // 			)
  // 			console.error(
  // 				`* license end date. The license key that you have expires on ${expiredDate}, however the version of you    *`
  // 			)
  // 			console.error(
  // 				`* are trying to use was released on ${releaseDate}.                                                               *`
  // 			)
  // 			console.error(
  // 				'*                                                                                                                          *'
  // 			)
  // 			console.error(
  // 				'****************************************************************************************************************************'
  // 			)
  // 			console.error(
  // 				'****************************************************************************************************************************'
  // 			)
  // 			watermarkMsg.value = 'License Expired'
  // 			break
  // 		}
  // 		default: {
  // 			watermarkMsg.value = ''
  // 		}
  // 	}
  // 	if (status.value.isTrial) {
  // 		const expiredDateTime = formatDate(status.value.expiredTime!)
  // 		console.warn(
  // 			'*****************************************************************************************************************'
  // 		)
  // 		console.warn('***************************************** Enterprise License ********************************************')
  // 		console.warn(
  // 			'********************************************* Trial License ***************************************************'
  // 		)
  // 		console.warn('* Your license for Enterprise is a trial license. *'),
  // 			console.warn(`* The license key that you have expires on ${expiredDateTime}. *`)
  // 		console.warn(
  // 			'*****************************************************************************************************************'
  // 		)
  // 		console.warn(
  // 			'*****************************************************************************************************************'
  // 		)
  // 	}
  // })
  return { status, watermarkMsg }
}

export default useLicense
