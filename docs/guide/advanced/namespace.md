---
outline: deep
---

# 自定义命名空间

Pro Design Vue 的组件`class`前缀统一为`pro`，在一些业务场景中，有需要改变组件样式前缀来满足业务的使用场景。通过全局配置修改classPrefix，并配合 less-loader 修改@prefix这个 less vars 来保证组件样式的正常。

::: tip 提示
同时支持修改 `Pro Design Vue` 和 `Ant Design Vue` 的样式前缀
:::

## 在 main.ts 中引入less样式

一定要使用less样式源文件，方便修改less变量

```ts
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import '@pro-design-vue/theme-chalk/src/index.less'

const app = createApp(App)

app.use(router)

app.mount('#app')
```

## 在 ProConfigProvider 中配置样式前缀

```vue
<template>
  <ProConfigProvider  
    pro-prefix-cls="pro1"
    prefix-cls="ant1"
  >
    <app />
  </ProConfigProvider>
</template>

```

## 在vite中配置

vite中配置的less变量要和`ProConfigProvider`的参数值保持一致。

```ts
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx()],
  css: {
    preprocessorOptions: {
      less: {
        modifyVars: {
          'pro-prefix': 'pro1',
          'ant-prefix': 'ant1',
        },
        javascriptEnabled: true,
      },
    },
  },
})

```