/*
 * @Author: shen
 * @Date: 2025-08-27 17:26:37
 * @LastEditors: shen
 * @LastEditTime: 2025-08-27 17:26:57
 * @Description:
 */
import { spawn } from 'child_process'
import chalk from 'chalk'
import consola from 'consola'
import { projRoot } from '@pro-design-vue/build-utils'

export const run = async (command: string, cwd: string = projRoot) =>
  new Promise<void>((resolve, reject) => {
    const [cmd, ...args] = command.split(' ')
    consola.info(`run: ${chalk.green(`${cmd} ${args.join(' ')}`)}`)
    const app = spawn(cmd, args, {
      cwd,
      stdio: 'inherit',
      shell: process.platform === 'win32',
    })

    const onProcessExit = () => app.kill('SIGHUP')

    app.on('close', (code) => {
      process.removeListener('exit', onProcessExit)

      if (code === 0) resolve()
      else reject(new Error(`Command failed. \n Command: ${command} \n Code: ${code}`))
    })
    process.on('exit', onProcessExit)
  })
