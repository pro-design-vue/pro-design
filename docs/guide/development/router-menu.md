---
outline: deep
---

# 路由与菜单

路由与菜单的管理，是前端项目中非常重要的一部分。

为了减少开发配置和理解成本，在 Pro Design Admin 项目中，管理菜单路由都规范在`src/router/routes` 这个目录下进行配置。

tips: 通常情况下不需要去理解和修改index.ts, 只需要在modules目录下增删文件，即可自动添加更新路由。

项目放弃了使用路由层级生成菜单的做法，因为菜单是后端根据用户权限生成的，所以 `src/router/routes/modules` 下的动态路由是可以不存在的。

## 路由类型

路由分为核心路由、静态路由和动态路由，核心路由是框架内置的路由，包含了根路由、登录路由、404路由等；静态路由是在项目启动时就已经确定的路由；动态路由一般是在用户登录后，根据用户的权限动态生成的路由。

### 核心路由

核心路由是框架内置的路由，包含了根路由、登录路由、404路由等，核心路由的配置在应用下 `src/router/routes/index.ts` 内的 `coreRoutes` 配置。

::: tip
核心路由主要用于框架的基础功能，因此不建议将业务相关的路由放在核心路由中，推荐将业务相关的路由放在静态路由或动态路由中。
:::

::: details 核心路由配置
```ts
const coreRoutes: RouteRecordRaw[] = [
  /**
   * 根路由
   * 使用基础布局，作为所有页面的父级容器，子级就不必配置BasicLayout。
   * 此路由必须存在，且不应修改
   */
  {
    component: BasicLayout,
    meta: {
      hideInBreadcrumb: true,
      title: 'Root',
    },
    name: 'Root',
    path: '/',
    redirect: '/dashboard',
    children: [],
  },
  {
    component: AuthPageLayout,
    meta: {
      hideInTab: true,
      title: 'Authentication',
    },
    name: 'Authentication',
    path: '/auth',
    redirect: LOGIN_PATH,
    children: [
      {
        name: 'Login',
        path: LOGIN_PATH,
        component: () => import('@/views/authentication/login/index.vue'),
        meta: {
          title: 'page.auth.login',
        },
      },
      {
        name: 'CodeLogin',
        path: 'code-login',
        component: () => import('@/views/authentication/code-login/index.vue'),
        meta: {
          title: 'page.auth.codeLogin',
        },
      },
      {
        name: 'QrCodeLogin',
        path: 'qrcode-login',
        component: () => import('@/views/authentication/qrcode-login/index.vue'),
        meta: {
          title: 'page.auth.qrcodeLogin',
        },
      },
      {
        name: 'ForgetPassword',
        path: 'forget-password',
        component: () => import('@/views/authentication/forget-password/index.vue'),
        meta: {
          title: 'page.auth.forgetPassword',
        },
      },
      {
        name: 'Register',
        path: 'register',
        component: () => import('@/views/authentication/register/index.vue'),
        meta: {
          title: 'page.auth.register',
        },
      },
    ],
  },
]

```
:::

### 静态路由

静态路由的配置在应用下 `src/router/routes/index.ts` 下，打开注释的文件内容:

```ts
// 有需要可以自行打开注释，并创建文件夹
// const externalRouteFiles = import.meta.glob('./external/**/*.ts', { eager: true }); // [!code --] 
const staticRouteFiles = import.meta.glob('./static/**/*.ts', { eager: true });  // [!code ++] 
/** 动态路由 */
const dynamicRoutes: RouteRecordRaw[] = mergeRouteModules(dynamicRouteFiles);

/** 外部路由列表，访问这些页面可以不需要Layout，可能用于内嵌在别的系统 */
// const externalRoutes: RouteRecordRaw[] = mergeRouteModules(externalRouteFiles)  // [!code --] 
// const externalRoutes: RouteRecordRaw[] = [];  // [!code --] 
const externalRoutes: RouteRecordRaw[] = mergeRouteModules(externalRouteFiles);  // [!code ++] 
```

### 动态路由
动态路由的配置在对应应用 `src/router/routes/modules` 目录下，这个目录下存放了所有的路由文件。每个文件的内容格式如下，与 Vue Router 的路由配置格式一致，此处路由配置不需要有层级。

其实此处配置的的动态路由已经可有可无了，动态路由已经迁移到通过权限菜单动态生成，如果菜单中有配置 `component`字段，根据`component`配置的路径，可以直接对应  `src/views` 下的页面组件。但是如果没有`component`字段，那么菜单会根据`path`字段和动态路由的`path`查找到路由配置的`component`进行渲染。同时会合并 `meta` 配置。菜单中的优先级更高。

所有动态路由不需要配置 `Layout`，因为根路由已经配置了`BasicLayout`，如果动态路由不需要使用 `Layout`布局，可以配置 `meta.noBasicLayout = ture`。

```ts
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    name: 'Analytics',
    path: '/analytics',
    component: () => import('@/views/dashboard/analytics/index.vue'),
    meta: {
      affixTab: true,
      icon: 'lucide:area-chart',
      title: 'page.dashboard.analytics',
    },
  },
  {
    name: 'Workspace',
    path: '/workspace',
    component: () => import('@/views/dashboard/workspace/index.vue'),
    meta: {
      icon: 'carbon:workspace',
      title: 'page.dashboard.workspace',
    },
  },
]
export default routes

```

## 路由配置

路由配置项主要在对象路由的 meta 属性中，以下为常用的配置项：

::: tip
路由的所有配置菜单需要支持，可以动态更改配置，如果菜单中不支持，可以定义在路由的meta中，当作默认处理。
:::

```ts
const routes = [
  {
    name: 'HomeIndex',
    path: '/home/index',
    meta: {
      icon: 'mdi:home', // [!code highlight]
      title: $t('page.home.index'), // [!code highlight]
    },
  },
];
```

::: details 路由Meta配置类型定义
```ts
interface RouteMeta {
  /**
   * 激活图标（菜单/tab）
   */
  activeIcon?: string
  /**
   * 当前激活的菜单，有时候不想激活现有菜单，需要激活父级菜单时使用
   */
  activePath?: string
  /**
   * 是否固定标签页
   * @default false
   */
  affixTab?: boolean
  /**
   * 固定标签页的顺序
   * @default 0
   */
  affixTabOrder?: number
  /**
   * 当前路由的子级在菜单中不展现
   * @default false
   */
  hideChildrenInMenu?: boolean
  /**
   * 当前路由在面包屑中不展现
   * @default false
   */
  hideInBreadcrumb?: boolean
  /**
   * 当前路由在菜单中不展现
   * @default false
   */
  hideInMenu?: boolean
  /**
   * 当前路由在标签页不展现
   * @default false
   */
  hideInTab?: boolean
  /**
   * 图标（菜单/tab）
   */
  icon?: Component | string
  /**
   * iframe 地址
   */
  iframeSrc?: string
  /**
   * 子应用 地址
   */
  microUrl?: string
  /**
   * 忽略权限，直接可以访问
   * @default false
   */
  ignoreAccess?: boolean
  /**
   * 开启KeepAlive缓存
   */
  keepAlive?: boolean
  /**
   * 外链-跳转路径
   */
  link?: string
  /**
   * 路由是否已经加载过
   */
  loaded?: boolean
  /**
   * 标签页最大打开数量
   * @default -1
   */
  maxNumOfOpenTab?: number
  /**
   * 菜单可以看到，但是访问会被重定向到403
   */
  menuVisibleWithForbidden?: boolean
  /**
   * 不使用基础布局（仅在顶级生效）
   */
  noBasicLayout?: boolean
  /**
   * 在新窗口打开
   */
  openInNewWindow?: boolean
  /**
   * 用于路由->菜单排序
   */
  order?: number
  /**
   * 菜单所携带的参数
   */
  query?: Recordable
  /**
   * 标题名称
   */
  title?: string

  /**
   * 父级路由
   */
  parent?: RouteRecordRaw

  /**
   * 所有父级路由，用于面包屑导航
   */
  parents?: RouteRecordRaw[]
}
```
:::

### title

- 类型：`string`
- 默认值：`''`

用于配置页面的标题，会在菜单和标签页中显示。一般会配合国际化使用。

### icon

- 类型：`string`
- 默认值：`''`

用于配置页面的图标，会在菜单和标签页中显示。一般会配合图标库使用，如果是`http`链接，会自动加载图片。

### activeIcon

- 类型：`string`
- 默认值：`''`

用于配置页面的激活图标，会在菜单中显示。一般会配合图标库使用，如果是`http`链接，会自动加载图片。

### keepAlive

- 类型：`boolean`
- 默认值：`false`

用于配置页面是否开启缓存，开启后页面会缓存，不会重新加载，仅在标签页启用时有效。

### hideInMenu

- 类型：`boolean`
- 默认值：`false`

用于配置页面是否在菜单中隐藏，隐藏后页面不会在菜单中显示。

### hideInTab

- 类型：`boolean`
- 默认值：`false`

用于配置页面是否在标签页中隐藏，隐藏后页面不会在标签页中显示。

### hideInBreadcrumb

- 类型：`boolean`
- 默认值：`false`

用于配置页面是否在面包屑中隐藏，隐藏后页面不会在面包屑中显示。

### hideChildrenInMenu

- 类型：`boolean`
- 默认值：`false`

用于配置页面的子页面是否在菜单中隐藏，隐藏后子页面不会在菜单中显示。

### authority

- 类型：`string[]`
- 默认值：`[]`

用于配置页面的权限，只有拥有对应权限的用户才能访问页面，不配置则不需要权限。

### badge

- 类型：`string`
- 默认值：`''`

用于配置页面的徽标，会在菜单显示。

### badgeType

- 类型：`'dot' | 'normal'`
- 默认值：`'normal'`

用于配置页面的徽标类型，`dot` 为小红点，`normal` 为文本。

### badgeVariants

- 类型：`'default' | 'destructive' | 'primary' | 'success' | 'warning' | string`
- 默认值：`'success'`

用于配置页面的徽标颜色。

### activePath

- 类型：`string`
- 默认值：`''`

用于配置当前激活的菜单，有时候页面没有显示在菜单内，需要激活父级菜单时使用。

### affixTab

- 类型：`boolean`
- 默认值：`false`

用于配置页面是否固定标签页，固定后页面不可关闭。

### affixTabOrder

- 类型：`number`
- 默认值：`0`

用于配置页面固定标签页的排序, 采用升序排序。

### iframeSrc

- 类型：`string`
- 默认值：`''`

用于配置内嵌页面的 `iframe` 地址，设置后会在当前页面内嵌对应的页面。

### microUrl

- 类型：`string`
- 默认值：`''`

用于配置微前端页面的 `url` 地址，设置后会在当前页面加载对应的子应用页面。

### ignoreAccess

- 类型：`boolean`
- 默认值：`false`

用于配置页面是否忽略权限，直接可以访问。

### link

- 类型：`string`
- 默认值：`''`

用于配置外链跳转路径，会在新窗口打开。

### maxNumOfOpenTab

- 类型：`number`
- 默认值：`-1`

用于配置标签页最大打开数量，设置后会在打开新标签页时自动关闭最早打开的标签页(仅在打开同名标签页时生效)。

### menuVisibleWithForbidden

- 类型：`boolean`
- 默认值：`false`

用于配置页面在菜单可以看到，但是访问会被重定向到403。

### openInNewWindow

- 类型：`boolean`
- 默认值：`false`

设置为 `true` 时，会在新窗口打开页面。

### order

- 类型：`number`
- 默认值：`0`

用于配置页面的排序，用于路由到菜单排序。

_注意:_ 排序仅针对一级菜单有效，二级菜单的排序需要在对应的一级菜单中按代码顺序设置。

### query

- 类型：`Recordable`
- 默认值：`{}`

用于配置页面的菜单参数，会在菜单中传递给页面。

### noBasicLayout

- 类型：`boolean`
- 默认值：`false`

用于配置当前路由不使用基础布局，仅在顶级时生效。默认情况下，所有的路由都会被包裹在基础布局中（包含顶部以及侧边等导航部件），如果你的页面不需要这些部件，可以设置 `noBasicLayout` 为 `true`。



## 路由刷新

路由刷新方式如下：

```vue
<script setup lang="ts">
import { useRefresh } from '@/hooks';

const { refresh } = useRefresh();

// 刷新当前路由
refresh();
</script>
```

## 标签页与路由控制

在某些场景下，需要单个路由打开多个标签页，或者修改路由的query不打开新的标签页

每个标签页Tab使用唯一的key标识，设置Tab key有三种方式，优先级由高到低：

* 使用路由query参数pageKey

```vue
<script setup lang="ts">
import { useRouter } from 'vue-router';
// 跳转路由
const router = useRouter();
router.push({
  path: 'path',
  query: {
    pageKey: 'key',
  },
});
</script>
```
* 路由的完整路径作为key

`meta` 属性中的 `fullPathKey` 不为 false，则使用路由`fullPath` 作为 key。

* 路由的path作为key

`meta` 属性中的 `fullPathKey` 为 false，则使用路由 `path` 作为 key。