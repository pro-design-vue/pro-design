/*
 * @Author: shen
 * @Date: 2025-06-11 10:32:10
 * @LastEditors: shen
 * @LastEditTime: 2025-08-27 13:22:35
 * @Description:
 */
import type { ProLayoutProps, LayoutType } from '../typing'

import { computed } from 'vue'

export function useLayout(props: ProLayoutProps) {
  const currentLayout = computed(() =>
    props.isMobile ? 'sidebar-nav' : (props.layout as LayoutType),
  )

  /**
   * 是否全屏显示content，不需要侧边、底部、顶部、tab区域
   */
  const isFullContent = computed(() => currentLayout.value === 'full-content')

  /**
   * 是否侧边混合模式
   */
  const isSidebarMixedNav = computed(() => currentLayout.value === 'sidebar-mixed-nav')
  // const isSidebarMixedNav = computed(() => true)

  /**
   * 是否为头部导航模式
   */
  const isHeaderNav = computed(() => currentLayout.value === 'header-nav')

  /**
   * 是否为混合导航模式
   */
  const isMixedNav = computed(
    () => currentLayout.value === 'mixed-nav' || currentLayout.value === 'header-sidebar-nav',
  )

  /**
   * 是否为头部混合模式
   */
  const isHeaderMixedNav = computed(() => currentLayout.value === 'header-mixed-nav')

  return {
    currentLayout,
    isFullContent,
    isHeaderMixedNav,
    isHeaderNav,
    isMixedNav,
    isSidebarMixedNav,
  }
}
