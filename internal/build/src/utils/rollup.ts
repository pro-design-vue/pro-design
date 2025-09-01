/*
 * @Author: shen
 * @Date: 2025-08-27 17:26:37
 * @LastEditors: shen
 * @LastEditTime: 2025-09-01 15:13:04
 * @Description:
 */
import { pdPackage, getPackageDependencies } from '@pro-design-vue/build-utils'

import type { OutputOptions, RollupBuild } from 'rollup'

export const generateExternal = async (options: { full: boolean }) => {
  const { dependencies, peerDependencies } = getPackageDependencies(pdPackage)
  return (id: string) => {
    const packages: string[] = [...peerDependencies]
    if (!options.full) {
      packages.push('@vue', ...dependencies)
    }
    return [...new Set(packages)].some((pkg) => id === pkg || id.startsWith(`${pkg}/`))
  }
}

export function writeBundles(bundle: RollupBuild, options: OutputOptions[]) {
  return Promise.all(options.map((option) => bundle.write(option)))
}

export function formatBundleFilename(name: string, minify: boolean, ext: string) {
  return `${name}${minify ? '.min' : ''}.${ext}`
}
