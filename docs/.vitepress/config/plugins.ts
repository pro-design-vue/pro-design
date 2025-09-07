/*
 * @Author: shen
 * @Date: 2025-09-05 10:09:12
 * @LastEditors: shen
 * @LastEditTime: 2025-09-05 11:17:46
 * @Description:
 */
import mdContainer from 'markdown-it-container'
import tableWrapper from '../plugins/table-wrapper'
import tooltip from '../plugins/tooltip'
import tag from '../plugins/tag'
import createDemoContainer from '../plugins/demo'
import { ApiTableContainer } from '../plugins/api-table'

import type { MarkdownRenderer } from 'vitepress'

export const mdPlugin = (md: MarkdownRenderer) => {
  md.use(tableWrapper)
  md.use(tooltip)
  md.use(tag)
  md.use(mdContainer, 'demo', createDemoContainer(md))
  md.use(ApiTableContainer)
}
