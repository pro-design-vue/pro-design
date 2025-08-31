/*
 * @Author: shen
 * @Date: 2025-07-17 10:11:59
 * @LastEditors: shen
 * @LastEditTime: 2025-08-27 15:19:59
 * @Description:
 */
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import '@pro-design-vue/theme-chalk'

const app = createApp(App)

app.use(router)

app.mount('#app')
