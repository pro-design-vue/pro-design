/*
 * @Author: shen
 * @Date: 2025-09-05 10:24:20
 * @LastEditors: shen
 * @LastEditTime: 2025-09-07 10:40:38
 * @Description:
 */
import type { Plugin } from 'vite'

import { camelize } from 'vue'
import { docRoot, docsDirName, projRoot } from '@pro-design-vue/build-utils'
import { REPO_PATH, REPO_BRANCH } from '@pro-design-vue/build-constants'
import fs from 'fs'
import path from 'path'
import glob from 'fast-glob'

type Append = Record<'headers' | 'footers' | 'scriptSetups', string[]>

let compPaths: string[]

const footerTextMap = {
  source: '源代码',
  contributors: '贡献者',
  component: '组件',
  style: '样式',
  docs: '文档',
}

export function MarkdownTransform(): Plugin {
  return {
    name: 'pro-design-md-transform',

    enforce: 'pre',

    async buildStart() {
      compPaths = await glob('./component', {
        cwd: docRoot,
        absolute: true,
        onlyDirectories: true,
      })
    },

    async transform(code, id) {
      if (!id.endsWith('.md')) return

      const componentId = path.basename(id, '.md')
      const append: Append = {
        headers: [],
        footers: [],
        scriptSetups: getExampleImports(componentId),
      }

      code = transformVpScriptSetup(code, append)

      if (compPaths.some((compPath) => id.startsWith(compPath))) {
        code = transformComponentMarkdown(id, componentId, code, append)
      }

      return combineMarkdown(
        code,
        [combineScriptSetup(append.scriptSetups), ...append.headers],
        append.footers,
      )
    },
  }
}

const combineScriptSetup = (codes: string[]) =>
  `\n<script setup>
${codes.join('\n')}
</script>
`

const combineMarkdown = (code: string, headers: string[], footers: string[]) => {
  const frontmatterEnds = code.indexOf('---\n\n')
  const firstHeader = code.search(/\n#{1,6}\s.+/)
  const sliceIndex = firstHeader < 0 ? (frontmatterEnds < 0 ? 0 : frontmatterEnds + 4) : firstHeader

  if (headers.length > 0)
    code = code.slice(0, sliceIndex) + headers.join('\n') + code.slice(sliceIndex)
  code += footers.join('\n')

  return `${code}\n`
}

const vpScriptSetupRE = /<vp-script\s(.*\s)?setup(\s.*)?>([\s\S]*)<\/vp-script>/

const transformVpScriptSetup = (code: string, append: Append) => {
  const matches = code.match(vpScriptSetupRE)
  if (matches) code = code.replace(matches[0], '')
  const scriptSetup = matches?.[3] ?? ''
  if (scriptSetup) append.scriptSetups.push(scriptSetup)
  return code
}

const GITHUB_BLOB_URL = `https://github.com/${REPO_PATH}/blob/${REPO_BRANCH}`
const GITHUB_TREE_URL = `https://github.com/${REPO_PATH}/tree/${REPO_BRANCH}`
const GITHUB_CONTRIBUTORS_URL = `https://github.com/${REPO_PATH}/graphs/contributors`

const transformComponentMarkdown = (
  id: string,
  componentId: string,
  code: string,
  append: Append,
) => {
  const docUrl = `${GITHUB_BLOB_URL}/${docsDirName}/component/${componentId}.md`
  const componentUrl = `${GITHUB_TREE_URL}/packages/components/${componentId}`
  const styleUrl = `${GITHUB_TREE_URL}/packages/theme-chalk/src/${componentId}.less`

  const componentPath = path.resolve(projRoot, `packages/components/${componentId}`)
  const stylePath = path.resolve(projRoot, `packages/theme-chalk/src/${componentId}.less`)

  const isComponent = fs.existsSync(componentPath)
  const isHaveComponentStyle = fs.existsSync(stylePath)

  const links = [[footerTextMap.docs, docUrl]]

  if (isComponent && isHaveComponentStyle) links.unshift([footerTextMap.style, styleUrl])

  if (isComponent) links.unshift([footerTextMap.component, componentUrl])

  const linksText = links
    .filter((i) => i)
    .map(([text, link]) => `[${text}](${link})`)
    .join(' • ')

  const sourceSection = `
## ${footerTextMap.source}

${linksText}`

  const contributorsSection = `
## ${footerTextMap.contributors}
<p>
  <a href="${GITHUB_CONTRIBUTORS_URL}" target="_blank">
    <img src="https://contrib.rocks/image?repo=${REPO_PATH}&max=100&columns=15" width="40px" style="pointer-events: none;" />
  </a>
</p>
`

  append.footers.push(sourceSection, isComponent ? contributorsSection : '')

  return code
}

const getExampleImports = (componentId: string) => {
  const examplePath = path.resolve(docRoot, 'examples', componentId)
  if (!fs.existsSync(examplePath)) return []
  const files = fs.readdirSync(examplePath)
  const imports: string[] = []

  for (const item of files) {
    if (!/\.vue$/.test(item)) continue
    const file = item.replace(/\.vue$/, '')
    const name = camelize(`Pd-${componentId}-${file}`)

    imports.push(`import ${name} from '../examples/${componentId}/${file}.vue'`)
  }

  return imports
}
