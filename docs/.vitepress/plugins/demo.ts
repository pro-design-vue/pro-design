/*
 * @Author: shen
 * @Date: 2025-09-05 10:09:58
 * @LastEditors: shen
 * @LastEditTime: 2025-09-13 11:00:09
 * @Description:
 */
import path from 'path'
import fs from 'fs'
import { docRoot } from '@pro-design-vue/build-utils'

import type { MarkdownRenderer } from 'vitepress'

interface ContainerOpts {
  marker?: string | undefined
  validate?(params: string): boolean
  render?: MarkdownRenderer['renderer']['rules']['container']
}

function createDemoContainer(md: MarkdownRenderer): ContainerOpts {
  return {
    validate(params) {
      return !!params.trim().match(/^demo\s*(.*)$/)
    },

    render(tokens, idx) {
      const m = tokens[idx].info.trim().match(/^demo\s*(.*)$/)
      if (tokens[idx].nesting === 1 /* means the tag is opening */) {
        const description = m && m.length > 1 ? m[1] : ''
        const sourceFileToken = tokens[idx + 2]
        let source = ''
        const sourceFile = sourceFileToken.children?.[0].content ?? ''

        if (sourceFileToken.type === 'inline') {
          source = fs.readFileSync(path.resolve(docRoot, 'examples', `${sourceFile}.vue`), 'utf-8')
        }
        // console.log('🚀 ~ render ~ source11:', source)
        if (!source) throw new Error(`Incorrect source file: ${sourceFile}`)
        // console.log('🚀 ~ render ~ source11:', encodeURIComponent(md.render(source)))
        return `<Demo source="${encodeURIComponent(source)}" path="${sourceFile}" raw-source="${encodeURIComponent(
          source,
        )}" description="${encodeURIComponent(md.render(description))}">
  <template #source><pd-${sourceFile.replaceAll('/', '-')}/></template>`
      } else {
        return '</Demo>\n'
      }
    },
  }
}

export default createDemoContainer
