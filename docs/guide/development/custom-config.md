---
outline: deep
---

# 个性化配置

Pro Design Admin 内置了配置面板，可以通过右上角的图标打开。

个性化配置的功能，有两种使用方式

1.您可以把它作为您项目的一部分，原封不动地提供给您的用户使用；

2.您也可以在我们的 demo 中上进行配置，将新的配置文件复制到您的项目中的src/preferences.ts中作为您的配置，并把右上角的配置能力相关的代码从项目代码中删除。作为项目的配置，默认配置如下：

::: details 框架默认配置
```ts
{
  app: {
    authPageLayout: 'panel-right',
    checkUpdatesInterval: 1,
    colorGrayMode: false,
    colorWeakMode: false,
    compact: false,
    contentCompact: 'wide',
    defaultAvatar: '',
    defaultHomePath: '/analytics',
    dynamicTitle: true,
    enableCheckUpdates: true,
    enablePreferences: true,
    enableRefreshToken: false,
    isMobile: false,
    layout: 'sidebar-nav',
    locale: 'zh-CN',
    loginExpiredMode: 'page',
    name: 'Pro Vue Admin',
    preferencesButtonPosition: 'auto',
    watermark: false,
    isSubApp: false,
    antdPrefixCls: 'ant',
    prefixCls: 'pro',
    actived: false,
  },
  breadcrumb: {
    enable: true,
    hideOnlyOne: false,
    showHome: false,
    showIcon: true,
    styleType: 'normal',
  },
  copyright: {
    companyName: 'Shen',
    companySiteLink: 'https://github.com/xh-shen',
    date: '2025',
    enable: true,
    icp: '',
    icpLink: '',
    settingShow: true,
  },
  footer: {
    enable: false,
    fixed: false,
  },
  header: {
    enable: true,
    hidden: false,
    menuAlign: 'start',
    mode: 'fixed',
  },
  logo: {
    enable: true,
    source: '',
  },
  navigation: {
    accordion: true,
    split: true,
    styleType: 'rounded',
  },
  shortcutKeys: {
    enable: true,
    globalLockScreen: true,
    globalLogout: true,
    globalPreferences: true,
    globalSearch: true,
  },
  sidebar: {
    autoActivateChild: true,
    collapsed: false,
    collapsedButton: true,
    collapsedShowTitle: false,
    enable: true,
    expandOnHover: true,
    extraCollapse: false,
    fixedButton: true,
    hidden: false,
    width: 224,
  },
  tabbar: {
    draggable: true,
    enable: true,
    height: 38,
    keepAlive: true,
    maxCount: 0,
    middleClickToClose: false,
    persist: true,
    showIcon: true,
    showMaximize: true,
    showMore: true,
    styleType: 'chrome',
    wheelable: true,
  },
  theme: {
    builtinType: 'default',
    colorError: 'hsl(348 100% 61%)',
    colorPrimary: 'hsl(212 100% 45%)',
    colorSuccess: 'hsl(144 57% 58%)',
    colorWarning: 'hsl(42 84% 61%)',
    mode: 'light',
    borderRadius: 8,
    semiDarkHeader: false,
    semiDarkSidebar: false,
  },
  transition: {
    enable: false,
    loading: true,
    name: 'fade-slide',
    progress: true,
  },
  widget: {
    fullscreen: true,
    globalSearch: true,
    languageToggle: true,
    lockScreen: true,
    notification: true,
    refresh: true,
    sidebarToggle: true,
    themeToggle: true,
  },
  micro: {
    url: '',
    baseroute: '',
    name: '',
    appName: '',
    path: '',
    tabName: '',
    actived: false,
  },
}
```
:::

::: details 框架默认配置类型
```ts
interface AppPreferences {
  /** 登录注册页面布局 */
  authPageLayout: AuthPageLayoutType
  /** 检查更新轮询时间 */
  checkUpdatesInterval: number
  /** 是否开启灰色模式 */
  colorGrayMode: boolean
  /** 是否开启色弱模式 */
  colorWeakMode: boolean
  /** 是否开启紧凑模式 */
  compact: boolean
  /** 是否开启内容紧凑模式 */
  contentCompact: ContentCompactType
  // /** 应用默认头像 */
  defaultAvatar: string
  /** 默认首页地址 */
  defaultHomePath: string
  // /** 开启动态标题 */
  dynamicTitle: boolean
  /** 是否开启检查更新 */
  enableCheckUpdates: boolean
  /** 是否显示偏好设置 */
  enablePreferences: boolean
  /**
   * @zh_CN 是否开启refreshToken
   */
  enableRefreshToken: boolean
  /** 是否移动端 */
  isMobile: boolean
  /** 布局方式 */
  layout: LayoutType
  /** 支持的语言 */
  locale: SupportedLanguagesType
  /** 登录过期模式 */
  loginExpiredMode: LoginExpiredModeType
  /** 应用名 */
  name: string
  /** 偏好设置按钮位置 */
  preferencesButtonPosition: PreferencesButtonPositionType
  /**
   * @zh_CN 是否开启水印
   */
  watermark: boolean
  /**
   * @zh_CN 是否子应用
   */
  isSubApp: boolean
  /**
   * @zh_CN antd-vue 全局样式前缀
   */
  antdPrefixCls: string
  /**
   *  @zh_CN 项目全局样式前缀
   */
  prefixCls: string
  /**
   *  @zh_CN 微应用环境是否是激活的tab
   */
  actived: false
}

interface BreadcrumbPreferences {
  /** 面包屑是否启用 */
  enable: boolean
  /** 面包屑是否只有一个时隐藏 */
  hideOnlyOne: boolean
  /** 面包屑首页图标是否可见 */
  showHome: boolean
  /** 面包屑图标是否可见 */
  showIcon: boolean
  /** 面包屑风格 */
  styleType: BreadcrumbStyleType
}

interface CopyrightPreferences {
  /** 版权公司名 */
  companyName: string
  /** 版权公司名链接 */
  companySiteLink: string
  /** 版权日期 */
  date: string
  /** 版权是否可见 */
  enable: boolean
  /** 备案号 */
  icp: string
  /** 备案号链接 */
  icpLink: string
  /** 设置面板是否显示*/
  settingShow?: boolean
}

interface FooterPreferences {
  /** 底栏是否可见 */
  enable: boolean
  /** 底栏是否固定 */
  fixed: boolean
}

interface HeaderPreferences {
  /** 顶栏是否启用 */
  enable: boolean
  /** 顶栏是否隐藏,css-隐藏 */
  hidden: boolean
  /** 顶栏菜单位置 */
  menuAlign: LayoutHeaderMenuAlignType
  /** header显示模式 */
  mode: LayoutHeaderModeType
}

interface LogoPreferences {
  /** logo是否可见 */
  enable: boolean
  /** logo地址 */
  source: string
}

interface NavigationPreferences {
  /** 导航菜单手风琴模式 */
  accordion: boolean
  /** 导航菜单是否切割，只在 layout=mixed-nav 生效 */
  split: boolean
  /** 导航菜单风格 */
  styleType: NavigationStyleType
}

interface SidebarPreferences {
  /** 点击目录时自动激活子菜单   */
  autoActivateChild: boolean
  /** 侧边栏是否折叠 */
  collapsed: boolean
  /** 侧边栏折叠按钮是否可见 */
  collapsedButton: boolean
  /** 侧边栏折叠时，是否显示title */
  collapsedShowTitle: boolean
  /** 侧边栏是否可见 */
  enable: boolean
  /** 菜单自动展开状态 */
  expandOnHover: boolean
  /** 侧边栏扩展区域是否折叠 */
  extraCollapse: boolean
  /** 侧边栏固定按钮是否可见 */
  fixedButton: boolean
  /** 侧边栏是否隐藏 - css */
  hidden: boolean
  /** 侧边栏宽度 */
  width: number
}

interface ShortcutKeyPreferences {
  /** 是否启用快捷键-全局 */
  enable: boolean
  /** 是否启用全局锁屏快捷键 */
  globalLockScreen: boolean
  /** 是否启用全局注销快捷键 */
  globalLogout: boolean
  /** 是否启用全局偏好设置快捷键 */
  globalPreferences: boolean
  /** 是否启用全局搜索快捷键 */
  globalSearch: boolean
}

interface TabbarPreferences {
  /** 是否开启多标签页拖拽 */
  draggable: boolean
  /** 是否开启多标签页 */
  enable: boolean
  /** 标签页高度 */
  height: number
  /** 开启标签页缓存功能 */
  keepAlive: boolean
  /** 限制最大数量 */
  maxCount: number
  /** 是否点击中键时关闭标签 */
  middleClickToClose: boolean
  /** 是否持久化标签 */
  persist: boolean
  /** 是否开启多标签页图标 */
  showIcon: boolean
  /** 显示最大化按钮 */
  showMaximize: boolean
  /** 显示更多按钮 */
  showMore: boolean
  /** 标签页风格 */
  styleType: TabsStyleType
  /** 是否开启鼠标滚轮响应 */
  wheelable: boolean
}

interface ThemePreferences {
  /** 内置主题名 */
  builtinType: BuiltinThemeType
  /** 错误色 */
  colorError: string
  /** 主题色 */
  colorPrimary: string
  /** 成功色 */
  colorSuccess: string
  /** 警告色 */
  colorWarning: string
  /** 当前主题 */
  mode: ThemeModeType
  /** 圆角 */
  borderRadius: number
  /** 是否开启半深色header（只在theme='light'时生效） */
  semiDarkHeader: boolean
  /** 是否开启半深色菜单（只在theme='light'时生效） */
  semiDarkSidebar: boolean
}

interface TransitionPreferences {
  /** 页面切换动画是否启用 */
  enable: boolean
  // /** 是否开启页面加载loading */
  loading: boolean
  /** 页面切换动画 */
  name: PageTransitionType | string
  /** 是否开启页面加载进度动画 */
  progress: boolean
}

interface WidgetPreferences {
  /** 是否启用全屏部件 */
  fullscreen: boolean
  /** 是否启用全局搜索部件 */
  globalSearch: boolean
  /** 是否启用语言切换部件 */
  languageToggle: boolean
  /** 是否开启锁屏功能 */
  lockScreen: boolean
  /** 是否显示通知部件 */
  notification: boolean
  /** 显示刷新按钮 */
  refresh: boolean
  /** 是否显示侧边栏显示/隐藏部件 */
  sidebarToggle: boolean
  /** 是否显示主题切换部件 */
  themeToggle: boolean
}

interface MicroPreferences {
  /** url地址 */
  url: string
  /** 基础路径 */
  baseroute: string
  /** 名称，唯一 */
  name: string
  /** 应用名称 */
  appName: string
  /** 路由path */
  path: string
  /** 主应用对用tab 名称 */
  tabName: string
  /** 是否时激活显示状态 */
  actived: boolean
}

interface Preferences {
  /** 全局配置 */
  app: AppPreferences
  /** 顶栏配置 */
  breadcrumb: BreadcrumbPreferences
  /** 版权配置 */
  copyright: CopyrightPreferences
  /** 底栏配置 */
  footer: FooterPreferences
  /** 面包屑配置 */
  header: HeaderPreferences
  /** logo配置 */
  logo: LogoPreferences
  /** 导航配置 */
  navigation: NavigationPreferences
  /** 快捷键配置 */
  shortcutKeys: ShortcutKeyPreferences
  /** 侧边栏配置 */
  sidebar: SidebarPreferences
  /** 标签页配置 */
  tabbar: TabbarPreferences
  /** 主题配置 */
  theme: ThemePreferences
  /** 动画配置 */
  transition: TransitionPreferences
  /** 功能配置 */
  widget: WidgetPreferences
  /** 微前端配置 */
  micro: MicroPreferences
}

type PreferencesKeys = keyof Preferences

interface InitialOptions {
  namespace?: string
  useCache?: boolean
  overrides?: DeepPartial<Preferences>
}
export type {
  AppPreferences,
  BreadcrumbPreferences,
  FooterPreferences,
  HeaderPreferences,
  InitialOptions,
  LogoPreferences,
  NavigationPreferences,
  Preferences,
  PreferencesKeys,
  ShortcutKeyPreferences,
  SidebarPreferences,
  SupportedLanguagesType,
  TabbarPreferences,
  ThemePreferences,
  TransitionPreferences,
  WidgetPreferences,
}
```
:::
在配置中，我们内置提供了多种配置，包括`主题模式`、`主题色`、`导航布局`以及`各类元素开关`。

::: warning
* overridesPreferences方法只需要覆盖项目中的一部分配置，不需要的配置不用覆盖，会自动使用默认配置。
* 任何配置项都可以覆盖，只需要在overridesPreferences方法内覆盖即可，不要修改默认配置文件。
* 更改配置后请清空缓存，否则可能不生效。
:::


## 主题模式与主题色

我们会根据您选择的主题模式（亮色或暗色）和主题色，计算出当前的配色色阶，并全局应用到 Pro Design Vue 和 Ant Design Vue 的组件中。

## 导航布局

Pro Design Admin 默认提供了七种布局模式，分别是`侧边垂直导航布局`、 `侧边垂直双列导航布局`、 `顶部导航布局` 、 `顶部通栏，侧边导航布局`、 `侧边顶部导航共存布局`、`侧边双列、顶部导航共存布局`和`内容全屏布局`。

## 元素开关配置

Pro Design Admin 也提供了多种元素开关，包括`footer`、`breadcrumb`、`header`、`多标签Tab页功能`等，都可以自由配置是否开启。