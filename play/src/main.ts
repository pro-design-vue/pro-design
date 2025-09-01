/*
 * @Author: shen
 * @Date: 2025-07-17 10:11:59
 * @LastEditors: shen
 * @LastEditTime: 2025-09-01 09:00:20
 * @Description:
 */
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import '@pro-design-vue/theme-chalk/src/index.less'

const app = createApp(App)

app.use(router)

app.mount('#app')
