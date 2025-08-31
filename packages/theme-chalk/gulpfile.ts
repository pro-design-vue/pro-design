import path from 'path'
import { Transform } from 'stream'
import chalk from 'chalk'
import { type TaskFunction, dest, parallel, series, src } from 'gulp'
import less from 'gulp-less'
import autoprefixer from 'gulp-autoprefixer'
import rename from 'gulp-rename'
import consola from 'consola'
import postcss from 'postcss'
import cssnano from 'cssnano'
import { pdOutput } from '@pro-design-vue/build-utils'

const distFolder = path.resolve(__dirname, 'dist')
const distBundle = path.resolve(pdOutput, 'theme-chalk')

/**
 * using `postcss` and `cssnano` to compress CSS
 * @returns
 */
function compressWithCssnano() {
  const processor = postcss([
    cssnano({
      preset: [
        'default',
        {
          // avoid color transform
          colormin: false,
          // avoid font transform
          minifyFontValues: false,
        },
      ],
    }),
  ])
  return new Transform({
    objectMode: true,
    transform(chunk, _encoding, callback) {
      const file = chunk as any
      if (file.isNull()) {
        callback(null, file)
        return
      }
      if (file.isStream()) {
        callback(new Error('Streaming not supported'))
        return
      }
      const cssString = file.contents!.toString()
      processor.process(cssString, { from: file.path }).then((result) => {
        const name = path.basename(file.path)
        file.contents = Buffer.from(result.css)
        consola.success(
          `${chalk.cyan(name)}: ${chalk.yellow(
            cssString.length / 1000,
          )} KB -> ${chalk.green(result.css.length / 1000)} KB`,
        )
        callback(null, file)
      })
    },
  })
}

/**
 * compile theme-chalk less & minify
 * @returns
 */
function buildThemeChalk() {
  const noElPrefixFile = /(index|base|display|css-var)/
  return src(path.resolve(__dirname, 'src/*.less'))
    .pipe(less())
    .pipe(autoprefixer({ cascade: false }))
    .pipe(compressWithCssnano())
    .pipe(
      rename((path) => {
        if (!noElPrefixFile.test(path.basename)) {
          path.basename = `pro-${path.basename}`
        }
      }),
    )
    .pipe(dest(distFolder))
}

/**
 * copy from packages/theme-chalk/dist to dist/pro-design-vue/theme-chalk
 */
export function copyThemeChalkBundle() {
  return src(`${distFolder}/**`).pipe(dest(distBundle))
}

/**
 * copy source file to packages
 */

export function copyThemeChalkSource() {
  return src(path.resolve(__dirname, 'src/**')).pipe(dest(path.resolve(distBundle, 'src')))
}

export const build: TaskFunction = parallel(
  copyThemeChalkSource,
  series(buildThemeChalk, copyThemeChalkBundle),
)

export default build
