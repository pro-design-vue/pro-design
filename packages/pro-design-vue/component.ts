/*
 * @Author: shen
 * @Date: 2025-08-26 21:16:08
 * @LastEditors: shen
 * @LastEditTime: 2025-09-01 13:20:12
 * @Description:
 */
import { ProButton } from '@pro-design-vue/components/button'
import { ProConfigProvider } from '@pro-design-vue/components/config-provider'
import { ProIcon } from '@pro-design-vue/components/icon'
import { ProClipboard } from '@pro-design-vue/components/clipboard'
import { ProCounter } from '@pro-design-vue/components/counter'
import { ProCropper } from '@pro-design-vue/components/cropper'
import { ProDrawer } from '@pro-design-vue/components/drawer'
import {
  ProForm,
  ProDrawerForm,
  ProModalForm,
  ProQueryFilter,
  ProStepsForm,
} from '@pro-design-vue/components/form'
import { ProLayout } from '@pro-design-vue/components/layout'
import { ProLoading } from '@pro-design-vue/components/loading'
import { ProModal } from '@pro-design-vue/components/modal'
import {
  ProTable,
  ProTableColumn,
  ProTableColumnGroup,
  ProTableSummary,
  ProTableSummaryRow,
  ProTableSummaryCell,
} from '@pro-design-vue/components/table'
import { ProPage } from '@pro-design-vue/components/page'
import { ProSlot } from '@pro-design-vue/components/slot'
import { ProSpinner } from '@pro-design-vue/components/spinner'

import type { Plugin } from 'vue'
export default [
  ProConfigProvider,
  ProButton,
  ProIcon,
  ProClipboard,
  ProCounter,
  ProCropper,
  ProDrawer,
  ProForm,
  ProDrawerForm,
  ProModalForm,
  ProQueryFilter,
  ProStepsForm,
  ProLayout,
  ProLoading,
  ProModal,
  ProPage,
  ProSlot,
  ProSpinner,
  ProTable,
  ProTableColumn,
  ProTableColumnGroup,
  ProTableSummary,
  ProTableSummaryRow,
  ProTableSummaryCell,
] as Plugin[]
