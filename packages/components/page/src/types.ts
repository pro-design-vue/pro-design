/*
 * @Author: shen
 * @Date: 2025-07-02 14:21:21
 * @LastEditors: shen
 * @LastEditTime: 2025-08-11 10:39:29
 * @Description:
 */
import type { TabsProps, TabPaneProps, SpinProps } from 'ant-design-vue'
import type { CSSProperties } from 'vue'

export interface PageProps {
  title?: string
  description?: string
  contentClass?: string
  contentStyle?: CSSProperties
  /**
   * 根据content可见高度自适应
   */
  autoContentHeight?: boolean
  headerClass?: string
  footerClass?: string
  /**
   * Custom height offset value (in pixels) to adjust content area sizing
   * when used with autoContentHeight
   * @default 0
   */
  heightOffset?: number
  contentPadding?: number
  tabList?: (TabPaneProps & { key?: string })[]
  // /** @name tabActiveKey 当前选中 tab 的 key */
  // tabActiveKey?: TabsProps['activeKey']
  /** @name tab 修改时触发 */
  onTabChange?: TabsProps['onChange']
  /** @name tabs 的其他配置 */
  tabProps?: TabsProps
  /**
   * 只加载内容区域
   *
   * @name loading 是否加载
   */
  loading?: boolean | SpinProps
}
