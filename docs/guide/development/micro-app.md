---
outline: deep
---

# 微前端

项目内使用[micro-app](https://jd-opensource.github.io/micro-app/) 作为微前端框架。Pro Design Admin 是一个主子同构项目，独立访问时是主应用，被其他Pro Design Admin项目使用micro-app嵌入时是子应用，作为子应用时只会生成被访问页面的一个路由，且没有layout，大大减小了加载体积。

## 主应用入口

src/bootstrap.ts

```ts
import { $t, setupI18n } from './locales'
import { useTitle } from '@vueuse/core'
import { preferences, initPreferences } from './shared/preferences'
import { setupStore } from './stores'
import { VITE_APP_NAME, VITE_LOGGER_LEVEL, VITE_REQUEST_MOCK } from './shared/constants'
import { overridesPreferences } from './preferences'
import logger, { setupLogger } from './shared/logger'
import router, { setupRouter } from './router'
import config from './config'
import microApp from '@micro-zoe/micro-app'
import App from './App.vue'
import 'pro-design-vue/theme-chalk/src/index.less'
import './styles'

async function bootstrap(namespace: string) {
  //环境变量
  // app偏好设置初始化
  await initPreferences({
    overrides: overridesPreferences,
  })

  const app = createApp(App)
  // 是否启用mock数据
  if (VITE_REQUEST_MOCK) {
    const { setupMockData } = await import('./mock')
    setupMockData()
  }
  microApp.start({
    tagName: !config.powerByMicro
      ? 'micro-app'
      : `micro-app-${config.baseRoute.slice(1).toLowerCase()}`,
    'disable-memory-router': true, // 关闭虚拟路由系统
    'disable-patch-request': true, // 关闭对子应用请求的拦截
    'router-mode': 'native', // 开启路由隔离
    iframeSrc: `${window.origin}/empty.html`,
    fetch: (url, options) => {
      const config: Record<string, unknown> = {
        // credentials: 'include', // 请求时带上cookie
      }
      return window.fetch(url, Object.assign({}, options, config)).then((res) => res.text())
    },
  })

  setupLogger(app, {
    level: VITE_LOGGER_LEVEL,
    name: VITE_APP_NAME,
  })
  // 国际化 i18n 配置
  await setupI18n(app)
  // 配置store
  setupStore(app)
  // 配置路由及路由守卫
  setupRouter(app)
  app.mount('#app')
  // 输出当前命名空间
  logger.info('namespace', namespace)

  // 动态更新标题
  watchEffect(() => {
    if (preferences.app.dynamicTitle) {
      const routeTitle = router.currentRoute.value.meta?.title
      const pageTitle = (routeTitle ? `${$t(routeTitle)} - ` : '') + preferences.app.name
      useTitle(pageTitle)
    }
  })

  watch(
    () => preferences.theme,
    (newVal) => {
      microApp.setGlobalData({
        theme: newVal,
      })
    },
  )
}

export { bootstrap }

```

## 子应用入口

src/micro.ts

```ts
import type { App as AppInstance } from 'vue'
import type { Pinia } from 'pinia'
import type { ComponentRecordType } from './typings'
import type { Router, RouteRecordRaw, RouterHistory } from 'vue-router'
import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import { setupI18n } from './locales'
import { updatePreferences, preferences } from './shared/preferences'
import { VITE_APP_NAME, VITE_LOGGER_LEVEL, VITE_ROUTER_HISTORY } from './shared/constants'
import { setupLogger } from './shared/logger'
import { accessRoutes, fallbackNotFoundRoute } from './router/routes'
import { useAuthStore } from '@/stores'
import { isEqual } from './shared/utils'
import config from './config'
import App from './App.vue'
import './styles'

let app: AppInstance | null = null
let router: Router | null = null
let history: RouterHistory | null = null
let store: Pinia | null = null

const createHistory = () => {
  return VITE_ROUTER_HISTORY === 'hash'
    ? createWebHashHistory(window.__MICRO_APP_BASE_ROUTE__)
    : createWebHistory(window.__MICRO_APP_BASE_ROUTE__)
}

async function createRoute(props: Record<string, any>): Promise<RouteRecordRaw> {
  const componentPath = props.route.meta?.componentPath
  // 服务端返回路由组件路径
  if (componentPath) {
    const pageMap: ComponentRecordType = import.meta.glob([
      './views/**/*.vue',
      '!./views/**/components/**/*.vue',
    ])
    const component = pageMap[`./views${componentPath}.vue`]
    if (!!component) {
      return {
        ...props.route,
        component,
        path: props.path,
      } as RouteRecordRaw
    }
    return {
      ...fallbackNotFoundRoute,
      path: props.path,
    } as RouteRecordRaw
  }

  // 查找本地路由组件
  const findRoute = (array) => {
    for (const item of array) {
      if (item.path === props.path) {
        return item
      } else if (item.children?.length) {
        const route = findRoute(item.children)
        if (route) {
          return route
        }
      }
    }
    return null
  }

  const route = findRoute(accessRoutes)
  return {
    ...(route ? route : fallbackNotFoundRoute),
    path: props.path,
  } as RouteRecordRaw
}

async function createRouterGuard(router: Router, props: Record<string, any>) {
  router.beforeEach(async (to) => {
    if (to.path === props.path) {
      return true
    } else {
      if (to.path === '/') {
        props.router.push(to.path)
      } else {
        props.router.push(`${props.baseroute}${to.path}`)
      }
      return false
    }
  })
}

function initAuthstore(props: Record<string, any>) {
  const { accessToken, userInfo } = props
  const authStore = useAuthStore()
  authStore.setAccessToken(accessToken)
  authStore.setUserInfo(userInfo)
}

function handleDataListener(data: Record<string, any>) {
  const { theme } = data
  if (!isEqual(theme, preferences.theme)) {
    updatePreferences({ theme })
  }
  if (data.actived !== preferences.micro.actived) {
    updatePreferences({
      micro: {
        actived: data.actived,
      },
    })
  }
}

async function bootstrap(props: Record<string, any>) {
  console.log('🚀 ~ bootstrap ~ props:', props)
  const route = await createRoute(props)
  history = createHistory()
  router = createRouter({
    history,
    routes: [route, fallbackNotFoundRoute],
  })
  router.listening = false
  store = createPinia()
  app = createApp(App, {
    contentOffsetTop: props.contentOffsetTop,
  })
  app?.use(router)
  app?.use(store)
  app?.provide('app', props)
  initAuthstore(props)
  createRouterGuard(router, props)
  setupLogger(app, {
    level: VITE_LOGGER_LEVEL,
    name: VITE_APP_NAME,
  })
  // 国际化 i18n 配置
  await setupI18n(app)
  app?.mount('#app')
  window.microApp.addDataListener(handleDataListener)
}

async function mount(props) {
  console.log(`[${config.microName}] micro app mounted`)
  bootstrap(props)
}

async function unmount() {
  console.log(`[${config.microName}] micro app unmounted`)
  app?.unmount()
  history?.destroy()
  app = null
  router = null
  store = null
  history = null
  window.microApp.clearDataListener()
  window.microApp.clearGlobalDataListener()
  window.microApp.clearGlobalData()
}

export { mount, unmount, bootstrap }

```

## 加载子应用

在菜单或路由的`mata`下配置 `microUrl` 即可加载子应用，当然这个子应用最好是Pro Design Admin开发的

Pro Design Admin 作为主应用加载子应用时是不限制框架的，`vue2`、`vue3`、`react`等都可以，只需要做一下适配即可。

### vue2示例
这只是vue2项目入口的简单示例，`props` 是主应用下发的参数，根据参数自行处理。
```ts
// main.ts
import Vue from "vue";
import { routes } from "./router";
import store from "./store";
import App from "./App.vue";
import VueRouter from "vue-router";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
Vue.use(ElementUI);
let app = null;
// 👇 将渲染操作放入 mount 函数，子应用初始化时会自动执行
window.mount = (props) => {
  console.log("🚀 ~ props:", props);
  const router = new VueRouter({
    mode: "history",
    base: window.__MICRO_APP_BASE_ROUTE__ || process.env.BASE_URL,
    routes: routes,
  });
  app = new Vue({
    router,
    store,
    render: (h) => h(App),
  }).$mount("#app");
};

// 👇 将卸载操作放入 unmount 函数，就是上面步骤2中的卸载函数
window.unmount = () => {
  app.$destroy();
  app.$el.innerHTML = "";
  app = null;
};

// 如果不在微前端环境，则直接执行mount渲染
if (!window.__MICRO_APP_ENVIRONMENT__) {
  window.mount();
}

```

### react示例

```tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { createRoot } from "react-dom/client";
import Home from "./pages/HomeView";
import Table from "./pages/TableView";
import Form from "./pages/FormView";

import "./index.css";

// 测试项目 随便写的
const routes = [
  { path: "/home", component: <Home /> },
  { path: "/table", component: <Table /> },
  { path: "/form", component: <Form /> },
];

let root = null;
// 👇 将渲染操作放入 mount 函数，子应用初始化时会自动执行
window.mount = (props) => {
  console.log("🚀 ~ props:", props);
  root = createRoot(document.getElementById("root"));
  root.render(
    <Router basename={window.__MICRO_APP_BASE_ROUTE__ || "/"}>
      <Routes>
        {routes.map((route) => (
          <Route key={route.path} path={route.path} element={route.component} />
        ))}
      </Routes>
    </Router>
  );
};

// 👇 将卸载操作放入 unmount 函数，就是上面步骤2中的卸载函数
window.unmount = () => {
  root?.unmount();
};

// 如果不在微前端环境，则直接执行mount渲染
if (!window.__MICRO_APP_ENVIRONMENT__) {
  window.mount();
}
```