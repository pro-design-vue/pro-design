---
outline: deep
---

# 快速开始 {#quick-start}

::: tip 建议

- 在开始之前，推荐先学习 [Vue](https://www.vuejs.org/) 和 [ES2015](http://babeljs.io/docs/learn-es2015/)，并正确安装和配置了 [Node.js](https://nodejs.org/) v20 或以上。官方指南假设你已了解关于 HTML、CSS 和 JavaScript 的中级知识，并且已经完全掌握了 Vue 的正确开发方式。如果你刚开始学习前端或者 Vue，将 UI 框架作为你的第一步可能不是最好的主意。

- 如果您正在从0开始一个中后台项目，建议您直接使用 `Pro Design Admin` 搭建项目，跳转到[最佳实践](/guide/introduction/best-practices)。

:::

## 兼容性

Pro Design Vue 支持最近两个版本的浏览器。

由于 Vue 3 不再支持 IE11，Pro Design Vue 也不支持 IE 浏览器。
| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Safari | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/opera/opera_48x48.png" alt="Opera" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Opera |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Edge | last 2 versions | last 2 versions | last 2 versions | last 2 versions |

## 引入 pro-design-vue

### 新建项目

如果你需要新建一个项目，可以使用 [Vite](https://github.com/vitejs/vite)、[Rsbuild](https://github.com/web-infra-dev/rsbuild) 或 [Vue CLI](https://github.com/vuejs/vue-cli)。

请使用命令行来初始化项目：

- Vite:

```bash
$ npm create vite@latest
```

- Rsbuild:

```bash
$ npm create rsbuild@latest
```

- Vue CLI:

```bash
$ npm install -g @vue/cli
# OR
$ yarn global add @vue/cli

$ vue create pro-demo
```

> Vue CLI 已经停止迭代，因此不推荐使用。

### 安装

::: code-group

```sh [npm]
$ npm install pro-design-vue --save
```

```sh [yarn]
$ yarn add pro-design-vue
```

```sh [pnpm]
$ pnpm install pro-design-vue
```

:::

### 注册

如果使用 Vue 默认的模板语法，需要注册组件后方可使用，有如下三种方式注册组件：

**全局完整注册**

```jsx
import { createApp } from 'vue'
import ProDesign from 'pro-design-vue'
import App from './App'
import 'pro-design-vue/dist/index.css'

const app = createApp(App)

app.use(ProDesign).mount('#app')
```

以上代码便完成了 ProDesign 的全局注册。需要注意的是，样式文件需要单独引入。

**全局部分注册**

```jsx
import { createApp } from 'vue'
import { ProForm } from 'pro-design-vue'
import App from './App'
import 'pro-design-vue/dist/index.css'

const app = createApp(App)

/* 会自动注册 ProForm 下的子组件, 例如 ProForm.Drawer */
app.use(ProForm).mount('#app')
```

**局部注册组件**

此种方式需要分别注册组件子组件，如 Button、ButtonGroup，并且注册后仅在当前组件中有效。所以我们推荐使用上述两种方式。

```html
<template>
  <pro-button>Add</pro-button>
</template>
<script>
  import { ProButton } from 'pro-design-vue'

  export default {
    components: {
      ProButton,
    },
  }
</script>
```
