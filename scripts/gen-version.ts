/*
 * @Author: shen
 * @Date: 2025-08-31 17:38:18
 * @LastEditors: shen
 * @LastEditTime: 2025-08-31 17:38:56
 * @Description:
 */
import { writeFile } from 'fs/promises'
import path from 'path'
import consola from 'consola'
import { pdRoot } from '@pro-design-vue/build-utils'
import pkg from '../packages/pro-design-vue/package.json' // need to be checked

function getVersion() {
  const tagVer = process.env.TAG_VERSION
  if (tagVer) {
    return tagVer.startsWith('v') ? tagVer.slice(1) : tagVer
  } else {
    return pkg.version
  }
}

const version = getVersion()

async function main() {
  consola.info(`Version: ${version}`)
  await writeFile(path.resolve(pdRoot, 'version.ts'), `export const version = '${version}'\n`)
}

main()
