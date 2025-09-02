/*
 * @Author: shen
 * @Date: 2025-09-01 20:18:08
 * @LastEditors: shen
 * @LastEditTime: 2025-09-02 11:11:12
 * @Description:
 */
import consola from 'consola'
import chalk from 'chalk'
import { errorAndExit, getWorkspacePackages } from '@pro-design-vue/build-utils'

import type { Project } from '@pnpm/find-workspace-packages'

async function main() {
  const tagVersion = process.env.TAG_VERSION
  const gitHead = process.env.GIT_HEAD
  if (!tagVersion || !gitHead) {
    errorAndExit(
      new Error(
        'No tag version or git head were found, make sure that you set the environment variable $TAG_VERSION \n',
      ),
    )
  }

  consola.log(chalk.cyan('Start updating version'))
  consola.log(chalk.cyan(`$TAG_VERSION: ${tagVersion}`))
  consola.log(chalk.cyan(`$GIT_HEAD: ${gitHead}`))

  consola.debug(chalk.yellow(`Updating package.json for pro-design-vue`))

  const pkgs = Object.fromEntries(
    (await getWorkspacePackages()).map((pkg) => [pkg.manifest.name!, pkg]),
  )
  const proDesign = pkgs['pro-design-vue']

  const writeVersion = async (project: Project) => {
    await project.writeProjectManifest({
      ...project.manifest,
      version: tagVersion,
    })
  }

  try {
    await writeVersion(proDesign)
  } catch (err: any) {
    errorAndExit(err)
  }
}

main()
