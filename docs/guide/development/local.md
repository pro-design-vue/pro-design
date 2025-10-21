---
outline: deep
---

# 进入开发

## 项目结构

正如您初始化项目后可以看到，Pro Design Admin 的整个项目的目录结构大致如下：

```
.
├── README.md                         # 说明文档
├── index.html                        # 主 html 文件
├── build  
│     ├── vite                        # vite config 目录
│     └── index.ts
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── node_modules                      # 项目依赖
├── public
│     └── favicon.ico
├── src                               # 页面代码
├── .env                              # 生产环境变量
├── .env.development                  # 开发环境变量
├── commitlint.config.ts              # commintlint 规范
├── tsconfig.json                     # typescript 配置文件
└── vite.config.js                    # vite 配置文件
```

## 页面代码结构

如上图所示，`src`目录下是页面代码，大部分情况下，您只需要增删`src`目录下的代码即可。

`src`内的结构大致如下所示，Pro Design 推荐您在使用的过程中，遵守既有的目录结构，以规范项目代码的组织结构。

```
src
├── App.vue
├── api                                 # 请求层
├── assets                              # 资源层
├── components                          # 公共组件层
├── config                              # 配置层
│     └── index.ts                   
├── directives                          # 指令层
│     └── index.ts
├── hooks                               # 钩子层
│     └── index.ts
├── layouts                             # 布局层 可动态调整
│     ├── auth                          # 认证布局（登录、注册、忘记密码）
│     │     ├── ...          
│     │     ├── auth.vue  
│     │     └── index.ts   
│     ├── basic                         # 基本布局
│     │     ├── ...          
│     │     ├── basic.vue  
│     │     └── index.ts              
│     ├── iframe                        # 嵌入式组件
│     │     ├── iframe-router-view.vue          
│     │     ├── iframe-view.vue
│     │     └── index.ts
│     ├── micro                         # 微前端组件
│     │     ├── micro-router-view.vue          
│     │     ├── micro-view.vue
│     │     └── index.ts
│     ├── widgets                       # 小部件
│     │     ├── global-search          
│     │     ├── lock-screen
│     │     ├── notification
│     │     ├── preferences
│     │     ├── breadcrumb.vue
│     │     ├── ...
│     │     └── index.ts
│     └── index.ts
├── locales                             # 国际化
│     ├── lang                          # 语言配置
│     └── index.ts
├── mock                                # mock数据
│     ├── data                       
│     └── index.ts
├── router                              # 路由层
│     ├── routes                        # 路由配置
│     │     ├── modules          
│     │     │    ├── dashboard.ts
│     │     │    └── demos.ts
│     │     └── index.ts                # 基础路由配置，不需要鉴权
│     ├── access.ts                     # 路由生成逻辑
│     ├── guard.ts                      # 权限逻辑
│     └── index.ts
├── shared                              # 共享层
│     ├── cache                       
│     ├── color                       
│     ├── constants                       
│     ├── locales                       
│     ├── logger                       
│     ├── plugins                       
│     ├── preferences                       
│     ├── request                       
│     └── utils
├── store                               # Pinia 数据层
│     ├── index.ts
│     └── modules
│           ├── auth.ts
│           ├── index.ts
│           └── tabbar.ts
├── styles                              # 样式目录
│     ├── antd.less                     # antd vue 样式覆盖
│     ├── basic.less                    # 全局基础样式
│     ├── index.ts                     
│     ├── nprogress.less                # 页面加载动画
│     └── transition.less               # 动画
├── typings                             # 类型文件目录
├── views                               # 业务模块层
│     ├── dashboard                     # 一个页面组件
│     │     ├── analytics
│     │     │     ├── components       # 该页面组件用到的子组件
│     │     │     └── index.vue
│     │     └── workspace
│     │           ├── components        
│     │           └── index.vue
│     ├── ...
│     └── authentication
│           ├── code-login
│           │     ├── components       
│           │     └── index.vue
│           ├── forget-password
│           │     ├── components       
│           │     └── index.vue
│           ├── login
│           │     ├── components       
│           │     └── index.vue
│           ├── qrcode-login
│           │     ├── components       
│           │     └── index.vue
│           └── register
│                 ├── components       
│                 └── index.vue
├── bootstrap.ts                       # 主应用入口
├── micro.ts                           # 微前端入口
├── preferences.ts                     # 偏好设置
└── main.ts                            # 入口逻辑文件
```

## 环境变量

在项目的根目录，有 `.env` 配置文件，项目会根据启动的命令中的 `mode` 参数，加载指定的配置文件的配置来运行， 如本地环境执行 `pnpm run dev`，因为对于命令中的`mode` 参数为`development`，项目运行会加载`.env.development`的配置来运行。 项目初始化内置了 `.env.development`、`.env.production` 分别对应本地开发环境、生产环境 ，也可以根据实际需求继续扩展。

### 内置环境变量

* `VITE_PORT`：本地项目启动运行端口
* `VITE_APP_NAME`： 应用名称（微前端模式下和服务端应用对应）
* `VITE_APP_TITLE`: 项目名称（浏览器title使用）
* `VITE_APP_NAMESPACE`：命名空间，本地缓存和日志打印使用，Pro Design Vue的样式前缀使用
* `VITE_ROUTER_HISTORY`：路由模式
* `VITE_PUBLIC_PATH`：路由和静态资源基础路径
* `VITE_APP_ANTD_PREFIX_CLS`：Ant Design Vue 样式前缀，同时注入到vite配置
* `VITE_APP_THEME_COLOR`：项目主题色
* `VITE_APP_LANGUAGE`：项目默认语言
* `VITE_LOGGER_LEVEL`：项目本地日期输出级别
* `VITE_PROXY`：项目请求代理
* `VITE_DROP_CONSOLE`：项目打包是否删除concole
* `VITE_REQUEST_MOCK`：项目是否启用mock数据
* `VITE_API_URL_PREFIX`：项目默认请求的前缀
* `VITE_WS_URL_PREFIX`：项目wx默认请求的前缀
* `VITE_BUILD_COMPRESS`：项目打包是否生成gzip压缩文件
* `VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE`：项目打包生成gzip压缩文件后是否删除原文件
* `VITE_APP_STORAGE_ENCRYPE`：本地缓存是否加密
* `VITE_APP_STORAGE_SECURE_KEY`：本地缓存加密密钥
* `VITE_ARCHIVER`：打包后是否生成dist.zip

## 开始开发

### 新增页面
在已有 Pro Design Admin 项目中，新增页面是非常方便的。

首先，在 ./src/views 下，创建新页面的目录以及相关的文件。

```bash
cd src/views && mkdir my-new-page
cd my-new-page && touch index.vue  # 可根据实际需求增加样式、变量、等文件

```
::: warning 注意
页面业务目录下，只可以存放被route配置的组件，该页面组件用到的子组件需要放置到其目录下的`components`文件夹下。

页面及组件需要使用`ProPage`包裹，子组件不需要。
:::

Options API 示例

```vue
<templates>
  <div>
    <ProPage>index.vue示例</ProPage>
  </div>
</templates>
<script>
import { ProPage } from 'pro-design-vue'
export default {
  components: {
    ProPage
  },
  data() {
    return {};
  },
  methods: {},
};
</script>
<style lang="less">
</style>

```

Composition API 示例

```vue
<templates>
  <div>
    <ProPage>index.vue示例</ProPage>
  </div>
</templates>
<script>
import { ProPage } from 'pro-design-vue'
import { ref, onMounted } from "vue";
// 定义变量
const count = ref(0);

// 定义方法
function increment() {
  count.value++;
}

// 生命周期钩子
onMounted(() => {
  console.log(`The initial count is ${count.value}.`);
});
</script>
<style lang="less">
</style>

```

**tips: 一般情况下推荐您使用Composition API进行开发，Composition API有关的好处请[点击此处](https://vuejs.org/guide/introduction.html#api-styles)**

### 添加路由

然后，需要在配置新页面的路由。根据具体的需求，修改 `src/router/routes/modules` 中的文件。

```ts
import type { RouteRecordRaw } from 'vue-router'
const routes: RouteRecordRaw[] = [
  {
    meta: {
      title: '表格',
      keepAlive: true,
    },
    name: 'Table',
    path: '/demos/table',
    component: () => import('@/views/demos/table/index.vue'),
  },
  {
    meta: {
      title: '表单',
      keepAlive: true,
    },
    name: 'Form',
    path: '/demos/form',
    component: () => import('@/views/demos/form/index.vue'),
  },
]
export default routes

```

### 添加菜单

完成路由配置后，还需要配置菜单，因为没有权限是在菜单中看不到的，如果是后端返回的菜单，通知后端添加菜单配置，如果是使用的mock数据，修改 `src/mock/data/menu` 文件。

```ts
import type { MenuData } from '@/typings'

export const genMenuData = (lang: 'zh-CN' | 'en-US' = 'zh-CN'): MenuData[] => {
  return [
    {
      id: '1',
      order: 1,
      parentId: '0',
      icon: 'lucide:layout-dashboard',
      name: 'Dashboard',
      path: '/dashboard',
      redirect: '/analytics',
      title: lang === 'zh-CN' ? '概览' : 'Dashboard',
    },
    {
      id: '1-1',
      parentId: '1',
      order: 1,
      icon: 'lucide:area-chart',
      name: 'Analytics',
      path: '/analytics',
      component: '/dashboard/analytics/index',
      title: lang === 'zh-CN' ? '分析页' : 'Analytics',
      keepAlive: true,
      affixTab: true,
    },
    {
      id: '1-2',
      parentId: '1',
      order: 2,
      icon: 'carbon:workspace',
      name: 'Workspace',
      path: '/workspace',
      // component: '/dashboard/workspace/index',
      keepAlive: true,
      title: lang === 'zh-CN' ? '工作台' : 'Workspace',
    },
    // 内部 demo
    {
      id: '2',
      order: 2,
      parentId: '0',
      name: 'Demos',
      path: '/demos',
      redirect: '/demos/form',
      title: lang === 'zh-CN' ? '示例' : 'Demos',
    },
    
    {
      id: '2-1',
      parentId: '2',
      order: 1,
      name: 'Table',
      path: '/demos/table',
      component: '/demos/table/index',
      title: lang === 'zh-CN' ? '表格' : 'Table Demo',
      keepAlive: true,
    },
    {
      id: '2-2',
      parentId: '2',
      order: 2,
      name: 'Form',
      path: '/demos/form',
      component: '/demos/form/index',
      title: lang === 'zh-CN' ? '表单' : 'Form Demo',
      keepAlive: true,
    }
  ]
}

```

## 开发组件

当 `Pro Design Vue` 提供的组件不能满足您的需求的时候，您可以根据需要开发新的组件, 推荐放置在`src/component`目录下。

组件的开发方式和 页面组件 的开发方式类似，不过您不再需要去为它增加路由，而是在您的组件中引用即可。

在 `src/components` 下新增一个组件文件，`new-component.vue`

```vue
<template>
  <div>
    <slot name="new-component" />
    <slot />
  </div>
</template>
```

## 布局配置
网站布局支持空布局、侧边栏导航布局、 侧边栏布局加头部导航和头部导航等很多中后台常用布局。布局文件位于 `/src/layouts`。

项目在动态生成路由时，自动使用了布局，无需你手动在routes中配置

如果项目内置的布局不能满足您的需求，您也可以自己实现定制化布局。