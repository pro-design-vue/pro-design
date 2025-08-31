/*
 * @Author: shen
 * @Date: 2025-07-17 10:11:59
 * @LastEditors: shen
 * @LastEditTime: 2025-08-26 21:10:38
 * @Description:
 */
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
  ],
})

export default router
