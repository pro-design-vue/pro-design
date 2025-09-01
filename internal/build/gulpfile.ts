/*
 * @Author: shen
 * @Date: 2025-08-27 17:00:18
 * @LastEditors: shen
 * @LastEditTime: 2025-09-01 10:04:42
 * @Description:
 */
import path from 'path'
import { copyFile, mkdir } from 'fs/promises'
import { copy } from 'fs-extra'
import { parallel, series } from 'gulp'
import { buildOutput, pdOutput, pdPackage, projRoot } from '@pro-design-vue/build-utils'
import { buildConfig, run, runTask, withTaskName } from './src'

import type { TaskFunction } from 'gulp'
import type { Module } from './src'

export const copyFiles = () =>
  Promise.all([
    copyFile(pdPackage, path.join(pdOutput, 'package.json')),
    copyFile(path.resolve(projRoot, 'README.md'), path.resolve(pdOutput, 'README.md')),
    copyFile(
      path.resolve(projRoot, 'typings', 'global.d.ts'),
      path.resolve(pdOutput, 'global.d.ts'),
    ),
  ])

export const copyTypesDefinitions: TaskFunction = (done) => {
  const src = path.resolve(buildOutput, 'types', 'packages')
  const copyTypes = (module: Module) =>
    withTaskName(`copyTypes:${module}`, () =>
      copy(src, buildConfig[module].output.path, { recursive: true }),
    )

  return parallel(copyTypes('esm'), copyTypes('cjs'))(done)
}

export const copyFullStyle = async () => {
  await mkdir(path.resolve(pdOutput, 'dist'), { recursive: true })
  await copyFile(
    path.resolve(pdOutput, 'theme-chalk/index.css'),
    path.resolve(pdOutput, 'dist/index.css'),
  )
}

export default series(
  withTaskName('clean', () => run('pnpm run clean')),
  withTaskName('createOutput', () => mkdir(pdOutput, { recursive: true })),

  parallel(
    runTask('buildModules'),
    runTask('buildFullBundle'),
    runTask('generateTypesDefinitions'),
    series(
      withTaskName('buildThemeChalk', () => run('pnpm run -C packages/theme-chalk build')),
      copyFullStyle,
    ),
  ),
  parallel(copyTypesDefinitions, copyFiles),
  parallel(copyFiles),
)

export * from './src'
