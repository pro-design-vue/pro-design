/*
 * @Author: shen
 * @Date: 2025-08-27 16:07:45
 * @LastEditors: shen
 * @LastEditTime: 2025-08-27 16:13:17
 * @Description:
 */
declare module 'vue' {
  // GlobalComponents for Volar
  export interface GlobalComponents {
    ProButton: (typeof import('pro-design-vue'))['ProButton']
    ProConfigProvider: (typeof import('pro-design-vue'))['ProConfigProvider']
    ProIcon: (typeof import('pro-design-vue'))['ProIcon']
    ProClipboard: (typeof import('pro-design-vue'))['ProClipboard']
    ProCounter: (typeof import('pro-design-vue'))['ProCounter']
    ProCropper: (typeof import('pro-design-vue'))['ProCropper']
    ProDrawer: (typeof import('pro-design-vue'))['ProDrawer']
    ProForm: (typeof import('pro-design-vue'))['ProForm']
    ProDrawerForm: (typeof import('pro-design-vue'))['ProDrawerForm']
    ProModalForm: (typeof import('pro-design-vue'))['ProModalForm']
    ProQueryFilter: (typeof import('pro-design-vue'))['ProQueryFilter']
    ProStepsForm: (typeof import('pro-design-vue'))['ProStepsForm']
    ProLayout: (typeof import('pro-design-vue'))['ProLayout']
    ProLoading: (typeof import('pro-design-vue'))['ProLoading']
    ProModal: (typeof import('pro-design-vue'))['ProModal']
    ProPage: (typeof import('pro-design-vue'))['ProPage']
    ProSlot: (typeof import('pro-design-vue'))['ProSlot']
    ProSpinner: (typeof import('pro-design-vue'))['ProSpinner']
    ProTable: (typeof import('pro-design-vue'))['ProTable']
    ProTableColumn: (typeof import('pro-design-vue'))['ProTableColumn']
    ProTableColumnGroup: (typeof import('pro-design-vue'))['ProTableColumnGroup']
    ProTableSummary: (typeof import('pro-design-vue'))['ProTableSummary']
    ProTableSummaryRow: (typeof import('pro-design-vue'))['ProTableSummaryRow']
    ProTableSummaryCell: (typeof import('pro-design-vue'))['ProTableSummaryCell']
  }
}

export {}
