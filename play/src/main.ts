/*
 * @Author: shen
 * @Date: 2025-07-17 10:11:59
 * @LastEditors: shen
 * @LastEditTime: 2026-04-13 15:26:12
 * @Description:
 */
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
// import { enableWhyDidYouRender } from 'vue-why-did-you-render'
import '@pro-design-vue/theme-chalk/src/index.less'

const app = createApp(App)

app.use(router)

// if (import.meta.env.DEV) {
//   enableWhyDidYouRender(app as any, {
//     include: [/Form/],
//     logOnConsole: true,
//     logLevel: 'warn',
//   })
// }

app.mount('#app')
